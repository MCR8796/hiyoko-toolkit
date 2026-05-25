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
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <main className="h-screen bg-[#313338] p-2 flex flex-col overflow-hidden">

      {/* 上部コンパクトバー */}
      <div className="h-[44px] bg-[#1e1f22] rounded-lg px-3 flex items-center gap-2 shrink-0">

        {/* タイトル */}
        <div className="text-white text-sm font-bold whitespace-nowrap">
          Hiyoko
        </div>

        {/* 入力 */}
        <input
          type="number"
          value={num}
          onChange={(e) => setNum(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="番号"
          className="
            w-[80px]
            h-[28px]
            bg-[#2b2d31]
            text-white
            text-sm
            rounded
            px-2
            outline-none
          "
        />

        {/* 表示ボタン */}
        <button
          onClick={handleSearch}
          className="
            h-[28px]
            px-3
            bg-[#5865F2]
            text-white
            text-sm
            rounded
          "
        >
          表示
        </button>

        {/* 履歴 */}
        <div className="flex gap-1 overflow-x-auto flex-1">

          {history.map((h, i) => (
            <button
              key={i}
              onClick={() => handleHistoryClick(h)}
              className="
                px-2
                h-[24px]
                bg-[#2b2d31]
                text-white
                text-xs
                rounded
                whitespace-nowrap
                shrink-0
              "
            >
              {h}
            </button>
          ))}

        </div>

        {/* 全削除 */}
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="
              h-[24px]
              px-2
              bg-[#da373c]
              text-white
              text-xs
              rounded
              shrink-0
            "
          >
            ×
          </button>
        )}

      </div>

      {/* 画像エリア */}
      <div className="flex-1 mt-2 min-h-0 bg-[#2b2d31] rounded-xl p-2">

        <div className="w-full h-full flex items-center justify-center">

          {loading ? (
            <div className="w-full h-full bg-[#1e1f22] rounded animate-pulse" />
          ) : image ? (
            <img
              src={image}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="text-[#999] text-sm">
              画像待機中
            </div>
          )}

        </div>

      </div>

    </main>
  );
}