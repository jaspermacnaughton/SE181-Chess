const MoveStatus = {
  SUCCESS: 'Success',
  SUCCESS_CHECK: 'SuccessCheck',
  INVALID: 'Invalid',
  BLACK_WIN: 'BlackWin',
  WHITE_WIN: 'WhiteWin',
  STALE_MATE: 'StaleMate',
  PROMOTION_REQUIRED: 'PromotionRequired'
};
const Players = {
  WHITE: {
    COLOR: 0,
    PAWN: '&#9817;',
    KNIGHT: '&#9816;',
    BISHOP: '&#9815;',
    ROOK: '&#9814;',
    QUEEN: '&#9813;',
    KING: '&#9812;'
  },
  BLACK: {
    COLOR: 1,
    PAWN: '&#9823;',
    BISHOP: '&#9821;',
    ROOK: '&#9820;',
    KNIGHT: '&#9822;',
    QUEEN: '&#9819;',
    KING: '&#9818;'
  }
};
const Direction = {
  RIGHT: [0, 1],
  LEFT: [0, -1],
  UP: [1, 0],
  DOWN: [-1, 0]
};
class Location {

  constructor(row, col) {
    this.row = row;
    this.col = col;
  }

  set(row, col) {
    this.row = row;
    this.col = col;
  }

  get() {
    return [this.row, this.col];
  }

  get_human_readable() {
    var col_char = String.fromCharCode(this.col + 64);
    return col_char + (this.row + 1).toString();
  }

  get_new_loc(directions) {
    if (directions[0].length === undefined) {
      directions = [directions];
    }
    var new_row = this.row;
    var new_col = this.col;

    for (var index = 0; index < directions.length; index++) {
      new_row = new_row + directions[index][0];
      new_col = new_col + directions[index][1];
    }
    return new Location(new_row, new_col);
  }

  isEqual(loc) {
    var [row2, col2] = loc.get();
    if (this.row === row2 && this.col === col2) {
      return true;
    }
    return false;
  }

}
class GameState {

  constructor(board, players, current_player) {
    this.board = board;
    this.players = players;
    this.current_player = current_player;
  }

  restart() {
    this.board = this.constructor.default_board();
    this.current_player = Players.WHITE.COLOR;
    return MoveStatus.SUCCESS;
  }

  get_curr_player() {
    return this.current_player;
  }

  get_curr_board() {
    return this.board;
  }

  // Just check if there are any valid moves for a player?
  // If none then check if current player is in check then they lost
  // Else it's a stalemate?
  game_over() {
    var row, col;
    var attacked_positions;
    var current_player_king;
    var has_valid_moves = false;
    for (row = 0; row < this.board.length; row++) {
      for (col = 0; col < this.board[0].length; col++) {
        var piece = this.board[row][col];
        if (piece === null) {
          continue;
        }

        if (piece.get_color() === this.current_player) {
          if (piece instanceof King) {
            current_player_king = new Location(row, col);
          }
          if (piece.get_moves(this).length !== 0) {
            //TODO something
            has_valid_moves = true;
          }
        } else {
          attacked_positions.concat(piece.get_moves(this));
        }
      }
    }
    if (!has_valid_moves && attacked_positions.indexOf(current_player_king) !== -1) {
      // Checkmate
      if (this.current_player === Players.WHITE.COLOR) {
        return MoveStatus.BLACK_WIN;
      } else {
        return MoveStatus.WHITE_WIN;
      }
    }
    return MoveStatus.SUCCESS;
  }

  //TODO: add promotion logic
  //      check for check
  play_move(start, end, promotion) {
    var piece = this.get_piece_on_board(start);
    if (end.indexOf(end) !== -1) {
      if (piece instanceof Pawn && (piece.get_end_row() === end.get()[0])) {
        return MoveStatus.PROMOTION_REQUIRED;
      }
      this.swap_locations(start, end);
      piece.set_location(end);
      if (promotion !== null) {
        var success = this.promote_piece(promotion, end);
        if (!success){
            return MoveStatus.INVALID;
        }
      }
      this.current_player = !this.current_player;
      // 1 goes to 0 and 0 goes to 1 which are the color representations
      return MoveStatus.SUCCESS;
    }

    return MoveStatus.INVALID;
  }

  promote_piece(promotion, loc) {
    var piece = this.get_piece_on_board(loc);
    var new_piece = null;
    switch (promotion) {
      case 'Knight':
        new_piece = new Knight(piece.get_color(), loc);
        break;
      case 'Rook':
        new_piece = new Rook(piece.get_color(), loc);
        break;
      case 'Bishop':
        new_piece = new Bishop(piece.get_color(), loc);
        break;
      case 'Queen':
        new_piece = new Queen(piece.get_color(), loc);
        break;
    }
    return this.set_piece_on_board(new_piece, loc);
  }

