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
            console.log("HERE");
            console.log(gameState.game_over());
        it('Game over for basic checkmate', function (){
            assert.equal(gameState.game_over(), chess.MoveStatus.WHITE_WIN);
        });
    });
});

describe('king', function (){
    var gameState = new chess.GameState(chess.GameState.default_board(), Players, Player2);
    var emptyState = new chess.GameState(chess.GameState.empty_board(), Players, Player2);
    var color = chess.Players.WHITE.COLOR;
    describe('#get_moves()', function(){
        var location = new chess.Location(0,5);
        var king = new chess.King(color, location);
        var moves = king.get_moves(gameState);
        it('King cannot move onto a space occupied by a same color piece', function (){
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
