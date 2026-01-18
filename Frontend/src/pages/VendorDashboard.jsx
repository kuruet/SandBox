import { useEffect, useState } from "react";
import { getVendorDashboard , markFileAsPrinted} from "../api/vendor";
import FilePreviewPanel from "../components/FilePreviewPanel";
import VendorDashboardSkeleton from "../components/DashboardSkeleton";
import { getFilePreviewUrl } from "../services/file.service";
import api from "../api/vendor"; // axios instance
import { deleteFile, bulkDeleteFiles } from "../api/vendor";
import { connectSocket, disconnectSocket } from "../utils/socket";







export default function VendorDashboard() {
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'
  const [selectMode, setSelectMode] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [vendor, setVendor] = useState(null);
const [files, setFiles] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [previewFile, setPreviewFile] = useState(null);
const [qrCodeUrl, setQrCodeUrl] = useState(null);




useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("vendorToken");
      if (!token) throw new Error("Not authenticated");

      // 1️⃣ Dashboard
      const res = await getVendorDashboard(token);

      setVendor(res.vendor);
setQrCodeUrl(res.vendor.qrCodeUrl);

   const now = Date.now();

setFiles(
  res.files
    .filter((file) => {
      const createdAt = new Date(file.createdAt).getTime();

      if (file.printed) {
        // Printed files → visible for 24 hours
        return now - createdAt <= 24 * 60 * 60 * 1000;
      } else {
        // Unprinted files → visible for 7 days
        return now - createdAt <= 7 * 24 * 60 * 60 * 1000;
      }
    })
    .map((file) => ({
      id: file._id,
      senderName: file.senderName,
      fileName: file.originalName,
      printed: file.printed,
      createdAt: file.createdAt, // keep for future use
    }))
);



      

    } catch (err) {
      console.error("Dashboard load failed:", err);
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  fetchDashboard();
}, []);

 
useEffect(() => {
  setSelectedFiles(prev =>
    prev.filter(id => files.some(file => file.id === id))
  );
}, [files]);
useEffect(() => {
  const token = localStorage.getItem("vendorToken");
  if (!token) return;

  const socket = connectSocket(token);

  socket.on("file:uploaded", (file) => {
    setFiles((prev) => [file, ...prev]);
  });

  socket.on("file:printed", ({ fileId }) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, printed: true } : f
      )
    );
  });

  socket.on("file:deleted", ({ fileId }) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  });

  return () => {
    disconnectSocket();
  };
}, []);



   

   

  const handleMarkPrinted = async (fileId) => {
  const token = localStorage.getItem("vendorToken");
  if (!token) {
    alert("Authentication error. Please login again.");
    return;
  }

  // save snapshot
  const prevFiles = [...files];

  // optimistic UI
  setFiles((prev) =>
    prev.map((file) =>
      file.id === fileId ? { ...file, printed: true } : file
    )
  );

  try {
    await markFileAsPrinted(fileId, token);

    // ✅ DO NOTHING HERE
    // backend success does not need response data
  } catch (err) {
    console.error("Mark as printed failed:", err);

    // rollback only on REAL error
    setFiles(prevFiles);

    alert("Failed to mark file as printed. Please try again.");
  }
};


const handleDeleteFile = async (fileId) => {
  const token = localStorage.getItem("vendorToken");
  if (!token) return;

  const prevFiles = [...files];

  // ✅ Optimistic UI
  setFiles((prev) => prev.filter((f) => f.id !== fileId));

  try {
    await deleteFile(fileId, token);
  } catch (err) {
    console.error("Delete failed:", err);
    setFiles(prevFiles); // rollback
    alert("Failed to delete file");
  }
};

