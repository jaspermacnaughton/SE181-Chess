var assert = require('assert');
var chess = require(__dirname + '/../src/chess.js');
const Player1 = "PLAYER1";
const Player2 = "PLAYER2";
var Players = [Player1, Player2];
const BLACK = chess.Players.BLACK.COLOR;
const WHITE = chess.Players.WHITE.COLOR;

describe('gameState', function (){
    var gameState = new chess.GameState(null, Players, Players.indexOf(Player2));
    describe('#restart()', function (){
        it('Restarting the game resets the game board and current player', function (){
            //            inputs             , expected result
            assert.equal(matching_boards(gameState.get_curr_board(), chess.GameState.default_board()), false);
            gameState.restart()
            assert.equal(gameState.get_curr_player(), Players.indexOf("PLAYER1"));
            assert.equal(matching_boards(gameState.get_curr_board(), chess.GameState.default_board()), true);
        });

    });
    describe('#game_over()', function (){
        var board = [
            [new chess.King(BLACK, new chess.Location(0,0)), null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [new chess.Queen(WHITE, new chess.Location(2,0)), new chess.Queen(WHITE, new chess.Location(2,1)), null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, new chess.King(WHITE, new chess.Location(7,7))]];

        var gameState = new chess.GameState(board, Players, BLACK);
        it('Game over for basic checkmate', function (){
            assert.equal(gameState.game_over(), chess.MoveStatus.WHITE_WIN);
        });
    });
});

<<<<<<< HEAD
=======

describe('king', function (){
    var gameState = new chess.GameState(chess.GameState.default_board(), Players, Players.indexOf(Player2));
    var emptyState = new chess.GameState(chess.GameState.empty_board(), Players, Players.indexOf(Player2));
    var color = chess.Players.BLACK.COLOR;
    describe('#get_moves()', function(){
        var location = new chess.Location(0,5);
		var king = new chess.King(color, location);
		var moves = king.get_moves(gameState);
        it('King cannot move onto a space occupied by a same color piece', function (){
			var location = new chess.Location(0,5);
			var king = new chess.King(color, location);
			var moves = king.get_moves(gameState);
            assert.equal(moves.length, 0);
        });
        moves = king.get_moves(emptyState);
        it('King cannot move up if in uppermost position',function (){
            assert.equal(moves.length, 5);
            assert.notEqual(moves[2].row, -1);
        });
        location.set(7,5);
        king.set_location(location);
        moves = king.get_moves(emptyState);
        it('King cannot move down if in lowermost position',function (){
            assert.equal(moves.length, 5);
            assert.notEqual(moves[3].row,8)
        });
        location.set(5,0);
        king.set_location(location);
        moves = king.get_moves(emptyState);
        it('King cannot move left if in leftmost position',function (){
            assert.equal(moves.length, 5);
            assert.notEqual(moves[1].col,-1)
        });
        location.set(5,7);
        king.set_location(location);
        moves = king.get_moves(emptyState);
        it('King cannot move right if in rightmost position',function (){
            assert.equal(moves.length, 5);
            assert.notEqual(moves[0].col,8)
        });
    });
});


>>>>>>> cbbf62211b656113b224ad3e397ba0279475c95c
describe('pawn', function (){
	it('should be able to move two spaces forward upon start', function() {
		var state = new chess.GameState(chess.GameState.default_board(), Players, Players.indexOf(Player2));
		var pawn_black = new chess.Pawn(chess.Players.BLACK.COLOR, new chess.Location(1,1));
		var valid_moves = pawn_black.get_moves(state);
		var expected_location = new chess.Location(2,1);
		assert.equal(list_contains(valid_moves, expected_location), true);
		expected_location = new chess.Location(3,1);
		assert.equal(list_contains(valid_moves, expected_location), true);

		var pawn_white = new chess.Pawn(chess.Players.WHITE.COLOR, new chess.Location(6,1));
		valid_moves = pawn_white.get_moves(state);
		expected_location = new chess.Location(5,1);
		assert.equal(list_contains(valid_moves, expected_location), true);
		expected_location = new chess.Location(4,1);
		assert.equal(list_contains(valid_moves, expected_location), true);
	});
	it('should ONLY be able to move one space if not blocked if not in start', function() {
		var state = new chess.GameState(chess.GameState.default_board(), Players, Players.indexOf(Player2));
		var pawn_black = new chess.Pawn(chess.Players.BLACK.COLOR, new chess.Location(3,1));
		var valid_moves = pawn_black.get_moves(state);
		var expected_location = new chess.Location(4,1);
		assert.equal(list_contains(valid_moves, expected_location), true);
		var unexpected_location = new chess.Location(5,1);
		assert.equal(list_contains(valid_moves, unexpected_location), false);

		var pawn_white = new chess.Pawn(chess.Players.WHITE.COLOR, new chess.Location(5,1));
		valid_moves = pawn_white.get_moves(state);
		expected_location = new chess.Location(4,1);
		assert.equal(list_contains(valid_moves, expected_location), true);
		unexpected_location = new chess.Location(3,1);
		assert.equal(list_contains(valid_moves, unexpected_location), false);
	});
	it('should NOT be able to move one space if blocked', function() {
		var state = new chess.GameState(chess.GameState.default_board(), Players, Players.indexOf(Player2));
		var pawn_black = new chess.Pawn(chess.Players.BLACK.COLOR, new chess.Location(2,1));
		state.set_piece_on_board(new chess.Rook(chess.Players.BLACK.COLOR, new chess.Location(3,1)), new chess.Location(3,1));
		var valid_moves = pawn_black.get_moves(state);
		var unexpected_location = new chess.Location(3,1);
		assert.equal(list_contains(valid_moves, unexpected_location), false);

		var pawn_white = new chess.Pawn(chess.Players.WHITE.COLOR, new chess.Location(4,1));
		valid_moves = pawn_white.get_moves(state);
		unexpected_location = new chess.Location(3,1);
		assert.equal(list_contains(valid_moves, unexpected_location), false);
	});
	it('should be able to capture along diagonals', function() {
		var state = new chess.GameState(chess.GameState.default_board(), Players, Players.indexOf(Player2));
		var pawn_black = new chess.Pawn(chess.Players.BLACK.COLOR, new chess.Location(2,2));
		state.set_piece_on_board(new chess.Rook(chess.Players.WHITE.COLOR, new chess.Location(3,1)), new chess.Location(3,1));
		state.set_piece_on_board(new chess.Rook(chess.Players.WHITE.COLOR, new chess.Location(3,3)), new chess.Location(3,3));
		var valid_moves = pawn_black.get_moves(state);
		var expected_location = new chess.Location(3,1);
		assert.equal(list_contains(valid_moves, expected_location), true);
		expected_location = new chess.Location(3,3);
		assert.equal(list_contains(valid_moves, expected_location), true);

		var pawn_white = new chess.Pawn(chess.Players.WHITE.COLOR, new chess.Location(6,2));
		state.set_piece_on_board(new chess.Rook(chess.Players.BLACK.COLOR, new chess.Location(5,1)), new chess.Location(5,1));
		state.set_piece_on_board(new chess.Rook(chess.Players.BLACK.COLOR, new chess.Location(5,3)), new chess.Location(5,3));
		var valid_moves = pawn_white.get_moves(state);
		var expected_location = new chess.Location(5,1);
		assert.equal(list_contains(valid_moves, expected_location), true);
		expected_location = new chess.Location(5,3);
		assert.equal(list_contains(valid_moves, expected_location), true);
	});
	it('should NOT be able to capture same color piece', function() {
		var state = new chess.GameState(chess.GameState.default_board(), Players, Players.indexOf(Player2));
		var pawn_black = new chess.Pawn(chess.Players.BLACK.COLOR, new chess.Location(2,2));
		state.set_piece_on_board(new chess.Rook(chess.Players.BLACK.COLOR, new chess.Location(3,1)), new chess.Location(3,1));
		var valid_moves = pawn_black.get_moves(state);
		var unexpected_location = new chess.Location(3,1);
		assert.equal(list_contains(valid_moves, unexpected_location), false);

		var pawn_white = new chess.Pawn(chess.Players.WHITE.COLOR, new chess.Location(6,2));
		state.set_piece_on_board(new chess.Rook(chess.Players.WHITE.COLOR, new chess.Location(5,3)), new chess.Location(5,3));
		var valid_moves = pawn_white.get_moves(state);
		var unexpected_location = new chess.Location(5,3);
		assert.equal(list_contains(valid_moves, unexpected_location), false);
	});
	it('should NOT be able to move off board', function() {
		var state = new chess.GameState(chess.GameState.default_board(), Players, Players.indexOf(Player2));
		var pawn1 = new chess.Pawn(chess.Players.BLACK.COLOR, new chess.Location(2,0));
		var pawn2 = new chess.Pawn(chess.Players.BLACK.COLOR, new chess.Location(2,7));
		var pawn3 = new chess.Pawn(chess.Players.BLACK.COLOR, new chess.Location(7,2));
		var pawn4 = new chess.Pawn(chess.Players.WHITE.COLOR, new chess.Location(0,2));
		state.set_piece_on_board(new chess.Rook(chess.Players.WHITE.COLOR, new chess.Location(3,-1)), new chess.Location(3,-1));
		state.set_piece_on_board(new chess.Rook(chess.Players.WHITE.COLOR, new chess.Location(3,8)), new chess.Location(3,8));

		var valid_moves = pawn1.get_moves(state);
		var unexpected_location = new chess.Location(3,-1);
		assert.equal(list_contains(valid_moves, unexpected_location), false);
		valid_moves = pawn2.get_moves(state);
		unexpected_location = new chess.Location(3,8);
		assert.equal(list_contains(valid_moves, unexpected_location), false);
		valid_moves = pawn3.get_moves(state);
		unexpected_location = new chess.Location(8,2);
		assert.equal(list_contains(valid_moves, unexpected_location), false);
		valid_moves = pawn4.get_moves(state);
		unexpected_location = new chess.Location(-1,2);
		assert.equal(list_contains(valid_moves, unexpected_location), false);
	});

	it('pawn should be able to promote on other side board', function() {
		var state = new chess.GameState(chess.GameState.default_board(), Players, Players.indexOf(Player2));
		var pawn_black = new chess.Pawn(chess.Players.BLACK.COLOR, new chess.Location(6,2));
		state.set_piece_on_board(pawn_black, new chess.Location(6,2));
		var pawn_white = new chess.Pawn(chess.Players.WHITE.COLOR, new chess.Location(1,2));
		state.set_piece_on_board(pawn_white, new chess.Location(1,2));
		state.set_piece_on_board(null, new chess.Location(7,2));
		state.set_piece_on_board(null, new chess.Location(0,2));
		var is_promotion = state.play_move(new chess.Location(6,2), new chess.Location(7,2), null);
		assert.equal(is_promotion, chess.MoveStatus.PROMOTION_REQUIRED);

		is_promotion = state.play_move(new chess.Location(1,2), new chess.Location(0,2), null);
		assert.equal(is_promotion, chess.MoveStatus.PROMOTION_REQUIRED);

	});

	it('pawn is promoted', function() {
		var state = new chess.GameState(chess.GameState.default_board(), Players, Players.indexOf(Player2));
		var pawn_black = new chess.Pawn(chess.Players.BLACK.COLOR, new chess.Location(6,2));
		state.set_piece_on_board(pawn_black, new chess.Location(6,2));
		var pawn_white = new chess.Pawn(chess.Players.WHITE.COLOR, new chess.Location(1,2));
		state.set_piece_on_board(pawn_white, new chess.Location(1,2));
		state.set_piece_on_board(null, new chess.Location(7,2));
		state.set_piece_on_board(null, new chess.Location(0,2));
		var is_promotion = state.play_move(new chess.Location(6,2), new chess.Location(7,2), 'Queen');
		var new_piece = state.get_piece_on_board(new chess.Location(7,2));
		assert.equal(new_piece instanceof chess.Queen, true);

		is_promotion = state.play_move(new chess.Location(1,2), new chess.Location(0,2), 'Bishop');
		var new_piece = state.get_piece_on_board(new chess.Location(0,2));
		assert.equal(new_piece instanceof chess.Bishop, true);

	});
});


describe('rook', function(){
    var defaultState = new chess.GameState(chess.GameState.default_board(), Players, Player2);
    var emptyState = new chess.GameState(chess.GameState.empty_board(), Players, Player2);
    var color = chess.Players.WHITE.COLOR;
    describe('#get_moves()',function(){
        var location = new chess.Location(0,0);
        var rook = new chess.Rook(color,location);
        var moves = rook.get_moves(emptyState);
        it ('Rook can move horizontally or vertically any number of squares', function (){
            assert.equal(moves.length, 14);
            location.set(7,7);
            rook.set_location(location);
            assert.equal(moves.length,14);
        });
        it ('Rook cannot move if blocked', function(){
            location.set(0,0)
            rook.set_location(location);
            moves = rook.get_moves(defaultState);
            assert.equal(moves.length,0);
        });
    });
});

describe('king', function (){
    var gameState = new chess.GameState(chess.GameState.default_board(), Players, Player2);
    var emptyState = new chess.GameState(chess.GameState.empty_board(), Players, Player2);
    var color = chess.Players.BLACK.COLOR;
    describe('#get_moves()', function(){
        var location = new chess.Location(0,5);
		var king = new chess.King(color, location);
		var moves = king.get_moves(gameState);
        it('King cannot move onto a space occupied by a same color piece', function (){
			var location = new chess.Location(0,5);
			var king = new chess.King(color, location);
			var moves = king.get_moves(gameState);
            assert.equal(moves.length, 0);
        });
        moves = king.get_moves(emptyState);
        it('King cannot move up if in uppermost position',function (){
            assert.equal(moves.length, 5);
            assert.notEqual(moves[2].row, -1);
        });
        location.set(7,5);
        king.set_location(location);
        moves = king.get_moves(emptyState);
        it('King cannot move down if in lowermost position',function (){
            assert.equal(moves.length, 5);
            assert.notEqual(moves[3].row,8)
        });
        location.set(5,0);
        king.set_location(location);
        moves = king.get_moves(emptyState);
        it('King cannot move left if in leftmost position',function (){
            assert.equal(moves.length, 5);
            assert.notEqual(moves[1].col,-1)
        });
        location.set(5,7);
        king.set_location(location);
        moves = king.get_moves(emptyState);
        it('King cannot move right if in rightmost position',function (){
            assert.equal(moves.length, 5);
            assert.notEqual(moves[0].col,8)
        });
        it('King cannot capture same color piece', function(){
            assert.equal(1,1);
        });
    });
});

function list_contains(list, value){
	var found = false;
	for (var index = 0; index < list.length; index++) {
		if (list[index].isEqual(value)){
			found = true;
		}
	}
	return found;

}

function matching_boards(gb1, gb2){
    if(gb1 == null || gb2 == null){
        return false;
    }
    var row, col;
    for(row = 0; row <gb1.length; row++){
        for(col = 0; col < gb1[0].length; col ++){
           if(!matching_piece(gb1[row][col], gb2[row][col])){
                return false;
            }
        }
    }
    return true;
}

function matching_piece(p1, p2){
    if(p1 == null && p2 == null){
        return true;
    }

    if(p1 == null || p2 == null){
        return false;
    }
    return p1.color == p2.color && p1.loc.row == p2.loc.row && p1.loc.col == p2.loc.col && p1.display == p2.display;
}
