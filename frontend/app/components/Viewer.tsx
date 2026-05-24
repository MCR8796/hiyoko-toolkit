"use client";

import { useState } from "react";

export default function Viewer() {
  const [num, setNum] = useState("");
  const [image, setImage] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function searchImage(value?: string) {
    const target = value ?? num;

    if (!target || target.trim() === "") return;

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/image/${target}`
      );

      const data = await res.json();

      if (data.image) {
        // ★ここが修正ポイント（SITE_URLではなくAPI_URL）
        setImage(
          `${process.env.NEXT_PUBLIC_API_URL}${data.image}`
        );
      } else {
        setImage("");
      }

      // 履歴（重複OK）
      setHistory((prev) => {
        const filtered = prev.filter((h) => h !== target);
        return [target, ...filtered];
      });

      setNum("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      searchImage();
    }
  }

  function onClickHistory(h: string) {
    searchImage(h);
  }

  return (
    <main className="min-h-screen bg-[#313338] flex flex-col overflow-hidden">

      {/* 上：履歴 */}
      <div className="p-3 flex flex-wrap gap-2 bg-[#1e1f22]">
        {history.length === 0 ? (
          <span className="text-[#888] text-sm">履歴なし</span>
        ) : (
          history.map((h, i) => (
            <button
              key={i}
              onClick={() => onClickHistory(h)}
              className="px-3 py-1 bg-[#2b2d31] text-white rounded text-sm"
            >
              {h}
            </button>
          ))
        )}

        {history.length > 0 && (
          <button
            onClick={() => setHistory([])}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm"
          >
            全削除
          </button>
        )}
      </div>

      {/* 中央 */}
      <div className="flex-1 flex items-center justify-center p-3">

        <div className="w-full max-w-[700px] bg-[#2b2d31] p-4 rounded-xl flex flex-col gap-4">

          <h1 className="text-white text-xl">Hiyoko Viewer</h1>

          {/* 入力 */}
          <div className="flex gap-2">
            <input
              value={num}
              onChange={(e) => setNum(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="番号入力"
              className="flex-1 p-3 bg-[#1e1f22] text-white rounded"
            />

            <button
              onClick={() => searchImage()}
              className="px-4 bg-blue-600 text-white rounded"
            >
              表示
            </button>
          </div>

          {/* 画像表示 */}
          <div className="flex-1 flex items-center justify-center min-h-[300px]">

            {loading ? (
              <div className="w-full h-[300px] bg-[#1e1f22] animate-pulse rounded" />
            ) : image ? (
              <img
                src={image}
                className="max-h-[60vh] w-auto object-contain rounded"
                alt=""
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