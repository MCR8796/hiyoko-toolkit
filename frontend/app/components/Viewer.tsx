"use client";

import { useState } from "react";

export default function Viewer() {
  const [query, setQuery] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function searchImage() {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/image/${query}`
      );

      const data = await res.json();

      setImage(data.image || null);
    } catch (e) {
      console.error(e);
      setImage(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[700px] bg-[#2b2d31] p-6 rounded-xl">

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && searchImage()}
        placeholder="番号 or キャラ名"
        className="w-full p-3 bg-[#1e1f22] text-white rounded"
      />

      <div className="mt-6 h-[450px] flex items-center justify-center bg-[#1e1f22] rounded overflow-hidden">

        {loading ? (
          <div className="text-white">読み込み中...</div>

        ) : image ? (
          <img src={image} className="max-h-full max-w-full object-contain" />

        ) : (
          <div className="text-[#aaa]">画像なし</div>
        )}

      </div>
    </div>
  );
}