
// /* eslint-disable */

// import React from "react";
// import { createPortal } from "react-dom";
// import { useNavigate, useParams } from "react-router-dom";
// import PaymentsIcon from "@mui/icons-material/Payments";

// import betService from "../../../services/bet.service";
// import { CustomLink } from "../../../pages/_layout/elements/custom-link";
// import "./ClientLedger.css";

// interface GroupedEntry {
//   agent: string;
//   amount: number;
//   settled: number;
//   final: number;
//   ChildId: string;
// }

// type SettlementType = "lena" | "dena";

// interface LedgerTotals {
//   amount: number;
//   settled: number;
//   final: number;
// }

// const formatAmount = (value: number): string => {
//   return Number(value || 0).toLocaleString("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });
// };

// const calculateTotals = (
//   rows: GroupedEntry[]
// ): LedgerTotals => {
//   return rows.reduce(
//     (acc, item) => {
//       acc.amount += item.amount;
//       acc.settled += item.settled;
//       acc.final += item.final;
//       return acc;
//     },
//     {
//       amount: 0,
//       settled: 0,
//       final: 0,
//     }
//   );
// };

// const AllClientLedger = () => {
//   // ORIGINAL ROUTING
//   const sendId = useParams().pid;
//   const navigate = useNavigate();

//   // ORIGINAL LEDGER DATA
//   const [lena, setLena] = React.useState<GroupedEntry[]>([]);
//   const [dena, setDena] = React.useState<GroupedEntry[]>([]);

//   // UI STATE
//   const [loading, setLoading] = React.useState(false);
//   const [error, setError] = React.useState("");
//   const [search, setSearch] = React.useState("");
//   const [activeTab, setActiveTab] =
//     React.useState<SettlementType>("lena");

//   // ORIGINAL SETTLEMENT STATE
//   const [showModal, setShowModal] = React.useState(false);
//   const [selectedEntry, setSelectedEntry] =
//     React.useState<GroupedEntry | null>(null);
//   const [inputAmount, setInputAmount] =
//     React.useState<number>(0);
//   const [remark, setRemark] = React.useState<string>("");
//   const [modalType, setModalType] =
//     React.useState<SettlementType | null>(null);
//   const [submitting, setSubmitting] = React.useState(false);

//   // ORIGINAL TOTAL CALCULATIONS
//   const lenaTotals = React.useMemo(
//     () => calculateTotals(lena),
//     [lena]
//   );

//   const denaTotals = React.useMemo(
//     () => calculateTotals(dena),
//     [dena]
//   );

//   // ORIGINAL API AND CHILD REDIRECT
//   const fetchLedger = React.useCallback(async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const res = await betService.pponeledger(sendId);

//       const { lenaArray, denaArray, user } = res.data.data;

//       if (user?.role === "dl") {
//         navigate(
//           `/admin/list-clients/${user.username}/user`,
//           { replace: true }
//         );
//         return;
//       }

//       setLena(lenaArray || []);
//       setDena(denaArray || []);
//     } catch (err) {
//       console.error("Ledger fetch failed:", err);
//       setError("Unable to load ledger. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }, [sendId, navigate]);

//   React.useEffect(() => {
//     fetchLedger();
//   }, [fetchLedger]);

//   // UI FILTER ONLY
//   const activeRows = activeTab === "lena" ? lena : dena;
//   const activeTotals =
//     activeTab === "lena" ? lenaTotals : denaTotals;

//   const filteredRows = React.useMemo(() => {
//     const query = search.trim().toLowerCase();

//     if (!query) return activeRows;

//     return activeRows.filter((row) =>
//       row.agent.toLowerCase().includes(query)
//     );
//   }, [activeRows, search]);

//   // ORIGINAL SETTLEMENT MODAL
//   const openSettlement = (
//     row: GroupedEntry,
//     type: SettlementType
//   ) => {
//     setSelectedEntry(row);
//     setInputAmount(0);
//     setRemark("");
//     setModalType(type);
//     setShowModal(true);
//   };

//   const closeSettlement = () => {
//     if (submitting) return;
//     setShowModal(false);
//   };

//   React.useEffect(() => {
//     if (!showModal) return;

//     const previousOverflow = document.body.style.overflow;
//     document.body.style.overflow = "hidden";

