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
