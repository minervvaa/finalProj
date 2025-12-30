// pages/Vacations/VacationsPage.tsx
import { useEffect, useState } from "react";
import { api } from "../../api";
import type { Vacation } from "../../types";
import "./VacationsPage.css";

type VacationFilter = "all" | "followed" | "upcoming" | "active";

interface VacationsResponse {
  vacations: Vacation[];
  total: number;
  page: number;
  pageSize: number;
}

export default function VacationsPage() {
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<VacationFilter>("all");
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [error, setError] = useState("");

  async function load() {
    try {
      const params: any = { page };
      if (filter !== "all") params.filter = filter;

      const res = await api.get<VacationsResponse>("/vacations", { params });

      setVacations(res.data.vacations);
      setTotal(res.data.total);
      setPageSize(res.data.pageSize);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to load vacations");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filter]);

  async function toggleFollow(v: Vacation) {
    try {
      if (v.isFollowed) await api.delete(`/vacations/${v.id}/follow`);
      else await api.post(`/vacations/${v.id}/follow`);
      await load();
    } catch (err: any) {
      console.error(err);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="home">
      {/* 1) HERO / BANNER  */}
      <section className="home-hero">
        <div className="home-hero-bg" />
        <div className="home-hero-content">
          <h1>Explore the world</h1>
          <p>Discover destinations that match your style, dates, and budget.</p>

          <button className="home-hero-btn"
           onClick={() => {
          document
          .getElementById("main") 
          ?.scrollIntoView({behavior: "smooth"});}} 
           >View vacation </button>
        </div>
      </section>

      {/* 2) TEXT AREA  */}
      <section className="home-text">
 <div className="values">


    <div className="values-grid">
      <div className="value-item">
        <div className="value-icon">
          <i className="bi bi-send"></i>
        </div>
        <h3 className="value-name">Airport pickup</h3>
        <p className="value-desc">We provide escort from the airport to the hotel</p>
      </div>

      <div className="value-item">
        <div className="value-icon">
          <i className="bi bi-wallet2"></i>
        </div>
        <h3 className="value-name">Easy booking</h3>
        <p className="value-desc">Quick and easy booking of tours for upcoming dates</p>
      </div>

      <div className="value-item">
        <div className="value-icon">
          <i className="bi bi-people"></i>
        </div>
        <h3 className="value-name">Best tour guide</h3>
        <p className="value-desc">Our best tour guide is ready to guide your trip</p>
      </div>
    </div>
 
    <div className="values-text">
     <h2 className="values-title">Top values for you</h2>
    <p className="values-subtitle">Try variety of benefits when using our services</p> 
    </div>

  </div>
</section>

      {/* 3) MAIN AREA */}
     <section className="home-main" id="main">
  {/* TOP: text area */}
  <aside className="home-main-top">
    <h1>Vacations for you</h1> 
  </aside>

  {/* CONTENT: filters + cards + pagination */}
  <div className="home-main-content">
    {/* Filters inline like navbar links */}
    <div className="filters-inline">
      <button
        className={`f-link ${filter === "all" ? "active" : ""}`}
        onClick={() => {
          setFilter("all");
          setPage(1);
        }}
      >
        All
      </button>

      <button
        className={`f-link ${filter === "followed" ? "active" : ""}`}
        onClick={() => {
          setFilter("followed");
          setPage(1);
        }}
      >
        Followed
      </button>

      <button
        className={`f-link ${filter === "upcoming" ? "active" : ""}`}
        onClick={() => {
          setFilter("upcoming");
          setPage(1);
        }}
      >
        Upcoming
      </button>

      <button
        className={`f-link ${filter === "active" ? "active" : ""}`}
        onClick={() => {
          setFilter("active");
          setPage(1);
        }}
      >
        Active
      </button>
      
 {/* Pagination bottom-right under cards */}
 <div className="pagination-home">
     <span>
             <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="adminT-pageInfo-arrow">
            <i className="bi bi-arrow-left"></i>
          </button>
             <b>{page}</b> / {totalPages}
              <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="adminT-pageInfo-arrow">
            <i className="bi bi-arrow-right"></i> 
          </button>
            Page
          </span>
    </div>

    </div>

    {error && <div className="error">{error}</div>}

    {/* Cards grid */}
    <div className="cards-grid">
      {vacations.map((v) => (
        <article key={v.id} className="vc">

          <img
            className="vc-img"
            src={v.imageName}
            alt={v.destination}
            loading="lazy"
             referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src =
                "https://i.pinimg.com/736x/a8/28/16/a828164a9969dcaadf16326350c800fd.jpg";
            }}
          />
          <div className="vc-overlay" />

          <div className="vc-glass">
            <div className="vc-head">

            <h3 className="vc-title"> {v.destination} </h3> 
            <p>{v.price} ₪</p>
                
            </div>
            <p className="vc-desc">{v.description}</p>

            <div className="vc-bottom">
              <span className="vc-followers">
                 <i className="bi bi-person-fill"></i> {v.followersCount}
              </span>
           
              <button className="vc-followBtn" onClick={() => toggleFollow(v)}>
                {v.isFollowed ? "Following" : "Follow +"}
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>

   
   
  </div>
</section>
    </div>
  );
}
