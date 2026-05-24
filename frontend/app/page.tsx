{/* 画像 */}
<div className="mt-4 flex-1 flex items-center justify-center">

  {loading ? (
    <div className="w-full h-full bg-[#1e1f22] rounded animate-pulse" />
  ) : image ? (
    <div className="w-full h-full flex items-center justify-center bg-[#1e1f22] rounded overflow-hidden">
      <img
        src={image}
        className="max-h-full max-w-full object-contain"
      />
    </div>
  ) : (
    <div className="w-full h-full flex items-center justify-center text-[#aaa]">
      画像待機中
    </div>
  )}

</div>