  set_piece_on_board(piece, loc) {
    var [row, col] = loc.get();
    if (row < 0 || col < 0 || row > (this.board.length - 1) || col > (this.board.length - 1)) {
      return false;
    }
    this.board[row][col] = piece;
    return true;
  }

  get_piece_on_board(loc) {
    var [row, col] = loc.get();
    if (row < 0 || col < 0 || row > (this.board.length - 1) || col > (this.board.length - 1)) {
        return undefined;
    }
    return this.board[row][col];
  }

  get_empty_loc_along_dir(curr_loc, dir) {
    var empty_locations = [];
    var loc = curr_loc.get_new_loc(dir);
    while (this.get_piece_on_board(loc) === null) {
      empty_locations.push(loc);
      loc = loc.get_new_loc(dir);
    }
    return empty_locations;
  }

  swap_locations(loc1, loc2) {
    var tmp = this.board[loc1.row][loc1.col];
    this.board[loc1.row][loc1.col] = this.board[loc2.row][loc2.col];
    this.board[loc2.row][loc2.col] = tmp;
  }

  static default_board() {
    var black = Players.BLACK.COLOR;
    var white = Players.BLACK.COLOR;
    return [
    [new Rook(black, new Location(0, 0)), new Knight(black, new Location(1, 0)), new Bishop(black, new Location(2, 0)), new Queen(black, new Location(3, 0)), new King(black, new Location(4, 0)), new Bishop(black, new Location(5, 0)), new Knight(black, new Location(6, 0)), new Rook(black, new Location(7, 0))],
    [new Pawn(black, new Location(0, 1)), new Pawn(black, new Location(1, 1)), new Pawn(black, new Location(2, 1)), new Pawn(black, new Location(3, 1)), new Pawn(black, new Location(4, 1)), new Pawn(black, new Location(5, 1)), new Pawn(black, new Location(6, 1)), new Pawn(black, new Location(7, 1))],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [new Pawn(white, new Location(0, 6)), new Pawn(white, new Location(1, 6)), new Pawn(white, new Location(2, 6)), new Pawn(white, new Location(3, 6)), new Pawn(white, new Location(4, 6)), new Pawn(white, new Location(5, 6)), new Pawn(white, new Location(6, 6)), new Pawn(white, new Location(7, 6))],
    [new Rook(white, new Location(0, 7)), new Knight(white, new Location(1, 7)), new Bishop(white, new Location(2, 7)), new Queen(white, new Location(3, 7)), new King(white, new Location(4, 7)), new Bishop(white, new Location(5, 7)), new Knight(white, new Location(6, 7)), new Rook(white, new Location(7, 7))]
    ];
  }
  static empty_board() {
      return [
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
          [null,null,null,null,null,null,null,null],
      ]
  }
}
class Piece {


  constructor(color, loc, display) {
    this.color = color;
    this.loc = loc;
    this.display = display;
  }


  get_moves(gs) {
    /*jshint unused:false*/
    throw new Error('Abstract Method');
  }

  valid_move(gs, loc) {
    var valid_moves = this.get_moves(gs);
    for (var index = 0; index < valid_moves.length; index++) {
      if (loc.isEqual(valid_moves[index])) {
        return true;
      }
    }
    return false;
  }

  get_end_row() {
    throw new Error('Not Implemented');
  }

  get_curr_loc() {
    return this.loc;
  }

  get_display() {
    return this.display;
  }

  get_color() {
    return this.color;
  }

  set_location(loc) {
    this.loc = loc;
  }

  can_capture(gs, capture_loc) {
    var capture_piece = gs.get_piece_on_board(capture_loc);
    if (capture_piece instanceof Piece && capture_piece.get_color() !== this.get_color()) {
      return true;
    }
    return false;
  }
}

class Pawn extends Piece {

  constructor(color, loc) {
    var display = Players.WHITE.PAWN;
    var forward_move = Direction.UP;
    var start_row = 2;
    var end_row = 7;
    if (color === Players.BLACK.COLOR) {
      display = Players.BLACK.PAWN;
      end_row = 2;
      start_row = 7;
      forward_move = Direction.DOWN;
    }
    super(color, loc, display);
    this.start_row = start_row;
    this.end_row = end_row;
    this.forward_move = forward_move;
  }

  get_end_row() {
    return this.end_row;
  }

  get_moves(gs) {
    var locations = [];
    var capture_dirs = [Direction.LEFT, Direction.RIGHT];
    var curr_loc = super.get_curr_loc();
    var forward = curr_loc.get_new_loc(this.forward_move);
    if (gs.get_piece_on_board(forward) === null) {
      locations.push(forward);
      forward = forward.get_new_loc(this.forward_move);
      if (curr_loc.get()[0] === this.start_row && gs.get_piece_on_board(forward) === null) {
        locations.push(forward);
      }
    }
    for (var index = 0; index < capture_dirs.length; index++) {
      var capture_loc = curr_loc.get_new_loc([this.forward_move, capture_dirs[index]]);
      if (super.can_capture(gs, capture_loc)) {
        locations.push(capture_loc);
      }
    }
    return locations;

  }
}
class Rook extends Piece {

