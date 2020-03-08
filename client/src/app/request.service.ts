import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MoveStatus } from './game/models/MoveStatus.model';
import { Location } from './game/models/Location.model';

export interface ColorResponse {
  color: string;
  status: MoveStatus;
}

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private assignedColor: string;

  constructor(private http: HttpClient, private router: Router) { }

  requestColor(requestedColor: string) {
    this.http.post<ColorResponse>("/api/color", {color: requestedColor}).subscribe(response => {
      this.assignedColor = response.color;
      this.router.navigateByUrl("/play");
    });
  }

  getAssignedColor() {
    return this.assignedColor;
  }

  getMoves(location: Location) {
    console.log("numeric row = " + (8 - location.row));
    console.log("col = " + (location.col.charCodeAt(0) - 97));
    this.http.post<{status: MoveStatus, moves: {row: number, col: number}[]}>("/api/get_moves", {
      piece: {
        row: 8 - location.row,
        col: location.col.charCodeAt(0) - 97
      }
    }).subscribe(res => {
      console.log(res.moves);
      const moves = [];
      res.moves.forEach(move => {
        let moveObject = new Location(8 - move.row, String.fromCharCode(move.col + 97));
        console.log(moveObject.toString());
        moves.push(moveObject);
      });
      console.log(moves);
      return moves;
    });
  }

  sendMove(start: Location, end: Location) {
    return this.http.post("/send_move", { start, end });
  }
}
