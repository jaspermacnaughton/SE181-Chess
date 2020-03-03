import { Location } from './Location.model';

export class GameState {
  values: string[][];

  constructor(values: string[][]) {
    this.values = values;
  }

  // inLocation(location: Location) {
  inLocation(row: number, col: string): string {
    // "a".charCodeAt(0) == 97
    return this.values[8 - row][col.charCodeAt(0) - 97];
  }

  setValue(location: Location, value: string) {
    this.values[8 - location.row][location.col.charCodeAt(0) - 97] = value;
  }

  move(start: Location, end: Location) {
    this.setValue(end, this.inLocation(start.row, start.col));
    this.setValue(start, "&#160");
  }

  updateState(values: string[][]) {
    this.values = values;
  }
}