//     const onKeyDown = (event: KeyboardEvent) => {
//       if (event.key === "Escape" && !submitting) {
//         setShowModal(false);
//       }
//     };

//     document.addEventListener("keydown", onKeyDown);

//     return () => {
//       document.body.style.overflow = previousOverflow;
//       document.removeEventListener("keydown", onKeyDown);
//     };
//   }, [showModal, submitting]);

//   // ORIGINAL SETTLEMENT API AND SIGN LOGIC
//   const submitSettlement = async () => {
//     if (!selectedEntry || !modalType || submitting) return;

//     if (
//       inputAmount >
//       Number(Math.abs(selectedEntry.final).toFixed(2))
//     ) {
//       alert(
//         "Settlement amount cannot exceed Settle Amount."
//       );
//       return;
//     }

//     const settleamount =
//       modalType === "lena"
//         ? -Math.abs(inputAmount)
//         : Math.abs(inputAmount);

//     const data: any = {
//       ChildId: selectedEntry.ChildId,
//       settleamount,
//       remark,
//       type: modalType,
//     };

//     setSubmitting(true);

//     try {
//       await betService.postsettelement(data);
//       setShowModal(false);

//       // ORIGINAL REFRESH BEHAVIOUR
//       window.location.reload();
//     } catch (err) {
//       alert("Error during settlement.");
//       console.error(err);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="client-ledger-page">

//       {/* HEADER */}
//       <div className="clp-header">
//         <div>
//           <span className="clp-eyebrow">
//             Accounts / Settlement
//           </span>

//           <h1>All Client Ledger</h1>

//           <p>
//             Manage agent receivables, payables and settlements.
//           </p>
//         </div>

//         <button
//           type="button"
//           className="clp-refresh"
//           onClick={fetchLedger}
//           disabled={loading}
//         >
//           {loading ? "Loading..." : "Refresh"}
//         </button>
//       </div>

//       {/* SUMMARY */}
//       <div className="clp-summary">
//         <div className="clp-summary-card">
//           <span>Total Receiving</span>

//           <strong>
//             ₹ {formatAmount(lenaTotals.final)}
//           </strong>

//           <small>
//             Lena Hai · {lena.length} Agents
//           </small>
//         </div>

//         <div className="clp-summary-card">
//           <span>Total Payable</span>

//           <strong className="negative">
//             ₹ {formatAmount(denaTotals.final)}
//           </strong>

//           <small>
//             Dena Hai · {dena.length} Agents
//           </small>
//         </div>
//       </div>

//       {/* MAIN LEDGER */}
//       <div className="clp-panel">

//         <div className="clp-toolbar">
//           {/* UI TABS */}
//           <div
//             style={{
//               display: "flex",
//               gap: 8,
//               flexWrap: "wrap",
//               alignItems: "center",
//             }}
//           >
//             <button
//               type="button"
//               onClick={() => setActiveTab("lena")}
//               style={{
//                 border: "1px solid #dce4ee",
//                 borderRadius: 7,
//                 padding: "10px 15px",
//                 background:
//                   activeTab === "lena" ? "#123a7c" : "#fff",
//                 color:
//                   activeTab === "lena" ? "#fff" : "#52647a",
//                 fontSize: 13,
//                 fontWeight: 600,
//                 fontFamily: "inherit",
//                 cursor: "pointer",
//               }}
//             >
//               Lena Hai ({lena.length})
//             </button>

//             <button
//               type="button"
//               onClick={() => setActiveTab("dena")}
//               style={{
//                 border: "1px solid #dce4ee",
//                 borderRadius: 7,
//                 padding: "10px 15px",
//                 background:
//                   activeTab === "dena" ? "#123a7c" : "#fff",
//                 color:
//                   activeTab === "dena" ? "#fff" : "#52647a",
//                 fontSize: 13,
//                 fontWeight: 600,
//                 fontFamily: "inherit",
//                 cursor: "pointer",
//               }}
//             >
//               Dena Hai ({dena.length})
//             </button>
//           </div>

//           {/* SEARCH */}
//           <div className="clp-field">
//             <label>Search Agent</label>

//             <input
//               type="text"
//               placeholder="Search agent..."
//               value={search}
//               onChange={(event) =>
//                 setSearch(event.target.value)
//               }
//             />
//           </div>
//         </div>

//         {error && (
//           <div className="clp-error">{error}</div>
//         )}