  constructor(color, loc) {
    var display = Players.WHITE.ROOK;
    if (color === Players.BLACK.COLOR) {
      display = Players.BLACK.ROOK;
    }
    super(color, loc, display);
  }

  get_moves(gs) {
    var possible_dirs = Object.values(Direction);
    var locations = [];
    for (var index = 0; index < possible_dirs.length; index++) {
      locations = locations.concat(gs.get_empty_loc_along_dir(super.get_curr_loc(), possible_dirs[index]));
      var capture_loc = locations[locations.length - 1].get_new_loc(possible_dirs[index]);
      if (super.can_capture(gs, capture_loc)) {
        locations.push(capture_loc);
      }
    }
    return locations;

  }
}
class Bishop extends Piece {

  constructor(color, loc) {
    var display = Players.WHITE.BISHOP;
    if (color === Players.BLACK.COLOR) {
      display = Players.BLACK.BISHOP;
    }
    super(color, loc, display);
  }

  get_moves(gs) {
    var possible_dirs = [[Direction.UP, Direction.LEFT], [Direction.UP, Direction.RIGHT], [Direction.DOWN, Direction.LEFT], [Direction.DOWN, Direction.RIGHT]];
    var locations = [];
    for (var index = 0; index < possible_dirs.length; index++) {
      locations = locations.concat(gs.get_empty_loc_along_dir(super.get_curr_loc(), possible_dirs[index]));
      var capture_loc = locations[locations.length - 1].get_new_loc(possible_dirs[index]);
      if (super.can_capture(gs, capture_loc)) {
        locations.push(capture_loc);
      }
    }
    return locations;
  }
}
class Knight extends Piece {

  constructor(color, loc) {
    var display = Players.WHITE.KNIGHT;
    if (color === Players.BLACK.COLOR) {
      display = Players.BLACK.KNIGHT;
    }
    super(color, loc, display);
  }

  get_moves(gs) {
    var possible_dirs = [[Direction.UP, Direction.UP, Direction.LEFT],
    [Direction.UP, Direction.UP, Direction.RIGHT], [Direction.DOWN, Direction.DOWN, Direction.LEFT],
    [Direction.DOWN, Direction.RIGHT, Direction.RIGHT]];
    var locations = [];
    for (var index = 0; index < possible_dirs.length; index++) {
      var next_loc = super.get_curr_loc().get_new_loc(possible_dirs[index]);
      if (gs.get_piece_on_board(next_loc) === null || super.can_capture(gs, next_loc)) {
        locations.push(next_loc);
      }
    }
    return locations;
  }
}
class Queen extends Piece {

  constructor(color, loc) {
    var display = Players.WHITE.QUEEN;
    if (color === Players.BLACK.COLOR) {
      display = Players.BLACK.QUEEN;
    }
    super(color, loc, display);
  }

  get_moves(gs) {
    var possible_dirs = Object.values(Direction).concat([[Direction.UP, Direction.LEFT], [Direction.UP, Direction.RIGHT], [Direction.DOWN, Direction.LEFT], [Direction.DOWN, Direction.RIGHT]]);
    var locations = [];
    for (var index = 0; index < possible_dirs.length; index++) {
      locations = locations.concat(gs.get_empty_loc_along_dir(super.get_curr_loc(), possible_dirs[index]));
      var capture_loc = locations[locations.length - 1].get_new_loc(possible_dirs[index]);
      if (super.can_capture(gs, capture_loc)) {
        locations.push(capture_loc);
      }
    }
    return locations;
  }
}
class King extends Piece {

  constructor(color, loc) {
    var display = Players.WHITE.KING;
    if (color === Players.BLACK.COLOR) {
      display = Players.BLACK.KING;
    }
    super(color, loc, display);
  }

  get_moves(gs) {
    var possible_dirs = Object.values(Direction).concat([[Direction.UP, Direction.LEFT], [Direction.UP, Direction.RIGHT], [Direction.DOWN, Direction.LEFT], [Direction.DOWN, Direction.RIGHT]]);
    var locations = [];
    for (var index = 0; index < possible_dirs.length; index++) {
      var next_loc = super.get_curr_loc().get_new_loc(possible_dirs[index]);
      if (gs.get_piece_on_board(next_loc) === null || super.can_capture(gs, next_loc)) {
        locations.push(next_loc);
      }
    }
    return locations;
  }
}

module.exports = {
  GameState: GameState,
  Players: Players,
  MoveStatus: MoveStatus,
  Location: Location,
  King: King
};
