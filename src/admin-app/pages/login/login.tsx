// // import React from 'react'
// // import api from '../../../utils/api'
// // import { useNavigateCustom } from '../../../pages/_layout/elements/custom-link'
// // import { useWebsocketUser } from '../../../context/webSocketUser'
// // import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
// // import { selectUserData } from '../../../redux/actions/login/loginSlice'
// // import User from '../../../models/User'
// // import { loginAction } from '../../../redux/actions/login/login.action'
// // import SubmitButton from '../../../components/SubmitButton'

// // const Login = () => {
// //   const dispatch = useAppDispatch()
// //   const userState = useAppSelector(selectUserData)
// //   const { socketUser } = useWebsocketUser()

// //   const navigate = useNavigateCustom()

// //   const [loginForm, setLoginForm] = React.useState<User>({
// //     username: '',
// //     password: '',
// //     logs: '',
// //     admin: true,
// //   })

// //   React.useEffect(() => {
// //     api.get(`${process.env.REACT_APP_IP_API_URL}`).then((res) => {
// //       setLoginForm({ ...loginForm, logs: res.data })
// //     })
// //   }, [])

// //   React.useEffect(() => {
// //     if (userState.status === 'done') {
// //       const { role, _id ,sessionId} = userState.user
// //       socketUser.emit('login', {
// //         role: userState.user.role,
// //         sessionId: userState.user.sessionId,
// //         _id,
// //         sessionIda:sessionId
// //       })

// //       if (userState.user.role && ['admin', '1', '2', '3'].includes(userState.user.role)) {
// //         return navigate.go('/market-analysis')
// //       }

// //       return navigate.go('/market-analysis')
// //     }
// //   }, [userState])

// //   const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     setLoginForm({ ...loginForm, [e.target.name]: e.target.value })
// //   }

// //   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
// //     event.preventDefault()
// //     dispatch(loginAction(loginForm))
// //   }

// //   return (
// //     <div className='login'>
// //       <div className='wrapper d-flex justify-content-center align-items-center'>
// //         <div className='container-flui'>
// //           <div className='row'>
// //             <div className='col-md-12'>
// //               <div  className='loginInner1 container-fluid '>
// //                 {/* <div className='log-logo m-b-20 text-center'>
// //                   <img src='/imgs/d006 copy.png' className='logo-login' style={{ maxWidth: "250px", maxHeight: "100px" }} />
// //                 </div> */}
// //                 <div className='featured-box-login featured-box-secundary default log-fld'>
// //                 <div className='log-logo m-b-20 text-center'>
// //                   <img src='/imgs/logo.png' className='logo-login' style={{ maxWidth: "250px", maxHeight: "100px" }} />
// //                 </div>
// //                   <form
// //                     onSubmit={(e) => handleSubmit(e)}
// //                     role='form'
// //                     autoComplete='off'
// //                     method='post'
// //                   >
// //                     <div className='form-group m-b-20'>
// //                       <input
// //                         name='username'
// //                         placeholder='User Name'
// //                         type='text'
// //                         className='form-control'
// //                         aria-required='true'
// //                         aria-invalid='false'
// //                         onChange={handleForm}
// //                         required
// //                       />
// //                       <small className='text-danger' style={{ display: 'none' }}></small>
// //                     </div>
// //                     <div className='form-group m-b-20'>
// //                       <input
// //                         name='password'
// //                         placeholder='Password'
// //                         type='password'
// //                         className='form-control'
// //                         aria-required='true'
// //                         aria-invalid='false'
// //                         onChange={handleForm}
// //                         required
// //                       />
// //                       {userState.error ? (
// //                         <small className='text-danger'>{userState.error}</small>
// //                       ) : (
// //                         ''
// //                       )}
// //                     </div>
// //                     <div className='form-group text-center mb-0'>
// //                       <SubmitButton type='submit' className='btn btn-submit btn-login' style={{backgroundColor:"#11283E"}}>
// //                         Login
// //                         {userState.status === 'loading' ? (
// //                           <i className='fas fa-spinner fa-spin'></i>
// //                         ) : (
// //                           <i className='fas fa-sign-in-alt'></i>
// //                         )}
// //                       </SubmitButton>