//         {/* TABLE */}
//         <div className="clp-table-wrap">
//           <table className="clp-table">
//             <thead>
//               <tr>
//                 <th>AGENT</th>
//                 <th className="clp-number">AMOUNT</th>
//                 <th className="clp-number">SETTLED</th>
//                 <th className="clp-number">FINAL</th>
//                 <th>ACTION</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredRows.length === 0 && (
//                 <tr>
//                   <td colSpan={5} className="clp-empty">
//                     {loading
//                       ? "Loading ledger..."
//                       : "No settlement records found"}
//                   </td>
//                 </tr>
//               )}

//               {filteredRows.map((row) => (
//                 <tr key={row.ChildId}>
//                   <td>
//                     {/* ORIGINAL CHILD LINK */}
//                     <CustomLink
//                       to={`/all-settlement/${row.ChildId}`}
//                       className="cl-agent-link"
//                     >
//                       {row.agent}
//                     </CustomLink>
//                   </td>

//                   <td className="clp-number">
//                     {formatAmount(row.amount)}
//                   </td>

//                   <td className="clp-number">
//                     {formatAmount(row.settled)}
//                   </td>

//                   <td className="clp-number">
//                     <span
//                       className={
//                         activeTab === "lena"
//                           ? "clp-credit"
//                           : "clp-debit"
//                       }
//                     >
//                       {formatAmount(row.final)}
//                     </span>
//                   </td>

//                   <td>
//                     <button
//                       type="button"
//                       className="cl-settle-btn"
//                       onClick={() =>
//                         openSettlement(row, activeTab)
//                       }
//                     >
//                       <PaymentsIcon fontSize="small" />
//                       Settlement
//                     </button>
//                   </td>
//                 </tr>
//               ))}

//               {/* ORIGINAL TOTALS */}
//               <tr className="cl-total-row">
//                 <td>
//                   {activeTab === "lena"
//                     ? "LENA HAI"
//                     : "DENA HAI"}
//                 </td>

//                 <td className="clp-number">
//                   {formatAmount(activeTotals.amount)}
//                 </td>

//                 <td className="clp-number">
//                   {formatAmount(activeTotals.settled)}
//                 </td>

//                 <td className="clp-number">
//                   {formatAmount(activeTotals.final)}
//                 </td>

//                 <td />
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         <div className="clp-table-footer">
//           <span>
//             Showing {filteredRows.length} of{" "}
//             {activeRows.length} agents
//           </span>

//           <span>
//             {activeTab === "lena"
//               ? "Total Receiving"
//               : "Total Payable"}
//             : ₹ {formatAmount(activeTotals.final)}
//           </span>
//         </div>
//       </div>

//       {/* SETTLEMENT MODAL */}
//       {showModal &&
//         selectedEntry &&
//         createPortal(
//           <div
//             className="cl-modal-overlay"
//             onMouseDown={(event) => {
//               if (event.target === event.currentTarget) {
//                 closeSettlement();
//               }
//             }}
//           >
//             <div
//               className="cl-modal"
//               role="dialog"
//               aria-modal="true"
//               aria-labelledby="cl-modal-title"
//             >
//               <div className="cl-modal-header">
//                 <div>
//                   <span className="cl-modal-kicker">
//                     Account Settlement
//                   </span>

//                   <h2 id="cl-modal-title">
//                     Settle with {selectedEntry.agent}
//                   </h2>
//                 </div>

//                 <button
//                   type="button"
//                   className="cl-modal-close"
//                   onClick={closeSettlement}
//                   disabled={submitting}
//                   aria-label="Close"
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="cl-modal-body">
//                 <div className="cl-modal-balance">
//                   <span>
//                     Settle Amount (Fixed): {modalType}
//                   </span>

//                   <strong>
//                     ₹ {formatAmount(selectedEntry.final)}
//                   </strong>
//                 </div>

//                 <label className="cl-field">
//                   <span>
//                     Settlement Amount
//                   </span>

//                   <input
//                     type="number"
//                     value={inputAmount}
//                     onChange={(event) =>
//                       setInputAmount(
//                         Math.abs(Number(event.target.value))
//                       )
//                     }
//                   />

//                   <small>
//                     Maximum ₹{" "}
//                     {formatAmount(
//                       Math.abs(selectedEntry.final)
//                     )}
//                   </small>
//                 </label>

