import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";


const API_BASE = import.meta.env.VITE_BACKEND_URL;


const VendorUploadPage = () => {
  const [senderName, setSenderName] = useState("");
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [nameError, setNameError] = useState("");

  const [shopName, setShopName] = useState("");
  const [vendorLoading, setVendorLoading] = useState(true);
  const [vendorError, setVendorError] = useState("");
  const [fileError, setFileError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);


  const fileInputRef = useRef(null);

  const MAX_FILES = 10;
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
  const ALLOWED_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];

  const [searchParams] = useSearchParams();
  const qrId = searchParams.get("qrId");

  useEffect(() => {
    if (!qrId) {
      setVendorError("Invalid QR code");
      setVendorLoading(false);
      return;
    }

    const fetchVendor = async () => {
      try {
        const res = await axios.get(`${API_BASE}/public/vendors/qr/${qrId}`);


        setShopName(res.data.shopName);
      } catch (err) {
        if (err.response?.status === 403) {
          setVendorError("This shop is currently unavailable");
        } else {
          setVendorError("Invalid QR code");
        }
      } finally {
        setVendorLoading(false);
      }
    };

    fetchVendor();
  }, [qrId]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (files.length + selectedFiles.length > MAX_FILES) {
      setFileError(`You can upload up to ${MAX_FILES} files`);
      return;
    }

    for (const file of selectedFiles) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setFileError("Only PDF and image files are allowed");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setFileError("Each file must be under 50MB");
        return;
      }
    }

    setFileError("");
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files || []);

    if (files.length + droppedFiles.length > MAX_FILES) {
      setFileError(`You can upload up to ${MAX_FILES} files`);
      return;
    }

    for (const file of droppedFiles) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setFileError("Only PDF and image files are allowed");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setFileError("Each file must be under 50MB");
        return;
      }
    }

    setFileError("");
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // 🔒 Guard against malformed / missing QR
  if (!qrId) {
    alert("Invalid QR code");
    return;
  }

  if (!senderName.trim()) {
    setNameError("Please enter your name");
    return;
  }

  if (files.length === 0) return;

  setUploading(true);
  setNameError("");

  try {
    const formData = new FormData();
    formData.append("senderName", senderName.trim());

    files.forEach((file) => {
      formData.append("files", file);
    });

    // ❌ DO NOT set Content-Type manually
await axios.post(
  `${import.meta.env.VITE_BACKEND_URL}/public/vendors/qr/${qrId}/upload`,
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (event) => {
      if (!event.total) return;
      const percent = Math.round(
        (event.loaded * 100) / event.total
      );
      setUploadProgress(percent);
    },
  }
);

setUploadProgress(0);