const handleBulkDelete = async () => {
  const token = localStorage.getItem("vendorToken");
  if (!token || selectedFiles.length === 0) return;

  const prevFiles = [...files];

  // ✅ Optimistic UI
  setFiles((prev) =>
    prev.filter((file) => !selectedFiles.includes(file.id))
  );

  try {
    await bulkDeleteFiles(selectedFiles, token);
    setSelectedFiles([]);
  } catch (err) {
    console.error("Bulk delete failed:", err);
    setFiles(prevFiles); // rollback
    alert("Failed to delete selected files");
  }
};



 

  const handleToggleSelect = (fileId) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map((f) => f._id));
    }
  };

 const handleBulkMarkPrinted = async () => {
  const token = localStorage.getItem("vendorToken");
  if (!token) return;

  const prevFiles = [...files];

  // optimistic UI
  setFiles((prev) =>
    prev.map((file) =>
      selectedFiles.includes(file.id) ? { ...file, printed: true } : file
    )
  );

  try {
    await Promise.all(
      selectedFiles.map((fileId) => markFileAsPrinted(fileId, token))
    );
    setSelectedFiles([]);
  } catch (err) {
    console.error("Bulk mark printed failed:", err);
    setFiles(prevFiles); // rollback
    alert("Failed to mark some files as printed");
  }
};

 


const handleDownloadQr = () => {
  if (!qrCodeUrl) return;

  // Convert base64 → blob
  const byteString = atob(qrCodeUrl.split(",")[1]);
  const mimeString = qrCodeUrl.split(",")[0].split(":")[1].split(";")[0];

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([ab], { type: mimeString });

  // Force download
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `sandbox-qr-${vendor?.shopName || "vendor"}.png`;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};


const handleDownloadFile = async (file) => {
  try {
    const token = localStorage.getItem("vendorToken");
    if (!token) throw new Error("Missing auth token");

    // Get secure file URL from backend
    const fileUrl = await getFilePreviewUrl(file.id, token);

    // Force browser download
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = file.fileName || "file";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("File download failed:", err);
    alert("Unable to download file");
  }
};






  

  const handleToggleSelectMode = () => {
    setSelectMode(!selectMode);
    setSelectedFiles([]);
  };

  const handleFileDoubleClick = async (file) => {
  try {
    const token = localStorage.getItem("vendorToken");
    if (!token) throw new Error("Missing auth token");

    const previewUrl = await getFilePreviewUrl(file.id, token);

    setPreviewFile({
      ...file,
      previewUrl,
    });
  } catch (err) {
    console.error("Preview failed:", err);
    alert("Unable to preview file");
  }
};