//                 <label className="cl-field">
//                   <span>Remark</span>

//                   <input
//                     type="text"
//                     value={remark}
//                     onChange={(event) =>
//                       setRemark(event.target.value)
//                     }
//                   />
//                 </label>
//               </div>

//               <div className="cl-modal-footer">
//                 <button
//                   type="button"
//                   className="cl-cancel-btn"
//                   onClick={closeSettlement}
//                   disabled={submitting}
//                 >
//                   Close
//                 </button>

//                 <button
//                   type="button"
//                   className="cl-submit-btn"
//                   onClick={submitSettlement}
//                   disabled={submitting}
//                 >
//                   {submitting ? "Processing..." : "Submit"}
//                 </button>
//               </div>
//             </div>
//           </div>,
//           document.body
//         )}
//     </div>
//   );
// };

// export default React.memo(AllClientLedger);




/* eslint-disable */

import React from "react";
import { createPortal } from "react-dom";
import { useParams } from "react-router-dom";
import PaymentsIcon from "@mui/icons-material/Payments";

import betService from "../../../services/bet.service";
import { CustomLink } from "../../../pages/_layout/elements/custom-link";

import "./ClientLedger.css";

interface GroupedEntry {
  agent: string;
  amount: number;
  settled: number;
  final: number;
  ChildId: string;
}

type SettlementType = "lena" | "dena";

interface LedgerTotals {
  amount: number;
  settled: number;
  final: number;
}

