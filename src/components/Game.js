import React, { Component } from "react";
import Board from "./Board";
import Modal from "@material-ui/core/Modal";
import draw from "../static/draw.gif";

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      xIsNext: true,
      stepNumber: 0,
      history: [{ squares: Array(9).fill(null) }],
      showModal: false,
    };
  }

  openDialog() {
    this.setState({ showModal: true });
  }

  jumpTo = (step) => {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  };

  reset = () => {
    this.jumpTo(0);
    this.setState({
      history: [{ squares: Array(9).fill(null) }],
    });
  };

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const winner = calculateWinner(squares);
    if (winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat({
        squares: squares,
      }),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  listOfMoves = (move, desc) => {
    return (
      <li key={move}>
        <button
          onClick={() => {
            this.jumpTo(move);
          }}
        >
          {desc}
        </button>
      </li>
    );
  };

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ? "Undo step" + move : "Start the Game";
      return this.listOfMoves(move, desc);
    });
    let status;
    if (winner) {
      status = "Winner is " + winner;
    } else {
      status = "Next Player is " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            onClick={(i) => this.handleClick(i)}
            squares={current.squares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ul>{moves}</ul>
        </div>
        <Modal open={winner} className="modal">
          <div className="modal-content">
            <h1>{winner === "draw" ? `Draw` : `Winner is ${winner}`}</h1>
            <img
              src={
                winner === "draw"
                  ? draw
                  : "https://media.giphy.com/media/yoJC2JaiEMoxIhQhY4/giphy.gif"
              }
            />
            <button onClick={() => this.reset()}>Re Start</button>
          </div>
        </Modal>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return squares[a];
    }
    const filled = squares.filter((cell) => cell);
    if (filled.length === 9) {
      return "draw";
    }
  }

  return null;
}

export default Game;
