import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export const getFilePreviewUrl = async (fileId, token) => {
  console.log("🟠 [service] Requesting preview URL for:", fileId);

  const res = await axios.get(
    `${API_BASE}/api/file-access/${fileId}/preview-url`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("🟠 [service] Raw response data:", res.data);

  return res.data.previewUrl;
};

