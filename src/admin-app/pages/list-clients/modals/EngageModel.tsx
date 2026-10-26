import React, { useEffect, useState } from "react";
import moment from "moment-timezone";

interface EngageModalProps {
  open: boolean;
  onClose: () => void;
  rows: any[];
  title?: string;
}

const styles = {
  overlay: {
    position: "fixed" as const,
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(10, 12, 20, 0.55)",
    zIndex: 2000,
    padding: 20,
  },
  container: {
    width: "min(980px, 96%)",
    maxHeight: "90vh",
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 20px 60px rgba(2,6,23,0.45)",
    display: "flex",
    flexDirection: "column" as const,
    overflow: "hidden",
  },
  body: {
    padding: 16,
    overflow: "auto" as const,
  },
  tableWrap: {
    width: "100%",
    overflowX: "auto" as const,
    borderRadius: 8,
    border: "1px solid #f0f4f8",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    minWidth: 640,
    fontSize: 14,
  },
  thead: {
    background: "#f8fbff",
  },
  th: {
    padding: "12px 14px",
    textAlign: "left" as const,
    fontWeight: 700,
    borderBottom: "1px solid #eef6ff",
  },
  td: {
    padding: "12px 14px",
    borderBottom: "1px solid #f6f9fc",
  },
  exposurePill: {
    padding: "6px 10px",
    borderRadius: 999,
    background: "#e8f8f0",
    color: "#037a4b",
    fontWeight: 600,
    fontSize: 13,
    display: "inline-block",
  },
  emptyRow: {
    padding: 30,
    textAlign: "center" as const,
    color: "#6b7280",
  },
  footer: {
    padding: "12px 16px",
    borderTop: "1px solid #f2f6fb",
    display: "flex",
    justifyContent: "flex-end",
  },
  closeBtn: {
    padding: "8px 14px",
    borderRadius: 8,
    border: "1px solid #e6eef6",
    background: "#fff",
    cursor: "pointer",
  },
};

const EngageModal: React.FC<EngageModalProps> = ({
  open,
  onClose,
  rows,
  title = "User Engaged Chips",
}) => {
  const [filtered, setFiltered] = useState<any[]>([]);

  useEffect(() => {
    console.log(rows, "rows")
    setFiltered(rows || []);
  }, [rows]);

  if (!open) return null;

  return (
    <>
      <style>{`
        .engage-row:nth-child(even){background:#fbfcff}
        .engage-row:hover{background:#f0fcf8}
      `}</style>

      <div style={styles.overlay} onClick={onClose}>
        <div
          style={styles.container}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={styles.body}>
            <h3 style={{ marginBottom: 12 }}>{title}</h3>

            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead style={styles.thead}>
                  <tr>
                    <th style={styles.th}>Match / Round</th>
                    <th style={styles.th}>-</th>
                      <th style={styles.th}>-</th>
                       <th style={styles.th}>Bhav</th>
                    <th style={styles.th}>Exposure</th>
                    <th style={styles.th}>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={3} style={styles.emptyRow}>
                        No engagement data found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((r, idx) => (
                      <tr key={idx} className="engage-row">
                        <td style={styles.td}>
                          <strong>
                            {r.selectionName || r.roundid || "N/A"}
                          </strong>
                        </td>

                        <td style={styles.td}>
                          <strong>
                            {
                              r.bet_on === "FANCY"
                                ? (r.isBack ? "YES" : "NO")
                                : r.bet_on === "MATCH_ODDS"
                                  ? (r.isBack ? "LAGAI" : "KHAI")
                                  : ""
                            }
                          </strong>
                        </td>
                         <td style={styles.td}>
                          <strong>
                            {
                              r.bet_on === "FANCY"
                                ? (r.odds)
                                : r.bet_on === "MATCH_ODDS"
                                  ? (r.selectionName)
                                  : ""
                            }
                          </strong>
                        </td>
                        <td style={styles.td}>
                          <strong>
                            {
                              r.bet_on === "FANCY"
                                ? (r.volume)
                                : r.bet_on === "MATCH_ODDS"
                                  ? (r.odds)
                                  : ""
                            }
                          </strong>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.exposurePill}>
                            {(Number(r.stack || r.betamount) || 0).toLocaleString()}
                          </span>
                        </td>

                        <td style={styles.td}>
                          {r.betClickTime
                            ? moment
                              .utc(r.betClickTime)
                              .format("MMMM Do YYYY, h:mm:ss A")
                            : moment(r.createdAt)
                              .tz("Asia/Kolkata")
                              .format("DD/MM/YYYY hh:mm:ss A")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div style={styles.footer}>
            <button onClick={onClose} style={styles.closeBtn}>
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EngageModal;
