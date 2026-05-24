"use client";

import Viewer from "./components/Viewer";

export default function Home() {
  return (
    <main className="h-screen w-screen flex bg-[#313338] overflow-hidden">
      <div className="flex-1 flex justify-center items-center p-4">
        <Viewer />
      </div>
    </main>
  );
}