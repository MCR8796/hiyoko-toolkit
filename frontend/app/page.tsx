"use client";

import { useState } from "react";

export default function Home() {
  const [num, setNum] = useState("");
  const [image, setImage] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchImage(target: string) {
    if (!target.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/image/${target}`
      );

      const data = await res.json();

      console.log("API:", data);

      // ★ここが正解（絶対加工しない）
      setImage(data.image || "");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch() {
    if (!num) return;

    await fetchImage(num);

    setHistory((prev) => {
      const filtered = prev.filter((h) => h !== num);
      return [num, ...filtered];
    });

    setNum("");
  }

  function handleHistoryClick(value: string) {
    setNum(value);
    fetchImage(value);
  }

  return (
    <main className="h-screen w-screen flex flex-col bg-[#313338]">

      {/* 履歴 */}
      <div className="h-[60px] bg-[#1e1f22] flex items-center px-3 gap-2 overflow-x-auto">
        <span className="text-white opacity-60">履歴:</span>

        {history.map((h, i) => (
          <button
            key={i}
            onClick={() => handleHistoryClick(h)}
            className="px-2 py-1 bg-[#2b2d31] text-white rounded"
          >
            {h}
          </button>
        ))}
      </div>

      {/* 本体 */}
      <div className="flex-1 flex items-center justify-center p-4">

        <div className="w-full max-w-[700px] h-[80vh] bg-[#2b2d31] rounded-xl p-4 flex flex-col">

          <input
            type="text"
            value={num}
            onChange={(e) => setNum(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="bg-[#1e1f22] text-white p-2 rounded"
          />

          <button
            onClick={handleSearch}
            className="mt-2 bg-[#5865F2] text-white p-2 rounded"
          >
            表示
          </button>

          {/* 画像 */}
          <div className="flex-1 mt-4 flex items-center justify-center bg-[#1e1f22] rounded">

            {loading ? (
              <div className="text-white">読み込み中...</div>
            ) : image ? (
              <img
                src={image}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-[#aaa]">画像待機中</div>
            )}

          </div>

        </div>
      </div>
    </main>
  );
}