import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import "./LoginPage.css";

// import back from "../../assets/back.png";

export default function LoginPage() {

  const { login } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");



 async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      nav("/vacations");
    } catch (err: any) {
      console.log(err?.response?.data);
      setError(err?.response?.data?.error || "Login failed");
    }
  }
    
  

  return (
   <section className="login-page">

   <div className="login-blob">
      <div className="login-blob-inner">


       {/* TEXT*/}
        <h1>Welcome Back</h1>
        <p>continue exploring destinations.</p>

           {/* ERROR */}
          {error && <div className="error">{error}</div>}

    
       {/* FORM */}
       <form className="login-form" onSubmit={handleSubmit}>

       {/* EMAIL */}
       <div className="input-with-icon">
         <i className="bi bi-envelope"></i>
         <input
         className="log-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
         required/>
       </div>

       {/* PASSWORD */}
       <div className="input-with-icon">
         <i className="bi bi-lock"></i>
         <input
         className="log-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required/>
       </div>

           
           
       {/* BUTTON */}
       <button className="primary-btn"
        type="submit">
        LOG IN
       </button>

       <div className="bottom-links">
        <span>Don’t have an account?</span>
        <button
         type="button"
         className="link-btn"
         onClick={() => nav("/register")}>
          Sign up
        </button>
      </div>
 
     </form>
        </div>

   </div>
    </section>

  );
}



// import { useState, type FormEvent } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../../auth/AuthContext";
// import "./LoginPage.css";


// export default function LoginPage() {

 

//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("admin@site.com");
//   const [password, setPassword] = useState("2134");
//   const [error, setError] = useState("");

//   async function handleSubmit(e: FormEvent) {
//     e.preventDefault();
//     setError("");

//     try {
//       await login(email, password);
//       navigate("/vacations");
//     } catch (err: any) {
//       console.log(err?.response?.data);
//       setError(err?.response?.data?.error || "Login failed");
//     }
//   }

// return (
//   <div className="login-page">
//     <div className="login-card">

//       <div className="left-side">
//         <h2 className="login-title">LOGIN</h2>
//         <p className="login-subtitle">
//           Hey welcome back! <br />
//           We hope you had a great day
//         </p>

//         <form onSubmit={handleSubmit} className="login-form">
//           <input
//             placeholder="Email"
//             type="email"
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//             required
//           />

//           <input
//             placeholder="Password"
//             type="password"
//             minLength={4}
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//             required
//           />

//           {error && <div className="error">{error}</div>}

//           <button type="submit" className="login-btn">LOGIN</button>

//           <p className="noAcc">
//             Not yet a member? <Link to="/register">Sign Up</Link>
//           </p>
//         </form>
//       </div>

//       <div className="right-card">
//         <div className="glass-panel">
//           <h3 className="glass-title">Welcome Back!</h3>
//           <p className="glass-text">Login to continue</p>
//         </div>
//       </div>

//     </div>
//   </div>
// );
// }
