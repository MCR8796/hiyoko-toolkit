"use client";

import { useState } from "react";

export default function Viewer() {
  const [num, setNum] = useState("");
  const [image, setImage] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function searchImage(value?: string) {
    const target = value ?? num;

    if (!target.trim()) return;

    setLoading(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/image/${target}`
    );

    const data = await res.json();

    if (data.image) {
      // GitHub / Vercel public配信を使う
      setImage(`/images/${target}.png`);
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

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      searchImage();
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#313338] overflow-hidden">

      {/* 履歴 */}
      <div className="p-3 flex flex-wrap gap-2 bg-[#1e1f22]">
        {history.length === 0 ? (
          <span className="text-gray-400 text-sm">履歴なし</span>
        ) : (
          history.map((h, i) => (
            <button
              key={i}
              onClick={() => searchImage(h)}
              className="px-3 py-1 bg-[#2b2d31] text-white rounded"
            >
              {h}
            </button>
          ))
        )}

        {history.length > 0 && (
          <button
            onClick={() => setHistory([])}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            全削除
          </button>
        )}
      </div>

      {/* メイン */}
      <div className="flex-1 flex items-center justify-center p-3">

        <div className="w-full max-w-[700px] bg-[#2b2d31] p-4 rounded-xl">

          <h1 className="text-white mb-3">Viewer</h1>

          <div className="flex gap-2">
            <input
              value={num}
              onChange={(e) => setNum(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 p-2 bg-[#1e1f22] text-white rounded"
              placeholder="番号入力"
            />

            <button
              onClick={() => searchImage()}
              className="px-4 bg-blue-600 text-white rounded"
            >
              表示
            </button>
          </div>

          {/* 画像 */}
          <div className="mt-4 flex items-center justify-center min-h-[300px]">

            {loading ? (
              <div className="w-full h-[300px] bg-[#1e1f22] animate-pulse rounded" />
            ) : image ? (
              <img
                src={image}
                className="max-h-[70vh] object-contain rounded"
              />
            ) : (
              <div className="text-gray-400">画像待機中</div>
            )}

          </div>

        </div>
      </div>

    </main>
  );
}