import React, { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { PlayCircle, Dices, Handshake, UsersRound, Layers3, FileText, ClipboardList } from "lucide-react";
import { useDispatch } from "react-redux";
import { CustomLink, useNavigateCustom } from "../../../pages/_layout/elements/custom-link";
import { useAppSelector } from "../../../redux/hooks";
import { selectUserData } from "../../../redux/actions/login/loginSlice";
import { setCurrentMatch } from "../../../redux/actions/sports/sportSlice";
import User, { RoleType } from "../../../models/User";
import IMatch from "../../../models/IMatch";
import LMatch from "../../../models/LMatch";
import UserService from "../../../services/user.service";
import userService from "../../../services/user.service";
import casinoService from "../../../services/casino.service";
import sportsServices from "../../../services/sports.service";
import MatchList2 from "../../../pages/dashboard/elements/adminmatch-list";
import "./admin-dashboard.css";

const ROLE_LABELS: Record<string, string> = {
  admin: "Super Admin", sadmin: "Sub Admin", suadmin: "Admin",
  smdl: "Master Agent", mdl: "Super Agent Master", dl: "Agent Master", user: "Client Master",
};
const ROLE_MAP: Record<string, RoleType[]> = {
  admin: [RoleType.sadmin, RoleType.suadmin, RoleType.smdl, RoleType.mdl, RoleType.dl, RoleType.user],
  sadmin: [RoleType.suadmin, RoleType.smdl, RoleType.mdl, RoleType.dl, RoleType.user],
  suadmin: [RoleType.smdl, RoleType.mdl, RoleType.dl, RoleType.user],
  smdl: [RoleType.mdl, RoleType.dl, RoleType.user],
  mdl: [RoleType.dl, RoleType.user], dl: [RoleType.user], user: [],
};
const formatMoney = (value: unknown) => {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? amount.toLocaleString("en-IN", { maximumFractionDigits: 2 }) : "0";
};
type DashboardSection = "matches" | "casino" | null;

const AdminDashboard: React.FC = () => {
  const navigate = useNavigateCustom();
  const dispatch = useDispatch();
  const userState = useAppSelector<{ user: User }>(selectUserData);
  const username = userState?.user?.username || "";
  const userRole = userState?.user?.role as RoleType;
  const [detail, setDetail] = useState<any>({});
  const [userList, setUserList] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<DashboardSection>(null);
  const [matchList, setMatchList] = useState<LMatch[]>([]);
  const [gameList, setGameList] = useState<any[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState("");

  const roleOptions = (ROLE_MAP[String(userRole)] || []).map((key) => ({
    key, label: ROLE_LABELS[String(key)] || String(key),
  }));

  useEffect(() => {
    if (!username) { setLoading(false); return; }
    let active = true;
    setLoading(true);
    Promise.allSettled([
      UserService.getParentUserDetail(username),
      userService.getUserList({ username, type: "", search: "", status: "", page: 1 }),
    ]).then((results) => {
      if (!active) return;
      const [detailResult, usersResult] = results;
      if (detailResult.status === "fulfilled") {
        const response = detailResult.value as AxiosResponse<any>;
        setDetail(response?.data?.data?.[0] || {});
      } else console.error("Dashboard detail error:", detailResult.reason);
      if (usersResult.status === "fulfilled") {
        const response = usersResult.value as AxiosResponse<any>;
        setUserList(response?.data?.data || {});
      } else console.error("Dashboard users error:", usersResult.reason);
      setLoading(false);
    });
    return () => { active = false; };
  }, [username]);

  // Use the same original list APIs. Only show the list when its dashboard icon is clicked.
  useEffect(() => {
    if (!activeSection) return;
    let active = true;
    setListLoading(true);
    setListError("");
    const request = activeSection === "matches"
      ? sportsServices.getMatchList("4")
      : casinoService.getCasinoList();
    request.then((res: AxiosResponse<any>) => {
      if (!active) return;
      const items = Array.isArray(res?.data?.data) ? res.data.data : [];
      if (activeSection === "matches") setMatchList(items);
      else setGameList(items);
    }).catch((error: any) => {
      if (!active) return;
      console.error("Dashboard list error:", error);
      setListError("Unable to load list. Please try again.");
    }).finally(() => { if (active) setListLoading(false); });
    return () => { active = false; };
  }, [activeSection]);

  const users = Array.isArray(userList?.items) ? userList.items : [];
  const countRole = (role: RoleType) => users.filter((item: any) => item.role === role).length;
  const go = (path: string) => navigate.go(path);

  const currentMatch = (match: IMatch) => {
    dispatch(setCurrentMatch(match));
    go(`/odds/${match.matchId}/${detail?.share ?? 0}`);
  };

  const cards = [
    { title: "Live Matches", icon: PlayCircle, color: "cyan", section: "matches" as DashboardSection, path: "" },
    { title: "Live Casino", icon: Dices, color: "red", section: "casino" as DashboardSection, path: "" },
    { title: "My Settlement", icon: Handshake, color: "blue", section: null, path: "/my-ledger" },
    { title: "Master Details", icon: UsersRound, color: "cyan", section: null, path: roleOptions[0] ? `/list-clients/${username}/${roleOptions[0].key}` : "" },
    { title: "Sports Betting", icon: Layers3, color: "green", section: null, path: "/sports-details" },
    { title: "ledgers", icon: ClipboardList, color: "blue", section: null, path: "/ledger-home" },
    { title: "All Report", icon: FileText, color: "red", section: null, path: "/all-client-report" },
  ];

  return (
    <div className="bet63-dashboard">
      <main className="bet63-content">
        {!activeSection && (<>
        <div className="bet63-notice">Please Maintain Your Account Otherwise Apka Panel Inactive Ho Jayega Thanks</div>
        <div className="bet63-balance-card">
          <span>My Account</span>
          <strong>₹ {formatMoney(detail?.balance?.balance)}</strong>
        </div>
        <div className="bet63-stats-grid">
          <div className="bet63-stat bet63-yellow"><span>My Share</span><strong>{detail?.share ?? 0}</strong></div>
          <div className="bet63-stat bet63-stat-blue"><span>Commission</span><strong>M {detail?.mcom ?? 0} / S {detail?.scom ?? 0}</strong></div>
        </div>
        <div className="bet63-role-grid">
          {roleOptions.map((role, index) => (
            <button type="button" key={role.key}
              className={`bet63-role-card ${role.key === RoleType.user ? "bet63-client" : index % 2 === 0 ? "bet63-agent" : "bet63-role-dark"}`}
              onClick={() => go(`/list-clients/${username}/${role.key}`)}>
              <strong>{role.label}</strong>
              <div className="bet63-role-count"><span className="bet63-count-white">{loading ? "…" : countRole(role.key)}</span></div>
            </button>
          ))}
        </div>
        <div className="bet63-icon-grid">
          {cards.map((item) => {
            const IconComponent = item.icon;
            return (
              <button type="button" key={item.title} className="bet63-icon-item"
                onClick={() => item.section ? setActiveSection(item.section) : item.path && go(item.path)}
                disabled={!item.section && !item.path}>
                <div className={`bet63-icon-circle bet63-${item.color}`}><IconComponent size={42} strokeWidth={2.4} /></div>
                <span className="bet63-icon-label">{item.title}</span>
              </button>
            );
          })}
        </div>

        </>)}

        {activeSection && (
          <section className="bet63-list-panel" style={{ marginTop: 24, padding: 16, background: "#fff", borderRadius: 12, border: "1px solid #dce4ee" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
              <h3 style={{ margin: 0, color: "#123a7c", fontSize: 18 }}>
                {activeSection === "matches" ? "Live Match List" : "Casino List"}
              </h3>
              <button type="button" onClick={() => setActiveSection(null)} style={{ border: 0, background: "#123a7c", color: "white", borderRadius: 6, padding: "8px 14px", cursor: "pointer" }}>← Back to Dashboard</button>
            </div>
            {listLoading ? <p>Loading...</p> : listError ? <p style={{ color: "#c33" }}>{listError}</p> : activeSection === "matches" ? (
              <MatchList2 currentMatch={currentMatch} matchList={matchList} />
            ) : (
              <div className="bet63-casino-list" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: 12 }}>
                {gameList.filter((item: any) => !item.isDisable && item.match_id !== -1).map((item: any, index: number) => (
                  <CustomLink key={item.slug || index} to={`/casino/${item.slug}`} className="bet63-casino-game"
                    style={{ display: "flex", flexDirection: "column", gap: 8, textAlign: "center", textDecoration: "none", color: "#123a7c", border: "1px solid #e0e6ee", borderRadius: 10, overflow: "hidden", paddingBottom: 10 }}>
                    <img src={item.image} alt={item.title} style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover" }} />
                    <span style={{ fontSize: 12, fontWeight: 600, padding: "0 6px" }}>{item.title}</span>
                  </CustomLink>
                ))}
                <CustomLink to="/matka-books" style={{ display: "flex", flexDirection: "column", gap: 8, textAlign: "center", textDecoration: "none", color: "#123a7c", border: "1px solid #e0e6ee", borderRadius: 10, overflow: "hidden", paddingBottom: 10 }}>
                  <img src="imgs/matka.png" alt="Matka" style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover" }} />
                  <span style={{ fontSize: 12, fontWeight: 600 }}>Matka</span>
                </CustomLink>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};
export default AdminDashboard;
