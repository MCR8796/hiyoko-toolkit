"use client";

import { useState } from "react";

export default function Home() {
  const [num, setNum] = useState("");
  const [image, setImage] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchImage(target: string) {
    if (!target) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/image/${target}`
      );

      const data = await res.json();

      if (data.image) {
        setImage(`${process.env.NEXT_PUBLIC_SITE_URL}${data.image}`);
      } else {
        setImage("");
      }
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

  function clearHistory() {
    setHistory([]);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <main className="h-screen w-screen flex flex-col bg-[#313338] overflow-hidden">

      {/* 履歴バー */}
      <div className="h-[60px] shrink-0 bg-[#1e1f22] flex items-center px-3 gap-2 overflow-x-auto">

        <div className="text-white text-sm opacity-70 whitespace-nowrap">
          履歴:
        </div>

        {history.map((h, i) => (
          <button
            key={i}
            onClick={() => handleHistoryClick(h)}
            className="px-2 py-1 bg-[#2b2d31] text-white rounded text-sm whitespace-nowrap"
          >
            {h}
          </button>
        ))}

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="ml-auto px-2 py-1 bg-red-500 text-white rounded text-sm"
          >
            全削除
          </button>
        )}
      </div>

      {/* 本体 */}
      <div className="flex-1 min-h-0 flex items-start justify-center p-4">

        <div className="bg-[#2b2d31] w-full max-w-[650px] p-4 rounded-xl">

          <h1 className="text-white text-xl mb-4 text-center">
            Hiyoko Tool
          </h1>

          {/* 入力 */}
          <div className="flex gap-2">
            <input
              type="number"
              value={num}
              onChange={(e) => setNum(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-[#1e1f22] text-white p-2 rounded outline-none"
            />

            <button
              onClick={handleSearch}
              className="bg-[#5865F2] px-4 rounded text-white"
            >
              表示
            </button>
          </div>

          {/* 画像 */}
          <div className="mt-4">

            {loading ? (
              <div className="h-[220px] bg-[#1e1f22] rounded animate-pulse" />
            ) : image ? (
              <img
                src={image}
                className="rounded w-full max-h-[220px] object-contain"
              />
            ) : (
              <div className="h-[220px] bg-[#1e1f22] rounded flex items-center justify-center text-[#aaa]">
                画像待機中
              </div>
            )}

          </div>

        </div>
      </div>

    </main>
  );
}