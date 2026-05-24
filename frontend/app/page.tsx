"use client";

import { useState } from "react";

export default function Home() {
  const [num, setNum] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  async function searchImage(value?: string) {
    const target = value ?? num;
    if (!target) return;

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/image/${target}`
      );

      const data = await response.json();

      if (data.image) {
        // 👉 ここが重要：即セット（待たない）
        setImage(`${process.env.NEXT_PUBLIC_SITE_URL}${data.image}`);
      }
    } finally {
      // 👉 API待ちに関係なくUIはすぐ戻す
      setLoading(false);
      setNum("");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      searchImage();
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
              onClick={() => searchImage()}
              className="bg-[#5865F2] px-5 rounded text-white hover:bg-[#4752c4] transition"
            >
              表示
            </button>
          </div>

          {/* 画像エリア */}
          <div className="mt-8 relative">

            {/* スケルトン（即表示） */}
            {loading && (
              <div className="absolute inset-0 h-[300px] bg-[#1e1f22] animate-pulse rounded-xl" />
            )}

            {/* 画像 */}
            {image && (
              <img
                src={image}
                className={`rounded-xl w-full shadow-lg transition-opacity duration-200 ${
                  loading ? "opacity-50" : "opacity-100"
                }`}
                alt=""
              />
            )}

            {/* 初期状態 */}
            {!image && !loading && (
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