// import React, { useEffect, useState, useCallback, useMemo } from "react";
// import { getVendorDashboard, markFileAsPrinted } from "../api/vendor";
// import FileList from "../components/FileList";
// // import FileGrid from "../components/FileGrid";
// import FilePreviewPanel from "../components/FilePreviewPanel";
// import SkeletonFileList from "../components/SkeletonFileList";
// import SkeletonFileGrid from "../components/SkeletonFileGrid";
// import { connectSocket, disconnectSocket } from "../utils/socket";
// import { useNavigate } from "react-router-dom";
// import { getFilePreviewUrl } from "../services/file.service";




 
// /**
//  * VendorDashboard Component
//  * Handles file management, real-time updates via Socket.io, 
//  * bulk actions, and multi-view layouts for print vendors.
//  */
// const VendorDashboard = () => {
//   // ---------------------------------------------------------------------------
//   // 1. State Management
//   // ---------------------------------------------------------------------------
//   const [vendor, setVendor] = useState(null);
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Selection state for bulk actions
//   const [selectedFiles, setSelectedFiles] = useState([]);

//   // Layout view mode (Persisted in localStorage)
//   const [viewMode, setViewMode] = useState(
//     localStorage.getItem("vendor:viewMode") || "list"
//   );

//   // File Preview state
//   const [previewFile, setPreviewFile] = useState(null);

//   // ---------------------------------------------------------------------------
//   // 2. Selection Helpers
//   // ---------------------------------------------------------------------------
//   const toggleSelect = useCallback((fileId) => {
//     setSelectedFiles((prev) =>
//       prev.includes(fileId)
//         ? prev.filter((id) => id !== fileId)
//         : [...prev, fileId]
//     );
//   }, []);

//   const navigate = useNavigate();


//   const handleDownloadQR = () => {
//   if (!vendor?.qrCodeUrl) return;

//   const link = document.createElement("a");
//   link.href = vendor.qrCodeUrl;
//   link.download = `sandbox-qr-${vendor.shopName || "vendor"}.png`;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };


//   const clearSelection = useCallback(() => setSelectedFiles([]), []);

//   const handleSelectAll = useCallback((checked) => {
//     if (checked) {
//       setSelectedFiles(files.map((f) => f._id));
//     } else {
//       clearSelection();
//     }
//   }, [files, clearSelection]);

//   const handleLogout = () => {
//   // 1. Remove auth token
//   localStorage.removeItem("vendorToken");

//   // 2. Disconnect socket
//   disconnectSocket();

//   // 3. Redirect to login
//   navigate("/login");
// };


//   // ---------------------------------------------------------------------------
//   // 3. API Actions & Logic
//   // ---------------------------------------------------------------------------

//   /**
//    * Bulk Print Action (Optimistic Update)
//    */
//   const handleBulkPrint = useCallback(async () => {
//     const token = localStorage.getItem("vendorToken");
//     if (!token || selectedFiles.length === 0) return;

//     const prevFiles = [...files];

//     // Optimistic Update: Mark UI as printed immediately
//     setFiles((prev) =>
//       prev.map((f) =>
//         selectedFiles.includes(f._id) ? { ...f, printed: true } : f
//       )
//     );

//     try {
//       const response = await fetch("http://localhost:5000/api/vendor/files/bulk-print", {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ fileIds: selectedFiles }),
//       });

//       if (!response.ok) throw new Error("Bulk action failed on server");
      
//       clearSelection();
//     } catch (err) {
//       console.error("Bulk print failed:", err);
//       setFiles(prevFiles); // Rollback
//       alert("Failed to mark files as printed. Please try again.");
//     }
//   }, [files, selectedFiles, clearSelection]);

//   /**
//    * Bulk Delete Action (Optimistic Update)
//    */
//   const handleBulkDelete = useCallback(async () => {
//     const token = localStorage.getItem("vendorToken");
//     if (!token || selectedFiles.length === 0) return;

//     const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedFiles.length} files?`);
//     if (!confirmDelete) return;

//     const prevFiles = [...files];

//     // Optimistic Update: Remove from UI immediately
//     setFiles((prev) => prev.filter((f) => !selectedFiles.includes(f._id)));

//     try {
//       const response = await fetch("http://localhost:5000/api/vendor/files/bulk-delete", {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ fileIds: selectedFiles }),
//       });

//       if (!response.ok) throw new Error("Bulk delete failed on server");
      
//       clearSelection();
//     } catch (err) {
//       console.error("Bulk delete failed:", err);
//       setFiles(prevFiles); // Rollback
//       alert("Failed to delete files.");
//     }
//   }, [files, selectedFiles, clearSelection]);

//   /**
//    * Single File Mark Printed
//    */
//   const handleMarkPrinted = useCallback(async (fileId) => {
//     const token = localStorage.getItem("vendorToken");
//     if (!token) return;

