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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/image/${target}`
      );

      const data = await response.json();

      if (data.image) {
        setImage(`${process.env.NEXT_PUBLIC_SITE_URL}${data.image}`);
      } else {
        setImage("");
      }
    } finally {
      setLoading(false);
    }
  }

  // 入力検索（履歴追加あり）
  async function handleSearch() {
    if (!num) return;

    await fetchImage(num);

    setHistory((prev) => {
      const filtered = prev.filter((h) => h !== num);
      return [num, ...filtered];
    });

    setNum("");
  }

  // 履歴クリック（追加なし）
  async function handleHistoryClick(value: string) {
    setNum(value);
    await fetchImage(value);
  }

  // ❌ 履歴削除
  function handleDeleteHistory(value: string) {
    setHistory((prev) => prev.filter((h) => h !== value));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <main className="min-h-screen bg-[#313338] flex">

      {/* サイドバー */}
      <div className="w-[72px] bg-[#1e1f22] flex flex-col items-center py-4">
        <div className="w-[48px] h-[48px] rounded-2xl bg-[#5865F2] text-white flex items-center justify-center">
          H
        </div>
      </div>

      {/* メイン */}
      <div className="flex-1 flex justify-center items-center p-3">

        <div className="bg-[#2b2d31] p-4 sm:p-8 rounded-xl w-full max-w-[700px]">

          <h1 className="text-white text-xl sm:text-3xl mb-5">
            Hiyoko Tool
          </h1>

          {/* 入力 */}
          <div className="flex gap-3">

            <input
              type="number"
              value={num}
              onChange={(e) => setNum(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="数字入力（Enterで送信）"
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
          <div className="mt-8">

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

          {/* 履歴 */}
          <div className="mt-6">

            <h2 className="text-white mb-2 text-sm opacity-70">
              履歴
            </h2>

            <div className="flex flex-wrap gap-2">

              {history.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center bg-[#1e1f22] rounded text-sm overflow-hidden"
                >
                  {/* 本体ボタン */}
                  <button
                    onClick={() => handleHistoryClick(h)}
                    className="px-3 py-1 text-white hover:bg-[#3a3c42] transition"
                  >
                    {h}
                  </button>

                  {/* 削除ボタン */}
                  <button
                    onClick={() => handleDeleteHistory(h)}
                    className="px-2 py-1 text-red-400 hover:bg-red-500 hover:text-white transition"
                  >
                    ×
                  </button>
                </div>
              ))}

            </div>

          </div>

        </div>
      </div>

    </main>
  );
}