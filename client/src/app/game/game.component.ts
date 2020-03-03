import { Component, OnInit } from '@angular/core';
import { RequestService } from '../request.service';
import { GameState } from './models/GameState.model';
import { Location } from './models/Location.model';

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
  blank = "&#160"; // If use empty string div doesn't render
  gameState: GameState;
  selectedPiece: Location;
  selectedPieceMoves: Location[];

  constructor(private requestService: RequestService) { }

  ngOnInit(): void {
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
    this.gameState = new GameState([
      ["&#9820;", "&#9822;", "&#9821;", "&#9819;", "&#9818;", "&#9821;", "&#9822;", "&#9820;"],
      ["&#9823;", "&#9823;", "&#9823;", "&#9823;", "&#9823;", "&#9823;", "&#9823;", "&#9823;"],
      [blank, blank, blank, blank, blank, blank, blank, blank],
      [blank, blank, blank, blank, blank, blank, blank, blank],
      [blank, blank, blank, blank, blank, blank, blank, blank],
      [blank, blank, blank, blank, blank, blank, blank, blank],
      ["&#9817;", "&#9817;", "&#9817;", "&#9817;", "&#9817;", "&#9817;", "&#9817;", "&#9817;"],
      ["&#9814;", "&#9816;", "&#9815;", "&#9813;", "&#9812;", "&#9815;", "&#9816;", "&#9814;"]
    ]);
    this.selectedPiece = null;
    this.selectedPieceMoves = [];
    // this.gameState = this.requestService.
  }

  getSquareColor(row: number, col: string): string {
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
    if (this.isHighlighted(row, col)) {
      classString += " highlighted";
    }
    return classString;
  }

  private isHighlighted(row: number, col: string): boolean {
    const location = new Location(row, col);
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
    // return this.gameState.inLocation(new Location(row, col));
    return this.gameState.inLocation(row, col);
  }

  onClickSquare(row: number, col: string) {
    console.log("WARNING: not checking whether its your turn!");
    // if (!this.isTurn) {
    //   console.log("Not your turn");
    //   return;
    // }
    const clickedLocation = new Location(row, col);
    if (this.selectedPiece == null) {
      // Then we have yet to select a piece

      if (this.gameState.isEmpty(clickedLocation)) {
        // FIXME: Also check if piece is correct color clientside?
        return;
      }

      this.selectedPiece = clickedLocation;
      // FIXME: Make request here
      // FIXME: Also handle if click blank space/not their piece
      this.selectedPieceMoves = [new Location(3, "f"), new Location(3, "h")];
    } else {
      // Piece has already been selected - if in selected piece array make move
      this.selectedPieceMoves.forEach(potentialMove => {
        if (clickedLocation.isEqual(this.selectedPiece)) {
          // If user just clicks back on selected piece just
          return;
        }
        if (clickedLocation.isEqual(potentialMove)) {
          this.moveSelectedPiece(clickedLocation);
        }
      });
      this.selectedPiece = null;
      this.selectedPieceMoves = [];
    }
  }

  private moveSelectedPiece(location: Location) {
    this.gameState.move(this.selectedPiece, location);

  }

  onRestart() {

  }

  onResign() {

  }
}