// //                     </div>
// //                     <div className='mt-2 text-center download-apk'></div>
// //                   </form>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default Login


// import React from 'react'
// import api from '../../../utils/api'
// import { useNavigateCustom } from '../../../pages/_layout/elements/custom-link'
// import { useWebsocketUser } from '../../../context/webSocketUser'
// import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
// import { selectUserData } from '../../../redux/actions/login/loginSlice'
// import User from '../../../models/User'
// import { loginAction } from '../../../redux/actions/login/login.action'
// import SubmitButton from '../../../components/SubmitButton'

// const Login = () => {
//   const dispatch = useAppDispatch()
//   const userState = useAppSelector(selectUserData)
//   const { socketUser } = useWebsocketUser()
//   const navigate = useNavigateCustom()

//   const [showPassword, setShowPassword] = React.useState(false)

//   const [loginForm, setLoginForm] = React.useState<User>({
//     username: '',
//     password: '',
//     logs: '',
//     admin: true,
//   })

//   React.useEffect(() => {
//     api.get(`${process.env.REACT_APP_IP_API_URL}`).then((res) => {
//       setLoginForm(prev => ({ ...prev, logs: res.data }))
//     })
//   }, [])

//   React.useEffect(() => {
//     if (userState.status === 'done') {
//       const { role, _id, sessionId } = userState.user

//       socketUser.emit('login', {
//         role,
//         sessionId,
//         _id,
//       })

//       navigate.go('/market-analysis')
//     }
//   }, [userState])

//   const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setLoginForm({ ...loginForm, [e.target.name]: e.target.value })
//   }

//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault()
//     dispatch(loginAction(loginForm))
//   }

//   // return (
//   //   <div className='login'>
//   //     <div className='wrapper d-flex justify-content-center align-items-center'>
//   //       <div className='container-flui'>
//   //         <div className='row'>
//   //           <div className='col-md-12'>
//   //             <div className='loginInner1 container-fluid'>
//   //               <div className='featured-box-login featured-box-secundary default log-fld'>
//   //                 <div className='log-logo m-b-20 text-center'>
//   //                   <img
//   //                     src='/imgs/logo.png'
//   //                     className='logo-login'
//   //                     style={{ maxWidth: '250px', maxHeight: '100px' }}
//   //                   />
//   //                 </div>

//   //                 <form onSubmit={handleSubmit} autoComplete='off'>
//   //                   {/* USERNAME */}
//   //                   <div className='form-group m-b-20'>
//   //                     <input
//   //                       name='username'
//   //                       placeholder='User Name'
//   //                       type='text'
//   //                       className='form-control'
//   //                       onChange={handleForm}
//   //                       required
//   //                     />
//   //                   </div>

//   //                   {/* PASSWORD WITH EYE */}
//   //                   <div className='form-group m-b-20 position-relative'>
//   //                     <input
//   //                       name='password'
//   //                       placeholder='Password'
//   //                       type={showPassword ? 'text' : 'password'}
//   //                       className='form-control'
//   //                       onChange={handleForm}
//   //                       required
//   //                     />

//   //                     <i
//   //                       className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
//   //                       style={{
//   //                         position: 'absolute',
//   //                         right: '12px',
//   //                         top: '50%',
//   //                         transform: 'translateY(-50%)',
//   //                         cursor: 'pointer',
//   //                         color: '#555',
//   //                       }}
//   //                       onClick={() => setShowPassword(!showPassword)}
//   //                     ></i>

//   //                     {userState.error && (
//   //                       <small className='text-danger'>{userState.error}</small>
//   //                     )}
//   //                   </div>

//   //                   {/* BUTTON */}
//   //                   <div className='form-group text-center mb-0'>
//   //                     <SubmitButton
//   //                       type='submit'
//   //                       className='btn btn-submit btn-login'
//   //                       style={{ backgroundColor: '#11283E' }}
//   //                     >
//   //                       Login&nbsp;
//   //                       {userState.status === 'loading' ? (
//   //                         <i className='fas fa-spinner fa-spin'></i>
//   //                       ) : (
//   //                         <i className='fas fa-sign-in-alt'></i>
//   //                       )}
//   //                     </SubmitButton>
//   //                   </div>
//   //                 </form>

