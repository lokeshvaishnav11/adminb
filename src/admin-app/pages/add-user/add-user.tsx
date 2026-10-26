// import React from "react";
// import {
//   useForm,
//   // Resolver
// } from "react-hook-form";
// import User, { RoleName, RoleType } from "../../../models/User";
// import UserService from "../../../services/user.service";
// import { useAppSelector } from "../../../redux/hooks";
// import { selectUserData } from "../../../redux/actions/login/loginSlice";
// import * as Yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { AxiosResponse } from "axios";
// import ISport from "../../../models/ISport";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import { selectSportList } from "../../../redux/actions/sports/sportSlice";
// import SubmitButton from "../../../components/SubmitButton";
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
// import DepositM from "../list-clients/modals/DepositM";
// import userService from "../../../services/user.service";
// import CancelIcon from "@mui/icons-material/Cancel";
// import SaveIcon from "@mui/icons-material/Save";

// const validationSchema = Yup.object().shape({
//   username: Yup.string()
//     .trim("User name cannot include leading and trailing spaces")
//     .strict(true)
//     .required("Username is required"),

//   password: Yup.string()
//     .required("Password is required")
//     .min(6, "Password must be at least 6 characters"),
//   role: Yup.string().required("Role is required"),
//   creditRefrences: Yup.string(),

//   share: Yup.string(),

//   mcom: Yup.string(),
//   matcom: Yup.string(),
//   scom: Yup.string(),
//   sendamount: Yup.number(),

//   // 🔗 NEW: commission-approval checkbox (only used when Admin creates a Sub-Admin)
//   comm: Yup.boolean(),

//   exposerLimit: Yup.string().when("role", {
//     is: "user",
//     then: Yup.string(),
//   }),
// });

// const AddUser = () => {
//   const userState = useAppSelector<{ user: User }>(selectUserData);
//   const [selectedUser, setSelectedUser] = React.useState<User>();
//   const [isPartnership, setIsPartnership] = React.useState(false);
//   const [isExposerAllow, setExposerAllow] = React.useState(false);
//   const sportListState = useAppSelector<{ sports: ISport[] }>(selectSportList);

//   const [uplineParent, setUplineParent] = React.useState<any>(null);

//   const [newbalance, setNewbalance] = React.useState({});
//   const [pshared, setPshared] = React.useState();
//   const [searchParams] = useSearchParams();
//   const [callbacklist, setcallbacklist] = React.useState(false);

//   const [users, setUserList] = React.useState<any>();
//   const [upperlist, setUpperlist] = React.useState<any>();

//   const [maxBalance, setMaxBalance] = React.useState<any>();

//   const [loading, setLoading] = React.useState(false);
//   const navigate = useNavigate();

//   React.useEffect(() => {
//     const username = uplineParent
//       ? uplineParent?.username
//       : userState?.user?.username;

//     UserService.getParentUserDetail(username).then(
//       (res: AxiosResponse<any>) => {
//         const thatb = res.data?.data[0]?.balance?.balance;
//         const psharee = res?.data?.data[0]?.share;
//         setPshared(psharee);
//         setNewbalance(thatb);
//         setMaxBalance(thatb);
//       }
//     );
//   }, [userState, uplineParent]);

//   const { username } = useParams();

//   const selfrole: any = userState?.user?.role;

//   const thetype: any = useParams().type;

//   // ✅ Define disallowed combinations
//   const allowedPairs: Record<string, string[]> = {
//     sadmin: ["admin"],
//     suadmin: ["sadmin"],
//     smdl: ["suadmin"],
//     mdl: ["smdl"],
//     dl: ["mdl"],
//     user: ["dl"],
//   };

//   const isallowed = React.useMemo(() => {
//     const sallowed = allowedPairs[thetype];
//     return sallowed?.includes(selfrole) ?? false;
//   }, [thetype, selfrole]);

//   // 🔗 NEW: is this specifically "Admin creating a Sub-Admin"?
//   // Only in this exact case do we show the commission-approval checkbox.
//   const isAdminCreatingSubAdmin = thetype === "sadmin" && selfrole === "admin";

//   // 🔗 NEW: for every other creation flow, whether the commission fields
//   // (Match / Matka / Session %) are shown depends on whether the
//   // *currently logged-in* user was themselves approved for commission
//   // (userState.user.comm === true) when they were created.
//   console.log(userState?.user?.comm,userState?.user,"hahahhaah")
//   const showCommissionFields = isAdminCreatingSubAdmin || userState?.user?.comm === true;

//   const [sendcode, setSendcode] = React.useState("");
//   const [sendpass, setSendpass] = React.useState("");

//   React.useEffect(() => {
//     let fword = "";

//     switch (thetype) {
//       case "sadmin":
//         fword = "SB";
//         break;
//       case "suadmin":
//         fword = "AD";
//         break;
//       case "smdl":
//         fword = "MA";
//         break;
//       case "mdl":
//         fword = "SA";
//         break;
//       case "dl":
//         fword = "A";
//         break;
//       case "user":
//         fword = "C";
//         break;
//       default:
//         fword = "";
//     }

//     // const randomNumber =
//     //   Math.floor(Math.random() * (99999 - 19999 + 1)) + 19999;
//     // setSendcode(fword + randomNumber);
    
//     userService.getUseridno().then((res: AxiosResponse<any>)=>{
//       const randomNumber = res.data.data.id
//       setSendcode(fword + randomNumber)
//     })


//   }, [thetype]);



//   const {
//     register,
//     handleSubmit,
//     reset,
//     getValues,
//     setValue,
//     formState: { errors },
//   } = useForm<User>({
//     resolver: yupResolver(validationSchema, { context: { maxBalance } }),
//     mode: "onChange",
//     defaultValues: {
//       transactionPassword: "123456",
//     },
//   });

//   React.useEffect(() => {
//     if (uplineParent ? uplineParent?.username : username) {
//       UserService.getUserDetail(
//         uplineParent ? uplineParent?.username : username
//       ).then((res: AxiosResponse<any>) => {
//         setSelectedUser(res.data.data);
//       });
//     }
//   }, [username, uplineParent]);

//   React.useEffect(() => {
//     const validRoles = Object.values(RoleType);

//     if (thetype && validRoles.includes(thetype as RoleType)) {
//       setValue("role", thetype as RoleType);
//       setIsPartnership(thetype === RoleType.user);
//       setExposerAllow(thetype === RoleType.user);
//     }
//   }, [thetype, setValue]);

//   React.useEffect(() => {
//     setValue("transactionPassword", "123456");
//   }, [setValue]);

//   const [senddata, setSenddata] = React.useState({});

//   const onSubmit = handleSubmit((data) => {
//     if (Number(data.sendamount) > Number(maxBalance)) {
//       toast.error(
//         `Client Limit cannot exceed available balance (${maxBalance})`
//       );
//       return;
//     }

//     if (Number(data.matcom) > 10 || Number(data.matcom) < 0) {
//       toast.error("Matka commission must be between 0 and 10");
//       return;
//     }

//     if (Number(data.mcom) > 2 || Number(data.mcom) < 0) {
//       toast.error("Match commission must be between 0 and 2");
//       return;
//     }

//      if (Number(data.cacom) > 2 || Number(data.cacom) < 0) {
//       toast.error("Casino must be between 0 and 2");
//       return;
//     }

//     if (Number(data.scom) > 4 || Number(data.scom) < 0) {
//       toast.error("Session commission must be between 0 and 4");
//       return;
//     }

//     setLoading(true);

//     data.creditRefrences = data.sendamount;
//     data.exposerLimit = data.sendamount;

