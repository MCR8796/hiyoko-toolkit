"use client";

import { useState } from "react";

export default function Home() {
  const [num, setNum] = useState("");
  const [image, setImage] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  async function fetchImage(target: string): Promise<boolean> {
    if (!target) return false;

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/image/${target}`
      );

      if (!res.ok) {
        setImage("");
        return false;
      }

      const data = await res.json();

      if (!data.image) {
        setImage("");
        return false;
      }

      const imageUrl =
        `${process.env.NEXT_PUBLIC_API_URL}${data.image}`;

      setImage(imageUrl);

      return true;

    } catch (e) {
      console.error(e);

      setImage("");

      return false;

    } finally {
      setLoading(false);
    }
  }

  async function handleSearch() {
    if (!num) return;

    const success = await fetchImage(num);

    // 表示成功時だけ履歴追加
    if (success) {
      setHistory((prev) => {
        const filtered = prev.filter(
          (h) => h !== num
        );

        return [num, ...filtered];
      });
    }

    setNum("");
  }

  function handleHistoryClick(value: string) {
    fetchImage(value);
  }

  function clearHistory() {
    setHistory([]);
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <>
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

        {/* メイン */}
        <div className="flex-1 min-h-0 flex justify-center items-start p-4">

          <div className="w-full max-w-[700px] bg-[#2b2d31] rounded-xl p-4 flex flex-col h-full">

            <h1 className="text-white text-xl text-center mb-4">
              Hiyoko Tool
            </h1>

            <div className="flex gap-2 shrink-0">

              <input
                type="number"
                value={num}
                onChange={(e) =>
                  setNum(e.target.value)
                }
                onKeyDown={handleKeyDown}
                className="
                  flex-1
                  bg-[#1e1f22]
                  text-white
                  p-2
                  rounded
                  outline-none
                "
              />

              <button
                onClick={handleSearch}
                className="
                  bg-[#5865F2]
                  px-4
                  rounded
                  text-white
                "
              >
                表示
              </button>

            </div>

            <div className="mt-4 flex-1 min-h-0 flex items-center justify-center">

              {loading ? (
                <div className="w-full h-full bg-[#1e1f22] rounded animate-pulse" />
              ) : image ? (
                <div className="w-full h-full flex items-center justify-center bg-[#1e1f22] rounded overflow-hidden">

                  <img
                    src={image}
                    onClick={() =>
                      setZoomOpen(true)
                    }
                    className="
                      max-h-full
                      max-w-full
                      object-contain
                      cursor-pointer
                    "
                  />

                </div>
              ) : (
                <div className="text-[#aaa]">
                  画像待機中
                </div>
              )}

            </div>

          </div>

        </div>
      </main>

      {zoomOpen && (
        <div
          onClick={() =>
            setZoomOpen(false)
          }
          className="
            fixed
            inset-0
            bg-black/80
            z-50
            flex
            items-center
            justify-center
          "
        >
          <img
            src={image}
            onClick={(e) =>
              e.stopPropagation()
            }
            className="
              max-w-[95vw]
              max-h-[95vh]
              object-contain
            "
          />
        </div>
      )}
    </>
  );
}