//   //               </div>
//   //             </div>
//   //           </div>
//   //         </div>
//   //       </div>
//   //     </div>
//   //   </div>
//   // )

//     return (
//     <div className="bh-login-page">
//       {/* HERO / BACKGROUND IMAGE (pure CSS background, no <img> tag) */}
//       <div className="bh-hero">
//         {/* Badge / Logo circle sitting over the hero-card junction */}
//         <div className="bh-badge">
//           <div className="bh-badge-inner">
//             {/* <span style={{    fontSize: "22px"}}>A2Z</span> */}
//                          <img src="/imgs/logoN.jpeg" className="logo-login" />

//             {/* <span></span> */}
//           </div>
//         </div>
//       </div>

//       {/* LOGIN CARD */}
//       <div className="bh-card">
//         <h1 className="bh-title">ADMIN LOGIN</h1>

//         <form onSubmit={handleSubmit} autoComplete="off" className="bh-form">
//           {/* USERNAME */}
//           <div className="bh-input-wrap">
//             <input
//               name="username"
//               placeholder="Username"
//               type="text"
//               className="bh-input"
//               onChange={handleForm}
//               // required={!isDemoLogin}
//             />
//           </div>

//           {/* PASSWORD */}
//           <div className="bh-input-wrap">
//             <input
//               name="password"
//               placeholder="Password"
//               type={showPassword ? "text" : "password"}
//               className="bh-input"
//               onChange={handleForm}
//               // required={!isDemoLogin}
//             />

//             <i
//               className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} bh-eye`}
//               onClick={() => setShowPassword(!showPassword)}
//             ></i>
//           </div>

//           {userState.error && (
//             <small className="text-danger bh-error">{userState.error}</small>
//           )}

//           {/* BUTTONS */}
//           <div className="bh-btn-group">
//             <SubmitButton type="submit" className="bh-btn-login">
//               Login
//               {userState.status === "loading" ? (
//                 <i className="ml-2 fas fa-spinner fa-spin"></i>
//               ) : null}
//             </SubmitButton>

//             {/* <SubmitButton
//               type="submit"
//               onClick={handleSubmitDemoLogin}
//               className="bh-btn-demo"
//             >
//               Login with Demo ID
//               {userState.status === "loading" ? (
//                 <i className="ml-2 fas fa-spinner fa-spin"></i>
//               ) : null}
//             </SubmitButton> */}
//           </div>
//         </form>
//       </div>

//       {/* FOOTER */}
//       {/* <section className="bh-footer">
//         <div className="bh-footer-note">
//           <h2>Note : This site is not for Indian Territory</h2>
//         </div>
//         <div className="bh-powered">
//           <span>Powered by</span>
//           <img src="/imgs/betfair-logo.png" alt="betfair" />
//         </div>
//       </section> */}
//     </div>
//   );
// }

// export default Login





import React, { useEffect, useRef, useState } from "react";

import api from "../../../utils/api";
import { useNavigateCustom } from "../../../pages/_layout/elements/custom-link";
import { useWebsocketUser } from "../../../context/webSocketUser";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectUserData } from "../../../redux/actions/login/loginSlice";
import { loginAction } from "../../../redux/actions/login/login.action";

import User from "../../../models/User";