setUploading(false);
setUploadProgress(0);




    // ✅ Success reset
    setSenderName("");
    setFiles([]);
    alert("Files sent successfully");

} catch (err) {
  console.error("Upload failed:", err);

  if (err.response) {
    alert(err.response.data?.message || "Upload failed");
  } else {
    alert("Upload failed. Please try again.");
  }
} finally {
  setUploading(false);
}

};


  const canSubmit = senderName.trim() && files.length > 0 && !uploading;

  if (vendorLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading…
      </div>
    );
  }

  if (vendorError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {vendorError}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, #05060A 0%, #0B1020 50%, #0E1A2F 100%)",
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        .btn-primary {
          transition: all 0.2s ease-out;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .file-item {
          transition: all 0.2s ease-out;
        }

        .file-item:hover {
          background: rgba(59, 130, 246, 0.08);
        }

        .drag-active {
          border-color: #3B82F6 !important;
          background: rgba(59, 130, 246, 0.05) !important;
        }

        .input-field {
          transition: all 0.2s ease-out;
        }

        .input-field:focus {
          border-color: #3B82F6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
          outline: none;
        }
      `}</style>

      <div
        className="w-full max-w-2xl fade-in"
        style={{
          background: "#0B1020",
          border: "1px solid rgba(59, 130, 246, 0.25)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          borderRadius: "1.5rem",
          padding: "3rem",
        }}
      >
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: "#E5E7EB" }}
          >
            {shopName}
          </h1>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>
            Send files securely for printing
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="senderName"
              className="block text-sm font-medium mb-2"
              style={{ color: "#E5E7EB" }}
            >
              Your Name
            </label>
            <input
              id="senderName"
              type="text"
              value={senderName}
              onChange={(e) => {
                setSenderName(e.target.value);
                setNameError("");
              }}
              className="input-field w-full px-4 py-3 rounded-lg text-sm"
              style={{
                background: "#0E122A",
                border: nameError
                  ? "1px solid rgba(239, 68, 68, 0.5)"
                  : "1px solid rgba(59, 130, 246, 0.25)",
                color: "#E5E7EB",
              }}
              placeholder="Enter your full name"
              aria-required="true"
              aria-invalid={!!nameError}
              aria-describedby={nameError ? "name-error" : undefined}
            />
            {nameError && (
              <p
                id="name-error"
                className="mt-2 text-xs"
                style={{ color: "#EF4444" }}
                role="alert"
              >
                {nameError}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "#E5E7EB" }}
            >
              Files
            </label>

            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer ${
                dragActive ? "drag-active" : ""
              }`}
              style={{
                borderColor: dragActive
                  ? "#3B82F6"
                  : "rgba(59, 130, 246, 0.3)",
                background: dragActive
                  ? "rgba(59, 130, 246, 0.05)"
                  : "#0E122A",
                transition: "all 0.2s ease-out",
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              aria-label="File upload area"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
                aria-label="File input"
              />

              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ background: "rgba(59, 130, 246, 0.1)" }}
              >
                <svg
                  className="w-8 h-8"
                  style={{ color: "#3B82F6" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>

              <p
                className="text-sm font-medium mb-1"
                style={{ color: "#E5E7EB" }}
              >
                Drop files here or click to browse
              </p>
              <p className="text-xs" style={{ color: "#6B7280" }}>
                PDF, images, and documents supported
              </p>
            </div>
            {fileError && (
              <p className="mt-2 text-xs text-red-400">{fileError}</p>
            )}

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="file-item flex items-center justify-between p-3 rounded-lg"
                    style={{
                      background: "#0E122A",
                      border: "1px solid rgba(59, 130, 246, 0.2)",
                    }}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(59, 130, 246, 0.1)" }}
                      >
                        <svg
                          className="w-5 h-5"
                          style={{ color: "#3B82F6" }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
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
                        <p
                          className="text-sm font-medium truncate"
                          style={{ color: "#E5E7EB" }}
                        >
                          {file.name}
                        </p>
                        <p className="text-xs" style={{ color: "#6B7280" }}>
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="p-2 rounded-lg hover:bg-opacity-20 flex-shrink-0"
                      style={{
                        color: "#EF4444",
                        background: "transparent",
                        transition: "all 0.2s ease-out",
                      }}
                      aria-label={`Remove ${file.name}`}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(239, 68, 68, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {uploading && (
  <div className="w-full mt-4">
    <div className="w-full h-2 bg-gray-700 rounded">
      <div
        className="h-2 bg-blue-500 rounded transition-all"
        style={{ width: `${uploadProgress}%` }}
      />
    </div>
    <p className="text-xs text-gray-300 mt-1 text-center">
      Uploading… {uploadProgress}%
    </p>
  </div>
)}



          <button
            type="submit"
            disabled={!canSubmit}
            className="btn-primary w-full py-3 rounded-lg font-medium text-base"
            style={{
              background: canSubmit
                ? "linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)"
                : "rgba(59, 130, 246, 0.2)",
              color: "#FFFFFF",
              boxShadow: canSubmit
                ? "0 4px 14px rgba(59, 130, 246, 0.4)"
                : "none",
            }}
            aria-label="Send files to shop"
          >
            {uploading ? "Sending..." : "Send Files"}
          </button>

          


          <div
            className="pt-4 border-t"
            style={{ borderColor: "rgba(59, 130, 246, 0.15)" }}
          >
            <div className="flex items-center gap-2 justify-center">
              <svg
                className="w-4 h-4"
                style={{ color: "#22C55E" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <p className="text-xs" style={{ color: "#9CA3AF" }}>
                Files are sent securely
              </p>
            </div>
            <p
              className="text-center text-xs mt-1"
              style={{ color: "#6B7280" }}
            >
              Only the shop owner can access these files
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorUploadPage;