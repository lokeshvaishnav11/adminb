import React from "react";
import "./ClientLedger.css";
import betService from "../../../services/bet.service";
import { AxiosResponse } from "axios";
import { useAppSelector } from "../../../redux/hooks";
import { selectUserData } from "../../../redux/actions/login/loginSlice";

interface LedgerItem {
  _id: string;
  money: number;
  umoney?: number;
  narration: string;
  username: string;
  cname?: string;
  createdAt: string;
  updown: number;
  ChildId: string;
  ParentId?: string;
  settled?: boolean;
}

interface ProcessedRow {
  id: string;
  credit: number;
  debit: number;
  balance: number;
  narration: string;
  date: string;
}

const PAGE_SIZE = 100;

const ClientLedger = () => {
  const [tableData, setTableData] = React.useState<LedgerItem[]>([]);
  const [optionuser, setOptionuser] = React.useState("all");
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [search, setSearch] = React.useState("");
  const userState = useAppSelector(selectUserData);

  const fetchLedger = React.useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res: AxiosResponse<any> = await betService.oneledgernew();
      const raw = res.data?.data || [];
      const dataToUse = Array.isArray(raw[0]) && raw[0].length
        ? raw[0]
        : Array.isArray(raw[1]) ? raw[1] : Array.isArray(raw) ? raw : [];
      // This endpoint has no page argument: fetch once, reveal locally in batches.
      setTableData(dataToUse);
      setVisibleCount(PAGE_SIZE);
    } catch (err) {
      console.error(err);
      setError("Unable to load ledger. Please retry.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchLedger();
  }, [fetchLedger]);

  const clientOptions = React.useMemo(() => {
    const unique = new Map<string, LedgerItem>();
    tableData.forEach((item) => {
      if (item.ChildId && !unique.has(item.ChildId)) unique.set(item.ChildId, item);
    });
    return Array.from(unique.values());
  }, [tableData]);

  // Preserve original ChildId/ParentId/settled and umoney calculation rules.
  const processedRows = React.useMemo<ProcessedRow[]>(() => {
    let balance = 0;
    const filteredData = optionuser === "all"
      ? tableData
      : tableData.filter((item) => item.ChildId === optionuser);

    const result: ProcessedRow[] = [];
    filteredData.forEach((item) => {
      const money = Number(item.umoney ?? 0);
      const isChildMatch = item.ParentId === userState?.user?._id;
      const isSettled = item.settled === true;
      let allow = false;

      if (optionuser === "all") {
        if (isChildMatch) {
          allow = item.ParentId === item.ChildId ? true : !isSettled;
        } else {
          allow = true;
        }
      } else {
        allow = true;
      }

      if (allow) {
        balance += money;
        result.push({
          id: item._id,
          credit: money > 0 ? money : 0,
          debit: money < 0 ? money : 0,
          balance,
          narration: item.narration,
          date: item.createdAt,
        });
      }
    });
    return result.reverse();
  }, [tableData, optionuser, userState?.user?._id]);

  const finalBalance = processedRows.length ? processedRows[0].balance : 0;
  const searchedRows = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return q
      ? processedRows.filter((row) =>
          row.narration?.toLowerCase().includes(q) ||
          new Date(row.date).toLocaleDateString("en-IN").includes(q))
      : processedRows;
  }, [processedRows, search]);
  const visibleRows = searchedRows.slice(0, visibleCount);

  const formatMoney = (amount: number) =>
    amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="client-ledger-page">
      <header className="clp-header">
        <div>
          <span className="clp-eyebrow">Accounts / Transactions</span>
          <h1>Client Ledger</h1>
          <p>Client-wise transactions and running balance</p>
        </div>
        <button className="clp-refresh" type="button" onClick={fetchLedger} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      <div className="clp-summary">
        <div className="clp-summary-card">
          <span>Current Balance</span>
          <strong className={finalBalance < 0 ? "negative" : ""}>{formatMoney(finalBalance)}</strong>
          <small>Based on selected client</small>
        </div>
        <div className="clp-summary-card">
          <span>Transactions</span>
          <strong>{processedRows.length.toLocaleString("en-IN")}</strong>
          <small>Entries in selected ledger</small>
        </div>
      </div>

      <section className="clp-panel">
        <div className="clp-toolbar">
          <div className="clp-field">
            <label htmlFor="clp-client-filter">Select Client</label>
            <select id="clp-client-filter" value={optionuser} onChange={(e) => {
              setOptionuser(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}>
              <option value="all">All Clients</option>
              {clientOptions.map((item) => (
                <option key={item.ChildId} value={item.ChildId}>
                  {item.username}{item.cname ? ` / (${item.cname})` : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="clp-field">
            <label htmlFor="clp-search">Search Remarks</label>
            <input id="clp-search" type="search" value={search}
              onChange={(e) => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
              placeholder="Search transaction..." />
          </div>
        </div>

        {error && <div className="clp-error">{error}</div>}
        <div className="clp-table-wrap">
          <table className="clp-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th className="clp-number">Credit</th>
                <th className="clp-number">Debit</th>
                <th className="clp-number">Balance</th>
                <th>Winner / Remark</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row, index) => (
                <tr key={`${row.id}-${index}`}>
                  <td className="clp-date">{new Date(row.date).toLocaleString("en-IN", {
                    day: "2-digit", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit", hour12: true,
                  })}</td>
                  <td className="clp-number clp-credit">{formatMoney(row.credit)}</td>
                  <td className="clp-number clp-debit">{formatMoney(row.debit)}</td>
                  <td className={`clp-number clp-balance ${row.balance < 0 ? "negative" : ""}`}>
                    {formatMoney(row.balance)}
                  </td>
                  <td>
                    <span className={row.narration === "Settlement" ? "clp-settlement" : "clp-remark"}>
                      {row.narration === "Settlement" ? "Settlement" : `🏆 ${row.narration || "—"}`}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && visibleRows.length === 0 && (
                <tr><td colSpan={5} className="clp-empty">No transactions found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="clp-table-footer">
          <span>Showing {visibleRows.length} of {searchedRows.length} transactions</span>
          {visibleCount < searchedRows.length && (
            <button type="button" className="clp-more" onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}>
              Load More
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default React.memo(ClientLedger);
