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
    <main className="h-screen w-screen bg-[#313338] flex flex-col">

      {/* 上部履歴 */}
      <div className="h-[70px] bg-[#1e1f22] flex items-center px-4 gap-2 overflow-x-auto shrink-0">

        <div className="text-white text-sm opacity-70 mr-2 whitespace-nowrap">
          履歴:
        </div>

        {history.map((h, i) => (
          <button
            key={i}
            onClick={() => handleHistoryClick(h)}
            className="px-3 py-1 bg-[#2b2d31] text-white rounded text-sm whitespace-nowrap"
          >
            {h}
          </button>
        ))}

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="ml-auto px-3 py-1 bg-red-500 text-white rounded text-sm"
          >
            全削除
          </button>
        )}
      </div>

      {/* メイン */}
      <div className="flex-1 flex justify-center items-start p-6 overflow-hidden">

        <div className="bg-[#2b2d31] p-6 rounded-xl w-full max-w-[700px]">

          <h1 className="text-white text-2xl mb-5 text-center">
            Hiyoko Tool
          </h1>

          {/* 入力 */}
          <div className="flex gap-3">
            <input
              type="number"
              value={num}
              onChange={(e) => setNum(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-[#1e1f22] text-white p-3 rounded outline-none"
            />

            <button
              onClick={handleSearch}
              className="bg-[#5865F2] px-5 rounded text-white"
            >
              表示
            </button>
          </div>

          {/* 画像 */}
          <div className="mt-6">

            {loading ? (
              <div className="h-[300px] bg-[#1e1f22] rounded-xl animate-pulse" />
            ) : image ? (
              <img
                src={image}
                className="rounded-xl w-full shadow-lg"
              />
            ) : (
              <div className="h-[300px] bg-[#1e1f22] rounded-xl text-[#aaa] flex justify-center items-center">
                画像待機中
              </div>
            )}

          </div>

        </div>
      </div>

    </main>
  );
}