//     // 🔗 NEW: only meaningful in the Admin → Sub-Admin creation flow.
//     // For every other flow this stays whatever the form default was
//     // (unregistered/undefined), so it won't accidentally grant permission.
//     if (isAdminCreatingSubAdmin) {
//       data.comm = true;
//     }

//     if (data.role !== RoleType.user) {
//       const partenershipValue: any = [10, 20, 30];
//       const partenershipArr: { [x: string]: any } = {};

//       partenershipValue.forEach((element: any, index: any) => {
//         if (element !== undefined) {
//           partenershipArr[index] = element;
//         }
//       });

//       const userSettingArr: { [x: string]: any } = {};

//       const minBetValue = Array.isArray(data.minbet)
//         ? data.minbet
//         : Object.values(data.minbet || {});
//       const maxBetValue = Array.isArray(data.maxbet)
//         ? data.maxbet
//         : Object.values(data.maxbet || {});
//       const delayValue = Array.isArray(data.delay)
//         ? data.delay
//         : Object.values(data.delay || {});

//       minBetValue.forEach((element, index) => {
//         if (element !== undefined) {
//           userSettingArr[index] = { minBet: element };
//         }
//       });

//       maxBetValue.forEach((element, index) => {
//         if (element !== undefined) {
//           userSettingArr[index] = Object.assign(userSettingArr[index] || {}, {
//             maxBet: element,
//           });
//         }
//       });

//       delayValue.forEach((element, index) => {
//         if (element !== undefined) {
//           userSettingArr[index] = Object.assign(userSettingArr[index] || {}, {
//             delay: element,
//           });
//         }
//       });

//       data.userSetting = userSettingArr;
//     }

//     data.parent = uplineParent ? uplineParent?.username : userData?.username;

//     data.code = sendcode;
//     data.pshare = pshared;

//     console.log(data, "send dataa");

//     UserService.addUser(data)
//       .then((ress) => {
//         if (ress?.data?.message === "New User Added and Funded Successfully") {
//           setLoading(false);
//           setSenddata(data);
//           toast.success("User successfully created");
//           reset();
//           // 🔗 CHANGED: instead of reloading the current add-user page,
//           // go back to whichever page this form was opened from.
//           navigate(-1);
//         } else {
//           setLoading(false);
//           toast.error(ress?.data?.message);
//         }
//       })
//       .catch((e) => {
//         const error = e.response?.data?.message;
//         setLoading(false);
//         toast.error(error);
//       });
//   });

//   const roleOption = () => {
//     const userRole = userData.role;
//     const allRoles = JSON.parse(JSON.stringify(RoleName));
//     delete allRoles.admin;
//     const options: Record<string, string> = allRoles;
//     if (userRole && userRole != "admin") {
//       const allOptions = Object.keys(options);
//       const startIndex = allOptions.indexOf(userRole);
//       const newArray = allOptions.slice(startIndex + 1);

//       return newArray.map((option, index) => {
//         if (+userRole >= ++index) return false;
//         return (
//           <option key={index} value={option}>
//             {options[option]}
//           </option>
//         );
//       });
//     }
//     return Object.keys(options).map((option, index) => {
//       return (
//         <option key={index} value={option}>
//           {options[option]}
//         </option>
//       );
//     });
//   };

//   const userData = selectedUser ? selectedUser : userState?.user;

//   const [searchObj, setSearchObj] = React.useState<any>({
//     type: "",
//     username: "",
//     status: "",
//     search: "",
//   });

//   const getList = (obj: {
//     username: string;
//     type: string;
//     search: string;
//     status?: string;
//     page?: number;
//   }) => {
//     if (!obj.page) obj.page = 1;
//     userService.getUserList(obj).then((res: AxiosResponse<any>) => {
//       setSearchObj(obj);
//       setUserList(res.data.data);
//     });
//   };

//   React.useEffect(() => {
//     const search = searchParams.get("search") ? searchParams.get("search") : "";
//     getList({
//       username: userState?.user?.username!,
//       search: search!,
//       type: "",
//     });
//   }, [
//     username,
//     searchParams.get("search"),
//     callbacklist,
//     thetype,
//     userState?.user?.username,
//   ]);

//   let addtype = "";

//   switch (thetype) {
//     case "sadmin":
//       addtype = "admin";
//       break;
//     case "suadmin":
//       addtype = "sadmin";
//       break;
//     case "smdl":
//       addtype = "suadmin";
//       break;
//     case "mdl":
//       addtype = "smdl";
//       break;
//     case "dl":
//       addtype = "mdl";
//       break;
//     case "user":
//       addtype = "dl";
//       break;
//     default:
//       addtype = "";
//       break;
//   }

//   const filterred = users?.items?.filter((u: any) => u?.role === addtype);

//   const handleSelectChange = (e: any) => {
//     const selectedUsername = e.target.value;
//     const selectedUserff = filterred?.find(
//       (u: any) => u.username === selectedUsername
//     );
//     setUplineParent(selectedUserff);
//   };

//   React.useEffect(() => {}, [uplineParent]);

//  const generatePassword = () => {
//   const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//   const lower = "abcdefghijklmnopqrstuvwxyz";
//   const numbers = "0123456789";

//   const firstPart =
//     upper[Math.floor(Math.random() * upper.length)] +
//     lower[Math.floor(Math.random() * lower.length)] +
//     lower[Math.floor(Math.random() * lower.length)] +
//     lower[Math.floor(Math.random() * lower.length)];

//   let lastPart = "";
//   for (let i = 0; i < 2; i++) {
//     lastPart += numbers[Math.floor(Math.random() * numbers.length)];
//   }

//   const finalPassword = firstPart + lastPart;

//   setValue("password", finalPassword, {
//     shouldDirty: true,
//     shouldValidate: true,
//   });
// };

// React.useEffect(() => {
//   generatePassword();
// }, []);

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-md-12 main-container">
//           <div>
//             <div className="add-account">
//               <div className="text-right mb-2 d-flex items-center justify-between bg-color p-2 rounded ">
//                 <p className="text-xl text-white">
//                   {thetype == "sadmin"
//                     ? "Sub Admin"
//                     : thetype == "suadmin"
//                       ? "Admin"
//                       : thetype == "smdl"
//                         ? "Master Agent"
//                         : thetype == "mdl"
//                           ? "Super Agent Master"
//                           : thetype == "dl"
//                             ? "Agent Master"
//                             : "Client"}
//                 </p>