//     const prevFiles = [...files];

//     setFiles((prev) =>
//       prev.map((f) => (f._id === fileId ? { ...f, printed: true } : f))
//     );

//     try {
//       await markFileAsPrinted(fileId, token);
//     } catch (error) {
//       console.error("Mark printed failed:", error);
//       setFiles(prevFiles); // Rollback
//       alert("Failed to update file status.");
//     }
//   }, [files]);

//   // ---------------------------------------------------------------------------
//   // 4. Data Fetching
//   // ---------------------------------------------------------------------------

//   const fetchDashboard = useCallback(async (isInitial = false) => {
//     if (isInitial) setLoading(true);
//     try {
//       const token = localStorage.getItem("vendorToken");
//       if (!token) throw new Error("Vendor not logged in");

//       // Removed search parameter from API call
//       const res = await getVendorDashboard(token);

//       setVendor(res.vendor);
//       setFiles(res.files);
//       setError("");
//     } catch (err) {
//       console.error("Dashboard fetch error:", err);
//       setError("Unable to load dashboard. Please login again.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Fetch data on initial mount
//   useEffect(() => {
//     fetchDashboard(true);
//   }, [fetchDashboard]);

//   useEffect(() => {
//   if (previewFile) {
//     console.log("PREVIEW FILE STATE:", previewFile);
//   }
// }, [previewFile]);

//   // ---------------------------------------------------------------------------
//   // 5. Real-time Updates (Socket.IO)
//   // ---------------------------------------------------------------------------
//   useEffect(() => {
//     const token = localStorage.getItem("vendorToken");
//     if (!token) return;

//     const socket = connectSocket(token);

//     socket.on("file:printed", ({ fileId }) => {
//       setFiles((prev) =>
//         prev.map((f) => (f._id === fileId ? { ...f, printed: true } : f))
//       );
//     });

//     socket.on("file:previewReady", ({ fileId, previewImages }) => {
//       setFiles((prev) =>
//         prev.map((f) => (f._id === fileId ? { ...f, previewImages } : f))
//       );
//     });

//     socket.on("file:deleted", ({ fileId }) => {
//       setFiles((prev) => prev.filter((f) => f._id !== fileId));
//       setSelectedFiles((prev) => prev.filter((id) => id !== fileId));
//     });

//     socket.on("file:new", (file) => {
//       setFiles((prev) => [file, ...prev]);
//     });

//     return () => {
//       disconnectSocket();
//     };
//   }, []);


// const handleFileDoubleClick = async (file) => {
//   try {
//     console.log("🟡 Double-clicked file:", file);

//     const token = localStorage.getItem("vendorToken");
//     console.log("🟡 Using token:", token);

//     const previewUrl = await getFilePreviewUrl(file._id, token);
//     console.log("🟢 Preview URL from service:", previewUrl);

//     setPreviewFile({
//       ...file,
//       previewUrl,
//     });
//   } catch (err) {
//     console.error("🔴 Preview failed:", err);
//     alert("Unable to preview file");
//   }
// };


//   // ---------------------------------------------------------------------------
//   // 6. Keyboard Shortcuts
//   // ---------------------------------------------------------------------------
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       // Prevent triggers while typing in inputs
//       if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

//       // ESC — Close preview or clear selection
//       if (e.key === "Escape") {
//         if (previewFile) {
//           setPreviewFile(null);
//         } else if (selectedFiles.length > 0) {
//           clearSelection();
//         }
//       }

//       // ENTER — Bulk mark printed
//       if (e.key === "Enter" && selectedFiles.length > 0) {
//         e.preventDefault();
//         handleBulkPrint();
//       }

//       // DELETE / BACKSPACE — Bulk delete
//       if ((e.key === "Delete" || e.key === "Backspace") && selectedFiles.length > 0) {
//         e.preventDefault();
//         handleBulkDelete();
//       }

//       // CTRL/CMD + A — Select All
//       if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
//         e.preventDefault();
//         handleSelectAll(true);
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [previewFile, selectedFiles, handleBulkPrint, handleBulkDelete, handleSelectAll, clearSelection]);

//   // ---------------------------------------------------------------------------
//   // 7. Memoized Values
//   // ---------------------------------------------------------------------------
//   const allPrinted = useMemo(() => {
//     return files.length > 0 && files.every((f) => f.printed);
//   }, [files]);

