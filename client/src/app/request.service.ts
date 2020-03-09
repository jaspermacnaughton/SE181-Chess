import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MoveStatus } from './game/models/MoveStatus.model';
import { Location } from './game/models/Location.model';
import { Piece } from './game/models/Piece.model';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private assignedColor: string;

  constructor(private http: HttpClient, private snackbar: MatSnackBar) {
    this.assignedColor = "";
  }

  private convertToNumericLocation(location: Location) {
    return {
      row: 8 - location.row,
      col: location.col.charCodeAt(0) - 97
    };
  }

  requestColor(requestedColor: string) {
    this.http.post<{color: string, status: string, msg: string}>("/api/color", {color: requestedColor})
    .subscribe(res => {
      if (res.status === "Success") {
        this.assignedColor = res.color;
      } else {
        console.log(res);
        this.snackbar.open(res.msg, "Dismiss", {
          duration: 5000,
        });
      }

    });
  }

  getAssignedColor() {
    return this.assignedColor;
  }

  getMoves(location: Location) {
    return this.http.post<{status: string, msg: string, moves: {row: number, col: number}[]}>("/api/get_moves", {
      piece: this.convertToNumericLocation(location)
    });
  }

  sendMove(start: Location, end: Location) {
    return this.http.post<{status: string}>("/api/send_move", {
      start: this.convertToNumericLocation(start),
      end: this.convertToNumericLocation(end)
    });
  }

  resign() {
    return this.http.post("/api/resign", {});
  }

  restart() {
    return this.http.post<{status: MoveStatus}>("/api/restart", {});
  }

  sync() {
    return this.http.post<{GameState: {board: Piece[][]}}>("/api/sync", {});
  }
}