//                 <p className="btn btn-diamond">
//                   <PersonAddIcon /> Create
//                 </p>
//               </div>
//               <form onSubmit={onSubmit} noValidate>
//                 <div className="row">
//                   <div className="col-md-6 personal-detail">
//                     {filterred?.length > 0 ? (
//                       <div className="mb-4 mt-4 justify-between flex items-center d-none">
//                         <label>Select Upperline</label>
//                         <select
//                           onChange={handleSelectChange}
//                           className="border rounded-0 p-2"
//                         >
//                           <option value="">-- Select User --</option>
//                           {filterred?.map((user: any) => (
//                             <option key={user?._id} value={user.username}>
//                               {user?.username}({user?.code})
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     ) : (
//                       ""
//                     )}

//                     <div className="row">
//                       <div className="col-md-6">
//                         <div className="form-group">
//                           <div>
//                             <label htmlFor="username">UserName</label>
//                             <input
//                               type="text"
//                               className="form-control username"
//                               value={sendcode}
//                             />
//                           </div>

//                           <div style={{ display: "grid" }}>
//                             <label>Agent</label>
//                             {filterred?.length > 0 ? (
//                               <select
//                                 onChange={handleSelectChange}
//                                 className="border rounded-0 p-2"
//                               >
//                                 <option value="">-- Select User --</option>
//                                 {filterred?.map((user: any) => (
//                                   <option key={user?._id} value={user.username}>
//                                     {user?.username}({user?.code})
//                                   </option>
//                                 ))}
//                               </select>
//                             ) : (
//                               ""
//                             )}
//                           </div>

//                           <div>
//                             <label htmlFor="">Agent Limit</label>
//                             <input
//                               type="text"
//                               className="form-control username"
//                               value={maxBalance}
//                             />
//                           </div>

//                           <div className="mt-4">
//                             <label htmlFor="username">Name</label>
//                             <input
//                               placeholder="User Name"
//                               id="username"
//                               {...register("username")}
//                               defaultValue={""}
//                               type="text"
//                               className="form-control"
//                             />
//                             <span
//                               id="username-error"
//                               className="error"
//                               style={{ display: "none" }}
//                             >
//                               Username already taken
//                             </span>
//                             {errors?.username && (
//                               <span id="username-required" className="error">
//                                 {errors.username.message}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                       <div className="col-md-6">
//                         <div className="form-group">
//                           <label htmlFor="password">Password</label>
//                           <input
//                             placeholder="Password"
//                             id="password"
//                             type="text"
//                             {...register("password")}
//                             className="form-control"
//                           />

//                           {errors?.password && (
//                             <span id="password-error" className="error">
//                               {errors.password.message}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-md-6 account-detail">
//                     <div className="row">
//                       <div className="col-md-6">
//                         {thetype === "undefined" ? (
//                           <div className={"form-group"}>
//                             <label htmlFor="role">Account Type</label>
//                             <select
//                               {...register("role", {
//                                 onChange: (e) => {
//                                   const value = e.target.value;
//                                   setIsPartnership(value === RoleType.user);
//                                   setExposerAllow(value === RoleType.user);
//                                 },
//                               })}
//                               id="role"
//                               className="form-control"
//                             >
//                               <option value={""}>
//                                 - Select Your Account Type -
//                               </option>
//                               {roleOption()}
//                             </select>
//                             {errors?.role && (
//                               <span id="role-error" className="error">
//                                 {errors.role.message}
//                               </span>
//                             )}
//                           </div>
//                         ) : (
//                           ""
//                         )}
//                       </div>

//                       <div className="col-md-6 d-none">
//                         <div className="form-group">
//                           <label htmlFor="creditrefrence">Client Limit</label>
//                           <input
//                             className="form-control"
//                             placeholder="Super Limit"
//                             {...register("creditRefrences")}
//                             id="creditRefrences"
//                             defaultValue={""}
//                             min="0"
//                             type="number"
//                           />
//                           {errors?.creditRefrences && (
//                             <span id="creditrefrence-error" className="error">
//                               {errors.creditRefrences.message}
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       {!isExposerAllow && (
//                         <div className="col-md-6">
//                           <div className="form-group">
//                             <label htmlFor="share">
//                               Super Share{`(≤${pshared ? pshared : 0})`}
//                             </label>

//                             <input
//                               className="form-control"
//                               placeholder="Supershare Limit"
//                               {...register("share")}
//                               id="share"
//                               defaultValue={0}
//                               min="0"
//                               max={pshared ? pshared : 0}
//                               type="number"
//                             />
//                           </div>
//                         </div>
//                       )}

//                       <div className="col-md-6">
//                         <div className="form-group">
//                           <label htmlFor="sendamount">
//                             Client Limit ({maxBalance ? maxBalance : ""})
//                           </label>
//                           <input
//                             className="form-control"
//                             placeholder="sendamount "
//                             {...register("sendamount")}
//                             id="sendamount"
//                             defaultValue={0}
//                             min="0"
//                             type="number"
//                           />
//                         </div>
//                       </div>

//                       {/* 🔗 NEW: Commission-approval checkbox — ONLY visible when
//                           an Admin is creating a Sub-Admin. Value posts as req.body.comm */}
//                       {/* {isAdminCreatingSubAdmin && (
//                         <div className="col-md-6">
//                           <div className="form-group">
//                             <label
//                               htmlFor="comm"
//                               style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: "8px",
//                                 cursor: "pointer",
//                               }}
//                             >
//                               <input
//                                 type="checkbox"
//                                 id="comm"
//                                 {...register("comm")}
//                                 style={{ width: "16px", height: "16px" }}
//                               />
//                               Commission
//                             </label>
//                           </div>
//                         </div>
//                       )} */}

//                       {/* 🔗 NEW: Commission percentage fields — only shown when
//                           showCommissionFields is true (Admin→SubAdmin case, OR
//                           the logged-in user's own userState.user.comm === true) */}
//                       {showCommissionFields && (
//                         <>
//                           <div className="col-md-6">
//                             <div className="form-group">
//                               <label htmlFor="mcom">Match Commision(≤2%)</label>
//                               <input
//                                 className="form-control"
//                                 placeholder="M Comm Limit"
//                                 {...register("mcom")}
//                                 id="mcom"
//                                 defaultValue={0}
//                                 min="0"
//                                 max="2"
//                                 step="0.01"
//                                 type="number"
//                               />
//                             </div>
//                           </div>

//                            <div className="col-md-6">
//                             <div className="form-group">
//                               <label htmlFor="cacom">Casino Commision(≤2%)</label>
//                               <input
//                                 className="form-control"
//                                 placeholder="Casino Comm Limit"
//                                 {...register("cacom")}
//                                 id="cacom"
//                                 defaultValue={0}
//                                 min="0"
//                                 max="2"
//                                 step="0.01"
//                                 type="number"
//                               />
//                             </div>
//                           </div>

                         
//                           <div className="col-md-6">
//                             <div className="form-group">
//                               <label htmlFor="scom">
//                                 Session Commision(≤4%)
//                               </label>
//                               <input
//                                 className="form-control"
//                                 placeholder="S Comm Limit"
//                                 {...register("scom")}
//                                 id="scom"
//                                 defaultValue={0}
//                                 min="0"
//                                 max="4"
//                                 step="0.01"
//                                 type="number"
//                               />
//                             </div>
//                           </div>

//                            <div className="col-md-6">
//                             <div className="form-group">
//                               <label htmlFor="matcom">
//                                 Matka Commision(≤10%)
//                               </label>
//                               <input
//                                 className="form-control"
//                                 placeholder="M Comm Limit"
//                                 {...register("matcom")}
//                                 id="matcom"
//                                 defaultValue={0}
//                                 min="0"
//                                 max="10"
//                                 step="0.01"
//                                 type="number"
//                               />
//                             </div>
//                           </div>

//                         </>
//                       )}

//                       {isExposerAllow && (
//                         <div className="col-md-6 d-none ">
//                           <div className="form-group" id="exposer-limit">
//                             <label htmlFor="exposerLimit">Exposer Limit</label>
//                             <input
//                               placeholder="Exposer Limit"
//                               id="exposerLimit"
//                               {...register("exposerLimit")}
//                               defaultValue={""}
//                               type="number"
//                               className="form-control"
//                               min="0"
//                             />
//                             {errors?.exposerLimit && (
//                               <span id="exposerlimit-error" className="error">
//                                 {errors.exposerLimit.message}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//                 {!isExposerAllow && (
//                   <div
//                     style={{ display: "none" }}
//                     className="row m-t-20"
//                     id="partnership-div"
//                   >
//                     <div className="col-md-12">
//                       <table className="table table-striped table-bordereddd">
//                         <thead>
//                           <tr>
//                             <th />
//                             {sportListState.sports.map((sports: ISport) =>
//                               sports.sportId === 1 ||
//                                 sports.sportId === 2 ||
//                                 sports.sportId === 4 ? (
//                                 <th className="" key={sports._id}>
//                                   {
//                                     sports.name === "Soccer"
//                                       ? "Match Commission (%)"
//                                       : sports.name === "Tennis"
//                                         ? "Session Commission (%)"
//                                         : ""
//                                   }
//                                 </th>
//                               ) : (
//                                 <th key={sports._id} />
//                               )
//                             )}
//                           </tr>
//                         </thead>
//                         <tbody>
//                           <tr className="hidden">
//                             <td>Upline</td>
//                             {sportListState.sports.map(({ _id, sportId }) =>
//                               sportId == 1 || sportId == 2 ? (
//                                 <td
//                                   id="taxpartnership-upline"
//                                   key={`upline-${_id}`}
//                                 >
//                                   {userData?.partnership?.[sportId].ownRatio}
//                                 </td>
//                               ) : (
//                                 <td key={_id} />
//                               )
//                             )}
//                           </tr>

//                           <tr>
//                             <td></td>
//                             {sportListState.sports?.map(({ _id, sportId }) => {
//                               if (sportId === 4) {
//                                 return (
//                                   <td key={_id}>
//                                     <input
//                                       type="hidden"
//                                       {...register(`partnership.${sportId}`)}
//                                       value={0}
//                                     />
//                                   </td>
//                                 );
//                               }

//                               if (sportId === 1 || sportId === 2) {
//                                 return (
//                                   <td key={_id}>
//                                     <input
//                                       className="partnership"
//                                       {...register(`partnership.${sportId}`, {
//                                         onChange: (e) => {
//                                           const ownRatio =
//                                             userData.partnership?.[sportId]
//                                               ?.ownRatio;
//                                           ownRatio
//                                             ? setValue(
//                                               `partnershipOur.${sportId}`,
//                                               ownRatio - e.target.value
//                                             )
//                                             : setValue(
//                                               `partnershipOur.${sportId}`,
//                                               getValues(
//                                                 `partnershipOur.${sportId}`
//                                               )
//                                             );
//                                         },
//                                       })}
//                                       id={`partnership.${sportId}`}
//                                       placeholder=""
//                                       max={
//                                         userData?.partnership?.[sportId]
//                                           ?.ownRatio
//                                       }
//                                       min="0"
//                                       defaultValue={0}
//                                       type="number"
//                                       disabled={isPartnership}
//                                     />
//                                     <span className="error" />
//                                   </td>
//                                 );
//                               }

//                               return <td key={_id} />;
//                             })}
//                           </tr>

//                           <tr className="hidden">
//                             <td>Our</td>
//                             {sportListState.sports?.map(({ _id, sportId }) =>
//                               sportId == 1 || sportId == 2 ? (
//                                 <td
//                                   id={`taxpartnership-our.${sportId}`}
//                                   key={_id}
//                                 >
//                                   <input
//                                     {...register(`partnershipOur.${sportId}`)}
//                                     value={
//                                       userData?.partnership?.[sportId].ownRatio
//                                     }
//                                     disabled={true}
//                                   />
//                                 </td>
//                               ) : (
//                                 <td key={_id} />
//                               )
//                             )}
//                           </tr>
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 )}

//                 <div className="row m-t-20" id="min-max-bet-div">
//                   <div className="col-md-12 overflow-x-scroll">
//                     <table className="table table-striped table-borderedddd">
//                       <thead
//                         className={` ${thetype === "sadmin" ? "d-" : "d-none"}`}
//                       >
//                         <tr>
//                           <th />
//                           {sportListState.sports?.map((sports: any) =>
//                             sports.sportId === 1 ||
//                               sports.sportId === 2 ||
//                               sports.sportId === 4 ? (
//                               <th key={sports._id}>
//                                 {sports.name === "Cricket"
//                                   ? "Casino "
//                                   : sports.name === "Soccer"
//                                     ? "Match"
//                                     : sports.name === "Tennis"
//                                       ? "Fancy "
//                                       : ""}
//                               </th>
//                             ) : (
//                               <th key={sports._id} />
//                             )
//                           )}
//                         </tr>
//                       </thead>
//                       <tbody>
//                         <tr
//                           className={` ${thetype === "sadmin" ? "d-bl" : "d-none"
//                             }`}
//                         >
//                           <td></td>
//                           {sportListState.sports?.map(({ _id, sportId }) =>
//                             sportId == 1 || sportId == 2 || sportId == 4 ? (
//                               <td id="minbet" key={_id}>
//                                 {userData?.userSetting?.[sportId].minBet}
//                               </td>
//                             ) : (
//                               <td key={_id} />
//                             )
//                           )}
//                         </tr>
//                         <tr
//                           className={` ${thetype === "sadmin" ? "d-nonefff" : "d-none"
//                             }`}
//                         >
//                           <td>Provide Min Bet</td>
//                           {sportListState.sports?.map(({ _id, sportId }) =>
//                             sportId == 1 || sportId == 2 || sportId == 4 ? (
//                               <td key={_id}>
//                                 <input
//                                   id={`minbet.${sportId}`}
//                                   className={`minbet.${sportId}`}
//                                   {...register(`minbet.${sportId}`)}
//                                   placeholder={""}
//                                   max={userData?.userSetting?.[sportId].minBet}
//                                   min={0}
//                                   defaultValue={
//                                     userData?.userSetting?.[sportId].minBet
//                                   }
//                                   disabled
//                                   type="number"
//                                 />
//                                 <span className="error" />
//                               </td>
//                             ) : (
//                               <td key={_id} />
//                             )
//                           )}
//                         </tr>
//                         <tr
//                           className={` ${thetype === "sadmin" ? "d-nonefff" : "d-none"
//                             }`}
//                         >
//                           <td>Max Bet</td>
//                           {sportListState.sports?.map(({ _id, sportId }) =>
//                             sportId == 1 || sportId == 2 || sportId == 4 ? (
//                               <td id="maxbet" key={_id}>
//                                 {userData?.userSetting?.[sportId].maxBet}
//                               </td>
//                             ) : (
//                               <td key={_id} />
//                             )
//                           )}
//                         </tr>
//                         <tr
//                           className={` ${thetype === "sadmin" ? "d-nofffne" : "d-none"
//                             }`}
//                         >
//                           <td>Provide Min Bet</td>
//                           {sportListState.sports?.map(({ _id, sportId }) =>
//                             sportId == 1 || sportId == 2 || sportId == 4 ? (
//                               <td key={_id}>
//                                 <input
//                                   id={`maxbet.${sportId}`}
//                                   className={`maxbet.${sportId}`}
//                                   {...register(`maxbet.${sportId}`)}
//                                   placeholder={""}
//                                   max={userData?.userSetting?.[sportId].maxBet}
//                                   defaultValue={
//                                     sportId == 1 ? 200000 : sportId == 2 ? 50000 : 10000
//                                   }
//                                   disabled
//                                   min={0}
//                                   type="number"
//                                 />
//                                 <span className="error" />
//                               </td>
//                             ) : (
//                               <td key={_id} />
//                             )
//                           )}
//                         </tr>
//                         <tr
//                           className={` ${thetype === "sadmin" ? "d-nonfffe" : "d-none"
//                             }`}
//                         >
//                           <td>Delay</td>
//                           {sportListState.sports?.map(({ _id, sportId }) =>
//                             sportId == 1 || sportId == 2 || sportId == 4 ? (
//                               <td id="delay" key={_id}>
//                                 {userData?.userSetting?.[sportId].delay}
//                               </td>
//                             ) : (
//                               <td key={_id} />
//                             )
//                           )}
//                         </tr>
//                         <tr
//                           className={` ${thetype === "sadmin" ? "d-nonffe" : "d-none"}`}
//                         >
//                           <td>Provide Delay</td>
//                           {sportListState.sports?.map(({ _id, sportId }) =>
//                             sportId == 1 || sportId == 2 || sportId == 4 ? (
//                               <td key={_id}>
//                                 <input
//                                   id={`delay.${sportId}`}
//                                   className={`delay.${sportId}`}
//                                   {...register(`delay.${sportId}`)}
//                                   placeholder={""}
//                                   max={userData?.userSetting?.[sportId].delay}
//                                   defaultValue={
//                                     userData?.userSetting?.[sportId].delay
//                                   }
//                                   disabled
//                                   type="number"
//                                 />
//                                 <span className="error" />
//                               </td>
//                             ) : (
//                               <td key={_id} />
//                             )
//                           )}
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

//                 <div className="row m-t-20">
//                   <div className="col-md-12"></div>
//                 </div>
//                 <div className="row m-t-20">
//                   <div className="col-md-12">
//                     {isallowed || uplineParent ? (
//                       <div className="float-right flex item-center ">
//                         <button
//                           onClick={() => navigate(-1)}
//                           className="btn btn-danger btn-md mr-2 flex items-center"
//                         >
//                           <CancelIcon /> Cancel
//                         </button>
//                         <SubmitButton
//                           className="btn btn-submit"
//                           type="submit"
//                           disabled={loading}
//                         >
//                           <SaveIcon /> {loading ? "Saving..." : "Save"}
//                         </SubmitButton>
//                       </div>
//                     ) : (
//                       <div className="float-right"> Select Upline</div>
//                     )}
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default AddUser;




import React from "react";
import {
  useForm,
  // Resolver
} from "react-hook-form";
import User, { RoleName, RoleType } from "../../../models/User";
import UserService from "../../../services/user.service";
import { useAppSelector } from "../../../redux/hooks";
import { selectUserData } from "../../../redux/actions/login/loginSlice";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AxiosResponse } from "axios";
import ISport from "../../../models/ISport";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { selectSportList } from "../../../redux/actions/sports/sportSlice";
import SubmitButton from "../../../components/SubmitButton";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DepositM from "../list-clients/modals/DepositM";
import userService from "../../../services/user.service";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .trim("User name cannot include leading and trailing spaces")
    .strict(true)
    .required("Username is required"),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  role: Yup.string().required("Role is required"),
  creditRefrences: Yup.string(),

  share: Yup.string(),

  mcom: Yup.string(),
  matcom: Yup.string(),
  scom: Yup.string(),
  sendamount: Yup.number(),

  // 🔗 NEW: commission-approval checkbox (only used when Admin creates a Sub-Admin)
  comm: Yup.boolean(),

  exposerLimit: Yup.string().when("role", {
    is: "user",
    then: Yup.string(),
  }),
});

