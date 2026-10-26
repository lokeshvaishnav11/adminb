import React from "react";
import betService from "../../../services/bet.service";
import ReportModal from "./ReportModal";
import { useAppSelector } from "../../../redux/hooks";
import { selectUserData } from "../../../redux/actions/login/loginSlice";
import "./AllReport.css";

type GroupedLedger = {
  username: string; cname: string; ss: number;
  matchPlusMinus: number; sessionPlusMinus: number; matkaPlusMinus: number;
  matkaCommission: number; matchcommision: number; fancycommmision: number;
};
type ReportRow = {
  client: string; cname: string; ss: number; match: number; session: number;
  matka: number; totall: number; mCom: number; sCom: number; mtCom: number;
  tCom: number; gTotal: number; upDownShare: number; balance: number;
};
type ReportTotals = {
  match: number; session: number; mCom: number; sCom: number; mtCom: number;
  tCom: number; gTotal: number; upDownShare: number; balance: number;
};
const emptyTotals: ReportTotals = { match: 0, session: 0, mCom: 0, sCom: 0, mtCom: 0, tCom: 0, gTotal: 0, upDownShare: 0, balance: 0 };
const money = (value: number) => Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const amountClass = (value: number) => value < 0 ? "ar-negative" : "ar-positive";

const AllReport = () => {
  const userState = useAppSelector(selectUserData);
  const [ledgerData, setLedgerData] = React.useState<ReportRow[]>([]);
  const [ledgerTotal, setLedgerTotal] = React.useState<ReportTotals>(emptyTotals);
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [optionuser, setOptionuser] = React.useState("all");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedUser, setSelectedUser] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleDateFilter = React.useCallback(async (isFilterApplied = false) => {
    try {
      setLoading(true);
      setError("");
      const res = await betService.twoledger();
      const rawData = (res.data?.data || []).filter((item: any) => item?.settled !== true);
      const filteredData = isFilterApplied ? rawData.filter((item: any) => {
        const createdAt = new Date(item.createdAt);
        const from = startDate ? new Date(startDate) : null;
        const to = endDate ? new Date(endDate) : null;
        return (!from || createdAt >= from) && (!to || createdAt <= to);
      }) : rawData;

      const grouped: Record<string, GroupedLedger & { updownTotal: number }> = {};
      filteredData.forEach((item: any) => {
        const childId: string = item.ChildId ? item.ChildId : item.ParentId;
        const isFancy: boolean = item.Fancy;
        const isMatka = item?.narration?.includes("Matka Bet");
        const amount: number = Number(item.fammount) || 0;
        const commissionn: number = Number(item.commissiondega) || 0;
        const updown: number = Number(item.umoney) || 0;
        if (!grouped[childId]) {
          grouped[childId] = {
            username: item.username, cname: item.cname, ss: item.superShare,
            matchPlusMinus: 0, sessionPlusMinus: 0, matkaPlusMinus: 0,
            matkaCommission: 0, matchcommision: 0, fancycommmision: 0, updownTotal: 0,
          };
        }
        if (isMatka) {
          grouped[childId].matkaPlusMinus += amount;
          grouped[childId].matkaCommission += commissionn;
        } else if (isFancy) {
          grouped[childId].sessionPlusMinus += amount;
          grouped[childId].fancycommmision += commissionn;
        } else {
          grouped[childId].matchPlusMinus += amount;
          grouped[childId].matchcommision += commissionn;
        }
        grouped[childId].updownTotal += updown;
      });

      const finalTotals: ReportTotals = { ...emptyTotals };
      const finalLedger: ReportRow[] = Object.entries(grouped).map(([, values]) => {
        const match = values.matchPlusMinus;
        const session = values.sessionPlusMinus;
        const matka = values.matkaPlusMinus;
        const matchc = values.matchcommision;
        const fancyc = values.fancycommmision;
        const mtCom = values.matkaCommission;
        const ctotal = matchc + fancyc + mtCom;
        const totall = match + session + matka;
        const total = totall - ctotal;
        finalTotals.match += match;
        finalTotals.session += session;
        finalTotals.mCom += matchc;
        finalTotals.sCom += fancyc;
        finalTotals.mtCom += mtCom;
        finalTotals.tCom += ctotal;
        finalTotals.gTotal += total;
        finalTotals.upDownShare += (values.ss / 100) * total;
        finalTotals.balance += total - (values.ss / 100) * total;
        return {
          client: values.username, cname: values.cname, ss: values.ss,
          match, session, matka, totall, mCom: matchc, sCom: fancyc,
          mtCom, tCom: ctotal, gTotal: total,
          upDownShare: (values.ss / 100) * total,
          balance: total - (values.ss / 100) * total,
        };
      });
      setLedgerTotal(finalTotals);
      setLedgerData(finalLedger);
    } catch (err) {
      console.error("Error filtering ledger by date:", err);
      setError("Unable to load report. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  React.useEffect(() => {
    if (startDate && endDate) handleDateFilter(true);
    if (!startDate && !endDate) handleDateFilter(false);
  }, [startDate, endDate, handleDateFilter]);

  React.useEffect(() => {
    if (!selectedUser) return;
    const onEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setSelectedUser(null); };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [selectedUser]);

  const filteredLedgerData = ledgerData.filter((row) =>
    (optionuser === "all" || row.client === optionuser) &&
    row.client.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const showCommission = userState?.user?.comm === true;
  const isDl = userState?.user?.role === "dl";
  const showNumber = (value: number, extra = "") => <span className={`${amountClass(value)} ${extra}`}>{money(value)}</span>;

  return (
    <div className="all-report-page">
      <div className="ar-heading">
        <div><div className="ar-kicker">REPORTS / CLIENTS</div><h1>All Client Report</h1><p>Match, session, Matka, commission and client balances</p></div>
        <button className="ar-primary" type="button" disabled={loading} onClick={() => handleDateFilter(Boolean(startDate && endDate))}>{loading ? "Loading..." : "Refresh Report"}</button>
      </div>

      <div className="ar-stats">
        <div className="ar-stat"><span>Clients</span><strong>{ledgerData.length}</strong><small>In current report</small></div>
        <div className="ar-stat"><span>Gross Total</span><strong className={amountClass(ledgerTotal.gTotal)}>{money(ledgerTotal.gTotal)}</strong><small>After commission</small></div>
        <div className="ar-stat"><span>Up / Down Share</span><strong className={amountClass(ledgerTotal.upDownShare)}>{money(ledgerTotal.upDownShare)}</strong><small>Calculated share</small></div>
        <div className="ar-stat ar-stat-accent"><span>Final Balance</span><strong>{money(ledgerTotal.balance)}</strong><small>All clients total</small></div>
      </div>

      <section className="ar-panel">
        <div className="ar-panel-head"><div><h2>Client-wise Report</h2><p>Filter by date, client or username</p></div></div>
        <div className="ar-filters">
          <label>Start Date<input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></label>
          <label>End Date<input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></label>
          <label>Client<select value={optionuser} onChange={(e) => setOptionuser(e.target.value)}><option value="all">All Clients</option>{ledgerData.map((row, index) => <option key={`${row.client}-${index}`} value={row.client}>{row.client}/{row.cname}</option>)}</select></label>
          <label>Search<input type="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search username" /></label>
        </div>
        {error && <div className="ar-error">{error}</div>}
        <div className="ar-scroll">
          <table className="ar-table"><thead><tr>
            <th>Client</th><th>Match (+/-)</th><th>Session (+/-)</th><th>Matka (+/-)</th><th>Total</th>
            {showCommission && <><th>M.Com</th><th>S.Com</th><th>MT.Com</th><th>T.Com</th></>}
            <th>G. Total</th><th>UP/Down Share</th><th>Balance</th><th>Action</th>
          </tr></thead><tbody>
            {filteredLedgerData.map((row, index) => <tr key={`${row.client}-${index}`}>
              <td><div className="ar-client"><span className="ar-avatar">{row.client?.charAt(0)?.toUpperCase() || "C"}</span><div><strong>{row.client}</strong><small>{row.cname}</small></div></div></td>
              <td>{showNumber(row.match)}</td><td>{showNumber(row.session)}</td><td>{showNumber(row.matka)}</td><td>{showNumber(row.totall)}</td>
              {showCommission && <><td className="ar-commission">{money(row.mCom)}</td><td className="ar-commission">{money(row.sCom)}</td><td className="ar-commission">{money(row.mtCom)}</td><td className="ar-commission">{money(row.tCom)}</td></>}
              <td>{showNumber(row.gTotal)}</td><td>{showNumber(isDl ? row.gTotal : row.upDownShare)}</td><td>{showNumber(isDl ? row.gTotal : row.balance, "ar-strong")}</td>
              <td><button type="button" className="ar-view" onClick={() => setSelectedUser(row.client)}>View</button></td>
            </tr>)}
            {!loading && filteredLedgerData.length === 0 && <tr><td className="ar-empty" colSpan={showCommission ? 13 : 9}>No user found</td></tr>}
          </tbody></table>
        </div>
        <div className="ar-bottom"><span>Showing {filteredLedgerData.length} of {ledgerData.length} clients</span><span>Scroll horizontally to view all columns</span></div>
      </section>

      <section className="ar-totals-panel"><h2>Report Totals</h2><div className="ar-totals-scroll"><table className="ar-totals-table"><thead><tr>
        <th>Match (+/-)</th><th>Session (+/-)</th><th>Total</th>
        {showCommission && <><th>M.Com</th><th>S.Com</th><th>MT.Com</th><th>T.Com</th></>}
        <th>G. Total</th><th>UP/Down</th><th>Final</th>
      </tr></thead><tbody><tr>
        <td>{showNumber(ledgerTotal.match)}</td><td>{showNumber(ledgerTotal.session)}</td><td>{showNumber(ledgerTotal.match + ledgerTotal.session)}</td>
        {showCommission && <><td className="ar-commission">{money(ledgerTotal.mCom)}</td><td className="ar-commission">{money(ledgerTotal.sCom)}</td><td className="ar-commission">{money(ledgerTotal.mtCom)}</td><td className="ar-commission">{money(ledgerTotal.tCom)}</td></>}
        <td>{showNumber(ledgerTotal.gTotal)}</td><td>{showNumber(ledgerTotal.upDownShare)}</td><td>{showNumber(ledgerTotal.balance, "ar-strong")}</td>
      </tr></tbody></table></div></section>

      {selectedUser && <div className="ar-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelectedUser(null); }}>
        <div className="ar-modal" role="dialog" aria-modal="true" aria-label="Client report details">
          <div className="ar-modal-head"><div><h2>Client Details</h2><p>{selectedUser}</p></div><button type="button" onClick={() => setSelectedUser(null)} aria-label="Close">×</button></div>
          <div className="ar-modal-body"><ReportModal data={selectedUser} /></div>
        </div>
      </div>}
    </div>
  );
};
export default AllReport;
