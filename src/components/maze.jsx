import React, { Component } from "react";
import Square from "./square";

const SIZE = 25;
const START = 0;
const END = SIZE * SIZE - 1;

class Maze extends Component {
  state = {
    squares: [],
    starting_id: -1,
    square_id_on: -1,
    lastkey: "",
  };

  constructor(props) {
    super(props);
    this.state.squares = this.fillMaze(SIZE);
  }

  /*Takes in an arrow key action and creates a path */
  followPath = (direction) => {
    const square_id = this.state.square_id_on;
    if (this.props.gameComplete) {
      return;
    }
    if (direction === "ArrowRight") {
      if (square_id % SIZE === SIZE - 1) {
        return;
      }
      if (this.state.lastkey === "ArrowLeft") {
        this.renderSquare(square_id);
      } else {
        this.renderSquare(square_id + 1);
      }
    } else if (direction === "ArrowLeft") {
      if (square_id % SIZE === 0) {
        return;
      }
      if (this.state.lastkey === "ArrowRight") {
        this.renderSquare(square_id);
      } else {
        this.renderSquare(square_id - 1);
      }
    } else if (direction === "ArrowDown") {
      if (this.state.lastkey === "ArrowUp") {
        this.renderSquare(square_id);
      } else {
        this.renderSquare(square_id + SIZE);
      }
    } else if (direction === "ArrowUp") {
      if (this.state.lastkey === "ArrowDown") {
        this.renderSquare(square_id);
      } else {
        this.renderSquare(square_id - SIZE);
      }
    }
    this.setState({ lastkey: direction });
  };

  /* Saves starting position */
  renderStart = () => {
    if (this.state.starting_id === -1) {
      const square_id = START;
      this.setState({ starting_id: square_id });
      this.renderSquare(square_id);
    }
  };

  /* initialize maze */
  fillMaze = (size) => {
    var maze = [];
    var counter = 0;
    for (var i = 0; i < size; i++) {
      var row = [];
      for (var j = 0; j < size; j++) {
        row.push({
          id: counter,
          traveled: false,
          isWall: true,
          isComplete: false,
        });
        counter++;
      }
      maze.push(row);
    }
    return maze;
  };

  renderSquare = (s) => {
    if (s > SIZE * SIZE - 1 || s < 0) {
      return;
    }
    const row = parseInt(s / SIZE);
    const col = parseInt(s % SIZE);
    const new_state = this.state.squares;
    if (new_state[row][col].isWall) {
      return;
    }
    if (s !== this.state.starting_id) {
      new_state[row][col].traveled = !new_state[row][col].traveled;
    }
    this.setState(new_state);
    document.getElementById(s).focus();
    this.props.isComplete(s);
    this.setState({ square_id_on: s });
  };

  /* pathMaker helper function, look for valid UNVISITED sides*/

  checkVisitedSides = (maze, id_on) => {
    var row = parseInt(id_on / SIZE);
    var col = id_on % SIZE;
    var out = [];
    if (id_on < SIZE * SIZE && id_on >= 0) {
      if (col + 2 < SIZE && !maze[row][col + 2].isWall) {
        out.push(maze[row][col + 2]);
      }
      if (col - 2 >= 0 && !maze[row][col - 2].isWall) {
        out.push(maze[row][col - 2]);
      }
      if (row + 2 < SIZE && !maze[row + 2][col].isWall) {
        out.push(maze[row + 2][col]);
      }
      if (row - 2 >= 0 && !maze[row - 2][col].isWall) {
        out.push(maze[row - 2][col]);
      }
    }
    return out;
  };

  checkUnvisitedSides = (maze, id_on) => {
    var row = parseInt(id_on / SIZE);
    var col = id_on % SIZE;
    var out = [];
    if (id_on < SIZE * SIZE && id_on >= 0) {
      if (col + 2 < SIZE && maze[row][col + 2].isWall) {
        out.push(maze[row][col + 2]);
      }
      if (col - 2 >= 0 && maze[row][col - 2].isWall) {
        out.push(maze[row][col - 2]);
      }
      if (row + 2 < SIZE && maze[row + 2][col].isWall) {
        out.push(maze[row + 2][col]);
      }
      if (row - 2 >= 0 && maze[row - 2][col].isWall) {
        out.push(maze[row - 2][col]);
      }
    }
    return out;
  };

  ResetMaze = () => {
    this.setState(() => {
      return {
        squares: this.fillMaze(SIZE),
        starting_id: -1,
        square_id_on: -1,
        lastkey: "",
      };
    });
  };

  /* Creates a maze */
  pathMaker = (start_id, end_id) => {
    const maze = this.state.squares;
    var row = parseInt(start_id / SIZE);
    var col = start_id % SIZE;
    var unused = [];
    maze[row][col].isWall = false;
    var walls = this.checkUnvisitedSides(maze, start_id);
    unused = unused.concat(walls);
    var end_row = parseInt(end_id / SIZE);
    var end_col = end_id % SIZE;
    while (maze[end_row][end_col].isWall) {
      const wall_index = Math.round(Math.random() * (unused.length - 1));
      const wall_on = unused[wall_index];
      const neighbors = this.checkVisitedSides(maze, wall_on.id);
      const neighbor_index = Math.round(Math.random() * (neighbors.length - 1));
      const neighbor_on = neighbors[neighbor_index];
      const passage_id = (wall_on.id + neighbor_on.id) / 2;
      row = parseInt(passage_id / SIZE);
      col = passage_id % SIZE;
      maze[row][col].isWall = false;
      row = parseInt(wall_on.id / SIZE);
      col = wall_on.id % SIZE;
      maze[row][col].isWall = false;
      unused = unused.concat(this.checkUnvisitedSides(maze, wall_on.id));
      unused.splice(wall_index, 1);
    }
    this.increaseDifficulty(maze, start_id, end_id);
    this.setState({ squares: maze });
    this.renderStart();
  };

