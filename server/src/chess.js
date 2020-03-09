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

  set_curr_player(player) {
      this.current_player = player;
  }

  get_curr_board() {
    return this.board;
  }

  set_curr_board(board) {
      this.board = board;
  }

  // Just check if there are any valid moves for a player?
  // If none then check if current player is in check then they lost
  // Else it's a stalemate?
  game_over() {
    var row, col;
    var attacked_positions = [];
    var current_player_king;
    var has_valid_moves = false;
    for (row = 0; row < this.board.length; row++) {
      for (col = 0; col < this.board[0].length; col++) {
        var piece = this.board[row][col];
        if (piece === null) {
          continue;
        }

        if (piece.get_color() === this.get_curr_player()) {
          if (piece instanceof King) {
            current_player_king = new Location(row, col);
          }
          if (piece.get_valid_moves(this).length !== 0) {
            has_valid_moves = true;
          }
        } else {
            attacked_positions = attacked_positions.concat(piece.get_moves(this));
        }
      }
    }

    if (!has_valid_moves){
      if(this.in_check(this.get_curr_player())){
        // Checkmate
        if (this.get_curr_player() === Players.WHITE.COLOR) {
          return MoveStatus.BLACK_WIN;
        } else {
          return MoveStatus.WHITE_WIN;
        }
      }else{
        return MoveStatus.STALE_MATE;
      }
    }
    return MoveStatus.SUCCESS;
  }

  play_move(start, end, promotion) {
    var piece = this.get_piece_on_board(start);
    if(piece === null){
        return MoveStatus.INVALID;
    }
	var [row,col] = end.get();
    if(piece.get_color() != this.current_player){
        // Trying to move incorrect piece color
        return MoveStatus.INVALID;
    }
    var isValid = false;
    piece.get_valid_moves(this).forEach((loc)=>{
        if(end.isEqual(loc)){
            isValid = true;
        }
    });
    // Not a move that can be made
    if(!isValid){
        return MoveStatus.INVALID;
    }
    if (!(row < 0 || col < 0 || row > (this.board.length - 1) || col > (this.board.length - 1))) {
      if (piece instanceof Pawn && (piece.get_end_row() === row) && promotion === null) {
        return MoveStatus.PROMOTION_REQUIRED;
      }
      this.move_piece(start, end);
      piece.set_location(end);
      if (promotion != null) {
        var success = this.promote_piece(promotion, end);
        if (!success){
            return MoveStatus.INVALID;
        }
      }
      // 1 goes to 0 and 0 goes to 1 which are the color representations
      if(this.current_player == Players.BLACK.COLOR){
        this.current_player = Players.WHITE.COLOR;
      }else{
        this.current_player = Players.BLACK.COLOR;
      }

      // If the new player is in check then inform client
      if(this.in_check(this.current_player)){
        return MoveStatus.SUCCESS_CHECK;
      }
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

  move_piece(loc1, loc2) {
    this.board[loc2.row][loc2.col] = this.board[loc1.row][loc1.col];
    this.board[loc1.row][loc1.col] = null;
  }

  // A player is in check if the OTHER player is attacking the King of the player
  in_check(player){
    var row, col;
    var attacked_positions = [];
    var player_king;
    for (row = 0; row < this.board.length; row++) {
      for (col = 0; col < this.board[0].length; col++) {
        var piece = this.board[row][col];
        if(piece === null){
            // no piece
            continue;
        }
        if(piece.get_color() === player){
            if(piece instanceof King){
                player_king = piece;
            }
        }else{
            attacked_positions = attacked_positions.concat(piece.get_moves(this));
        }
      }
    }
    // If no king nothing to check, so false
    if(player_king === undefined){
        return false;
    }
    var i;
    for(i = 0; i < attacked_positions.length; i++){
        if(attacked_positions[i].isEqual(player_king.get_curr_loc())){
            return true;
        }
    }
    return false;
  }

  static default_board() {
    var black = Players.BLACK.COLOR;
    var white = Players.WHITE.COLOR;
    return [
    [new Rook(black, new Location(0, 0)), new Knight(black, new Location(0, 1)), new Bishop(black, new Location(0, 2)), new Queen(black, new Location(0, 3)), new King(black, new Location(0, 4)), new Bishop(black, new Location(0, 5)), new Knight(black, new Location(0, 6)), new Rook(black, new Location(0, 7))],
    [new Pawn(black, new Location(1, 0)), new Pawn(black, new Location(1, 1)), new Pawn(black, new Location(1, 2)), new Pawn(black, new Location(1, 3)), new Pawn(black, new Location(1, 4)), new Pawn(black, new Location(1, 5)), new Pawn(black, new Location(1, 6)), new Pawn(black, new Location(1, 7))],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [new Pawn(white, new Location(6, 0)), new Pawn(white, new Location(6, 1)), new Pawn(white, new Location(6, 2)), new Pawn(white, new Location(6, 3)), new Pawn(white, new Location(6, 4)), new Pawn(white, new Location(6, 5)), new Pawn(white, new Location(6, 6)), new Pawn(white, new Location(6, 7))],
    [new Rook(white, new Location(7, 0)), new Knight(white, new Location(7, 1)), new Bishop(white, new Location(7, 2)), new Queen(white, new Location(7, 3)), new King(white, new Location(7, 4)), new Bishop(white, new Location(7, 5)), new Knight(white, new Location(7, 6)), new Rook(white, new Location(7, 7))]
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
      ];
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

  get_valid_moves(gs){
    return this.remove_moves_still_in_check(gs, this.get_moves(gs));
  }

  remove_moves_still_in_check(gs, locs){
    if(locs == null || locs.length == 0){
        return [];
    }
    var valid_moves = [];
    var [orig_row, orig_col] = this.loc.get();
    locs.forEach((loc) => {
        var piece = gs.get_piece_on_board(loc);
        gs.move_piece(new Location(orig_row, orig_col), loc);
        this.set_location(loc);
        if(!gs.in_check(this.get_color())){
            valid_moves.push(loc);
        }
        gs.move_piece(loc, new Location(orig_row, orig_col));
        this.set_location(new Location(orig_row, orig_col));
        gs.set_piece_on_board(piece, loc);
    });
    return valid_moves;
  }
}

class Pawn extends Piece {

  constructor(color, loc) {
    var display = Players.WHITE.PAWN;
    var forward_move = Direction.DOWN;
    var start_row = 6;
    var end_row = 0;
    if (color === Players.BLACK.COLOR) {
      display = Players.BLACK.PAWN;
	  start_row = 1;
      end_row = 7;
      forward_move = Direction.UP;
    }
    super(color, loc, display);
    this.start_row = start_row;
    this.end_row = end_row;
    this.forward_move = forward_move;
  }

  get_end_row() {
    return this.end_row;
  }

  // Doesn't do forward 2 from home row or en passant
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
    var new_locations = [];
    for (var index = 0; index < possible_dirs.length; index++) {
      new_locations = gs.get_empty_loc_along_dir(super.get_curr_loc(), possible_dirs[index]);
      var capture_loc;
      if(new_locations.length == 0){
        capture_loc = super.get_curr_loc().get_new_loc(possible_dirs[index]);
      }else{
        locations = locations.concat(new_locations);
        capture_loc = new_locations[new_locations.length - 1].get_new_loc(possible_dirs[index]);
      }
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
    var new_locations;
    for (var index = 0; index < possible_dirs.length; index++) {
      new_locations = gs.get_empty_loc_along_dir(super.get_curr_loc(), possible_dirs[index]);
      var capture_loc;
      if(new_locations.length == 0){
        capture_loc = super.get_curr_loc().get_new_loc(possible_dirs[index]);
      }else{
        locations = locations.concat(new_locations);
        capture_loc = new_locations[new_locations.length - 1].get_new_loc(possible_dirs[index]);
      }
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
    [Direction.DOWN, Direction.DOWN, Direction.RIGHT], [Direction.UP, Direction.LEFT, Direction.LEFT],
    [Direction.UP, Direction.RIGHT, Direction.RIGHT], [Direction.DOWN, Direction.LEFT, Direction.LEFT],
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
    var new_locations;
    for (var index = 0; index < possible_dirs.length; index++) {
      new_locations = gs.get_empty_loc_along_dir(super.get_curr_loc(), possible_dirs[index]);
      var capture_loc;
      if(new_locations.length == 0){
        capture_loc = super.get_curr_loc().get_new_loc(possible_dirs[index]);
      }else{
        locations = locations.concat(new_locations);
        capture_loc = new_locations[new_locations.length - 1].get_new_loc(possible_dirs[index]);
      }
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
  Pawn: Pawn,
  King: King,
  Bishop: Bishop,
  Rook: Rook,
  Queen: Queen,
  Knight: Knight
};