const formatAmount = (value: number): string => {
  return Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const calculateTotals = (
  rows: GroupedEntry[]
): LedgerTotals => {
  return rows.reduce(
    (acc, item) => {
      acc.amount += item.amount;
      acc.settled += item.settled;
      acc.final += item.final;

      return acc;
    },
    {
      amount: 0,
      settled: 0,
      final: 0,
    }
  );
};

const AllClientLedger = () => {
  // ORIGINAL CHILD / AGENT ID
  const sendId = useParams().pid;

  // LEDGER DATA
  const [lena, setLena] = React.useState<GroupedEntry[]>([]);
  const [dena, setDena] = React.useState<GroupedEntry[]>([]);

  // UI STATE
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [search, setSearch] = React.useState("");

  const [activeTab, setActiveTab] =
    React.useState<SettlementType>("lena");

  // SETTLEMENT STATE
  const [showModal, setShowModal] = React.useState(false);

  const [selectedEntry, setSelectedEntry] =
    React.useState<GroupedEntry | null>(null);

  const [inputAmount, setInputAmount] =
    React.useState<number>(0);

  const [remark, setRemark] =
    React.useState<string>("");

  const [modalType, setModalType] =
    React.useState<SettlementType | null>(null);

  const [submitting, setSubmitting] =
    React.useState(false);

  // TOTALS
  const lenaTotals = React.useMemo(
    () => calculateTotals(lena),
    [lena]
  );

  const denaTotals = React.useMemo(
    () => calculateTotals(dena),
    [dena]
  );

  // FETCH SELECTED AGENT / CHILD LEDGER
  const fetchLedger = React.useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // ORIGINAL API
      const res = await betService.pponeledger(sendId);

      const { lenaArray, denaArray } = res.data.data;

      // IMPORTANT:
      // DL par user list redirect REMOVE.
      // DL ke clients ka ledger isi page par dikhega.
      setLena(lenaArray || []);
      setDena(denaArray || []);

    } catch (err) {
      console.error("Ledger fetch failed:", err);

      setLena([]);
      setDena([]);

      setError(
        "Unable to load ledger. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [sendId]);

  React.useEffect(() => {
    fetchLedger();
  }, [fetchLedger]);

  // ACTIVE TABLE
  const activeRows =
    activeTab === "lena" ? lena : dena;

  const activeTotals =
    activeTab === "lena"
      ? lenaTotals
      : denaTotals;

  // SEARCH FILTER - UI ONLY
  const filteredRows = React.useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return activeRows;
    }

    return activeRows.filter((row) => {
      return (
        row.agent?.toLowerCase().includes(query) ||
        String(row.ChildId).toLowerCase().includes(query)
      );
    });
  }, [activeRows, search]);

  // OPEN SETTLEMENT
  const openSettlement = (
    row: GroupedEntry,
    type: SettlementType
  ) => {
    setSelectedEntry(row);
    setInputAmount(0);
    setRemark("");
    setModalType(type);
    setShowModal(true);
  };

  // CLOSE SETTLEMENT
  const closeSettlement = () => {
    if (submitting) return;

    setShowModal(false);
  };

  // MODAL SCROLL LOCK
  React.useEffect(() => {
    if (!showModal) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        !submitting
      ) {
        setShowModal(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [showModal, submitting]);

  // ORIGINAL SETTLEMENT LOGIC
  const submitSettlement = async () => {
    if (
      !selectedEntry ||
      !modalType ||
      submitting
    ) {
      return;
    }

    // ORIGINAL MAXIMUM AMOUNT CHECK
    if (
      inputAmount >
      Number(
        Math.abs(selectedEntry.final).toFixed(2)
      )
    ) {
      alert(
        "Settlement amount cannot exceed Settle Amount."
      );

      return;
    }

    // ORIGINAL LENA / DENA SIGN LOGIC
    const settleamount =
      modalType === "lena"
        ? -Math.abs(inputAmount)
        : Math.abs(inputAmount);

    // ORIGINAL API PAYLOAD
    const data: any = {
      ChildId: selectedEntry.ChildId,
      settleamount,
      remark,
      type: modalType,
    };

    setSubmitting(true);

    try {
      await betService.postsettelement(data);

      setShowModal(false);

      // ORIGINAL REFRESH BEHAVIOUR
      window.location.reload();

    } catch (err) {
      alert("Error during settlement.");
      console.error(err);

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="client-ledger-page">

      {/* HEADER */}
      <div className="clp-header">
        <div>
          <span className="clp-eyebrow">
            Accounts / Settlement
          </span>

          <h1>All Client Ledger</h1>

          <p>
            Manage agent receivables,
            payables and settlements.
          </p>
        </div>

        <button
          type="button"
          className="clp-refresh"
          onClick={fetchLedger}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="clp-summary">

        {/* RECEIVING */}
        <div className="clp-summary-card">
          <span>Total Receiving</span>

          <strong
            style={{ color: "#16834a" }}
          >
            ₹ {formatAmount(lenaTotals.final)}
          </strong>

          <small>
            Lena Hai · {lena.length} Agents
          </small>
        </div>

        {/* PAYABLE */}
        <div className="clp-summary-card">
          <span>Total Payable</span>

          <strong className="negative">
            ₹ {formatAmount(denaTotals.final)}
          </strong>

          <small>
            Dena Hai · {dena.length} Agents
          </small>
        </div>

      </div>

      {/* LEDGER PANEL */}
      <div className="clp-panel">

        {/* TOOLBAR */}
        <div className="clp-toolbar">

          {/* TABS */}
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >

            <button
              type="button"
              onClick={() =>
                setActiveTab("lena")
              }
              style={{
                border: "1px solid #dce4ee",
                borderRadius: 7,
                padding: "10px 15px",
                background:
                  activeTab === "lena"
                    ? "#123a7c"
                    : "#fff",
                color:
                  activeTab === "lena"
                    ? "#fff"
                    : "#52647a",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              Lena Hai ({lena.length})
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveTab("dena")
              }
              style={{
                border: "1px solid #dce4ee",
                borderRadius: 7,
                padding: "10px 15px",
                background:
                  activeTab === "dena"
                    ? "#123a7c"
                    : "#fff",
                color:
                  activeTab === "dena"
                    ? "#fff"
                    : "#52647a",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              Dena Hai ({dena.length})
            </button>

          </div>

          {/* SEARCH */}
          <div className="clp-field">
            <label>Search Agent</label>

            <input
              type="text"
              placeholder="Search agent..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

        </div>

        {/* ERROR */}
        {error && (
          <div className="clp-error">
            {error}
          </div>
        )}

        {/* TABLE */}
        <div className="clp-table-wrap">
          <table className="clp-table">

            <thead>
              <tr>
                <th>AGENT</th>

                <th className="clp-number">
                  AMOUNT
                </th>

                <th className="clp-number">
                  SETTLED
                </th>

                <th className="clp-number">
                  FINAL
                </th>

                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>

              {/* EMPTY STATE */}
              {filteredRows.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="clp-empty"
                  >
                    {loading
                      ? "Loading ledger..."
                      : search
                      ? "No matching agents found"
                      : "No settlement records found"}
                  </td>
                </tr>
              )}

              {/* LEDGER ROWS */}
              {filteredRows.map((row) => (
                <tr key={row.ChildId}>

                  {/* CHILD / AGENT LINK */}
                  <td>
                    <CustomLink
                      to={`/all-settlement/${row.ChildId}`}
                      className="cl-agent-link"
                    >
                      {row.agent}
                    </CustomLink>
                  </td>

                  <td className="clp-number">
                    {formatAmount(row.amount)}
                  </td>

                  <td className="clp-number">
                    {formatAmount(row.settled)}
                  </td>

                  <td className="clp-number">
                    <span
                      className={
                        activeTab === "lena"
                          ? "clp-credit"
                          : "clp-debit"
                      }
                    >
                      {formatAmount(row.final)}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="cl-settle-btn"
                      onClick={() =>
                        openSettlement(
                          row,
                          activeTab
                        )
                      }
                    >
                      <PaymentsIcon fontSize="small" />
                      Settlement
                    </button>
                  </td>

                </tr>
              ))}

              {/* TOTALS */}
              <tr className="cl-total-row">

                <td>
                  {activeTab === "lena"
                    ? "LENA HAI"
                    : "DENA HAI"}
                </td>

                <td className="clp-number">
                  {formatAmount(
                    activeTotals.amount
                  )}
                </td>

                <td className="clp-number">
                  {formatAmount(
                    activeTotals.settled
                  )}
                </td>

                <td className="clp-number">
                  {formatAmount(
                    activeTotals.final
                  )}
                </td>

                <td />

              </tr>

            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="clp-table-footer">

          <span>
            Showing {filteredRows.length} of{" "}
            {activeRows.length} agents
          </span>

          <span>
            {activeTab === "lena"
              ? "Total Receiving"
              : "Total Payable"}
            : ₹{" "}
            {formatAmount(activeTotals.final)}
          </span>

        </div>
      </div>

      {/* SETTLEMENT MODAL */}
      {showModal &&
        selectedEntry &&
        createPortal(
          <div
            className="cl-modal-overlay"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeSettlement();
              }
            }}
          >
            <div
              className="cl-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="cl-modal-title"
            >

              {/* MODAL HEADER */}
              <div className="cl-modal-header">

                <div>
                  <span className="cl-modal-kicker">
                    Account Settlement
                  </span>

                  <h2 id="cl-modal-title">
                    Settle with{" "}
                    {selectedEntry.agent}
                  </h2>
                </div>

                <button
                  type="button"
                  className="cl-modal-close"
                  onClick={closeSettlement}
                  disabled={submitting}
                  aria-label="Close"
                >
                  ×
                </button>

              </div>

              {/* MODAL BODY */}
              <div className="cl-modal-body">

                <div className="cl-modal-balance">

                  <span>
                    Settle Amount (Fixed):{" "}
                    {modalType}
                  </span>

                  <strong>
                    ₹{" "}
                    {formatAmount(
                      selectedEntry.final
                    )}
                  </strong>

                </div>

                {/* AMOUNT */}
                <label className="cl-field">

                  <span>
                    Settlement Amount
                  </span>

                  <input
                    type="number"
                    value={inputAmount}
                    onChange={(event) =>
                      setInputAmount(
                        Math.abs(
                          Number(
                            event.target.value
                          )
                        )
                      )
                    }
                  />

                  <small>
                    Maximum ₹{" "}
                    {formatAmount(
                      Math.abs(
                        selectedEntry.final
                      )
                    )}
                  </small>

                </label>

                {/* REMARK */}
                <label className="cl-field">

                  <span>Remark</span>

                  <input
                    type="text"
                    value={remark}
                    onChange={(event) =>
                      setRemark(
                        event.target.value
                      )
                    }
                  />

                </label>

              </div>

              {/* MODAL FOOTER */}
              <div className="cl-modal-footer">

                <button
                  type="button"
                  className="cl-cancel-btn"
                  onClick={closeSettlement}
                  disabled={submitting}
                >
                  Close
                </button>

                <button
                  type="button"
                  className="cl-submit-btn"
                  onClick={submitSettlement}
                  disabled={submitting}
                >
                  {submitting
                    ? "Processing..."
                    : "Submit"}
                </button>

              </div>

            </div>
          </div>,
          document.body
        )}

    </div>
  );
};

export default AllClientLedger;