const AddUser = () => {
  const userState = useAppSelector<{ user: User }>(selectUserData);
  const [selectedUser, setSelectedUser] = React.useState<User>();
  const [isPartnership, setIsPartnership] = React.useState(false);
  const [isExposerAllow, setExposerAllow] = React.useState(false);
  const sportListState = useAppSelector<{ sports: ISport[] }>(selectSportList);

  const [uplineParent, setUplineParent] = React.useState<any>(null);

  const [newbalance, setNewbalance] = React.useState({});
  const [pshared, setPshared] = React.useState();
  const [searchParams] = useSearchParams();
  const [callbacklist, setcallbacklist] = React.useState(false);

  const [users, setUserList] = React.useState<any>();
  const [upperlist, setUpperlist] = React.useState<any>();

  const [maxBalance, setMaxBalance] = React.useState<any>();

  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const username = uplineParent
      ? uplineParent?.username
      : userState?.user?.username;

    UserService.getParentUserDetail(username).then(
      (res: AxiosResponse<any>) => {
        const thatb = res.data?.data[0]?.balance?.balance;
        const psharee = res?.data?.data[0]?.share;
        setPshared(psharee);
        setNewbalance(thatb);
        setMaxBalance(thatb);
      }
    );
  }, [userState, uplineParent]);

  const { username } = useParams();

  const selfrole: any = userState?.user?.role;

  const thetype: any = useParams().type;

  // ✅ Define disallowed combinations
  const allowedPairs: Record<string, string[]> = {
    sadmin: ["admin"],
    suadmin: ["sadmin"],
    smdl: ["suadmin"],
    mdl: ["smdl"],
    dl: ["mdl"],
    user: ["dl"],
  };

  const isallowed = React.useMemo(() => {
    const sallowed = allowedPairs[thetype];
    return sallowed?.includes(selfrole) ?? false;
  }, [thetype, selfrole]);

  // 🔗 NEW: is this specifically "Admin creating a Sub-Admin"?
  // Only in this exact case do we show the commission-approval checkbox.
  const isAdminCreatingSubAdmin = thetype === "sadmin" && selfrole === "admin";

  // Share label should reflect the currently logged-in account role.
  const currentShareLabel = React.useMemo(() => {
    const roleLabelMap: Record<string, string> = {
      admin: "Super Share",
      sadmin: "Sub Admin Share",
      suadmin: "Admin Share",
      smdl: "Master Agent Share",
      mdl: "Super Agent Master Share",
      dl: "Agent Master Share",
      user: "Client Share",
    };

    return roleLabelMap[selfrole] || "Share";
  }, [selfrole]);

  // 🔗 NEW: for every other creation flow, whether the commission fields
  // (Match / Matka / Session %) are shown depends on whether the
  // *currently logged-in* user was themselves approved for commission
  // (userState.user.comm === true) when they were created.
  console.log(userState?.user?.comm,userState?.user,"hahahhaah")
  const showCommissionFields = isAdminCreatingSubAdmin || userState?.user?.comm === true;

  const [sendcode, setSendcode] = React.useState("");
  const [sendpass, setSendpass] = React.useState("");

  React.useEffect(() => {
    let fword = "";

    switch (thetype) {
      case "sadmin":
        fword = "SB";
        break;
      case "suadmin":
        fword = "AD";
        break;
      case "smdl":
        fword = "MA";
        break;
      case "mdl":
        fword = "SA";
        break;
      case "dl":
        fword = "A";
        break;
      case "user":
        fword = "C";
        break;
      default:
        fword = "";
    }

    // const randomNumber =
    //   Math.floor(Math.random() * (99999 - 19999 + 1)) + 19999;
    // setSendcode(fword + randomNumber);
    
    userService.getUseridno().then((res: AxiosResponse<any>)=>{
      const randomNumber = res.data.data.id
      setSendcode(fword + randomNumber)
    })


  }, [thetype]);



  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<User>({
    resolver: yupResolver(validationSchema, { context: { maxBalance } }),
    mode: "onChange",
    defaultValues: {
      transactionPassword: "123456",
    },
  });

  React.useEffect(() => {
    if (uplineParent ? uplineParent?.username : username) {
      UserService.getUserDetail(
        uplineParent ? uplineParent?.username : username
      ).then((res: AxiosResponse<any>) => {
        setSelectedUser(res.data.data);
      });
    }
  }, [username, uplineParent]);

  React.useEffect(() => {
    const validRoles = Object.values(RoleType);

    if (thetype && validRoles.includes(thetype as RoleType)) {
      setValue("role", thetype as RoleType);
      setIsPartnership(thetype === RoleType.user);
      setExposerAllow(thetype === RoleType.user);
    }
  }, [thetype, setValue]);

  React.useEffect(() => {
    setValue("transactionPassword", "123456");
  }, [setValue]);

  const [senddata, setSenddata] = React.useState({});

  const onSubmit = handleSubmit((data) => {
    if (Number(data.sendamount) > Number(maxBalance)) {
      toast.error(
        `Client Limit cannot exceed available balance (${maxBalance})`
      );
      return;
    }

    // Commission limits are checked ONLY when Super Admin creates Sub Admin.
    // For every other account creation flow, commission values are not restricted here.
    if (isAdminCreatingSubAdmin) {
      if (Number(data.matcom) > 10 || Number(data.matcom) < 0) {
        toast.error("Matka commission must be between 0 and 10");
        return;
      }

      if (Number(data.mcom) > 2 || Number(data.mcom) < 0) {
        toast.error("Match commission must be between 0 and 2");
        return;
      }

      if (Number(data.cacom) > 2 || Number(data.cacom) < 0) {
        toast.error("Casino must be between 0 and 2");
        return;
      }

      if (Number(data.scom) > 4 || Number(data.scom) < 0) {
        toast.error("Session commission must be between 0 and 4");
        return;
      }
    }

    setLoading(true);

    data.creditRefrences = data.sendamount;
    data.exposerLimit = data.sendamount;

    // 🔗 NEW: only meaningful in the Admin → Sub-Admin creation flow.
    // For every other flow this stays whatever the form default was
    // (unregistered/undefined), so it won't accidentally grant permission.
    if (isAdminCreatingSubAdmin) {
      data.comm = true;
    }

    if (data.role !== RoleType.user) {
      const partenershipValue: any = [10, 20, 30];
      const partenershipArr: { [x: string]: any } = {};

      partenershipValue.forEach((element: any, index: any) => {
        if (element !== undefined) {
          partenershipArr[index] = element;
        }
      });

      const userSettingArr: { [x: string]: any } = {};

      const minBetValue = Array.isArray(data.minbet)
        ? data.minbet
        : Object.values(data.minbet || {});
      const maxBetValue = Array.isArray(data.maxbet)
        ? data.maxbet
        : Object.values(data.maxbet || {});
      const delayValue = Array.isArray(data.delay)
        ? data.delay
        : Object.values(data.delay || {});

      minBetValue.forEach((element, index) => {
        if (element !== undefined) {
          userSettingArr[index] = { minBet: element };
        }
      });

      maxBetValue.forEach((element, index) => {
        if (element !== undefined) {
          userSettingArr[index] = Object.assign(userSettingArr[index] || {}, {
            maxBet: element,
          });
        }
      });

      delayValue.forEach((element, index) => {
        if (element !== undefined) {
          userSettingArr[index] = Object.assign(userSettingArr[index] || {}, {
            delay: element,
          });
        }
      });

      data.userSetting = userSettingArr;
    }

    data.parent = uplineParent ? uplineParent?.username : userData?.username;

    data.code = sendcode;
    data.pshare = pshared;

    console.log(data, "send dataa");

    UserService.addUser(data)
      .then((ress) => {
        if (ress?.data?.message === "New User Added and Funded Successfully") {
          setLoading(false);
          setSenddata(data);
          toast.success("User successfully created");
          reset();
          // 🔗 CHANGED: instead of reloading the current add-user page,
          // go back to whichever page this form was opened from.
          navigate(-1);
        } else {
          setLoading(false);
          toast.error(ress?.data?.message);
        }
      })
      .catch((e) => {
        const error = e.response?.data?.message;
        setLoading(false);
        toast.error(error);
      });
  });

  const roleOption = () => {
    const userRole = userData.role;
    const allRoles = JSON.parse(JSON.stringify(RoleName));
    delete allRoles.admin;
    const options: Record<string, string> = allRoles;
    if (userRole && userRole != "admin") {
      const allOptions = Object.keys(options);
      const startIndex = allOptions.indexOf(userRole);
      const newArray = allOptions.slice(startIndex + 1);

      return newArray.map((option, index) => {
        if (+userRole >= ++index) return false;
        return (
          <option key={index} value={option}>
            {options[option]}
          </option>
        );
      });
    }
    return Object.keys(options).map((option, index) => {
      return (
        <option key={index} value={option}>
          {options[option]}
        </option>
      );
    });
  };

  const userData = selectedUser ? selectedUser : userState?.user;

  const [searchObj, setSearchObj] = React.useState<any>({
    type: "",
    username: "",
    status: "",
    search: "",
  });

  const getList = (obj: {
    username: string;
    type: string;
    search: string;
    status?: string;
    page?: number;
  }) => {
    if (!obj.page) obj.page = 1;
    userService.getUserList(obj).then((res: AxiosResponse<any>) => {
      setSearchObj(obj);
      setUserList(res.data.data);
    });
  };

  React.useEffect(() => {
    const search = searchParams.get("search") ? searchParams.get("search") : "";
    getList({
      username: userState?.user?.username!,
      search: search!,
      type: "",
    });
  }, [
    username,
    searchParams.get("search"),
    callbacklist,
    thetype,
    userState?.user?.username,
  ]);

  let addtype = "";

  switch (thetype) {
    case "sadmin":
      addtype = "admin";
      break;
    case "suadmin":
      addtype = "sadmin";
      break;
    case "smdl":
      addtype = "suadmin";
      break;
    case "mdl":
      addtype = "smdl";
      break;
    case "dl":
      addtype = "mdl";
      break;
    case "user":
      addtype = "dl";
      break;
    default:
      addtype = "";
      break;
  }

  const filterred = users?.items?.filter((u: any) => u?.role === addtype);

  const handleSelectChange = (e: any) => {
    const selectedUsername = e.target.value;
    const selectedUserff = filterred?.find(
      (u: any) => u.username === selectedUsername
    );
    setUplineParent(selectedUserff);
  };

  React.useEffect(() => {}, [uplineParent]);

 const generatePassword = () => {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";

  const firstPart =
    upper[Math.floor(Math.random() * upper.length)] +
    lower[Math.floor(Math.random() * lower.length)] +
    lower[Math.floor(Math.random() * lower.length)] +
    lower[Math.floor(Math.random() * lower.length)];

  let lastPart = "";
  for (let i = 0; i < 2; i++) {
    lastPart += numbers[Math.floor(Math.random() * numbers.length)];
  }

  const finalPassword = firstPart + lastPart;

  setValue("password", finalPassword, {
    shouldDirty: true,
    shouldValidate: true,
  });
};

