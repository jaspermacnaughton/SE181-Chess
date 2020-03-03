export class Location {
  public row: number;
  public col: string;

  constructor(row: number, col: string) {
    this.row = row;
    this.col = col.toLowerCase();
  }

  public toString(): string {
    return this.col + this.row;
  }

  public isEqual(otherLocation: Location): boolean {
    return ((this.col === otherLocation.col) && (this.row === otherLocation.row));
  }
}
