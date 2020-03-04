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
    BLACK:  {
      COLOR: 1,
      PAWN: '&#9823;',
      BISHOP: '&#9821;',
      ROOK: '&#9820;',
      KNIGHT: '&#9822;',
      QUEEN: '&#9819;',
      KING: '&#9818;'
    }
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

}
class GameState {

    constructor(board, players, current_player) {
        this.board = board;
        this.players = players;
        this.current_player = current_player;
    }

    restart() {
        return null();
    }

    get_curr_player() {
        return this.current_player;
    }
	
	  get_curr_board() {
        return this.board
    }

    game_over() {
        return null();
    }

    play_move(start, end, promotion) {
        return null();
    }

    get_loc_on_board(row, col){
      if (row < 0 || col < 0 || row > this.board.length || col > this.board.length ){
          return 'undefined'
      }else{
          return this.board[row][col] 
      }
      
      
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

    get_corr_loc() {
        return this.loc;
    }

    get_display() {
        return this.display;
    }

    get_color() {
        return this.color;
    }
}
class Pawn extends Piece {

  constructor(color, loc) {
        Piece.call(this, color, loc);
        if (color == Players.BLACK.COLOR){
          this.display = Players.BLACK.PAWN;
          this.start_row = 7;
          this.forward_move = -1;
        }else{
          this.display = Players.WHITE.PAWN;
          this.start_row = 2;
          this.forward_move = 1;
        }
    }

    get_moves(gs) {
      var locations = [];
      var [row, col] = this.get_curr_loc().get();
      if (gs.get_loc_on_board(row+this.forward_move,col) == null)
      {
      	locations.push(new Location(row+1, col));
        if (row == this.start_row && gs.get_loc_on_board(row+2*this.forward_move,col) == null){
          locations.push(new Location(row+2, col));
        }
      }
      var capture =  gs.get_loc_on_board(row+this.forward_move,col+1)
      if (capture instanceof Piece && capture.get_color() != this.get_color()){
          locations.push(new Location(row+this.forward_move, col+1));
      }
      var capture =  gs.get_loc_on_board(row+this.forward_move,col-1)
      if (capture instanceof Piece && capture.get_color() != this.get_color()){
          locations.push(new Location(row+this.forward_move, col-1));
      }
      return locations
      
    }
}
class Rook extends Piece {

    constructor(color, loc) {
        Piece.call(this, color, loc);
        if (color == Players.BLACK.COLOR){
          this.display = Players.BLACK.ROOK;
        }else{
          this.display = Players.WHITE.ROOK;
        }
    }

    get_moves(gs) {
        return null;
    }
}
class Bishop extends Piece {

    constructor(color, loc) {
        Piece.call(this, color, loc);
        if (color == Players.BLACK.COLOR){
          this.display = Players.BLACK.BISHOP;
        }else{
          this.display = Players.WHITE.BISHOP;
        }
    }

    get_moves(gs) {
        return null;
    }
}
class Knight extends Piece {

    constructor(color, loc) {
        Piece.call(this, color, loc);
        if (color == Players.BLACK.COLOR){
          this.display = Players.BLACK.KNIGHT;
        }else{
          this.display = Players.WHITE.KNIGHT;
        }
    }

    get_moves(gs) {
        return null;
    }
}
class Queen extends Piece {

    constructor(color, loc) {
        Piece.call(this, color, loc);
        if (color == Players.BLACK.COLOR){
          this.display = Players.BLACK.QUEEN;
        }else{
          this.display = Players.WHITE.QUEEN;
        }
    }

    get_moves(gs) {
        return null;
    }
}
class King extends Piece {

    constructor(color, loc) {
        Piece.call(this, color, loc);
        if (color == Players.BLACK.COLOR){
          this.display = Players.BLACK.KING;
        }else{
          this.display = Players.WHITE.KING;
        }
    }

    get_moves(gs) {
        return null;
    }
}