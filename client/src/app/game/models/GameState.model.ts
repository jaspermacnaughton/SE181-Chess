import { Location } from './Location.model';
import { Piece } from './Piece.model';

export class GameState {
  // values: string[][];
  pieces: Piece[][];
  private blankChar = "&#160";

  constructor(pieces: Piece[][]) {
    this.pieces = pieces;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.pieces.length; i++) {
      for (let j = 0; j < this.pieces[i].length; j++) {
        if (!this.pieces) {
          this.pieces[i][j] = new Piece(this.blankChar);
        }
      }
    }
  }

  // inLocation(location: Location) {
  public inLocation(location: Location): Piece {
    // "a".charCodeAt(0) == 97
    // const displayValue = this.pieces[8 - location.row][location.col.charCodeAt(0) - 97].display;
    // return displayValue === null ? displayValue : this.blankChar;
    return this.pieces[8 - location.row][location.col.charCodeAt(0) - 97];
  }

  public inLocationDisplay(location: Location): string {
    const locationValue = this.inLocation(location);
    return locationValue != null ? locationValue.display : this.blankChar;
  }

  public isEmpty(location: Location): boolean {
    return this.inLocationDisplay(location) === this.blankChar;
  }

  private setValue(location: Location, piece: Piece) {
    this.pieces[8 - location.row][location.col.charCodeAt(0) - 97] = piece;
  }

  move(start: Location, end: Location) {
    this.setValue(end, this.inLocation(start));
    // this.setValue(start, this.blankChar);
  }

  updateState(pieces: Piece[][]) {
    this.pieces = pieces;
  }
}
