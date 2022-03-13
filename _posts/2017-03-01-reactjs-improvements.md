---
layout: post
title: ReactJs improvements after tutorial 
tags:
- reactjs  
- tutorials 
excerpt: The 5 answers of office reactjs tutorials 
---

## Questions
1. Display the move locations in the format "(1, 3)" instead of "6".
2. Bold the currently-selected item in the move list.
3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
4. Add a toggle button that lets you sort the moves in either ascending or descending order.
5. When someone wins, highlight the three squares that caused the win.

## Answers
{% highlight javascript linenos %}
  import React from 'react';// eslint-disable-line no-unused-vars
  import ReactDOM from 'react-dom';
  //import App from './App';
  import './App.css';

  // remeber props in normal func does not need this
  function Square(props) {
    const className = props.winner ? 'square winner' : 'square';
    return (
      <button className={className} onClick={()=>props.onClick()}>
      {props.value}
      </button>
    );
  }
  Square.propTypes = {
    value: React.PropTypes.string,
    winner: React.PropTypes.bool,
    onClick: React.PropTypes.func
  };


  class Board extends React.Component {
    constructor() {
      super();
      this.state = {
        rows: 3,
        columns: 3,
      };
    }
    /*
      render Square
      @param number
    */
    renderSquare(i) {
      // includes() not []
      return <Square winner={this.props.winner.includes(i) } key={i} value={this.props.squares[i]} onClick={()=>this.props.onClick(i)} />;
    }
    render() {
      let rows = [];
      let cells = [];
      let cellNumber = 0;
      for(let i = 0, l = this.state.rows; i < l; i++) {
        for(let j =0, k = this.state.columns; j < k; j++) {
          cells.push(this.renderSquare(cellNumber));
          cellNumber++;
        }
        rows.push(<div key={i} className="board-row">{cells}</div>);
        cells = [];
      }
      return (
        <div>
          {rows}
        </div>
      );
    }
  }

  Board.propTypes = {
    squares: React.PropTypes.array,
    winner: React.PropTypes.array,
    onClick: React.PropTypes.func,
  };

  class Game extends React.Component {
    constructor() {
      super();
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          move: null,
          xIsNext: true,
          when: Date.now(),
          location: null,
        }],
        isAscend:true,
        stepNumber: 0,
      };
    }
    handleToggle() {
      this.setState({
        isAscend: !this.state.isAscend
      });
    }
    jumpTo(step) {
      this.setState({
        stepNumber: step,
      });
    }
    isActive(value) {
      return value === this.state.selected ? 'active' : ''; 
    }
    handleClick(i) {
      const history = this.state.history.slice(0,this.state.stepNumber+1) ;
      const current = history[history.length -1];
      const squares = current.squares.slice();
      if(calculateWinner(squares) || squares[i]) {
        return;
      }
      const xIsNext = current.xIsNext;
      squares[i] = xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat({
          squares:squares,
          xIsNext: !xIsNext,
          move: {player:squares[i], location: i},
          when: Date.now(),
        }),
        stepNumber: history.length,
      });
    }
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares) || [];

      let status;
      if(winner.length!==0) {
        // get first ele by current.squares[winner[0]]
        status = 'Winner: ' + current.squares[winner[0]]; 
      } else {
        status = 'Next player: '+(current.xIsNext ? 'X' : 'O');
      }

      const moves = history.map((step, i)=>{
        const [row, column] = step.move ? getHumanReadableLocation(step.move.location) : [null, null];
        const desc = step.move ? 
          step.move.player + ' played at (' + row +',' + column + ')' :
          'Game Start';
        const isCurrentMove = i === this.state.stepNumber;
        const className = isCurrentMove ? 'active' : '';
        return (
          <li  key={step.when}>
            <a className={className} href="#" onClick={()=>this.jumpTo(i)}>{desc}</a>
          </li>
        );
      });

      return (
        <div className="game">
        <div className="game-board">
        <Board squares={current.squares}
        winner={winner}
        onClick={(i)=>this.handleClick(i)} />
        </div>
        <div className="game-info">
        <button onClick={()=>this.handleToggle()}>{this.state.isAscend ? 'ASCEND' : 'DESCEND'}</button>
        <div>{status}</div>
        <ol >{this.state.isAscend ? moves : moves.reverse()}</ol>
        </div>
        </div>
      );
    }
  }

  // ========================================

  ReactDOM.render(
    <Game />,
    document.getElementById('container')
  );

  /*
    calculate winer
    @param Array
    @return Array
  */
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
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        //return squares[a];
        return lines[i];
      }
    }
    return null;
  }
  // converts from 0-8 to (1,1)-(3,3)
  function getHumanReadableLocation(inputLocation) {
    const location = inputLocation + 1;
    var row = Math.ceil(location / 3);
    var column = location % 3;
    if (column === 0) {
      column = 3;
    }
    
    return [row, column];
  }
{% endhighlight %}


