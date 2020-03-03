import { Location } from './Location.model';

export class GameState {
  values: string[][];
  private blankChar = "&#160";

  constructor(values: string[][]) {
    this.values = values;
  }

  // inLocation(location: Location) {
  public inLocation(location: Location): string {
    // "a".charCodeAt(0) == 97
    return this.values[8 - location.row][location.col.charCodeAt(0) - 97];
  }

  public isEmpty(location: Location): boolean {
    return this.inLocation(location) === this.blankChar;
  }

  private setValue(location: Location, value: string) {
    this.values[8 - location.row][location.col.charCodeAt(0) - 97] = value;
  }

  move(start: Location, end: Location) {
    this.setValue(end, this.inLocation(start));
    this.setValue(start, this.blankChar);
  }

  updateState(values: string[][]) {
    this.values = values;
  }
}