import "./login.css";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserData);
  const { socketUser } = useWebsocketUser();
  const navigate = useNavigateCustom();

  const [loginForm, setLoginForm] = useState<User>({
    username: "",
    password: "",
    logs: "",
    admin: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const handledSession = useRef<string | null>(null);

  // -----------------------------------
  // FETCH IP / LOGIN LOGS
  // -----------------------------------

  useEffect(() => {
    let active = true;

    const ipApiUrl = process.env.REACT_APP_IP_API_URL;

    if (ipApiUrl) {
      api
        .get(ipApiUrl)
        .then((res) => {
          if (active) {
            setLoginForm((prev) => ({
              ...prev,
              logs: res.data,
            }));
          }
        })
        .catch((error) => {
          console.error("IP API error:", error);
        });
    }

    return () => {
      active = false;
    };
  }, []);

  // -----------------------------------
  // LOGIN SUCCESS
  // -----------------------------------

useEffect(() => {
  if (userState.status !== "done" || !userState.user) {
    return;
  }

  const { _id, role, sessionId } = userState.user;

  // API sessionId nahi bhejti, isliye usko mandatory mat rakho.
  const loginIdentifier = String(sessionId || _id || "");

  if (!loginIdentifier) {
    setSubmitting(false);
    return;
  }

  if (handledSession.current === loginIdentifier) {
    return;
  }

  handledSession.current = loginIdentifier;

  socketUser.emit("login", {
    role,
    sessionId: sessionId || "",
    _id,
  });

  if (sessionId) {
    localStorage.setItem("login-session", sessionId);
  }

  setSubmitting(false);
  setLoginSuccess(true);

  if (redirectTimer.current) {
    clearTimeout(redirectTimer.current);
  }

  redirectTimer.current = setTimeout(() => {
    navigate.go("/market-analysis");
  }, 900);
}, [userState, socketUser, navigate]);
  // -----------------------------------
  // LOGIN ERROR
  // -----------------------------------

  useEffect(() => {
    if (userState.status === "error") {
      setSubmitting(false);
      setLoginSuccess(false);
      handledSession.current = null;
    }
  }, [userState.status]);

  // -----------------------------------
  // CLEANUP
  // -----------------------------------

  useEffect(() => {
    return () => {
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
      }
    };
  }, []);

  // -----------------------------------
  // INPUT CHANGE
  // -----------------------------------

  const handleForm = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------------
  // LOGIN SUBMIT
  // -----------------------------------

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (submitting || userState.status === "loading") {
      return;
    }

    if (
      !loginForm.username.trim() ||
      !loginForm.password
    ) {
      return;
    }

    setLoginSuccess(false);
    setSubmitting(true);

    dispatch(
      loginAction({
        ...loginForm,
        admin: true,
      })
    );
  };

  const isLoading =
    submitting || userState.status === "loading";

  // -----------------------------------
  // UI
  // -----------------------------------

  return (
    <div className="bh-login-page">
      {/* HERO BACKGROUND */}
      <div className="bh-hero" />

      {/* LOGIN CARD */}
      <main className="bh-card">
        {/* LOGO */}
        <div className="bh-badge">
          <div className="bh-badge-inner">
            <img
              src="https://betx99.co/imgs/logobet2.png"
              alt="Admin Logo"
              className="logo-login"
            />
          </div>
        </div>

        {/* TITLE */}
        <h1 className="bh-title">ADMIN LOGIN</h1>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className="bh-form"
        >
          {/* USERNAME */}
          <div className="bh-input-wrap">
            <input
              name="username"
              placeholder="Username"
              type="text"
              className="bh-input"
              value={loginForm.username}
              onChange={handleForm}
              autoComplete="username"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="bh-input-wrap">
            <input
              name="password"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              className="bh-input"
              value={loginForm.password}
              onChange={handleForm}
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="bh-eye"
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              <i
                className={`fas ${
                  showPassword
                    ? "fa-eye-slash"
                    : "fa-eye"
                }`}
              />
            </button>
          </div>

          {/* ERROR MESSAGE */}
          {userState.error && !loginSuccess && (
            <div
              className="bh-error"
              role="alert"
            >
              {userState.error}
            </div>
          )}

          {/* LOGIN BUTTON */}
          <div className="bh-btn-group">
            <button
              type="submit"
              className="bh-btn-login"
              disabled={isLoading || loginSuccess}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                "Login"
              )}
            </button>

            {/* SUCCESS POPUP */}
            {loginSuccess && (
              <div
                className="bh-success-popup"
                role="status"
                aria-live="polite"
              >
                <span className="bh-success-icon">
                  ✓
                </span>

                <span>Login Successful!</span>
              </div>
            )}
          </div>
        </form>
      </main>

      {/* FOOTER */}
      <footer className="bh-footer">
        <div className="bh-powered">
          <span>Powered By</span>

          <img
            src="https://bethub24pro.com/assets/images/betfair.png"
            alt="Betfair"
          />
        </div>
      </footer>
    </div>
  );
};

export default Login;