React.useEffect(() => {
  generatePassword();
}, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12 main-container">
          <div>
            <div className="add-account">
              <div className="text-right mb-2 d-flex items-center justify-between bg-color p-2 rounded ">
                <p className="text-xl text-white">
                  {thetype == "sadmin"
                    ? "Sub Admin"
                    : thetype == "suadmin"
                      ? "Admin"
                      : thetype == "smdl"
                        ? "Master Agent"
                        : thetype == "mdl"
                          ? "Super Agent Master"
                          : thetype == "dl"
                            ? "Agent Master"
                            : "Client"}
                </p>

                <p className="btn btn-diamond">
                  <PersonAddIcon /> Create
                </p>
              </div>
              <form onSubmit={onSubmit} noValidate>
                <div className="row">
                  <div className="col-md-6 personal-detail">
                    {filterred?.length > 0 ? (
                      <div className="mb-4 mt-4 justify-between flex items-center d-none">
                        <label>Select Upperline</label>
                        <select
                          onChange={handleSelectChange}
                          className="border rounded-0 p-2"
                        >
                          <option value="">-- Select User --</option>
                          {filterred?.map((user: any) => (
                            <option key={user?._id} value={user.username}>
                              {user?.username}({user?.code})
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      ""
                    )}

                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <div>
                            <label htmlFor="username">UserName</label>
                            <input
                              type="text"
                              className="form-control username"
                              value={sendcode}
                            />
                          </div>

                          <div style={{ display: "grid" }}>
                            <label>Agent</label>
                            {filterred?.length > 0 ? (
                              <select
                                onChange={handleSelectChange}
                                className="border rounded-0 p-2"
                              >
                                <option value="">-- Select User --</option>
                                {filterred?.map((user: any) => (
                                  <option key={user?._id} value={user.username}>
                                    {user?.username}({user?.code})
                                  </option>
                                ))}
                              </select>
                            ) : (
                              ""
                            )}
                          </div>

                          <div>
                            <label htmlFor="">Agent Limit</label>
                            <input
                              type="text"
                              className="form-control username"
                              value={maxBalance}
                            />
                          </div>

                          <div className="mt-4">
                            <label htmlFor="username">Name</label>
                            <input
                              placeholder="User Name"
                              id="username"
                              {...register("username")}
                              defaultValue={""}
                              type="text"
                              className="form-control"
                            />
                            <span
                              id="username-error"
                              className="error"
                              style={{ display: "none" }}
                            >
                              Username already taken
                            </span>
                            {errors?.username && (
                              <span id="username-required" className="error">
                                {errors.username.message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="password">Password</label>
                          <input
                            placeholder="Password"
                            id="password"
                            type="text"
                            {...register("password")}
                            className="form-control"
                          />

                          {errors?.password && (
                            <span id="password-error" className="error">
                              {errors.password.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 account-detail">
                    <div className="row">
                      <div className="col-md-6">
                        {thetype === "undefined" ? (
                          <div className={"form-group"}>
                            <label htmlFor="role">Account Type</label>
                            <select
                              {...register("role", {
                                onChange: (e) => {
                                  const value = e.target.value;
                                  setIsPartnership(value === RoleType.user);
                                  setExposerAllow(value === RoleType.user);
                                },
                              })}
                              id="role"
                              className="form-control"
                            >
                              <option value={""}>
                                - Select Your Account Type -
                              </option>
                              {roleOption()}
                            </select>
                            {errors?.role && (
                              <span id="role-error" className="error">
                                {errors.role.message}
                              </span>
                            )}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>

                      <div className="col-md-6 d-none">
                        <div className="form-group">
                          <label htmlFor="creditrefrence">Client Limit</label>
                          <input
                            className="form-control"
                            placeholder="Super Limit"
                            {...register("creditRefrences")}
                            id="creditRefrences"
                            defaultValue={""}
                            min="0"
                            type="number"
                          />
                          {errors?.creditRefrences && (
                            <span id="creditrefrence-error" className="error">
                              {errors.creditRefrences.message}
                            </span>
                          )}
                        </div>
                      </div>

                      {!isExposerAllow && (
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="share">
                              {currentShareLabel}{`(≤${pshared ? pshared : 0})`}
                            </label>

                            <input
                              className="form-control"
                              placeholder={`${currentShareLabel} Limit`}
                              {...register("share")}
                              id="share"
                              defaultValue={0}
                              min="0"
                              max={pshared ? pshared : 0}
                              type="number"
                            />
                          </div>
                        </div>
                      )}

                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="sendamount">
                            Client Limit ({maxBalance ? maxBalance : ""})
                          </label>
                          <input
                            className="form-control"
                            placeholder="sendamount "
                            {...register("sendamount")}
                            id="sendamount"
                            defaultValue={0}
                            min="0"
                            type="number"
                          />
                        </div>
                      </div>

                      {/* 🔗 NEW: Commission-approval checkbox — ONLY visible when
                          an Admin is creating a Sub-Admin. Value posts as req.body.comm */}
                      {/* {isAdminCreatingSubAdmin && (
                        <div className="col-md-6">
                          <div className="form-group">
                            <label
                              htmlFor="comm"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                cursor: "pointer",
                              }}
                            >
                              <input
                                type="checkbox"
                                id="comm"
                                {...register("comm")}
                                style={{ width: "16px", height: "16px" }}
                              />
                              Commission
                            </label>
                          </div>
                        </div>
                      )} */}

                      {/* 🔗 NEW: Commission percentage fields — only shown when
                          showCommissionFields is true (Admin→SubAdmin case, OR
                          the logged-in user's own userState.user.comm === true) */}
                      {showCommissionFields && (
                        <>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="mcom">Match Commision(≤2%)</label>
                              <input
                                className="form-control"
                                placeholder="M Comm Limit"
                                {...register("mcom")}
                                id="mcom"
                                defaultValue={0}
                                min="0"
                                max="2"
                                step="0.01"
                                type="number"
                              />
                            </div>
                          </div>

                           <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="cacom">Casino Commision(≤2%)</label>
                              <input
                                className="form-control"
                                placeholder="Casino Comm Limit"
                                {...register("cacom")}
                                id="cacom"
                                defaultValue={0}
                                min="0"
                                max="2"
                                step="0.01"
                                type="number"
                              />
                            </div>
                          </div>

                         
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="scom">
                                Session Commision(≤4%)
                              </label>
                              <input
                                className="form-control"
                                placeholder="S Comm Limit"
                                {...register("scom")}
                                id="scom"
                                defaultValue={0}
                                min="0"
                                max="4"
                                step="0.01"
                                type="number"
                              />
                            </div>
                          </div>

                           <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="matcom">
                                Matka Commision(≤10%)
                              </label>
                              <input
                                className="form-control"
                                placeholder="M Comm Limit"
                                {...register("matcom")}
                                id="matcom"
                                defaultValue={0}
                                min="0"
                                max="10"
                                step="0.01"
                                type="number"
                              />
                            </div>
                          </div>

                        </>
                      )}

                      {isExposerAllow && (
                        <div className="col-md-6 d-none ">
                          <div className="form-group" id="exposer-limit">
                            <label htmlFor="exposerLimit">Exposer Limit</label>
                            <input
                              placeholder="Exposer Limit"
                              id="exposerLimit"
                              {...register("exposerLimit")}
                              defaultValue={""}
                              type="number"
                              className="form-control"
                              min="0"
                            />
                            {errors?.exposerLimit && (
                              <span id="exposerlimit-error" className="error">
                                {errors.exposerLimit.message}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {!isExposerAllow && (
                  <div
                    style={{ display: "none" }}
                    className="row m-t-20"
                    id="partnership-div"
                  >
                    <div className="col-md-12">
                      <table className="table table-striped table-bordereddd">
                        <thead>
                          <tr>
                            <th />
                            {sportListState.sports.map((sports: ISport) =>
                              sports.sportId === 1 ||
                                sports.sportId === 2 ||
                                sports.sportId === 4 ? (
                                <th className="" key={sports._id}>
                                  {
                                    sports.name === "Soccer"
                                      ? "Match Commission (%)"
                                      : sports.name === "Tennis"
                                        ? "Session Commission (%)"
                                        : ""
                                  }
                                </th>
                              ) : (
                                <th key={sports._id} />
                              )
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="hidden">
                            <td>Upline</td>
                            {sportListState.sports.map(({ _id, sportId }) =>
                              sportId == 1 || sportId == 2 ? (
                                <td
                                  id="taxpartnership-upline"
                                  key={`upline-${_id}`}
                                >
                                  {userData?.partnership?.[sportId].ownRatio}
                                </td>
                              ) : (
                                <td key={_id} />
                              )
                            )}
                          </tr>

                          <tr>
                            <td></td>
                            {sportListState.sports?.map(({ _id, sportId }) => {
                              if (sportId === 4) {
                                return (
                                  <td key={_id}>
                                    <input
                                      type="hidden"
                                      {...register(`partnership.${sportId}`)}
                                      value={0}
                                    />
                                  </td>
                                );
                              }

                              if (sportId === 1 || sportId === 2) {
                                return (
                                  <td key={_id}>
                                    <input
                                      className="partnership"
                                      {...register(`partnership.${sportId}`, {
                                        onChange: (e) => {
                                          const ownRatio =
                                            userData.partnership?.[sportId]
                                              ?.ownRatio;
                                          ownRatio
                                            ? setValue(
                                              `partnershipOur.${sportId}`,
                                              ownRatio - e.target.value
                                            )
                                            : setValue(
                                              `partnershipOur.${sportId}`,
                                              getValues(
                                                `partnershipOur.${sportId}`
                                              )
                                            );
                                        },
                                      })}
                                      id={`partnership.${sportId}`}
                                      placeholder=""
                                      max={
                                        userData?.partnership?.[sportId]
                                          ?.ownRatio
                                      }
                                      min="0"
                                      defaultValue={0}
                                      type="number"
                                      disabled={isPartnership}
                                    />
                                    <span className="error" />
                                  </td>
                                );
                              }

                              return <td key={_id} />;
                            })}
                          </tr>

                          <tr className="hidden">
                            <td>Our</td>
                            {sportListState.sports?.map(({ _id, sportId }) =>
                              sportId == 1 || sportId == 2 ? (
                                <td
                                  id={`taxpartnership-our.${sportId}`}
                                  key={_id}
                                >
                                  <input
                                    {...register(`partnershipOur.${sportId}`)}
                                    value={
                                      userData?.partnership?.[sportId].ownRatio
                                    }
                                    disabled={true}
                                  />
                                </td>
                              ) : (
                                <td key={_id} />
                              )
                            )}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="row m-t-20" id="min-max-bet-div">
                  <div className="col-md-12 overflow-x-scroll">
                    <table className="table table-striped table-borderedddd">
                      <thead
                        className={` ${thetype === "sadmin" ? "d-" : "d-none"}`}
                      >
                        <tr>
                          <th />
                          {sportListState.sports?.map((sports: any) =>
                            sports.sportId === 1 ||
                              sports.sportId === 2 ||
                              sports.sportId === 4 ? (
                              <th key={sports._id}>
                                {sports.name === "Cricket"
                                  ? "Casino "
                                  : sports.name === "Soccer"
                                    ? "Match"
                                    : sports.name === "Tennis"
                                      ? "Fancy "
                                      : ""}
                              </th>
                            ) : (
                              <th key={sports._id} />
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          className={` ${thetype === "sadmin" ? "d-bl" : "d-none"
                            }`}
                        >
                          <td></td>
                          {sportListState.sports?.map(({ _id, sportId }) =>
                            sportId == 1 || sportId == 2 || sportId == 4 ? (
                              <td id="minbet" key={_id}>
                                {userData?.userSetting?.[sportId].minBet}
                              </td>
                            ) : (
                              <td key={_id} />
                            )
                          )}
                        </tr>
                        <tr
                          className={` ${thetype === "sadmin" ? "d-nonefff" : "d-none"
                            }`}
                        >
                          <td>Provide Min Bet</td>
                          {sportListState.sports?.map(({ _id, sportId }) =>
                            sportId == 1 || sportId == 2 || sportId == 4 ? (
                              <td key={_id}>
                                <input
                                  id={`minbet.${sportId}`}
                                  className={`minbet.${sportId}`}
                                  {...register(`minbet.${sportId}`)}
                                  placeholder={""}
                                  max={userData?.userSetting?.[sportId].minBet}
                                  min={0}
                                  defaultValue={
                                    userData?.userSetting?.[sportId].minBet
                                  }
                                  disabled
                                  type="number"
                                />
                                <span className="error" />
                              </td>
                            ) : (
                              <td key={_id} />
                            )
                          )}
                        </tr>
                        <tr
                          className={` ${thetype === "sadmin" ? "d-nonefff" : "d-none"
                            }`}
                        >
                          <td>Max Bet</td>
                          {sportListState.sports?.map(({ _id, sportId }) =>
                            sportId == 1 || sportId == 2 || sportId == 4 ? (
                              <td id="maxbet" key={_id}>
                                {userData?.userSetting?.[sportId].maxBet}
                              </td>
                            ) : (
                              <td key={_id} />
                            )
                          )}
                        </tr>
                        <tr
                          className={` ${thetype === "sadmin" ? "d-nofffne" : "d-none"
                            }`}
                        >
                          <td>Provide Min Bet</td>
                          {sportListState.sports?.map(({ _id, sportId }) =>
                            sportId == 1 || sportId == 2 || sportId == 4 ? (
                              <td key={_id}>
                                <input
                                  id={`maxbet.${sportId}`}
                                  className={`maxbet.${sportId}`}
                                  {...register(`maxbet.${sportId}`)}
                                  placeholder={""}
                                  max={userData?.userSetting?.[sportId].maxBet}
                                  defaultValue={
                                    sportId == 1 ? 200000 : sportId == 2 ? 50000 : 10000
                                  }
                                  disabled
                                  min={0}
                                  type="number"
                                />
                                <span className="error" />
                              </td>
                            ) : (
                              <td key={_id} />
                            )
                          )}
                        </tr>
                        <tr
                          className={` ${thetype === "sadmin" ? "d-nonfffe" : "d-none"
                            }`}
                        >
                          <td>Delay</td>
                          {sportListState.sports?.map(({ _id, sportId }) =>
                            sportId == 1 || sportId == 2 || sportId == 4 ? (
                              <td id="delay" key={_id}>
                                {userData?.userSetting?.[sportId].delay}
                              </td>
                            ) : (
                              <td key={_id} />
                            )
                          )}
                        </tr>
                        <tr
                          className={` ${thetype === "sadmin" ? "d-nonffe" : "d-none"}`}
                        >
                          <td>Provide Delay</td>
                          {sportListState.sports?.map(({ _id, sportId }) =>
                            sportId == 1 || sportId == 2 || sportId == 4 ? (
                              <td key={_id}>
                                <input
                                  id={`delay.${sportId}`}
                                  className={`delay.${sportId}`}
                                  {...register(`delay.${sportId}`)}
                                  placeholder={""}
                                  max={userData?.userSetting?.[sportId].delay}
                                  defaultValue={
                                    userData?.userSetting?.[sportId].delay
                                  }
                                  disabled
                                  type="number"
                                />
                                <span className="error" />
                              </td>
                            ) : (
                              <td key={_id} />
                            )
                          )}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="row m-t-20">
                  <div className="col-md-12"></div>
                </div>
                <div className="row m-t-20">
                  <div className="col-md-12">
                    {isallowed || uplineParent ? (
                      <div className="float-right flex item-center ">
                        <button
                          onClick={() => navigate(-1)}
                          className="btn btn-danger btn-md mr-2 flex items-center"
                        >
                          <CancelIcon /> Cancel
                        </button>
                        <SubmitButton
                          className="btn btn-submit"
                          type="submit"
                          disabled={loading}
                        >
                          <SaveIcon /> {loading ? "Saving..." : "Save"}
                        </SubmitButton>
                      </div>
                    ) : (
                      <div className="float-right"> Select Upline</div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddUser;