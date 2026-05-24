"use client";

import { useState } from "react";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      resolve(base64);
    };

    reader.onerror = reject;
  });
}

export default function Uploader() {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function upload() {
    if (!name.trim()) {
      alert("名前が空です");
      return;
    }

    if (!file) {
      alert("画像がありません");
      return;
    }

    setLoading(true);

    const base64 = await fileToBase64(file);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/upload`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          base64,
        }),
      }
    );

    const data = await res.json();

    setLoading(false);

    if (data.ok) {
      alert("アップロード成功");
      setName("");
      setFile(null);
    } else {
      alert("失敗");
    }
  }

  return (
    <div className="p-4 bg-[#2b2d31] rounded-xl text-white">
      <h2 className="mb-3">Uploader</h2>

      <input
        className="p-2 bg-[#1e1f22] rounded w-full mb-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="画像番号（例: 3）"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={upload}
        disabled={loading}
        className="mt-3 px-4 py-2 bg-blue-600 rounded"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}