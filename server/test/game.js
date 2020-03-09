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
        it('in_check() returns true when game is in check',function() {
            var location = new chess.Location(7,7);
            board = [
            [new chess.King(BLACK, new chess.Location(0,0)), null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, new chess.Queen(WHITE, new chess.Location(2,2)), null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, new chess.King(WHITE, new chess.Location(7,7))]];
            gameState.set_curr_board(board);
            assert.equal(gameState.in_check(chess.Players.BLACK.COLOR),true);
            board = [
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, new chess.Queen(WHITE, new chess.Location(2,2)), null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, new chess.King(WHITE, new chess.Location(7,7))]];
            gameState.set_curr_board(board);
            assert.equal(gameState.in_check(BLACK),false);

        });
        it('Pinned pieces', function(){
            board = [
            [null, new chess.King(BLACK, new chess.Location(0,1)), null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, new chess.Queen(WHITE, new chess.Location(2,2)), null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, new chess.King(WHITE, new chess.Location(7,7))]];
            gameState.set_curr_board(board);
            assert.equal(gameState.in_check(chess.Players.BLACK.COLOR),false);
            var start = new chess.Location(0,1);
            var end = new chess.Location(0,0);
            assert.equal(gameState.play_move(start,end,null),chess.MoveStatus.INVALID);
        });
        it('move before game.game_over() is MoveStatus.SUCCESS', function (){
            board = [
            [new chess.King(BLACK, new chess.Location(0,0)), null , null, null, null, null, null, null],
            [new chess.Pawn(BLACK, new chess.Location(1,0)), new chess.Pawn(BLACK, new chess.Location(1,1)),null, new chess.Queen(WHITE, new chess.Location(1,3)), null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, new chess.King(WHITE, new chess.Location(7,7))]];
            gameState.set_curr_board(board);
            gameState.current_player = chess.Players.WHITE.COLOR;
            var start = new chess.Location(1,3);
            var end = new chess.Location(0,3);
            assert.equal(gameState.play_move(start,end,null),chess.MoveStatus.SUCCESS_CHECK);
            assert.equal(gameState.in_check(BLACK), true);
            assert.equal(gameState.game_over(),chess.MoveStatus.WHITE_WIN);
            assert.equal(gameState.play_move(start,end,null),chess.MoveStatus.INVALID);
            assert.equal(gameState.game_over(),chess.MoveStatus.WHITE_WIN);
        });
        it('WhiteWin and BlackWin are returned when the respective side wins',function(){
            assert.equal(gameState.game_over(), chess.MoveStatus.WHITE_WIN);
            board = [
                [new chess.King(WHITE, new chess.Location(0,0)), null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
                [new chess.Queen(BLACK, new chess.Location(2,0)), new chess.Queen(BLACK, new chess.Location(2,1)), null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, new chess.King(BLACK, new chess.Location(7,7))]];
            gameState.set_curr_board(board);
            gameState.set_curr_player(WHITE);
            assert.equal(gameState.game_over(),chess.MoveStatus.BLACK_WIN);
        });
        it('Check for valid pawn promotion', function(){
            board = [
                [new chess.King(BLACK, new chess.Location(0,0)),null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null],
                [null,null,new chess.Pawn(BLACK,new chess.Location(6,2)),null,null,null,null,null],
                [null,null,null,null,null,null,null,new chess.King(WHITE, new chess.Location(7,7))]
            ];
            board2 = [
                [new chess.King(BLACK, new chess.Location(0,0)),null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null],
                [null,null,new chess.Knight(BLACK,new chess.Location(7,2)),null,null,null,null,new chess.King(WHITE, new chess.Location(7,7))]
            ];
            gameState.set_curr_board(board);
            gameState.set_curr_player(BLACK);
            var start = new chess.Location(6,2);
            var end = new chess.Location(7,2);
            assert.equal(gameState.play_move(start,end,"invalid"),chess.MoveStatus.INVALID);
            gameState.set_curr_board(board);
            gameState.set_curr_player(BLACK);
            assert.equal(gameState.play_move(start,end,"Knight"),chess.MoveStatus.SUCCESS);
            gameState.set_curr_board(board);
            gameState.set_curr_player(BLACK);
            gameState.move_piece(start, end);
            var testState = new chess.GameState(board2, Players, Players.indexOf(Player2));
            assert.equal(matching_boards(gameState.promote_piece('Knight', end),testState), true);
            gameState.set_curr_board(board);
            gameState.set_curr_player(BLACK);
            assert.equal(gameState.play_move(start,end,"Rook"),chess.MoveStatus.SUCCESS);
            gameState.set_curr_board(board);
            gameState.set_curr_player(BLACK);
            assert.equal(gameState.play_move(start,end,"Bishop"),chess.MoveStatus.SUCCESS);
            gameState.set_curr_board(board);
            gameState.set_curr_player(BLACK);
            assert.equal(gameState.play_move(start,end,"Queen"),chess.MoveStatus.SUCCESS);
            gameState.set_curr_board(board);
            gameState.set_curr_player(BLACK);
            assert.equal(gameState.play_move(start,end,"invalid"),chess.MoveStatus.PROMOTION_REQUIRED);
            assert.equal(gameState.promote_piece('Knight', ))
        })
        it('if game isn\'t over, then game_over() returns MoveStatus.SUCCESS',function() {
            gameState.set_curr_board(chess.GameState.default_board());
            assert.equal(gameState.game_over(),chess.MoveStatus.SUCCESS);
        });
        it('Stalemate works as it should',function() {
            board = [
            [null, null, null, new chess.King(BLACK, new chess.Location(0,3)), null, null, null, null],
            [null, null ,null, new chess.Bishop(WHITE, new chess.Location(1,3)), null, null, null, null],
            [null, null, null, new chess.King(WHITE, new chess.Location(2,3)), null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null]];
            gameState.set_curr_board(board);
            gameState.set_curr_player(BLACK);
            assert.equal(gameState.game_over(), chess.MoveStatus.STALE_MATE);
        });
        it('Valid move checker works',function() {
            var location = new chess.Location(7,7);
            board = [
            [new chess.King(BLACK, new chess.Location(0,0)), null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, new chess.Queen(WHITE, new chess.Location(2,2)), null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, new chess.King(WHITE, new chess.Location(7,7))]];
            gameState.set_curr_board(board);
            gameState.set_curr_player(WHITE);
            var test_queen = new chess.Queen(WHITE, new chess.Location(2,2));
            var loc = new chess.Location(1,1);
            assert.equal(test_queen.valid_move(gameState,loc),true);
            loc.set(0,1);
            assert.equal(test_queen.valid_move(gameState,loc),false);
        })
    });
});

