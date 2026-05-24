"use client";

import { useState } from "react";

export default function Home() {

  const [num,setNum]=useState("");
  const [image,setImage]=useState("");

  async function searchImage(){

    const response=await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/image/${num}`
    );

    const data=await response.json();

    if(data.image){

      setImage(
        `${process.env.NEXT_PUBLIC_SITE_URL}${data.image}`
      );

    }else{
      setImage("");
    }
  }

  return(

    <main className="min-h-screen bg-[#313338] flex">

      <div className="
      w-[72px]
      bg-[#1e1f22]
      flex
      flex-col
      items-center
      py-4
      ">

        <div className="
        w-[48px]
        h-[48px]
        rounded-2xl
        bg-[#5865F2]
        text-white
        flex
        items-center
        justify-center
        ">
          H
        </div>

      </div>

      <div className="
      flex-1
      flex
      justify-center
      items-center
      ">

        <div className="
        bg-[#2b2d31]
        p-8
        rounded-xl
        w-[700px]
        ">

          <h1 className="
          text-white
          text-3xl
          mb-5
          ">
            Hiyoko Tool
          </h1>

          <div className="flex gap-3">

            <input
              type="number"
              value={num}
              onChange={(e)=>setNum(e.target.value)}
              placeholder="数字入力"
              className="
              flex-1
              bg-[#1e1f22]
              text-white
              p-3
              rounded
              "
            />

            <button
              onClick={searchImage}
              className="
              bg-[#5865F2]
              px-5
              rounded
              text-white
              "
            >
              表示
            </button>

          </div>

          <div className="mt-8">

          {image ?

            <img
              src={image}
              className="
              rounded-xl
              w-full
              "
              alt=""
            />

            :

            <div
            className="
            h-[300px]
            bg-[#1e1f22]
            rounded-xl
            text-[#aaa]
            flex
            justify-center
            items-center
            "
            >
              画像待機中
            </div>

          }

          </div>

        </div>

      </div>

    </main>

  );

}