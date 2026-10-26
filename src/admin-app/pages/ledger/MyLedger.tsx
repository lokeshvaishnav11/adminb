import React from "react";
import "./ledger.css";
import betService from "../../../services/bet.service";
import { useAppSelector } from "../../../redux/hooks";
import { selectUserData } from "../../../redux/actions/login/loginSlice";

type LedgerItem = {
  _id: string;
  umoney?: number;
  money?: number;
  narration?: string;
  createdAt: string;
  settled?: boolean;
  ChildId?: string;
};

type ProcessedRow = {
  id: string;
  credit: number;
  debit: number;
  balance: number;
  narration: string;
  date: string;
};

const PAGE_SIZE = 100;

const formatMoney = (amount: number) =>
  Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const MyLedger: React.FC = () => {
  const userState = useAppSelector(selectUserData);
  const userId = userState.user?._id;
  const [tableData, setTableData] = React.useState<LedgerItem[]>([]);
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [search, setSearch] = React.useState("");

  const fetchLedger = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // The existing API returns the ledger without a page argument.
      // Fetch once, then use client-side Load More to avoid duplicate entries.
      const res = await betService.oneledgernew();
      const payload = res.data?.data;
      const data: LedgerItem[] = Array.isArray(payload?.[0]) && payload[0].length
        ? payload[0]
        : Array.isArray(payload?.[1])
          ? payload[1]
          : Array.isArray(payload)
            ? payload
            : [];
      setTableData(data);
      setVisibleCount(PAGE_SIZE);
    } catch (err) {
      console.error("My ledger fetch failed:", err);
      setError("Unable to load ledger. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchLedger();
  }, [fetchLedger, userId]);

  const processedRows = React.useMemo<ProcessedRow[]>(() => {
    let balance = 0;
    const result: ProcessedRow[] = [];
    const sorted = [...tableData].sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    sorted.forEach((item) => {
      const isSettled = item.settled === true;
      const isChildMatch = item.ChildId === userId;
      if (!isSettled || (isSettled && isChildMatch)) {
        // Keep the original accounting field: umoney, not money.
        const money = Number(item.umoney ?? 0);
        balance += money;
        result.push({
          id: item._id,
          credit: money > 0 ? money : 0,
          debit: money < 0 ? money : 0,
          balance,
          narration: item.narration || "—",
          date: item.createdAt,
        });
      }
    });
    return result.reverse();
  }, [tableData, userId]);

  const finalBalance = processedRows.length ? processedRows[0].balance : 0;
  const totalCredit = React.useMemo(() => processedRows.reduce((sum, row) => sum + row.credit, 0), [processedRows]);
  const totalDebit = React.useMemo(() => processedRows.reduce((sum, row) => sum + row.debit, 0), [processedRows]);
  const filteredRows = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    return query
      ? processedRows.filter((row) =>
          row.narration.toLowerCase().includes(query) ||
          new Date(row.date).toLocaleString("en-IN").toLowerCase().includes(query)
        )
      : processedRows;
  }, [processedRows, search]);
  const visibleRows = filteredRows.slice(0, visibleCount);

  return (
    <main className="my-ledger-page">
      <header className="my-ledger-heading">
        <div>
          <span className="my-ledger-eyebrow">Accounts / Ledger</span>
          <h1>My Ledger</h1>
          <p>Review your credits, debits and running balance.</p>
        </div>
        <button type="button" className="my-ledger-refresh" onClick={fetchLedger} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      <div className="my-ledger-summary">
        <div className="my-ledger-stat">
          <span>Total Credit</span>
          <strong className="my-ledger-positive">₹ {formatMoney(totalCredit)}</strong>
          <small>Money received</small>
        </div>
        <div className="my-ledger-stat">
          <span>Total Debit</span>
          <strong className="my-ledger-negative">₹ {formatMoney(Math.abs(totalDebit))}</strong>
          <small>Money paid</small>
        </div>
        <div className="my-ledger-stat my-ledger-balance-stat">
          <span>Current Balance</span>
          <strong>₹ {formatMoney(finalBalance)}</strong>
          <small>Based on all loaded ledger entries</small>
        </div>
      </div>

      <section className="my-ledger-panel">
        <div className="my-ledger-panel-top">
          <div>
            <h2>Transaction History</h2>
            <span>{filteredRows.length.toLocaleString("en-IN")} entries</span>
          </div>
          <input
            type="search"
            className="my-ledger-search"
            value={search}
            onChange={(event) => { setSearch(event.target.value); setVisibleCount(PAGE_SIZE); }}
            placeholder="Search remark or date..."
            aria-label="Search ledger"
          />
        </div>

        {error && <div className="my-ledger-error" role="alert">{error}</div>}
        <div className="my-ledger-table-scroll">
          <table className="my-ledger-table">
            <thead>
              <tr>
                <th>Date</th>
                <th className="my-ledger-number">Credit</th>
                <th className="my-ledger-number">Debit</th>
                <th className="my-ledger-number">Balance</th>
                <th>Winner / Remark</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.id}>
                  <td className="my-ledger-date">
                    {new Date(row.date).toLocaleString("en-IN", {
                      day: "2-digit", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit", hour12: true,
                    })}
                  </td>
                  <td className="my-ledger-number my-ledger-positive">{formatMoney(row.credit)}</td>
                  <td className="my-ledger-number my-ledger-negative">{formatMoney(row.debit)}</td>
                  <td className={`my-ledger-number ${row.balance >= 0 ? "my-ledger-positive" : "my-ledger-negative"}`}>
                    {formatMoney(row.balance)}
                  </td>
                  <td>
                    <span className={row.narration === "Settlement" ? "my-ledger-settlement" : "my-ledger-remark"}>
                      {row.narration}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && visibleRows.length === 0 && (
                <tr><td colSpan={5} className="my-ledger-empty">No ledger entries found.</td></tr>
              )}
              {loading && tableData.length === 0 && (
                <tr><td colSpan={5} className="my-ledger-empty">Loading ledger...</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {visibleCount < filteredRows.length && (
          <div className="my-ledger-load-wrap">
            <button type="button" className="my-ledger-load" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
              Load More ({Math.min(PAGE_SIZE, filteredRows.length - visibleCount)} more)
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default MyLedger;