describe('piece', function(){
    it('cannot call abstract methods', function(){
        var gameState = new chess.GameState(null, Players, Players.indexOf(Player2));
        var color = chess.Players.WHITE;
        var location = new chess.Location(0,0);
        var display = chess.Players.WHITE.PAWN;
        var test_piece = new chess.Piece(color,location,display);
        assert.throws(function () {test_piece.get_moves(gameState) }, Error, 'Abstract Method');
        assert.throws(function () {test_piece.get_end_row() }, Error, 'Abstract Method');
    })
})
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
		var is_promotion = state.play_move(new chess.Location(6,2), new chess.Location(7,2), 'Rook');
		assert.equal(state.get_piece_on_board(new chess.Location(7,2)) instanceof chess.Rook, true);

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
    var color = chess.Players.BLACK.COLOR;
    describe('#get_moves()',function(){
        var location = new chess.Location(0,0);
        var rook = new chess.Rook(color,location);
        var moves = rook.get_moves(emptyState);
        it ('Rook can move horizontally or vertically any number of spaces', function (){
            assert.equal(moves.length, 14);
            location.set(7,7);
            rook.set_location(location);
            moves = rook.get_moves(emptyState);
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

describe('bishop', function(){
    var defaultState = new chess.GameState(chess.GameState.default_board(), Players, Player2);
    var emptyState = new chess.GameState(chess.GameState.empty_board(), Players, Player2);
    var color = chess.Players.BLACK.COLOR;
    describe('#get_moves()',function(){
        var location = new chess.Location(0,0);
        var bishop = new chess.Bishop(color,location);
        var moves = bishop.get_moves(emptyState);
        it('Bishop can move diagnoally any number of spaces', function (){
            assert.equal(moves.length, 7);
        });
        it('Bishop cannot move if blocked', function() {
            location.set(0,2);
            bishop.set_location(location);
            moves = bishop.get_moves(defaultState);
            assert.equal(moves.length,0);
        });
    });
});

describe('knight',function(){
    var defaultState = new chess.GameState(chess.GameState.default_board(), Players, Player2);
    var emptyState = new chess.GameState(chess.GameState.empty_board(), Players, Player2);
    var color = chess.Players.BLACK.COLOR;
    describe('#get_moves()',function(){
        var location = new chess.Location(0,0);
        var knight = new chess.Knight(color,location);
        var moves = knight.get_moves(emptyState);
        it('Knight can move one vertically and two horizontally, and vice versa', function (){
            assert.equal(moves.length, 2);
            location.set(3,3);
            knight.set_location(location);
            moves = knight.get_moves(emptyState);
            assert.equal(moves.length, 8);
        });
        it('Knight can hop over pieces if blocked by same color', function() {
            location.set(0,1);
            knight.set_location(location);
            moves = knight.get_moves(defaultState);
            assert.equal(moves.length,2);
        });
    });
});

describe('queen', function(){
    var defaultState = new chess.GameState(chess.GameState.default_board(), Players, Player2);
    var emptyState = new chess.GameState(chess.GameState.empty_board(), Players, Player2);
    var color = chess.Players.BLACK.COLOR;
    describe('#get_moves()',function(){
        var location = new chess.Location(0,0);
        var queen = new chess.Queen(color,location);
        var moves = queen.get_moves(emptyState);
        it('Queen can move horizontally, vertically, or diagonally any number of spaces', function(){
            assert.equal(moves.length,21);
        });
        it('Queen cannot move if blocked', function() {
            location.set(0,3);
            queen.set_location(location);
            moves = queen.get_moves(defaultState);
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
        it('King can castle when not in check', function(){
            board = [
                [new chess.Rook(BLACK, new chess.Location(0,0)),null,null,null,new chess.King(BLACK,new chess.Location(0,4)),null,null,new chess.Rook(BLACK, new chess.Location(0,7))],
                [null,null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null],
                [new chess.Rook(WHITE, new chess.Location(7,0)),null,null,null,new chess.King(WHITE,new chess.Location(7,4)),null,null,new chess.Rook(WHITE, new chess.Location(7,7))]];
            gameState.set_curr_board(board);
            var start = new chess.Location(0,4);
            var end = new chess.Location(0,6);
            assert.equal(gameState.play_move(start,end,null),chess.MoveStatus.SUCCESS);
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
