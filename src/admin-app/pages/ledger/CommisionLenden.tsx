
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { createPortal } from "react-dom";
import { AxiosResponse } from "axios";

import HistoryIcon from "@mui/icons-material/History";
import RefreshIcon from "@mui/icons-material/Refresh";
import PaymentsIcon from "@mui/icons-material/Payments";
import CloseIcon from "@mui/icons-material/Close";

import betService from "../../../services/bet.service";
import "./ClientLedger.css";

interface CommissionEntry {
  _id?: string;
  ChildId: string;
  ParentId?: string;
  username: string;
  cname?: string;
  commissionlega?: number;
  commissiondega?: number;
  iscomSet?: boolean;
  Fancy?: boolean;
  narration?: string;
  createdAt?: string;
}

interface CommissionRow {
  ChildId: string;
  name: string;
  cname: string;

  milaCasinoComm: number;
  milaSportsComm: number;
  milaMatkaComm: number;
  milaTotalComm: number;

  denaCasinoComm: number;
  denaSportsComm: number;
  denaMatkaComm: number;
  denaTotalComm: number;

  pendingCount: number;
  historyCount: number;
}

type ActiveTab = "pending" | "history" | "all";
type Category = "Casino" | "Sports" | "Matka";

const money = (value: number = 0): string => {
  return Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const getCategory = (entry: CommissionEntry): Category => {
  if (entry.narration?.includes("Matka Bet")) {
    return "Matka";
  }

  if (entry.Fancy === true) {
    return "Sports";
  }

  return "Casino";
};

const createEmptyRow = (
  ChildId: string,
  name: string,
  cname: string
): CommissionRow => ({
  ChildId,
  name,
  cname,

  milaCasinoComm: 0,
  milaSportsComm: 0,
  milaMatkaComm: 0,
  milaTotalComm: 0,

  denaCasinoComm: 0,
  denaSportsComm: 0,
  denaMatkaComm: 0,
  denaTotalComm: 0,

  pendingCount: 0,
  historyCount: 0,
});

const processCommissionTable = (
  data: CommissionEntry[][]
): CommissionRow[] => {
  const sourceArray = data[0] || [];

  const map = new Map<string, CommissionRow>();

  const parentLookup = new Map<string, CommissionEntry>();

  sourceArray.forEach((entry) => {
    if (entry.ParentId && !parentLookup.has(entry.ParentId)) {
      parentLookup.set(entry.ParentId, entry);
    }
  });

  sourceArray.forEach((entry) => {
    const childId = entry.ChildId;

    if (!childId) return;

    if (!map.has(childId)) {
      const match = parentLookup.get(childId);

      map.set(
        childId,
        createEmptyRow(
          childId,
          match?.username || entry.username || childId,
          match?.cname || entry.cname || childId
        )
      );
    }

    const row = map.get(childId)!;

    // Settled entries are kept for history.
    if (entry.iscomSet === true) {
      row.historyCount += 1;
      return;
    }

    row.pendingCount += 1;

    // Original pending commission calculations.
    const mila = Number(entry.commissionlega || 0);
    const dena = Number(entry.commissiondega || 0);

    const category = getCategory(entry);

    if (category === "Matka") {
      row.milaMatkaComm += mila;
      row.denaMatkaComm += dena;
    } else if (category === "Sports") {
      row.milaSportsComm += mila;
      row.denaSportsComm += dena;
    } else {
      row.milaCasinoComm += mila;
      row.denaCasinoComm += dena;
    }
  });

  return Array.from(map.values()).map((row) => ({
    ...row,

    milaTotalComm:
      row.milaCasinoComm +
      row.milaSportsComm +
      row.milaMatkaComm,

    denaTotalComm:
      row.denaCasinoComm +
      row.denaSportsComm +
      row.denaMatkaComm,
  }));
};

const CommisionLenden: React.FC = () => {
  const [allEntries, setAllEntries] =
    useState<CommissionEntry[][]>([]);

  const [activeTab, setActiveTab] =
    useState<ActiveTab>("pending");

  const [optionuser, setOptionuser] = useState("all");
  const [search, setSearch] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [historyUser, setHistoryUser] =
    useState<CommissionRow | null>(null);

  const [historySearch, setHistorySearch] = useState("");

  const [historyStartDate, setHistoryStartDate] =
    useState("");

  const [historyEndDate, setHistoryEndDate] =
    useState("");

  // ORIGINAL API
  const fetchCommission = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res: AxiosResponse<any> =
        await betService.oneledgernew();

      const data = res.data.data;

      setAllEntries(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error("Commission fetch failed:", err);
      setError("Unable to load commission records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommission();
  }, [fetchCommission]);

  const sourceEntries = allEntries[0] || [];

  // Keep all users in the master list.
  // Do not remove users just because pending commission is zero.
  const allCommissionUsers = useMemo(() => {
    return processCommissionTable(allEntries);
  }, [allEntries]);

  const filteredEntries = useMemo(() => {
    if (!startDate || !endDate) {
      return sourceEntries;
    }

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59.999`);

    return sourceEntries.filter((entry) => {
      const date = new Date(entry.createdAt || "");

      return date >= start && date <= end;
    });
  }, [sourceEntries, startDate, endDate]);

  const filteredCommissionData = useMemo(() => {
    return processCommissionTable([filteredEntries]);
  }, [filteredEntries]);

  const filteredMap = useMemo(() => {
    return new Map(
      filteredCommissionData.map((row) => [
        row.ChildId,
        row,
      ])
    );
  }, [filteredCommissionData]);

  // Preserve user identity even after a reset.
  const commissionData = useMemo(() => {
    return allCommissionUsers.map((user) => {
      const filtered = filteredMap.get(user.ChildId);

      if (filtered) return filtered;

      return createEmptyRow(
        user.ChildId,
        user.name,
        user.cname
      );
    });
  }, [allCommissionUsers, filteredMap]);

  const hasPendingCommission = (row: CommissionRow) => {
    return Number(
      (
        row.milaTotalComm + row.denaTotalComm
      ).toFixed(2)
    ) > 0;
  };

  const pendingUsers = commissionData.filter(
    hasPendingCommission
  );

  const historyUsers = commissionData.filter(
    (row) => row.historyCount > 0
  );

  const visibleUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return commissionData.filter((row) => {
      const matchesUser =
        optionuser === "all" ||
        row.ChildId === optionuser;

      const matchesSearch =
        !query ||
        row.name.toLowerCase().includes(query) ||
        row.cname.toLowerCase().includes(query) ||
        row.ChildId.toLowerCase().includes(query);

      let matchesTab = true;

      if (activeTab === "pending") {
        matchesTab = hasPendingCommission(row);
      }

      if (activeTab === "history") {
        matchesTab = row.historyCount > 0;
      }

      return matchesUser && matchesSearch && matchesTab;
    });
  }, [commissionData, activeTab, optionuser, search]);

  const totals = useMemo(() => {
    return visibleUsers.reduce(
      (acc, row) => {
        acc.milaCasino += row.milaCasinoComm;
        acc.milaSports += row.milaSportsComm;
        acc.milaMatka += row.milaMatkaComm;
        acc.milaTotal += row.milaTotalComm;

        acc.denaCasino += row.denaCasinoComm;
        acc.denaSports += row.denaSportsComm;
        acc.denaMatka += row.denaMatkaComm;
        acc.denaTotal += row.denaTotalComm;

        return acc;
      },
      {
        milaCasino: 0,
        milaSports: 0,
        milaMatka: 0,
        milaTotal: 0,
        denaCasino: 0,
        denaSports: 0,
        denaMatka: 0,
        denaTotal: 0,
      }
    );
  }, [visibleUsers]);

  // HISTORY - ONLY iscomSet === true
  const historyEntries = useMemo(() => {
    if (!historyUser) return [];

    const query = historySearch.trim().toLowerCase();

    return sourceEntries
      .filter(
        (entry) =>
          entry.ChildId === historyUser.ChildId &&
          entry.iscomSet === true
      )
      .filter((entry) => {
        const matchesSearch =
          !query ||
          (entry.narration || "")
            .toLowerCase()
            .includes(query) ||
          getCategory(entry)
            .toLowerCase()
            .includes(query);

        if (!matchesSearch) return false;

        if (!historyStartDate || !historyEndDate) {
          return true;
        }

        const date = new Date(entry.createdAt || "");
        const start = new Date(
          `${historyStartDate}T00:00:00`
        );
        const end = new Date(
          `${historyEndDate}T23:59:59.999`
        );

        return date >= start && date <= end;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt || "").getTime() -
          new Date(a.createdAt || "").getTime()
      );
  }, [
    sourceEntries,
    historyUser,
    historySearch,
    historyStartDate,
    historyEndDate,
  ]);

  const historyTotals = useMemo(() => {
    return historyEntries.reduce(
      (acc, entry) => {
        const mila = Number(entry.commissionlega || 0);
        const dena = Number(entry.commissiondega || 0);

        acc.mila += mila;
        acc.dena += dena;

        const category = getCategory(entry);

        if (category === "Casino") {
          acc.milaCasino += mila;
          acc.denaCasino += dena;
        } else if (category === "Sports") {
          acc.milaSports += mila;
          acc.denaSports += dena;
        } else {
          acc.milaMatka += mila;
          acc.denaMatka += dena;
        }

        return acc;
      },
      {
        mila: 0,
        dena: 0,
        milaCasino: 0,
        milaSports: 0,
        milaMatka: 0,
        denaCasino: 0,
        denaSports: 0,
        denaMatka: 0,
      }
    );
  }, [historyEntries]);

  const openHistory = (row: CommissionRow) => {
    setHistoryUser(row);
    setHistorySearch("");
    setHistoryStartDate("");
    setHistoryEndDate("");
  };

  const closeHistory = () => {
    setHistoryUser(null);
  };

  useEffect(() => {
    if (!historyUser) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setHistoryUser(null);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [historyUser]);

  // ORIGINAL RESET API
  const settled = async (row: CommissionRow) => {
    if (
      !window.confirm(
        `Reset pending commission for ${row.name}?`
      )
    ) {
      return;
    }

    setResetting(row.ChildId);

    try {
      const res = await betService.comreset({
        name: row.name,
      });

      if (res.data.status) {
        // Move to history so user remains visible.
        setActiveTab("history");
        setOptionuser("all");

        await fetchCommission();
      } else {
        alert("Commission reset was not successful.");
      }
    } catch (err) {
      console.error("Reset failed:", err);
      alert("Commission reset failed.");
    } finally {
      setResetting(null);
    }
  };

  const formatDate = (value?: string) => {
    if (!value) return "-";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? "-"
      : date.toLocaleString("en-IN");
  };

  return (
    <div className="commission-page">

      {/* HEADER */}
      <div className="commission-header">
        <div>
          <span className="commission-eyebrow">
            Accounts / Commission
          </span>

          <h1>Commission Len-Den</h1>

          <p>
            Pending commission, reset history and all users.
          </p>
        </div>

        <button
          type="button"
          className="commission-primary-btn"
          onClick={fetchCommission}
          disabled={loading}
        >
          <RefreshIcon fontSize="small" />
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="commission-summary">
        <div className="commission-summary-card">
          <span>Total Mila Hai</span>
          <strong className="commission-green">
            ₹ {money(totals.milaTotal)}
          </strong>
          <small>Pending commission</small>
        </div>

        <div className="commission-summary-card">
          <span>Total Dena Hai</span>
          <strong className="commission-red">
            ₹ {money(totals.denaTotal)}
          </strong>
          <small>Pending commission</small>
        </div>
      </div>

      <div className="commission-panel">

        {/* TABS */}
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "16px",
            borderBottom: "1px solid #e5ebf3",
            flexWrap: "wrap",
          }}
        >
          {([
            {
              key: "pending",
              label: `Pending Commission (${pendingUsers.length})`,
            },
            {
              key: "history",
              label: `Reset History (${historyUsers.length})`,
            },
            {
              key: "all",
              label: `All Users (${commissionData.length})`,
            },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              style={{
                border: "1px solid #dce4ee",
                borderRadius: 7,
                padding: "10px 14px",
                background:
                  activeTab === tab.key
                    ? "#123a7c"
                    : "#fff",
                color:
                  activeTab === tab.key
                    ? "#fff"
                    : "#52647a",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* FILTERS */}
        <div className="commission-toolbar">
          <label>
            Start Date
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>

          <label>
            End Date
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>

          <label>
            Select User
            <select
              value={optionuser}
              onChange={(e) => setOptionuser(e.target.value)}
            >
              <option value="all">All Clients</option>

              {allCommissionUsers.map((row) => (
                <option
                  key={row.ChildId}
                  value={row.ChildId}
                >
                  {row.name} ({row.cname})
                </option>
              ))}
            </select>
          </label>

          <label>
            Search
            <input
              type="text"
              placeholder="Search username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <button
            type="button"
            className="commission-clear-btn"
            onClick={() => {
              setStartDate("");
              setEndDate("");
              setOptionuser("all");
              setSearch("");
            }}
          >
            Clear Filters
          </button>
        </div>

        {error && (
          <p className="commission-error">{error}</p>
        )}

        {/* TABLE */}
        <div className="commission-table-scroll">
          <table className="commission-new-table">
            <thead>
              <tr className="commission-group-head">
                <th rowSpan={2}>USER</th>
                <th colSpan={4}>MILA HAI</th>
                <th colSpan={4}>DENA HAI</th>
                <th rowSpan={2}>ACTION</th>
              </tr>

              <tr>
                <th>Casino</th>
                <th>Sports</th>
                <th>Matka</th>
                <th>Total</th>

                <th>Casino</th>
                <th>Sports</th>
                <th>Matka</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {visibleUsers.map((row) => (
                <tr key={row.ChildId}>
                  <td>
                    <div className="commission-user">
                      <strong>{row.name}</strong>
                      <small>{row.cname}</small>

                      {row.historyCount > 0 && (
                        <span
                          style={{
                            fontSize: 10,
                            color: "#16834a",
                            fontWeight: 600,
                          }}
                        >
                          {row.historyCount} settled records
                        </span>
                      )}
                    </div>
                  </td>

                  <td>{money(row.milaCasinoComm)}</td>
                  <td>{money(row.milaSportsComm)}</td>
                  <td>{money(row.milaMatkaComm)}</td>
                  <td className="commission-green commission-strong">
                    {money(row.milaTotalComm)}
                  </td>

                  <td>{money(row.denaCasinoComm)}</td>
                  <td>{money(row.denaSportsComm)}</td>
                  <td>{money(row.denaMatkaComm)}</td>
                  <td className="commission-red commission-strong">
                    {money(row.denaTotalComm)}
                  </td>

                  <td>
                    <div className="commission-actions">
                      <button
                        type="button"
                        className="commission-history-btn"
                        onClick={() => openHistory(row)}
                      >
                        <HistoryIcon fontSize="small" />
                        View History
                      </button>

                      {hasPendingCommission(row) && (
                        <button
                          type="button"
                          className="commission-reset-btn"
                          onClick={() => settled(row)}
                          disabled={resetting !== null}
                        >
                          <PaymentsIcon fontSize="small" />
                          {resetting === row.ChildId
                            ? "Processing..."
                            : "Reset"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {visibleUsers.length === 0 && (
                <tr>
                  <td colSpan={10} className="commission-empty">
                    {loading
                      ? "Loading commissions..."
                      : "No commission records found"}
                  </td>
                </tr>
              )}

              <tr className="commission-total-row">
                <td>TOTAL</td>
                <td>{money(totals.milaCasino)}</td>
                <td>{money(totals.milaSports)}</td>
                <td>{money(totals.milaMatka)}</td>
                <td>{money(totals.milaTotal)}</td>

                <td>{money(totals.denaCasino)}</td>
                <td>{money(totals.denaSports)}</td>
                <td>{money(totals.denaMatka)}</td>
                <td>{money(totals.denaTotal)}</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>

        <div className="commission-footer">
          Showing {visibleUsers.length} users
        </div>
      </div>

      {/* HISTORY POPUP */}
     
{/* RESET HISTORY POPUP - ORIGINAL COMMISSION TABLE FORMAT */}
{historyUser &&
  createPortal(
    <div
      className="commission-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeHistory();
        }
      }}
    >
      <div
        className="commission-history-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Commission Reset History"
      >
        <div className="commission-modal-header">
          <div>
            <span>COMMISSION LEN-DEN</span>
            <h2>Reset History</h2>
            <p>
              {historyUser.name} ({historyUser.cname})
            </p>
          </div>

          <button
            type="button"
            onClick={closeHistory}
            aria-label="Close history"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="commission-modal-body">
          <div className="commission-table-scroll">
            <table className="commission-new-table">
              <thead>
                <tr className="commission-group-head">
                  <th rowSpan={2}>NAME</th>
                  <th colSpan={4}>MILA HAI</th>
                  <th colSpan={4}>DENA HAI</th>
                </tr>

                <tr>
                  <th>M Comm</th>
                  <th>S Comm</th>
                  <th>Mat Comm</th>
                  <th>Total Comm</th>

                  <th>M Comm</th>
                  <th>S Comm</th>
                  <th>Mat Comm</th>
                  <th>Total Comm</th>
                </tr>
              </thead>

              <tbody>
                {historyEntries.length > 0 ? (
                  <>
                    <tr>
                      <td>
                        <div className="commission-user">
                          <strong>{historyUser.name}</strong>
                          <small>{historyUser.cname}</small>
                        </div>
                      </td>

                      <td>{money(historyTotals.milaCasino)}</td>
                      <td>{money(historyTotals.milaSports)}</td>
                      <td>{money(historyTotals.milaMatka)}</td>
                      <td className="commission-green commission-strong">
                        {money(historyTotals.mila)}
                      </td>

                      <td>{money(historyTotals.denaCasino)}</td>
                      <td>{money(historyTotals.denaSports)}</td>
                      <td>{money(historyTotals.denaMatka)}</td>
                      <td className="commission-red commission-strong">
                        {money(historyTotals.dena)}
                      </td>
                    </tr>

                    <tr className="commission-total-row">
                      <td>TOTAL</td>

                      <td>{money(historyTotals.milaCasino)}</td>
                      <td>{money(historyTotals.milaSports)}</td>
                      <td>{money(historyTotals.milaMatka)}</td>
                      <td>{money(historyTotals.mila)}</td>

                      <td>{money(historyTotals.denaCasino)}</td>
                      <td>{money(historyTotals.denaSports)}</td>
                      <td>{money(historyTotals.denaMatka)}</td>
                      <td>{money(historyTotals.dena)}</td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan={9} className="commission-empty">
                      No reset history found for this user.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="commission-modal-footer">
          <button type="button" onClick={closeHistory}>
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  )}

    </div>
  );
};

export default CommisionLenden;
