import { useState } from "react";
import api from "../../api/axios";

const ExportImport = ({ onImported }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleExport = async (format) => {
    setLoading(true);
    try {
      const response = await api.get(`/transactions/export?format=${format}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `transactions.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMessage("Export completed.");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (file) => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post("/transactions/import", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessage(data.message || "Import completed.");
      if (onImported) onImported();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="surface-card p-4">
      <h3 className="mb-3 text-lg font-semibold">Sync & Backup</h3>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn-primary" onClick={() => handleExport("json")} disabled={loading}>Export JSON</button>
        <button type="button" className="btn-secondary" onClick={() => handleExport("csv")} disabled={loading}>Export CSV</button>
        <input className="field-input max-w-xs" type="file" accept=".json,.csv,text/csv,application/json" onChange={(e) => handleImport(e.target.files?.[0])} />
      </div>
      <p className="mt-2 text-sm text-gray-400">Auto sync is enabled: transactions are stored in MongoDB automatically.</p>
      {message ? <p className="mt-2 text-sm text-white">{message}</p> : null}
    </div>
  );
};

export default ExportImport;
