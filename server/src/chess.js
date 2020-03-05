const MoveStatus = {
  SUCCESS: 'Success',
  SUCCESS_CHECK: 'SuccessCheck',
  INVALID: 'Invalid',
  BLACK_WIN: 'BlackWin',
  WHITE_WIN: 'WhiteWin',
  STALE_MATE: 'StaleMate',
  PROMOTION_REQUIRED: 'PromotionRequired'
}
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
}
const Direction = {
  RIGHT: [0, 1],
  LEFT: [0, -1],
  UP: [1, 0],
  DOWN: [-1, 0],
}
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
    return '';
  }

  get_new_loc(directions) {
    var new_row = this.row;
    var new_col = this.col;
    for (var index = 0; index < directions.length; index++) {
      new_row = new_row + directions[index][0];
      new_col = new_col + directions[index][1];
    }
    return new Location(new_row, new_col);
  }

}
class GameState {

  constructor(board, players, current_player) {
    this.board = board;
    this.players = players;
    this.current_player = current_player;
  }

  restart() {
    return null;
  }

  get_curr_player() {
    return this.current_player;
  }

  get_curr_board() {
    return this.board
  }

  game_over() {
    return null;
  }

  play_move(start, end, promotion) {
    return null;
  }

  get_piece_on_board(loc) {
    var [row, col] = loc.get();
    row = row - 1;
    col = col - 1;
    if (row < 0 || col < 0 || row > (this.board.length - 1) || col > (this.board.length - 1)) {
      return undefined;
    } else {
      return this.board[row][col];
    }
  }

  get_empty_loc_along_dir(curr_loc, dir) {
    var empty_locations = [];
    var loc = curr_loc.get_new_loc([dir]);
    while (this.get_piece_on_board(loc) === null) {
      empty_locations.push(loc);
      loc = loc.get_new_loc([dir]);
    }
    return empty_locations;
  }

}
class Piece {

  constructor(color, loc) {
    this.color = color;
    this.loc = loc;
  }


  get_moves(gs) {
    return null;
  }

  valid_move(loc) {
    return null;
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

  can_capture(gs, capture_loc) {
    var capture_piece = gs.get_piece_on_board(capture_loc);
    if (capture_piece instanceof Piece && capture_piece.get_color() != this.get_color()) {
      return true;
    }
    return false;
  }
}

class Pawn extends Piece {

  constructor(color, loc) {
    super(color, loc);
    if (color == Players.BLACK.COLOR) {
      this.display = Players.BLACK.PAWN;
      this.start_row = 7;
      this.forward_move = Direction.DOWN;
    } else {
      this.display = Players.WHITE.PAWN;
      this.start_row = 2;
      this.forward_move = Direction.UP;
    }
  }

  get_moves(gs) {
    var locations = [];
    var capture_dirs = [Direction.LEFT, Direction.RIGHT];
    var curr_loc = super.get_curr_loc();
    var forward = curr_loc.get_new_loc([this.forward_move]);
    if (gs.get_piece_on_board(forward) == null) {
      locations.push(forward);
      forward = forward.get_new_loc([this.forward_move]);
      if (curr_loc.get()[0] == this.start_row && gs.get_piece_on_board(forward) == null) {
        locations.push(forward);
      }
    }
    for (var index = 0; index < capture_dirs.length; index++) {

      var capture_loc = curr_loc.get_new_loc([this.forward_move, capture_dirs[index]]);
      if (super.can_capture(gs, capture_loc)) {
        locations.push(capture_loc);
      }
    }
    return locations

  }
}
class Rook extends Piece {

  constructor(color, loc) {
    super(color, loc);
    if (color == Players.BLACK.COLOR) {
      this.display = Players.BLACK.ROOK;
    } else {
      this.display = Players.WHITE.ROOK;
    }
  }

  get_moves(gs) {
    var possible_dirs = Object.values(Direction);
    var locations = [];
    for (var index = 0; index < possible_dirs.length; index++) {
      locations = locations.concat(gs.get_empty_loc_along_dir(super.get_curr_loc(), possible_dirs[index]));
      var capture_loc = locations[locations.length - 1].get_new_loc([possible_dirs[index]]);
      if (super.can_capture(gs, capture_loc)) {
        locations.push(capture_loc);
      }
    }
    return locations;

  }
}
class Bishop extends Piece {

  constructor(color, loc) {
    super(color, loc);
    if (color == Players.BLACK.COLOR) {
      this.display = Players.BLACK.BISHOP;
    } else {
      this.display = Players.WHITE.BISHOP;
    }
  }

  get_moves(gs) {
    return null;
  }
}
class Knight extends Piece {

  constructor(color, loc) {
    super(color, loc);
    if (color == Players.BLACK.COLOR) {
      this.display = Players.BLACK.KNIGHT;
    } else {
      this.display = Players.WHITE.KNIGHT;
    }
  }

  get_moves(gs) {
    return null;
  }
}
class Queen extends Piece {

  constructor(color, loc) {
    super(color, loc);
    if (color == Players.BLACK.COLOR) {
      this.display = Players.BLACK.QUEEN;
    } else {
      this.display = Players.WHITE.QUEEN;
    }
  }

  get_moves(gs) {
    return null;
  }
}
class King extends Piece {

  constructor(color, loc) {
    super(color, loc);
    if (color == Players.BLACK.COLOR) {
      this.display = Players.BLACK.KING;
    } else {
      this.display = Players.WHITE.KING;
    }
  }

  get_moves(gs) {
    return null;
  }
}