  increaseDifficulty = (maze, start_id, end_id) => {
    const used = new Set();
    for (var count = 0; count < SIZE * SIZE; count++) {
      const i = Math.round(Math.random() * (SIZE - 1));
      const j = Math.round(Math.random() * (SIZE - 1));
      if (
        maze[i][j].id === start_id ||
        maze[i][j].id === end_id ||
        used.has(maze[i][j].id)
      ) {
        continue;
      }
      used.add(maze[i][j].id);
      if (!maze[i][j].isWall) {
        maze[i][j].isWall = true;
        if (!this.verifySolution(maze, start_id, end_id, false)) {
          maze[i][j].isWall = false;
          count--;
        }
      } else {
        var wall_neighbors = 0;
        if (i - 1 >= 0) {
          wall_neighbors += maze[i - 1][j].isWall;
        }
        if (i + 1 < SIZE) {
          wall_neighbors += maze[i + 1][j].isWall;
        }
        if (j - 1 >= 0) {
          wall_neighbors += maze[i][j - 1].isWall;
        }
        if (j + 1 < SIZE) {
          wall_neighbors += maze[i][j + 1].isWall;
        }
        if (wall_neighbors === 3) {
          maze[i][j].isWall = false;
          if (!this.verifySolution(maze, start_id, end_id, false)) {
            maze[i][j].isWall = true;
            count--;
          }
        }
      }
    }
  };

  verifySolution = (maze, start_id, end_id, show_solution) => {
    var row = parseInt(start_id / SIZE);
    var col = start_id % SIZE;
    const stack = [];
    stack.push(maze[row][col].id);
    const visited = new Set();
    while (stack.length !== 0) {
      const node = stack.pop();
      row = parseInt(node / SIZE);
      col = node % SIZE;
      visited.add(maze[row][col].id);
      if (
        col + 1 < SIZE &&
        !maze[row][col + 1].isWall &&
        !visited.has(maze[row][col + 1].id)
      ) {
        stack.push(maze[row][col + 1].id);
      }
      if (
        col - 1 >= 0 &&
        !maze[row][col - 1].isWall &&
        !visited.has(maze[row][col - 1].id)
      ) {
        stack.push(maze[row][col - 1].id);
      }
      if (
        row + 1 < SIZE &&
        !maze[row + 1][col].isWall &&
        !visited.has(maze[row + 1][col].id)
      ) {
        stack.push(maze[row + 1][col].id);
      }
      if (
        row - 1 >= 0 &&
        !maze[row - 1][col].isWall &&
        !visited.has(maze[row - 1][col].id)
      ) {
        stack.push(maze[row - 1][col].id);
      }
    }
    var count = 0;
    for (var i = 0; i < SIZE; i++) {
      for (var j = 0; j < SIZE; j++) {
        if (!maze[i][j].isWall) {
          count++;
        }
      }
    }
    if (show_solution) {
      return visited.has(end_id);
    } else {
      return visited.has(end_id) && count === visited.size;
    }
  };

  showSolution = (start_id, end_id) => {
    const maze = this.state.squares;
    for (var i = 0; i < SIZE; i++) {
      for (var j = 0; j < SIZE; j++) {
        if (maze[i][j].id === start_id) {
          continue;
        }
        maze[i][j].isWall = true;
        if (!this.verifySolution(maze, start_id, end_id, true)) {
          maze[i][j].isWall = false;
        }
      }
    }
    this.setState({ squares: maze });
  };

  renderRestart = () => {
    if (parseInt(document.activeElement.id) === START) {
      this.setState({ square_id_on: START });
      document.getElementById(START).focus();
    }
  };

  render() {
    return (
      <div id="maze" class="p-3 mb-2 bg-dark text-white main">
        {this.state.squares.map((row) => {
          return row.map((square) => (
            <Square
              key={square.id}
              id={square.id}
              isStart={square.id === START}
              isEnd={square.id === END}
              isComplete={this.state.square_id_on === END}
              isWall={square.isWall}
              traveled={square.traveled}
              squareOn={this.state.square_id_on}
              onMove={(key) => this.followPath(key)}
              onClick={this.renderRestart}
            />
          ));
        })}
        <button
          id="clear-maze"
          onClick={this.ResetMaze}
          type="button"
          class="btn btn-warning"
        >
          Clear Maze
        </button>
        <button
          id="create-maze"
          onClick={() => this.pathMaker(0, SIZE * SIZE - 1)}
          type="button"
          class="btn btn-danger"
        >
          Create Maze
        </button>
        <button
          id="show-solution"
          onClick={() => this.showSolution(0, SIZE * SIZE - 1)}
          type="button"
          class="btn btn-success"
        >
          Show Solution
        </button>
      </div>
    );
  }
}

export default Maze;
