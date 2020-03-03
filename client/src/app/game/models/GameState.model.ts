import { Location } from './Location.model';

export class GameState {
  values: string[][];
  private blankChar = "&#160";

  constructor(values: string[][]) {
    this.values = values;
  }

  // inLocation(location: Location) {
  public inLocation(row: number, col: string): string {
    // "a".charCodeAt(0) == 97
    return this.values[8 - row][col.charCodeAt(0) - 97];
  }

  public isEmpty(location: Location): boolean {
    return this.inLocation(location.row, location.col) === this.blankChar;
  }

  private setValue(location: Location, value: string) {
    this.values[8 - location.row][location.col.charCodeAt(0) - 97] = value;
  }

  move(start: Location, end: Location) {
    this.setValue(end, this.inLocation(start.row, start.col));
    this.setValue(start, this.blankChar);
  }

  updateState(values: string[][]) {
    this.values = values;
  }
}
