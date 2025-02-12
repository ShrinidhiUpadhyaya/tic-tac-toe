import { useState } from "react";
import { Button } from "./components/ui/button";

type Player = "X" | "O";
type Winner = Player | "draw" | null;

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [7, 8, 9],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 7],
  [2, 4, 6],
];

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<Winner>(null);
  const [winningLine, setWinningLine] = useState([]);
  const [history, setHistory] = useState<Array<Array<string | null>>>([
    Array(9).fill(null),
  ]);

  const [currentMove, setCurrentMove] = useState(0);

  const handleClick = (index: number) => {
    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";

    const newHistory = history.slice(0, currentMove + 1);
    newHistory.push(newBoard);

    console.log(currentMove);

    setBoard(newBoard);
    setIsXNext(!isXNext);
    setHistory(newHistory);
    setCurrentMove(newHistory.length - 1);
    checkWinner(newBoard);
  };

  const checkWinner = (board) => {
    for (const [a, b, c] of WINNING_COMBINATIONS) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        setWinningLine([a, b, c]);
      }
    }

    if (board.every((value) => value !== null)) {
      setWinner("draw");
    }
  };

  const gameStatus = () => {
    if (winner === "draw") {
      return "The game is draw";
    }

    if (winner) {
      return `Winner is ${winner}`;
    }

    return `Next Player: ${isXNext ? "X" : "O"}`;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsXNext(true);
  };

  const undoMove = () => {
    const move = currentMove - 1;
    setCurrentMove(move);
    setBoard(history[move]);
    setIsXNext(move % 2 === 0);
    setWinner(null);
    setWinningLine([]);
  };

  return (
    <div className="w-svw">
      <h1>Tic Tac Toe</h1>
      <h2>{gameStatus()}</h2>
      <div className="grid grid-cols-3 w-1/2 gap-2">
        {board.map((value, index) => (
          <div
            className={`border-2 border-gray-600 h-24 rounded-md flex items-center justify-center font-extrabold text-5xl ${
              winningLine.includes(index) && "bg-green-600"
            }`}
            onClick={() => handleClick(index)}
          >
            {" "}
            {value}{" "}
          </div>
        ))}
      </div>

      <div className="gap-4 flex">
        <Button onClick={() => resetGame()}>Reset</Button>
        <Button onClick={() => undoMove()}>Undo Move</Button>
      </div>

      <div className="mt-4 w-full">
        <h3 className="text-sm font-medium mb-2">Move History:</h3>
        <div className="flex flex-wrap gap-2">
          {history.map((_, move) => (
            <Button
              key={move}
              onClick={() => undoMove(move)}
              variant="ghost"
              size="sm"
              className={
                currentMove === move ? "bg-blue-100" : "bg-transparent"
              }
            >
              {move === 0 ? "Start" : `Move ${move}`}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