//   // ---------------------------------------------------------------------------
//   // 8. Render Helpers
//   // ---------------------------------------------------------------------------
//   if (loading) {
//     return (
//       <div className="p-6 max-w-7xl mx-auto">
//         <h2 className="text-2xl font-bold mb-6 text-gray-800">Vendor Dashboard</h2>
//         <div className="space-y-4">
//           <div className="h-20 bg-gray-100 animate-pulse rounded-lg" />
//           {viewMode === "list" ? <SkeletonFileList /> : <SkeletonFileGrid />}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 max-w-7xl mx-auto min-h-screen bg-white">
//       {/* Header Section */}
//      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//   <div>
//     <h2 className="text-3xl font-extrabold text-gray-900">
//       Vendor Dashboard
//     </h2>
//     {vendor && (
//       <div className="mt-2 text-sm text-gray-600 flex gap-4">
//         <span><strong>Shop:</strong> {vendor.shopName}</span>
//         <span><strong>Vendor:</strong> {vendor.firstName}</span>
//       </div>
//     )}
//   </div>

//   {/* 🔴 Logout Button */}
//   <button
//     onClick={handleLogout}
//     className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium"
//   >
//     Logout
//   </button>
// </div>


//       {vendor?.qrCodeUrl && (
//   <div className="mb-8 p-6 border rounded-lg bg-gray-50">
//     <h3 className="text-lg font-semibold mb-3">Your QR Code</h3>

//     <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
//       <img
//         src={vendor.qrCodeUrl}
//         alt="Vendor QR Code"
//         className="w-48 h-48 border bg-white p-2 rounded"
//       />

//       <div className="flex flex-col gap-2">
//         <p className="text-sm text-gray-600">
//           Print and place this QR code at your counter so customers can upload files.
//         </p>

//         <button
//           onClick={handleDownloadQR}
//           className="bg-black text-white px-4 py-2 rounded w-fit"
//         >
//           Download QR Code
//         </button>
//       </div>
//     </div>
//   </div>
// )}


//       {/* Bulk Action Bar */}
//       {selectedFiles.length > 0 && (
//         <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex flex-wrap gap-4 items-center shadow-sm animate-in fade-in slide-in-from-top-2">
//           <span className="text-blue-800 font-semibold">
//             {selectedFiles.length} item{selectedFiles.length > 1 ? 's' : ''} selected
//           </span>
//           <div className="flex gap-2">
//             <button
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
//               onClick={handleBulkPrint}
//             >
//               Mark Printed
//             </button>
//             <button
//               className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
//               onClick={handleBulkDelete}
//             >
//               Delete Selected
//             </button>
//             <button
//               className="bg-white border border-gray-300 text-gray-700 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
//               onClick={clearSelection}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Control Bar (View Toggle) */}
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex bg-gray-100 p-1 rounded-lg">
//           <button
//             className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
//               viewMode === "list" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-700"
//             }`}
//             onClick={() => {
//               setViewMode("list");
//               localStorage.setItem("vendor:viewMode", "list");
//             }}
//           >
//             List View
//           </button>
//           <button
//             className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
//               viewMode === "grid" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-700"
//             }`}
//             onClick={() => {
//               setViewMode("grid");
//               localStorage.setItem("vendor:viewMode", "grid");
//             }}
//           >
//             Grid View
//           </button>
//         </div>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-2">
//           <span className="font-medium">Error:</span> {error}
//         </div>
//       )}

//       {/* Content Area */}
//       <div className="relative">
//         {files.length === 0 && !error ? (
//           <div className="border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
//             <div className="mb-4 text-gray-300">
//               <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//             </div>
//             <p className="text-xl font-medium text-gray-900">No files found</p>
//             <p className="text-gray-500 mt-1">New print orders will appear here automatically.</p>
//           </div>
//         ) : allPrinted ? (
//           <div className="bg-green-50 border border-green-100 rounded-2xl p-12 text-center mb-8">
//             <p className="text-xl font-bold text-green-800">🎉 Great job!</p>
//             <p className="text-green-700 mt-2">All current pending files have been printed.</p>
//           </div>
//         ) : null}

//         {/* File Display */}
//         {files.length > 0 && (
//           <div className="transition-all duration-300">
//             {viewMode === "list" ? (
//              <FileList
//   files={files}
//   onOpen={handleFileDoubleClick}
//   onMarkPrinted={handleMarkPrinted}
//   selectedFiles={selectedFiles}
//   onToggleSelect={toggleSelect}
//   onSelectAll={handleSelectAll}
// />

//             ) : (
//               <FileGrid
//   files={files}
//   onOpen={handleFileDoubleClick}
//   selectedFiles={selectedFiles}
//   onToggleSelect={toggleSelect}
// />

//             )}
//           </div>
//         )}
//       </div>

//       {/* File Preview Overlays */}
//       {previewFile && (
//         <FilePreviewPanel
//           file={previewFile}
//           onClose={() => setPreviewFile(null)}
//           onMarkPrinted={handleMarkPrinted}
//         />
//       )}

//       {/* Bottom Padding for Mobile */}
//       <div className="h-20 md:hidden" />
//     </div>
//   );
// };

// export default VendorDashboard;