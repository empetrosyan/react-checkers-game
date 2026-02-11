import { useEffect, useState } from "react";

export default function Board() {
    const [board, setBoard] = useState<string[][]>([]);
    const [selected, setSelected] = useState<{ playeri: number, playerj: number } | null>(null);
    const [availableBox, setAvailableBox] = useState<string[] | null>(null);
    const [score, setScore] = useState<{ 'p1': number, 'p2': number }>({ 'p1': 0, 'p2': 0 });
    const [step, setStep] = useState<string>('p1');
    const [winner, setWinner] = useState<string | null>(null);

    useEffect(() => {
        createBoard();
    }, []);

    useEffect(() => {
        checkWinner();
    }, [board])

    const createBoard = () => {
        let arr: string[][] = [];
        for (let i = 0; i < 8; i++) {
            arr[i] = [];
            for (let j = 0; j < 8; j++) {
                if ((i === 0 || i === 1) && (i + j) % 2 === 1) {
                    arr[i][j] = 'p1';
                } else if ((i === 6 || i === 7) && (i + j) % 2 === 1) {
                    arr[i][j] = 'p2';
                } else {
                    arr[i][j] = '';
                }
            }
        }
        setBoard(arr);
    }

    const selectBox = (playeri: number, playerj: number, player: string) => {
        if (!player.includes(step)) return;

        setAvailableBox(null);
        const box = { playeri, playerj };
        setSelected(box);

        if (player.includes('king')) {
            handleAvailablesKing(playeri, playerj, player);
        } else {
            handleAvailables(playeri, playerj, player);
        }

    }

    const handleAvailablesKing = (playeri: number, playerj: number, player: string) => {
        const boxes = [] as string[];

        let stopLeft = false;
        let stopRight = false;
        let colLeft = playerj - 1;
        let colRight = playerj + 1;
        for (let rowUp = playeri - 1; rowUp > -1; rowUp--) {
            if (colLeft > -1 && !stopLeft) {
                if (board[rowUp][colLeft] &&
                    (player.includes(board[rowUp][colLeft]) ||
                        (board[rowUp + 1][colLeft + 1] && playeri !== rowUp + 1 && playerj !== colLeft + 1))) {
                    stopLeft = true;
                } else if (!board[rowUp][colLeft]) {
                    boxes.push(rowUp + '' + colLeft);
                }
                colLeft--;
            }

            if (colRight < 8 && !stopRight) {
                if (board[rowUp][colRight] &&
                    (player.includes(board[rowUp][colRight]) ||
                        (board[rowUp + 1][colRight - 1] && playeri !== rowUp + 1 && playerj !== colRight - 1))) {
                    stopRight = true;
                } else if (!board[rowUp][colRight]) {
                    boxes.push(rowUp + '' + colRight);
                }
                colRight++;
            }
        }

        stopLeft = false;
        stopRight = false;
        colLeft = playerj - 1;
        colRight = playerj + 1;
        for (let rowDown = playeri + 1; rowDown < 8; rowDown++) {
            if (!stopLeft) {
                if (board[rowDown][colLeft] &&
                    (player.includes(board[rowDown][colLeft]) ||
                        (board[rowDown - 1][colLeft + 1]) && playeri !== rowDown - 1 && playerj !== colLeft + 1)) {
                    stopLeft = true;
                } else if (!board[rowDown][colLeft]) {
                    boxes.push(rowDown + '' + colLeft);
                }
                colLeft--;
            }

            if (!stopRight) {
                if (board[rowDown][colRight] &&
                    (player.includes(board[rowDown][colRight]) ||
                        (board[rowDown - 1][colRight - 1] && playeri !== rowDown - 1 && playerj !== colRight - 1))) {
                    stopRight = true;
                } else if (!board[rowDown][colRight]) {
                    boxes.push(rowDown + '' + colRight);
                }
                colRight++;
            }
        }

        setAvailableBox(boxes);
    }

    const handleAvailables = (playeri: number, playerj: number, player: string) => {
        const boxes = [] as string[];

        const rowUp = playeri - 1;
        const rowDown = playeri + 1;
        const colLeft = playerj - 1;
        const colRight = playerj + 1;

        if (player === 'p1') {
            if (step === 'p2') return;

            if (rowDown !== 8 && colLeft !== -1) {
                if (!board[rowDown][colLeft]) {
                    boxes.push(rowDown + '' + colLeft);
                } else if (board[rowDown][colLeft].includes('p2')) {
                    if (((rowDown + 1) !== 8 && (colLeft - 1) !== -1) && !board[rowDown + 1][colLeft - 1]) {
                        boxes.push((rowDown + 1) + '' + (colLeft - 1));
                    }
                }
            }

            if (rowDown !== 8 && colRight !== 8) {
                if (!board[rowDown][colRight]) {
                    boxes.push(rowDown + '' + colRight);
                } else if (board[rowDown][colRight].includes('p2')) {
                    if (((rowDown + 1) !== 8 && (colRight + 1) !== 8) && !board[rowDown + 1][colRight + 1]) {
                        boxes.push((rowDown + 1) + '' + (colRight + 1));
                    }
                }
            }

        } else if (player === 'p2') {
            if (step === 'p1') return;

            if (rowUp !== -1 && colLeft !== -1) {
                if (!board[rowUp][colLeft]) {
                    boxes.push(rowUp + '' + colLeft);
                } else if (board[rowUp][colLeft].includes('p1')) {
                    if (((rowUp - 1) !== -1 && (colLeft - 1) !== -1) && !board[rowUp - 1][colLeft - 1]) {
                        boxes.push((rowUp - 1) + '' + (colLeft - 1));
                    }
                }
            }

            if (rowUp !== -1 && colRight !== 8) {
                if (!board[rowUp][colRight]) {
                    boxes.push(rowUp + '' + colRight);
                } else if (board[rowUp][colRight].includes('p1')) {
                    if (((rowUp - 1) !== -1 && (colRight + 1) !== 8) && !board[rowUp - 1][colRight + 1]) {
                        boxes.push((rowUp - 1) + '' + (colRight + 1));
                    }
                }
            }
        }

        setAvailableBox(boxes);
    }


    const handleStep = (boxi: number, boxj: number) => {
        if (!selected) return;

        const { playeri: playeri, playerj: playerj } = selected;
        let newBoard = board.map(row => [...row]);

        if (availableBox?.includes(boxi + '' + boxj)) {
            if ((board[playeri][playerj] === 'p1' && boxi === 7) || (board[playeri][playerj] === 'p2' && boxi === 0)) {
                newBoard[boxi][boxj] = board[playeri][playerj] + '/king';
            } else {
                newBoard[boxi][boxj] = board[playeri][playerj];
            }

            newBoard[playeri][playerj] = '';

            if (playeri - boxi > 1) {
                let colLeft = playerj - 1;
                let colRight = playerj + 1;
                for (let rowUp = playeri - 1; rowUp > boxi; rowUp--) {
                    if (playerj - boxj > 1) {
                        if (board[rowUp][colLeft]) {
                            board[playeri][playerj].includes('p1') ?
                                setScore(prev => ({ p1: prev.p1 + 1, p2: prev.p2 })) :
                                setScore(prev => ({ p1: prev.p1, p2: prev.p2 + 1 }));
                            newBoard[rowUp][colLeft] = '';
                        }
                        colLeft--;
                    } else if (boxj - playerj > 1) {
                        if (board[rowUp][colRight]) {
                            board[playeri][playerj].includes('p1') ?
                                setScore(prev => ({ p1: prev.p1 + 1, p2: prev.p2 })) :
                                setScore(prev => ({ p1: prev.p1, p2: prev.p2 + 1 }));
                            newBoard[rowUp][colRight] = '';
                        }
                        colRight++;
                    }
                }
            } else if (boxi - playeri > 1) {
                let colLeft = playerj - 1;
                let colRight = playerj + 1;
                for (let rowDown = playeri + 1; rowDown < boxi; rowDown++) {
                    if (playerj - boxj > 1) {
                        if (board[rowDown][colLeft]) {
                            board[playeri][playerj].includes('p1') ?
                                setScore(prev => ({ p1: prev.p1 + 1, p2: prev.p2 })) :
                                setScore(prev => ({ p1: prev.p1, p2: prev.p2 + 1 }));
                            newBoard[rowDown][colLeft] = '';
                        }
                        colLeft--;
                    } else if (boxj - playerj > 1) {
                        if (board[rowDown][colRight]) {
                            board[playeri][playerj].includes('p1') ?
                                setScore(prev => ({ p1: prev.p1 + 1, p2: prev.p2 })) :
                                setScore(prev => ({ p1: prev.p1, p2: prev.p2 + 1 }));
                            newBoard[rowDown][colRight] = '';
                        }
                        colRight++;
                    }
                }
            }

            board[playeri][playerj].includes('p1') ? setStep('p2') : setStep('p1');
        }

        setBoard(newBoard);
        setSelected(null);
    }

    const checkWinner = () => {
        if (score.p1 === 8) setWinner('Player 1');
        else if (score.p2 === 8) setWinner('Player 2');
    }

    const restartGame = () => {
        setWinner(null);
        setSelected(null);
        setScore({ 'p1': 0, 'p2': 0 });
        setStep('p1');
        createBoard();
    }

    return <div className="Board w-full h-full flex flex-col justify-between items-center relative ">
        <div className="w-full h-full flex flex-col justify-center">
            <div className=" flex justify-between px-6 py-4 md:px-8 text-xl md:text-2xl text-shadow-md">
                {step === 'p1' && <p className=" font-bold">Your Turn Player 1!</p>}
                <p className=" ml-auto"><strong>Score:</strong> {score?.p1} </p>
            </div>
            <table className=" w-90 h-90 sm:w-110 sm:h-110 md:w-115 md:h-115 border mx-auto bg-yellow-600">
                <tbody>
                    {board.map((row, i) => <tr key={i}>
                        {row.map((box, j) => <td key={`${i}-${j}`}
                            className={` ${(i + j) % 2 === 1 ? "bg-linear-30 from-yellow-900 via-yellow-950 to-yellow-950 shadow-md rounded-xs" : ""}
                        ${(selected && availableBox?.includes(i + '' + j)) ? "focus ring-2 rounded cursor-pointer" : ""}`}
                            onClick={() => { box ? selectBox(i, j, box) : handleStep(i, j) }}>
                            {box ? <div
                                className={` w-10 h-10 rounded-[50%] mx-auto cursor-pointer flex items-center shadow-sm  
                                ${box.includes('p1') ? "shadow-red-950 bg-linear-to-tr from-red-600 via-red-700 to-red-950" : "shadow-gray-950 bg-linear-to-tr from-neutral-700 via-neutral-800 to-neutral-950"}`}>
                                <div className={` w-6 h-6 rounded-[50%] mx-auto cursor-pointer shadow-inner relative flex justify-center 
                                    ${box.includes('p1') ? "shadow-red-950" : "shadow-gray-950"}`}>
                                    {box.includes('king') && <p className={`font-bold ${box.includes('p1') ? "text-gray-900" : "text-red-800"}`} >K</p>}
                                    {(selected && selected.playeri === i && selected.playerj === j && availableBox) &&
                                        <div className="w-0 h-0 border-t-25 border-t-neutral-300 border-l-8 border-l-transparent border-r-8 border-r-transparent absolute bottom-3"></div>
                                    }
                                </div>
                            </div> : <div className={`w-10 h-10 mx-auto`}></div>}
                        </td>)}
                    </tr>)}
                </tbody>
            </table>
            <div className=" flex justify-between px-6 py-4 md:px-8 text-xl md:text-2xl text-shadow-md">
                {step === 'p2' && <p className=" font-bold">Your Turn Player 2!</p>}
                <p className=" ml-auto"><strong>Score:</strong> {score?.p2} </p>
            </div>
        </div>
        {winner && <div className=" absolute w-full h-full bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-8 shadow-lg rounded-xl">
            <div className=" flex items-center gap-3 text-xl sm:text-2xl font-bold px-3 whitespace-nowrap text-shadow-md animate-bounce">
                <p className=" text-2xl sm:text-3xl py-2 text-yellow-200"> {winner} win the game!!!  </p>
                <div className={` w-10 h-10 rounded-[50%] flex items-center shadow-sm                                
                        ${step === 'p2' ? "shadow-red-950 bg-linear-to-tr from-red-600 via-red-700 to-red-950" : "shadow-gray-950 bg-linear-to-tr from-neutral-700 via-neutral-800 to-neutral-950"}`}>
                    <div className={` w-6 h-6 rounded-[50%] mx-auto shadow-inner 
                            ${step === 'p2' ? "shadow-red-950" : "shadow-gray-950"}`}>
                    </div>
                </div>
            </div>
            <button className="bg-linear-to-br from-red-700 via-red-800 to-red-950 px-6 py-1 cursor-pointer rounded-lg hover:scale-105 transition-all duration-200 text-lg font-semibold shadow-lg "
                onClick={restartGame}>Restart</button>
        </div>}
    </div>
}