const handleLogout = async () => {
  try {
    const token = localStorage.getItem("vendorToken");
    if (token) {
      await api.post("/vendor/logout", {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (e) {
    // ignore
  } finally {
    localStorage.removeItem("vendorToken");
    window.location.href = "/login";
  }
};


 if (loading) {
  return <VendorDashboardSkeleton />;
}


if (error) {
  return <div className="text-red-400 p-10">{error}</div>;
}


  return (
    <div
      className="min-h-screen w-full"
      style={{
        background:
          "linear-gradient(135deg, #05060A 0%, #0B1020 50%, #0E1A2F 100%)",
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card-hover {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4), 0 0 20px rgba(59, 130, 246, 0.15);
        }

        .btn-primary {
          transition: all 0.2s ease-out;
        }

        .btn-primary:hover:not(:disabled) {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
        }

        .btn-secondary {
          transition: all 0.2s ease-out;
        }

        .btn-secondary:hover {
          background: rgba(59, 130, 246, 0.15);
          border-color: rgba(59, 130, 246, 0.5);
        }

        .btn-download {
          transition: all 0.2s ease-out;
        }

        .btn-download:hover {
          background: rgba(124, 58, 237, 0.15);
          border-color: rgba(124, 58, 237, 0.5);
        }

        .toggle-btn {
          transition: all 0.2s ease-out;
        }

        .toggle-btn-active {
          background: linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%);
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
        }

        .table-row {
          transition: all 0.2s ease-out;
        }

        .table-row:hover {
          background: rgba(59, 130, 246, 0.08);
        }

        .table-row-selected {
          background: rgba(59, 130, 246, 0.12);
          border-color: rgba(59, 130, 246, 0.4) !important;
        }

        .badge {
          animation: fadeIn 0.3s ease-out;
        }

        .grid-card {
          animation: slideUp 0.3s ease-out;
        }

        .grid-card-selected {
          background: rgba(59, 130, 246, 0.12) !important;
          border-color: rgba(59, 130, 246, 0.5) !important;
        }

        .bulk-actions {
          animation: slideDown 0.3s ease-out;
        }

        .checkbox-custom {
          appearance: none;
          width: 18px;
          height: 18px;
          border: 2px solid rgba(59, 130, 246, 0.4);
          border-radius: 4px;
          background: #0E122A;
          cursor: pointer;
          transition: all 0.2s ease-out;
          position: relative;
        }

        .checkbox-custom:checked {
          background: linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%);
          border-color: #3B82F6;
        }

        .checkbox-custom:checked::after {
          content: '';
          position: absolute;
          left: 5px;
          top: 2px;
          width: 4px;
          height: 8px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .checkbox-custom:hover {
          border-color: rgba(59, 130, 246, 0.6);
        }
      `}</style>

      {/* HEADER BAR */}
      <header
        className="w-full px-8 py-4 flex items-center justify-between"
        style={{
          borderBottom: "1px solid rgba(59, 130, 246, 0.25)",
          background: "rgba(11, 16, 32, 0.6)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold" style={{ color: "#E5E7EB" }}>
            {vendor?.shopName}
          </h1>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>
            {vendor?.firstName}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="btn-secondary px-4 py-2 rounded-lg text-sm font-medium"
          style={{
            color: "#9CA3AF",
            border: "1px solid rgba(59, 130, 246, 0.25)",
            background: "transparent",
          }}
        >
          Logout
        </button>
      </header>

      {/* MAIN CONTENT */}
      <main className="px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT — QR PANEL */}
          <div
            className="card-hover p-6 rounded-2xl"
            style={{
              background: "#0B1020",
              border: "1px solid rgba(59, 130, 246, 0.25)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            }}
          >
            <h2
              className="text-xl font-semibold mb-6"
              style={{ color: "#E5E7EB" }}
            >
              Upload via QR
            </h2>

            {/* QR Code Placeholder */}
            <div
              className="w-full aspect-square rounded-xl mb-6 flex items-center justify-center"
              style={{
                background: "#0E122A",
                border: "2px dashed rgba(59, 130, 246, 0.3)",
              }}
            >
            {qrCodeUrl ? (
  <img
    src={qrCodeUrl}
    alt="Vendor QR Code"
    className="w-48 h-48 rounded-lg bg-white p-2"
  />
) : (
  <span className="text-sm text-gray-500">Loading QR…</span>
)}


            </div>

            <button
            onClick={handleDownloadQr}
              className="btn-primary w-full py-3 rounded-lg font-medium mb-4"
              style={{
                background: "linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)",
                color: "#FFFFFF",
                boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)",
              }}
            >
              Download QR Code
            </button>

            <p className="text-sm text-center" style={{ color: "#6B7280" }}>
              Share this QR code with customers to receive their print files
              instantly
            </p>
          </div>

          {/* RIGHT — FILE WORKSPACE */}
          <div className="lg:col-span-2">
            <div
              className="card-hover p-6 rounded-2xl"
              style={{
                background: "#0B1020",
                border: "1px solid rgba(59, 130, 246, 0.25)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              }}
            >
              {/* Header with view toggle */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: "#E5E7EB" }}
                  >
                    Files
                  </h2>
                  <span
                    className="badge px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      background: "rgba(59, 130, 246, 0.15)",
                      color: "#3B82F6",
                    }}
                  >
                    {files.length}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Select Button */}
                  <button
                    onClick={handleToggleSelectMode}
                    className="btn-secondary px-4 py-2 rounded-lg text-sm font-medium"
                    style={{
                      color: selectMode ? "#FFFFFF" : "#9CA3AF",
                      border: "1px solid rgba(59, 130, 246, 0.25)",
                      background: selectMode
                        ? "linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)"
                        : "transparent",
                      boxShadow: selectMode
                        ? "0 0 15px rgba(59, 130, 246, 0.3)"
                        : "none",
                    }}
                  >
                    {selectMode ? "Cancel" : "Select"}
                  </button>

                  {/* View Toggle */}
                  <div
                    className="flex items-center gap-2 p-1 rounded-lg"
                    style={{
                      background: "#0E122A",
                      border: "1px solid rgba(59, 130, 246, 0.2)",
                    }}
                  >
                    <button
                      onClick={() => setViewMode("list")}
                      className={`toggle-btn px-4 py-2 rounded-md text-sm font-medium ${
                        viewMode === "list" ? "toggle-btn-active" : ""
                      }`}
                      style={{
                        color: viewMode === "list" ? "#FFFFFF" : "#9CA3AF",
                        background: viewMode === "list" ? "" : "transparent",
                      }}
                    >
                      List
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`toggle-btn px-4 py-2 rounded-md text-sm font-medium ${
                        viewMode === "grid" ? "toggle-btn-active" : ""
                      }`}
                      style={{
                        color: viewMode === "grid" ? "#FFFFFF" : "#9CA3AF",
                        background: viewMode === "grid" ? "" : "transparent",
                      }}
                    >
                      Grid
                    </button>
                  </div>
                </div>
              </div>

              {/* Bulk Actions Bar */}
              {selectMode && selectedFiles.length > 0 && (
                <div
                  className="bulk-actions mb-4 p-3 rounded-lg flex items-center justify-between"
                  style={{
                    background: "rgba(59, 130, 246, 0.1)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                  }}
                >
                  <span className="text-sm" style={{ color: "#E5E7EB" }}>
                    {selectedFiles.length} file(s) selected
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleBulkMarkPrinted}
                      className="btn-secondary px-4 py-2 rounded-lg text-xs font-medium"
                      style={{
                        color: "#3B82F6",
                        border: "1px solid rgba(59, 130, 246, 0.25)",
                        background: "transparent",
                      }}
                    >
                      Mark as Printed
                    </button>
                    <button
                     onClick={handleBulkDelete}

                      className="btn-secondary px-4 py-2 rounded-lg text-xs font-medium"
                      style={{
                        color: "#EF4444",
                        border: "1px solid rgba(239, 68, 68, 0.25)",
                        background: "transparent",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}

              {/* FILE CONTENT */}
              {files.length === 0 ? (
                // EMPTY STATE
                <div className="py-20 text-center">
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{
                      background: "rgba(59, 130, 246, 0.1)",
                    }}
                  >
                    <svg
                      className="w-8 h-8"
                      style={{ color: "#3B82F6" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3
                    className="text-lg font-medium mb-2"
                    style={{ color: "#E5E7EB" }}
                  >
                    No files yet
                  </h3>
                  <p className="text-sm" style={{ color: "#6B7280" }}>
                    Ask customers to scan your QR code
                  </p>
                </div>
              ) : viewMode === "list" ? (
                // LIST VIEW
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                     <tr
  className="table-row cursor-pointer"
 >

                        {selectMode && (
                          <th className="text-left py-3 px-4">
                            <input
                              type="checkbox"
                              className="checkbox-custom"
                              checked={selectedFiles.length === files.length}
                              onChange={handleSelectAll}
                            />
                          </th>
                        )}
                        <th
                          className="text-left py-3 px-4 text-sm font-medium"
                          style={{ color: "#9CA3AF" }}
                        >
                          Sender Name
                        </th>
                        <th
                          className="text-left py-3 px-4 text-sm font-medium"
                          style={{ color: "#9CA3AF" }}
                        >
                          File Name
                        </th>
                        <th
                          className="text-left py-3 px-4 text-sm font-medium"
                          style={{ color: "#9CA3AF" }}
                        >
                          Download
                        </th>
                        <th
                          className="text-left py-3 px-4 text-sm font-medium"
                          style={{ color: "#9CA3AF" }}
                        >
                          Status
                        </th>
                        <th
                          className="text-left py-3 px-4 text-sm font-medium"
                          style={{ color: "#9CA3AF" }}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {files.map((file) => (
                        <tr
  key={file.id}
  onDoubleClick={() => handleFileDoubleClick(file)}
  className={`table-row cursor-pointer ${
    selectedFiles.includes(file.id)
      ? "table-row-selected"
      : ""
  }`}
  style={{
    borderBottom: "1px solid rgba(59, 130, 246, 0.1)",
  }}
>

                          {selectMode && (
                            <td className="py-4 px-4">
                              <input
                                type="checkbox"
                                className="checkbox-custom"
                                checked={selectedFiles.includes(file.id)}
                                onChange={() => handleToggleSelect(file.id)}
                              />
                            </td>
                          )}
                          <td
                            className="py-4 px-4 text-sm"
                            style={{ color: "#E5E7EB" }}
                          >
                            {file.senderName}
                          </td>
                          <td
                            className="py-4 px-4 text-sm font-medium"
                            style={{ color: "#E5E7EB" }}
                          >
                            {file.fileName}
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleDownloadFile(file)}

                              className="btn-download p-2 rounded-lg"
                              style={{
                                color: "#7C3AED",
                                border: "1px solid rgba(124, 58, 237, 0.25)",
                                background: "transparent",
                              }}
                              title="Download file"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                              </svg>
                            </button>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className="badge px-3 py-1 rounded-full text-xs font-medium"
                              style={{
                                background: file.printed
                                  ? "rgba(34, 197, 94, 0.15)"
                                  : "rgba(251, 191, 36, 0.15)",
                                color: file.printed ? "#22C55E" : "#FBBf24",
                              }}
                            >
                              {file.printed ? "Printed" : "Pending"}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleMarkPrinted(file.id)}
                              disabled={file.printed}
                              className="btn-secondary px-4 py-2 rounded-lg text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                              style={{
                                color: file.printed ? "#6B7280" : "#3B82F6",
                                border: "1px solid rgba(59, 130, 246, 0.25)",
                                background: "transparent",
                              }}
                            >
                              {file.printed ? "Completed" : "Mark as Printed"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                // GRID VIEW
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {files.map((file, index) => (
                    <div
  key={file.id}
  onDoubleClick={() => handleFileDoubleClick(file)}
  className={`grid-card card-hover p-4 rounded-xl relative cursor-pointer ${
    selectedFiles.includes(file.id)
      ? "grid-card-selected"
      : ""
  }`}
  style={{
    background: "#0E122A",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    animationDelay: `${index * 50}ms`,
  }}
>

                      {/* Checkbox overlay */}
                      {selectMode && (
                        <div className="absolute top-3 left-3 z-10">
                          <input
                            type="checkbox"
                            className="checkbox-custom"
                            checked={selectedFiles.includes(file.id)}
                            onChange={() => handleToggleSelect(file.id)}
                          />
                        </div>
                      )}

                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            background: "rgba(59, 130, 246, 0.1)",
                          }}
                        >
                          <svg
                            className="w-6 h-6"
                            style={{ color: "#3B82F6" }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="text-sm font-medium truncate mb-1"
                            style={{ color: "#E5E7EB" }}
                          >
                            {file.fileName}
                          </h3>
                          <p
                            className="text-xs truncate"
                            style={{ color: "#9CA3AF" }}
                          >
                            {file.senderName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className="badge px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: file.printed
                              ? "rgba(34, 197, 94, 0.15)"
                              : "rgba(251, 191, 36, 0.15)",
                            color: file.printed ? "#22C55E" : "#FBBf24",
                          }}
                        >
                          {file.printed ? "Printed" : "Pending"}
                        </span>

                        <button
                          onClick={() => handleDownloadFile(file)}
                          className="btn-download p-2 rounded-lg"
                          style={{
                            color: "#7C3AED",
                            border: "1px solid rgba(124, 58, 237, 0.25)",
                            background: "transparent",
                          }}
                          title="Download file"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                        </button>
                      </div>

                      <button
                        onClick={() => handleMarkPrinted(file.id)}
                        disabled={file.printed}
                        className="btn-secondary w-full px-3 py-2 rounded-lg text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                          color: file.printed ? "#6B7280" : "#3B82F6",
                          border: "1px solid rgba(59, 130, 246, 0.25)",
                          background: "transparent",
                        }}
                      >
                        {file.printed ? "Completed" : "Mark as Printed"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {previewFile && (
  <FilePreviewPanel
    file={previewFile}
    onClose={() => setPreviewFile(null)}
  />
)}

    </div>

    
  );
}