import React from "react";

const FilePreviewPanel = ({ file, onClose }) => {
  if (!file) return null;

  const iframeSrc = `${import.meta.env.VITE_BACKEND_URL}${file.previewUrl}`;

  // Debug (you can remove later)
  console.log("🟢 Rendering preview iframe with URL:", file.previewUrl);
  console.log("🟢 IFRAME SRC:", iframeSrc);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex">
      {/* Main container */}
      <div className="bg-white flex flex-col w-full h-screen">

        {/* Header */}
        <div className="flex-shrink-0 p-4 flex justify-between items-center border-b">
          <h3 className="font-semibold truncate">
            {file.originalName}
          </h3>

          <button
            onClick={onClose}
            className="text-xl font-bold px-2 hover:text-red-600"
            aria-label="Close preview"
          >
            ✕
          </button>
        </div>

        {/* Preview area */}
        <div className="flex-1 min-h-0 bg-gray-100">
          <iframe
            src={iframeSrc}
            className="w-full h-full border-none"
            title="File Preview"
          />
        </div>

      </div>
    </div>
  );
};

export default FilePreviewPanel;
