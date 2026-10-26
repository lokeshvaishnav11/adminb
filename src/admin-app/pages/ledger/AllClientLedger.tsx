

/* eslint-disable */
import betService from "../../../services/bet.service";
import { AxiosResponse } from "axios";
import React from "react";
import "./ClientLedger.css";
import PaymentsIcon from "@mui/icons-material/Payments";
import { createPortal } from "react-dom";
import { useAppSelector } from "../../../redux/hooks";
import { selectUserData } from "../../../redux/actions/login/loginSlice";
import { CustomLink } from "../../../pages/_layout/elements/custom-link";

interface GroupedEntry {
  agent: string;
  amount: number;
  settled: number;
  final: number;
  ChildId: string;
}

const AllClientLedger = () => {
  const userState = useAppSelector(selectUserData);

  const [showModal, setShowModal] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [selectedEntry, setSelectedEntry] = React.useState<GroupedEntry | null>(null);
  const [inputAmount, setInputAmount] = React.useState<number>(0);
  const [remark, setRemark] = React.useState<string>("");
  const [modalType, setModalType] = React.useState<"lena" | "dena" | null>(null);

  const [lena, setLena] = React.useState<GroupedEntry[]>([]);
  const [dena, setDena] = React.useState<GroupedEntry[]>([]);

  //////////////////////////////////////////////////////
  // 🔥 TOTALS
  //////////////////////////////////////////////////////
  const lenaTotals = lena.reduce(
    (acc, item) => {
      acc.amount += item.amount;
      acc.settled += item.settled;
      acc.final += item.final;
      return acc;
    },
    { amount: 0, settled: 0, final: 0 }
  );

  const denaTotals = dena.reduce(
    (acc, item) => {
      acc.amount += item.amount;
      acc.settled += item.settled;
      acc.final += item.final;
      return acc;
    },
    { amount: 0, settled: 0, final: 0 }
  );

  //////////////////////////////////////////////////////
  // 🚀 FETCH DATA (UPDATED)
  //////////////////////////////////////////////////////
  const fetchLedger = async () => {
    const res: AxiosResponse<{ data: any }> = await betService. newledger();
    const { lenaArray, denaArray } = res.data.data;

    setLena(lenaArray || []);
    setDena(denaArray || []);
  };

  React.useEffect(() => {
    fetchLedger();
  }, [userState]);


  const openSettlement = (row: GroupedEntry, type: "lena" | "dena") => {
    setSelectedEntry(row);
    setInputAmount(0);
    setRemark("");
    setModalType(type);
    setShowModal(true);
  };

  React.useEffect(() => {
    if (!showModal) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) setShowModal(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [showModal, submitting]);

  const submitSettlement = async () => {
    if (!selectedEntry || !modalType || submitting) return;
    const limit = Math.abs(selectedEntry.final);
    if (!Number.isFinite(inputAmount) || inputAmount <= 0 || inputAmount > limit) {
      alert(`Enter an amount greater than 0 and up to ${limit.toFixed(2)}`);
      return;
    }
    setSubmitting(true);
    try {
      const settleamount = modalType === "lena"
        ? -Math.abs(inputAmount)
        : Math.abs(inputAmount);
      await betService.postsettelement({
        ChildId: selectedEntry.ChildId,
        settleamount,
        remark,
        type: modalType,
      });
      setShowModal(false);
      await fetchLedger();
    } catch (error) {
      console.error("Settlement failed", error);
      alert("Settlement failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatAmount = (value: number) =>
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const renderLedgerTable = (
    rows: GroupedEntry[],
    totals: { amount: number; settled: number; final: number },
    type: "lena" | "dena"
  ) => (
    <div className="cl-ledger-table-scroll">
      <table className="cl-ledger-table">
        <thead>
          <tr>
            <th>Agent</th>
            <th className="cl-numeric">Amount</th>
            <th className="cl-numeric">Settled</th>
            <th className="cl-numeric">Final</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={5} className="cl-empty">No settlement records found</td></tr>
          )}
          {rows.map((row) => (
            <tr key={row.ChildId}>
              <td>
                <CustomLink to={`/all-settlement/${row.ChildId}`} className="cl-agent-link">
                  {row.agent}
                </CustomLink>
              </td>
              <td className="cl-numeric">{formatAmount(row.amount)}</td>
              <td className="cl-numeric">{formatAmount(row.settled)}</td>
              <td className="cl-numeric cl-final">{formatAmount(row.final)}</td>
              <td>
                <button type="button" className="cl-settle-btn" onClick={() => openSettlement(row, type)}>
                  <PaymentsIcon fontSize="small" /> Settlement
                </button>
              </td>
            </tr>
          ))}
          <tr className="cl-total-row">
            <td>{type === "lena" ? "TOTAL RECEIVING" : "TOTAL PAYABLE"}</td>
            <td className="cl-numeric">{formatAmount(totals.amount)}</td>
            <td className="cl-numeric">{formatAmount(totals.settled)}</td>
            <td className="cl-numeric">{formatAmount(totals.final)}</td>
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="cl-ledger-page">
      <div className="cl-ledger-heading">
        <div>
          <span className="cl-eyebrow">Accounts / Settlement</span>
          <h1>All Client Ledger</h1>
          <p>Manage agent receivables, payables and settlements.</p>
        </div>
        <button type="button" className="cl-refresh-btn" onClick={() => fetchLedger()}>
          Refresh
        </button>
      </div>

      <div className="cl-summary-grid">
        <div className="cl-summary-card">
          <span>Total Receiving</span>
          <strong>₹ {formatAmount(lenaTotals.final)}</strong>
          <small>Lena Hai</small>
        </div>
        <div className="cl-summary-card">
          <span>Total Payable</span>
          <strong>₹ {formatAmount(denaTotals.final)}</strong>
          <small>Dena Hai</small>
        </div>
      </div>

      <section className="cl-ledger-section">
        <div className="cl-section-heading">
          <div><span className="cl-section-mark receiving" /><h2>Payment Receiving (Lena Hai)</h2></div>
          <span className="cl-count">{lena.length} Agents</span>
        </div>
        {renderLedgerTable(lena, lenaTotals, "lena")}
      </section>

      <section className="cl-ledger-section">
        <div className="cl-section-heading">
          <div><span className="cl-section-mark payable" /><h2>Payment Paid To (Dena Hai)</h2></div>
          <span className="cl-count">{dena.length} Agents</span>
        </div>
        {renderLedgerTable(dena, denaTotals, "dena")}
      </section>

      {showModal && selectedEntry && createPortal(
        <div className="cl-modal-overlay" onMouseDown={(e) => {
          if (e.target === e.currentTarget && !submitting) setShowModal(false);
        }}>
          <div className="cl-modal" role="dialog" aria-modal="true" aria-labelledby="cl-modal-title">
            <div className="cl-modal-header">
              <div>
                <span className="cl-modal-kicker">Account Settlement</span>
                <h2 id="cl-modal-title">Settle with {selectedEntry.agent}</h2>
              </div>
              <button type="button" className="cl-modal-close" aria-label="Close" disabled={submitting} onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="cl-modal-body">
              <div className="cl-modal-balance">
                <span>{modalType === "lena" ? "Receiving Amount" : "Payable Amount"}</span>
                <strong>₹ {formatAmount(Math.abs(selectedEntry.final))}</strong>
              </div>
              <label className="cl-field">
                <span>Settlement Amount <b>*</b></span>
                <input type="number" min="0" max={Math.abs(selectedEntry.final)} step="0.01"
                  value={inputAmount || ""} placeholder="Enter settlement amount"
                  onChange={(e) => setInputAmount(Math.abs(Number(e.target.value)))} />
                <small>Maximum ₹ {formatAmount(Math.abs(selectedEntry.final))}</small>
              </label>
              <label className="cl-field">
                <span>Remark</span>
                <textarea rows={3} value={remark} placeholder="Add a settlement note (optional)"
                  onChange={(e) => setRemark(e.target.value)} />
              </label>
            </div>
            <div className="cl-modal-footer">
              <button type="button" className="cl-cancel-btn" disabled={submitting} onClick={() => setShowModal(false)}>Cancel</button>
              <button type="button" className="cl-submit-btn" disabled={submitting} onClick={submitSettlement}>
                {submitting ? "Processing..." : "Confirm Settlement"}
              </button>
            </div>
          </div>
        </div>, document.body
      )}
    </div>
  );
};

export default React.memo(AllClientLedger);
