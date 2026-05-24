"use client";

import { useState } from "react";
import Viewer from "./components/Viewer";
import Uploader from "./components/Uploader";

export default function Home() {
  const [mode, setMode] = useState<"viewer" | "uploader">("viewer");

  return (
    <main className="h-screen w-screen flex bg-[#313338] overflow-hidden">

      {/* サイドバー */}
      <div className="w-[72px] bg-[#1e1f22] flex flex-col items-center py-4 gap-3">

        <button
          onClick={() => setMode("viewer")}
          className={`w-[48px] h-[48px] rounded-2xl flex items-center justify-center text-white ${
            mode === "viewer" ? "bg-[#5865F2]" : "bg-[#2b2d31]"
          }`}
        >
          V
        </button>

        <button
          onClick={() => setMode("uploader")}
          className={`w-[48px] h-[48px] rounded-2xl flex items-center justify-center text-white ${
            mode === "uploader" ? "bg-[#5865F2]" : "bg-[#2b2d31]"
          }`}
        >
          U
        </button>

      </div>

      {/* メイン */}
      <div className="flex-1 flex justify-center items-center min-h-0 p-4">

        {mode === "viewer" ? <Viewer /> : <Uploader />}

      </div>

    </main>
  );
}