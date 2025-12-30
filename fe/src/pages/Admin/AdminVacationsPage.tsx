import { useEffect, useMemo, useState } from "react";
import { api } from "../../api";
import type { Vacation } from "../../types";
import "./AdminVacationsPage.css";

interface VacationsResponse {
  vacations: Vacation[];
  total: number;
  page: number;
  pageSize: number;
}

const emptyForm = {
  id: undefined as number | undefined,
  destination: "",
  description: "",
  startDate: "",
  endDate: "",
  price: 0,
  imageName: "", // now used as IMAGE URL
};

export default function AdminVacationsPage() {
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(6);

  // UI
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  async function load() {
    try {
      const res = await api.get<VacationsResponse>("/vacations", { params: { page } });
      setVacations(res.data.vacations);
      setTotal(res.data.total);
      setPageSize(res.data.pageSize);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to load vacations");
    }
  }

  useEffect(() => {
    load();
  }, [page]);

  // lock body scroll when modal open
  useEffect(() => {
    if (!isModalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isModalOpen]);

  function openCreate() {
    setError("");
    setMessage("");
    setForm({ ...emptyForm });
    setIsModalOpen(true);
  }

  function openEdit(v: Vacation) {
    setError("");
    setMessage("");
    setForm({
      id: v.id,
      destination: v.destination,
      description: v.description,
      startDate: v.startDate,
      endDate: v.endDate,
      price: v.price,
      imageName: v.imageName, // URL
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    const body = {
      destination: form.destination,
      description: form.description,
      start_date: form.startDate,
      end_date: form.endDate,
      price: form.price,
      image_name: form.imageName, // URL
    };

    try {
      if (form.id) {
        await api.put(`/vacations/${form.id}`, body);
        setMessage("Updated");
      } else {
        await api.post("/vacations", body);
        setMessage("Created");
      }
      await load();
      closeModal();
      setForm({ ...emptyForm });
    } catch (err: any) {
      setError(err?.response?.data?.error || "Save failed");
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this vacation?")) return;
    try {
      await api.delete(`/vacations/${id}`);
      await load();
    } catch (err: any) {
      console.error(err);
    }
  }

  const shownVacations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return vacations;
    return vacations.filter((v) => v.destination.toLowerCase().includes(q));
  }, [vacations, search]);

  return (
    <div className="adminT">
      <div className="adminT-head">
        
      </div>

      <div className="adminT-bar">
        <div className="adminT-search">
          <span className="adminT-searchIcon"><i className="bi bi-search"></i></span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vacation…"
          />
        </div>


        <button className="adminT-addBtn" onClick={openCreate}>
          + Add vacation
        </button>

        <div className="adminT-pageInfo">
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

      {/* TABLE */}
      <div className="adminTable">
        <div className="adminTableHead">
          <div id="no-color">Vacation</div>
          <div>Price </div>
          <div>Start date</div>
          <div>End date</div>
          <div  className="adminActions">Action</div>
        </div>

        <div className="adminTableBody">
          {shownVacations.map((v) => (
            <div className="adminRow" key={v.id}>
              <div className="adminCell adminCellMain">
                <div className="adminThumb">
                  <img
                    src={v.imageName}
                    alt={v.destination}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60";
                    }}
                  />
                </div>

                <div className="adminMainText">
                  <div className="adminDest">{v.destination}</div>
                  <div className="adminSmall">{v.description}</div>
                </div>
              </div>

              <div className="adminCell adminPrice">{v.price} ₪</div>
              <div className="adminCell adminDates">{v.startDate}</div>
              <div className="adminCell adminDates">{v.endDate}</div>
              <div className="adminCell adminActions">
                <button className="actEdit" onClick={() => openEdit(v)}>
                   <i className="bi bi-highlighter"></i>   
                </button>
                <button className="actDelete" onClick={() => handleDelete(v.id)}>
                  <i className="bi bi-trash3"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* MODAL */}
      {isModalOpen && (
        <>
          <div className="adminModalOverlay" onClick={closeModal} />

          <div className="adminModal" role="dialog" aria-modal="true">
            <div className="adminModalHead">
              <div>
                <h3>{form.id ? "Edit vacation" : "Create vacation"}</h3>
                <p className="adminModalSub">
                  {form.id ? "Update the details and save." : "Fill details and create."}
                </p>
              </div>

              <button className="adminModalClose" onClick={closeModal} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="adminModalPreview">
              {form.imageName ? (
                <img
                  src={form.imageName}
                  alt="Preview"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60";
                  }}
                />
              ) : (
                <div className="adminModalPreviewEmpty">Image preview</div>
              )}
            </div>

            <form className="adminModalForm" onSubmit={handleSubmit}>
              <input
                value={form.destination}
                onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))}
                placeholder="Destination"
                required
              />

              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Description"
                required
              />

              <div className="adminModalRow2">
                <label>
                  <span>Start date</span>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                    required
                  />
                </label>

                <label>
                  <span>End date</span>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                    required
                  />
                </label>
              </div>

              <div className="adminModalRow2">
                <label>
                  <span>Price</span>
                  <input
                    type="text"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                    required
                  />
                </label>

                <label>
                  <span>Image URL</span>
                  <input
                    value={form.imageName}
                    onChange={(e) => setForm((f) => ({ ...f, imageName: e.target.value }))}
                    placeholder="https://…"
                    required
                  />
                </label>
              </div>

              {message && <div className="success">{message}</div>}
              {error && <div className="error">{error}</div>}

              <div className="adminModalActions">
                <button type="submit" className="btnPrimary">
                  {form.id ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
