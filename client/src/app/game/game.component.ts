import { Component, OnInit } from '@angular/core';
import { RequestService } from '../request.service';
import { GameState } from './models/GameState.model';
import { Location } from './models/Location.model';
import { MoveStatus } from './models/MoveStatus.model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  color: string;
  rowVals: number[];
  colVals: string[];
  isTurn: boolean;
  boardLoaded: boolean;
  blank = "&#160"; // If use empty string div doesn't render
  gameState: GameState;
  selectedPiece: Location;
  selectedPieceMoves: Location[];

  constructor(private requestService: RequestService) { }

  ngOnInit(): void {
    this.boardLoaded = false;
    const blank = this.blank;
    this.color = this.requestService.getAssignedColor();
    if (this.color == null) {
      console.log("DEV: No Color selected: Defaulting to white");
      this.color = "white";
    }
    this.rowVals = [8, 7, 6, 5, 4, 3, 2, 1];
    this.colVals = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    if (this.color === "white") {
      this.isTurn = true;
    } else {
      this.isTurn = false;
      this.rowVals = this.rowVals.reverse();
      this.colVals = this.colVals.reverse();
    }
    this.requestService.sync().subscribe(res => {
      this.gameState = new GameState(res.GameState.board);
      this.boardLoaded = true;
    });
    // this.gameState = new GameState([
    //   ["&#9820;", "&#9822;", "&#9821;", "&#9819;", "&#9818;", "&#9821;", "&#9822;", "&#9820;"],
    //   ["&#9823;", "&#9823;", "&#9823;", "&#9823;", "&#9823;", "&#9823;", "&#9823;", "&#9823;"],
    //   [blank, blank, blank, blank, blank, blank, blank, blank],
    //   [blank, blank, blank, blank, blank, blank, blank, blank],
    //   [blank, blank, blank, blank, blank, blank, blank, blank],
    //   [blank, blank, blank, blank, blank, blank, blank, blank],
    //   ["&#9817;", "&#9817;", "&#9817;", "&#9817;", "&#9817;", "&#9817;", "&#9817;", "&#9817;"],
    //   ["&#9814;", "&#9816;", "&#9815;", "&#9813;", "&#9812;", "&#9815;", "&#9816;", "&#9814;"]
    // ]);
    this.selectedPiece = null;
    this.selectedPieceMoves = [];
  }

  getSquareBackground(row: number, col: string): string {
    let classString = "square";
    if (row % 2 === 0) {
      if (['a', 'c', 'e', 'g'].includes(col)) {
        classString += " white";
      } else {
        classString += " black";
      }
    } else {
      if (['a', 'c', 'e', 'g'].includes(col)) {
        classString += " black";
      } else {
        classString += " white";
      }
    }
    if (this.shouldBeHighlighted(new Location(row, col))) {
      classString += " highlighted";
    }
    return classString;
  }

  private shouldBeHighlighted(location: Location): boolean {
    let returnVal = false;
    if (this.selectedPiece != null && this.selectedPiece.isEqual(location)) {
      returnVal = true;
    }
    this.selectedPieceMoves.forEach(move => {
      if (move.isEqual(location)) {
        returnVal = true;
        return;
      }
    });
    return returnVal;
  }

  getInLocation(row: number, col: string): string {
    return this.gameState.inLocationDisplay(new Location(row, col));
  }

  onClickSquare(row: number, col: string) {
    // if (!this.isTurn) {
    //   console.log("Not your turn");
    //   return;
    // }
    const clickedLocation = new Location(row, col);
    if (this.selectedPiece == null) {
      // Then we have yet to select a piece

      if (this.gameState.isEmpty(clickedLocation)) {
        return;
      }

      this.selectedPiece = clickedLocation;
      this.requestService.getMoves(clickedLocation).subscribe(res => {
        res.moves.forEach(move => {
          console.log("Returned: row=" + move.row + ", col=" + move.col);
          const moveObject = new Location(8 - move.row, String.fromCharCode(move.col + 97));
          this.selectedPieceMoves.push(moveObject);
        });
      });
    } else {
      // Piece has already been selected - if in selected piece array make move
      this.selectedPieceMoves.forEach(potentialMove => {
        if (clickedLocation.isEqual(this.selectedPiece)) {
          // If user just clicks back on selected piece just unselect all
          this.selectedPiece = null;
          this.selectedPieceMoves = [];
          return;
        }
        if (clickedLocation.isEqual(potentialMove)) {
          this.moveSelectedPiece(clickedLocation);
          return;
        }
      });
    }
  }

  private moveSelectedPiece(location: Location) {
    this.requestService.sendMove(this.selectedPiece, location).subscribe(res => {
      // if (res.status === MoveStatus.Success) {
        this.gameState.move(this.selectedPiece, location);
        this.selectedPiece = null;
        this.selectedPieceMoves = [];
      // } else {
      //   console.log("Error moving piece: " + res.status);
      // }
    });
  }

  onRestart() {
    this.requestService.restart().subscribe(res => {
      console.log("Restart returned");
    });
  }

  onResign() {
    this.requestService.resign().subscribe(res => {
      console.log("Resign returned");
    });
  }

  onSync() {
    this.requestService.sync().subscribe(res => {
      this.gameState.updateState(res.GameState.board);
    });
  }
}
