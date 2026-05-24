"use client";

import { useState } from "react";

export default function Viewer() {

  const [num, setNum] = useState("");
  const [image, setImage] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function search(value?: string) {
    const target = value ?? num;
    if (!target) return;

    setLoading(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/image/${target}`
    );

    const data = await res.json();

    if (data.image) {
      setImage(`${process.env.NEXT_PUBLIC_SITE_URL}${data.image}`);
    } else {
      setImage("");
    }

    setHistory((prev) => {
      const filtered = prev.filter((h) => h !== target);
      return [target, ...filtered];
    });

    setNum("");
    setLoading(false);
  }

  return (
    <div className="w-full max-w-[700px] bg-[#2b2d31] rounded-xl p-4 flex flex-col h-full">

      {/* 入力 */}
      <div className="flex gap-2">
        <input
          value={num}
          onChange={(e) => setNum(e.target.value)}
          className="flex-1 p-2 bg-[#1e1f22] text-white rounded"
        />

        <button
          onClick={() => search()}
          className="bg-[#5865F2] px-4 text-white rounded"
        >
          表示
        </button>
      </div>

      {/* 画像 */}
      <div className="flex-1 flex items-center justify-center mt-4 bg-[#1e1f22] rounded">
        {image ? (
          <img src={image} className="max-h-full max-w-full object-contain" />
        ) : (
          <span className="text-gray-400">画像待機中</span>
        )}
      </div>

      {/* 履歴（ここ重要） */}
      <div className="mt-3 flex flex-wrap gap-2">
        {history.map((h, i) => (
          <button
            key={i}
            onClick={() => search(h)}
            className="px-2 py-1 bg-[#1e1f22] text-white rounded text-sm"
          >
            {h}
          </button>
        ))}
      </div>

    </div>
  );
}