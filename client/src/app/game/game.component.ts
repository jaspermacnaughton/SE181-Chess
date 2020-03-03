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
  isTurn: boolean;
  blank = "&#160"; // If use empty string div doesn't render
  gameState: GameState;
  selectedPiece: Location;
  selectedPieceMoves: Location[];

  constructor(private requestService: RequestService) { }

  ngOnInit(): void {
    const blank = this.blank;
    this.color = this.requestService.getAssignedColor();
    this.isTurn = this.color === "white";
    this.gameState = new GameState([
      ["&#9820;", "&#9822;", "&#9821;", "&#9819;", "&#9818;", "&#9821;", "&#9822;", "&#9820;"],
      ["&#9823;", "&#9823;", "&#9823;", "&#9823;", "&#9823;", "&#9823;", "&#9823;", "&#9823;"],
      [blank, blank, blank, blank, blank, blank, blank, blank],
      [blank, blank, blank, blank, blank, blank, blank, blank],
      [blank, blank, blank, blank, blank, blank, blank, blank],
      [blank, blank, blank, blank, blank, blank, blank, blank],
      ["&#9817;", "&#9817;", "&#9817;", "&#9817;", "&#9817;", "&#9817;", "&#9817;", "&#9817;"],
      ["&#9814;", "&#9816;", "&#9815;", "&#9812;", "&#9813;", "&#9815;", "&#9816;", "&#9814;"]
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

      this.selectedPiece = clickedLocation;
      // FIXME: Make request here
      this.selectedPieceMoves = [new Location(5, "a"), new Location(1, "h")];
    } else {
      // Piece has already been selected - if in selected piece array make move
      this.selectedPieceMoves.forEach(potentialMove => {
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
