"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [num, setNum] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 プレロードキャッシュ
  const cache = new Map<string, string>();

  // 🔥 入力中プレロード（0.4秒後に実行）
  useEffect(() => {
    if (!num) return;

    const timer = setTimeout(async () => {
      const target = num;

      if (cache.has(target)) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/image/${target}`
        );
        const data = await res.json();

        if (data.image) {
          const url = `${process.env.NEXT_PUBLIC_SITE_URL}${data.image}`;

          // キャッシュ保存
          cache.set(target, url);

          // 🔥 ブラウザに事前ロード
          const img = new Image();
          img.src = url;
        }
      } catch (e) {
        // 無視でOK
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [num]);

  async function searchImage(value?: string) {
    const target = value ?? num;
    if (!target) return;

    setLoading(true);

    // 🔥 キャッシュ優先
    if (cache.has(target)) {
      setImage(cache.get(target)!);
      setLoading(false);
      setNum("");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/image/${target}`
      );

      const data = await response.json();

      if (data.image) {
        const url = `${process.env.NEXT_PUBLIC_SITE_URL}${data.image}`;
        cache.set(target, url);
        setImage(url);
      }
    } finally {
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
              placeholder="数字入力（即プレロード）"
              className="flex-1 bg-[#1e1f22] text-white p-3 rounded outline-none"
            />

            <button
              onClick={() => searchImage()}
              className="bg-[#5865F2] px-5 rounded text-white"
            >
              表示
            </button>
          </div>

          {/* 画像 */}
          <div className="mt-8 relative">

            {loading && (
              <div className="absolute inset-0 h-[300px] bg-[#1e1f22] animate-pulse rounded-xl" />
            )}

            {image ? (
              <img
                src={image}
                className="rounded-xl w-full shadow-lg transition-opacity duration-150"
              />
            ) : (
              !loading && (
                <div className="h-[300px] bg-[#1e1f22] rounded-xl text-[#aaa] flex justify-center items-center">
                  画像待機中
                </div>
              )
            )}

          </div>

        </div>
      </div>

    </main>
  );
}