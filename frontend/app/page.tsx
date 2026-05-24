"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [num, setNum] = useState("");
  const [image, setImage] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 履歴復元
  useEffect(() => {
    const saved = localStorage.getItem("history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  // 履歴保存
  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  async function fetchImage(target: string) {
    if (!target) return;

    setLoading(true);
    setImage("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/image/${target}`
      );

      if (!res.ok) {
        setImage("");
        return;
      }

      const data = await res.json();

      if (data.image) {
        setImage(`${process.env.NEXT_PUBLIC_API_URL}${data.image}`);
      } else {
        setImage("");
      }
    } catch (e) {
      console.error(e);
      setImage("");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch() {
    if (!num || loading) return;

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
    if (e.key === "Enter" && !loading) {
      handleSearch();
    }
  }

  return (
    <main className="h-screen w-screen flex flex-col bg-[#313338] overflow-hidden">
      {/* 履歴 */}
      <div className="h-[60px] shrink-0 bg-[#1e1f22] flex items-center px-3 gap-2 overflow-x-auto">
        <div className="text-white text-sm opacity-70">履歴:</div>

        {history.map((h, i) => (
          <button
            key={i}
            onClick={() => handleHistoryClick(h)}
            className="px-2 py-1 bg-[#2b2d31] text-white rounded text-sm"
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

      {/* メイン */}
      <div className="flex-1 flex justify-center items-start p-4">
        <div className="w-full max-w-[700px] bg-[#2b2d31] rounded-xl p-4 flex flex-col h-full">
          <h1 className="text-white text-xl text-center mb-4">
            Hiyoko Tool
          </h1>

          <div className="flex gap-2">
            <input
              type="number"
              value={num}
              onChange={(e) => setNum(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-[#1e1f22] text-white p-2 rounded"
            />

            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-[#5865F2] px-4 rounded text-white"
            >
              表示
            </button>
          </div>

          <div className="mt-4 flex-1 flex items-center justify-center">
            {loading ? (
              <div className="w-full h-full bg-[#1e1f22] rounded animate-pulse" />
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