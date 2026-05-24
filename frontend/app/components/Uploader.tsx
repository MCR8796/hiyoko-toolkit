"use client";

import { useState } from "react";

export default function Uploader() {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [conflictImage, setConflictImage] = useState<string | null>(null);
  const [mode, setMode] = useState<"input" | "confirm">("input");

  /**
   * 文字チェック
   */
  function validate(text: string) {
    if (!text.trim()) return false;
    return true;
  }

  /**
   * 名前チェック
   */
  async function checkName() {
    if (!validate(name)) {
      alert("空・スペースはNG");
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/check-name`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      }
    );

    const data = await res.json();

    if (data.exists) {
      setConflictImage(
        `${process.env.NEXT_PUBLIC_SITE_URL}${data.image}`
      );
      setMode("confirm");
    } else {
      upload();
    }
  }

  /**
   * アップロード
   */
  async function upload() {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
      method: "POST",
      body: formData
    });

    alert("アップロード完了");

    setName("");
    setFile(null);
    setMode("input");
  }

  if (mode === "confirm") {
    return (
      <div className="bg-[#2b2d31] p-6 rounded-xl text-white w-[500px]">

        <h1 className="mb-4">上書き確認</h1>

        {conflictImage && (
          <img src={conflictImage} className="mb-4 rounded" />
        )}

        <p>同じ名前の画像があります。上書きしますか？</p>

        <div className="flex gap-2 mt-4">
          <button
            onClick={upload}
            className="bg-red-500 px-4 py-2 rounded"
          >
            上書きOK
          </button>

          <button
            onClick={() => setMode("input")}
            className="bg-gray-500 px-4 py-2 rounded"
          >
            戻る
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className="bg-[#2b2d31] p-6 rounded-xl text-white w-[500px]">

      <h1 className="text-xl mb-4">Uploader</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="画像名"
        className="mb-3 w-full p-2 bg-[#1e1f22]"
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <button
        onClick={checkName}
        className="bg-[#5865F2] px-4 py-2 rounded"
      >
        アップロード
      </button>

    </div>
  );
}