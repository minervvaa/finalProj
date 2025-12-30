import { useEffect, useState } from "react";
import { api } from "../../api";
import { Bar } from "react-chartjs-2";
import "./ReportsPage.css";


interface ReportRow {
  destination: string;
  followers: number;
}

export default function ReportsPage() {
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      const res = await api.get<ReportRow[]>("/reports/followers");
      setRows(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to load report");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function downloadCsv() {
    try {
      const res = await api.get("/reports/followers.csv", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "vacations-followers.csv";
      a.click();
    } catch (err: any) {
      console.error(err);
    }
  }

  const data = {
    labels: rows.map(r => r.destination),
    datasets: [
      {
        label: "Followers",
        data: rows.map(r => r.followers),
      },
    ],
  };

  return (
    <div className="reports-page">
      <h2>Followers Report</h2>

      {error && <div className="error">{error}</div>}

      <Bar data={data} />

      <button onClick={downloadCsv}>Download CSV</button>
    </div>
  );
}
