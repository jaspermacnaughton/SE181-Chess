#!/usr/bin/node

const express = require('express');
const app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
const port = 8080;

const path = require('path');
app.use(express.static(path.join(__dirname, 'dist')));

var chess = require(__dirname + '/chess.js');

var player_ips = [];
var inGame = false;
var winner = null;

var game = new chess.GameState(chess.GameState.default_board(), player_ips, chess.Players.WHITE.COLOR);

// Returns index of player in player_ips or -1 if it doesn't exist
function get_player_id(id){
    return player_ips.indexOf(id);
}

function valid_player(id){
    return id == 0 || id == 1;
}

app.get('/', (req,res) => {
    // Dummy while in dev because of proxy
    res.write("<h1>Chess server</h1>");
    res.end();
});

app.post('/api/send_move', (req,res) => {
    var player = get_player_id(req.connection.remoteAddress);
    if(!valid_player(player)){
        res.json({
            "status" : chess.MoveStatus.INVALID,
            "msg" : "Not currently a valid player"
        });
        res.end();
        return;
    }

    var start_loc = req.body.start;
    var end_loc = req.body.end;
    var promotion = req.body.promotion;

    if(start_loc.row == null || start_loc.col == null){
        res.json({
            "status" : chess.MoveStatus.INVALID,
            "msg" : "Invalid start location"
        });
        res.end();
        return;
    }
    start_loc = new chess.Location(start_loc.row, start_loc.col);

    if(end_loc.row == null || end_loc.col == null){
        res.json({
            "status" : chess.MoveStatus.INVALID,
            "msg" : "Invalid end location"
        });
        res.end();
        return;
    }
    end_loc = new chess.Location(end_loc.row, end_loc.col);

    if(promotion == undefined){
        promotion = null;
    }

    var stat = game.play_move(start_loc, end_loc, promotion);
    // update global state for sync with other player
    if(stat == chess.MoveStatus.BLACK_WIN || stat == chess.MoveStatus.WHITE_WIN || stat == chess.MoveStatus.STALE_MATE){
        inGame = false;
        winner = stat;
    }

    res.json({
        "status" : stat
    });

});

app.post('/api/sync', (req,res) => {
    var player = get_player_id(req.connection.remoteAddress);
    if(!valid_player(player)){
        res.json({
            "status" : chess.MoveStatus.INVALID,
            "msg" : "Not currently a valid player"
        });
        res.end();
        return;
    }

    res.json({
        "GameState" : game,
        "inGame" : inGame,
        "game_status" : winner
    });
});

app.post('/api/get_moves', (req,res) => {
    var player = get_player_id(req.connection.remoteAddress);
    if(!valid_player(player)){
        res.json({
            "status" : chess.MoveStatus.INVALID,
            "msg" : "Not currently a valid player"
        });
        res.end();
        return;
    }

    var piece_loc = req.body.piece;
    if(piece_loc.row == null || piece_loc.col == null){
        res.json({
            "status" : chess.MoveStatus.INVALID,
            "msg" : "Invalid location"
        });
        res.end();
        return;
    }

    var piece = game.get_piece_on_board(new chess.Location(piece_loc.row, piece_loc.col));
    var moves = piece.get_moves(game);

    res.json({
        "status" : chess.MoveStatus.Success,
        "moves" : moves
    });

});

app.post('/api/restart', (req,res) => {
    game = new chess.GameState(chess.GameState.default_board(), player_ips, chess.Players.WHITE.COLOR);
    inGame = true;
    res.json({"status" : chess.MoveStatus.SUCCESS});
    res.send();
});

// This is questionable if a color request is sent midgame or something....
app.post('/api/color', (req,res) => {
    var player = get_player_id(req.connection.remoteAddress);
    if(player == -1){
        if(player_ips.length < 2){
            player_ips.push(req.connection.remoteAddress);
        }else{
            res.write("Already have two players");
            res.end();
            return;
        }
    }

    var color;
    switch(req.body.color){
        case "white":
            if(player != chess.Players.WHITE.COLOR){
                color = player_ips[0];
                player_ips[0] = player_ips[1];
                player_ips[1] = color;
            }
            color = "white";
            break;
        case "black":
            if(player != chess.Players.BLACK.COLOR){
                color = player_ips[0];
                player_ips[0] = player_ips[1];
                player_ips[1] = color;
            }
            color = "black";
            break;
        default:
            color = (player) ? "white" : "black";
            break;
    }

    res.json({
        "status" : chess.MoveStatus.Success,
        "color" : color
    });
});

app.post('/api/resign', (req,res) => {
    var player = get_player_id(req.connection.remoteAddress);
    if(!valid_player(player)){
        res.json({
            "status" : chess.MoveStatus.INVALID,
            "msg" : "Not currently a valid player",
        });
        return;
    }

    game = new chess.GameState(chess.default_board(), player_ips, chess.Players.WHITE.COLOR);

    if(player == chess.Players.WHITE.COLOR){
        winner = chess.Players.BLACK.COLOR;
        res.json({
            "status" : chess.MoveStatus.BLACK_WIN
        });
    }else{
        winner = chess.Players.WHITE.COLOR;
        res.json({
            "status" : chess.MoveStatus.WHITE_WIN
        });
    }
});

app.listen(port, () => {
    console.log("Server started, listening on port " + port);
});

