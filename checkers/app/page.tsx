'use client'
import Board from "@/components/Board";
import { useState } from "react"

export default function Home() {
  const [start, setStart] = useState(false);


  return <div className="Home bg-linear-to-br from-emerald-900 via-emerald-950 to-black w-full h-full flex flex-col items-center justify-center gap-4 ">
    <h1 className=" text-6xl sm:text-7xl font-bold text-yellow-500 text-shadow-lg">Checkers</h1>
    <div className=" w-100 sm:w-120 md:w-130 h-130 sm:h-150 md:h-155 bg-linear-to-br from-yellow-500 via-yellow-600 to-yellow-800 flex flex-col items-center justify-center rounded-2xl shadow-lg shadow-neutral-800 relative">
      {!start && <div className=" h-full flex flex-col justify-center items-center sm:gap-8">
        <div className="bg-amber-300/20 sm:px-6 sm:py-9 px-4 py-7 m-5 rounded-md shadow-xl">
          <p className="font-semibold text-center md:text-lg">Checkers is a classic strategy game where two players take turns moving their pieces. The goal is to capture all of your opponent’s pieces or block them so they cannot make any moves.</p>
          <br />
          <ul className=" text-sm md:text-[16px]">
            <li><strong>Start –</strong>  The game begins with Player 1 (red pieces).</li>
            <li><strong>Moves –</strong>  Pieces move diagonally forward, one square at a time.</li>
            <li><strong>Capturing –</strong>  If an opponent’s piece is next to yours and the square behind it is empty, you can “jump” over and capture it.</li>
            <li><strong>King –</strong> When a piece reaches the opposite side of the board, it becomes a king and can move both forward and backward.</li>
          </ul>
          <br />
          <p className=" text-center text-sm md:text-[16px]">This game requires careful planning, patience, and strategy. Every move can change the flow of the match, so players must think ahead and anticipate their opponent’s next steps.</p>
        </div>
        <button
          className=" bg-linear-to-br from-emerald-800 via-emerald-900 to-emerald-950 sm:px-8 sm:py-2 px-6 py-1 cursor-pointer rounded-lg hover:scale-105 transition-all duration-200 sm:text-xl text-lg font-semibold shadow-lg"
          onClick={() => setStart(true)}
        >Start!</button>
      </div>}
      {start && <Board />}
    </div>
  </div>
}
