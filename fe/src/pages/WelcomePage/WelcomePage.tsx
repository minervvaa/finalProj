import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";


// import sky from "../../assets/sky.png";
// import forst from "../../assets/forest.png"
// import mountains from "../../assets/mountains.png";


// --- Background img ---
import back from "../../assets/back.png"
import back2 from "../../assets/back2.png"
import back3 from "../../assets/back4.png"

export default function WelcomePage() {
  const nav = useNavigate();

  return (
    <section className="welcome-page">
      {/* Background img */}

      <img
        src={back}
        alt=""
        className="back2"
      />

  

      {/* Content */}
      <div className="welcome-content">
        <h1>Around the world</h1>
        <p>
          Discover destinations, plan vacations, and explore with ease.
        </p>

        <div className="welcome-actions">
          <button onClick={() => nav("/register")} className="primary-btn">
            GET STARTED
          </button>

          Alredy have an account? 
          <button onClick={() => nav("/login")} className="link-btn">
           Log in
          </button>
          
        </div>
      </div>


    </section>
  );
}
