import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MoveStatus } from './game/models/MoveStatus.model';
import { Location } from './game/models/Location.model';
import { Observable } from 'rxjs';

export interface ColorResponse {
  color: string;
  status: MoveStatus;
}

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private assignedColor: string;

  constructor(private http: HttpClient) {
    this.assignedColor = "";
  }

  private convertToNumericLocation(location: Location) {
    return {
      row: 8 - location.row,
      col: location.col.charCodeAt(0) - 97
    };
  }

  requestColor(requestedColor: string) {
    this.http.post<ColorResponse>("/api/color", {color: requestedColor}).subscribe(response => {
      this.assignedColor = response.color;
    });
  }

  getAssignedColor() {
    return this.assignedColor;
  }

  getMoves(location: Location) {
    const numericRow = 8 - location.row;
    const numericCol = location.col.charCodeAt(0) - 97;
    console.log("getMoves() with row=" + numericRow + ", col=" + numericCol);
    return this.http.post<{status: MoveStatus, moves: {row: number, col: number}[]}>("/api/get_moves", {
      piece: this.convertToNumericLocation(location)
    });
  }

  sendMove(start: Location, end: Location) {
    return this.http.post("/api/send_move", {
      start: this.convertToNumericLocation(start),
      end: this.convertToNumericLocation(end)
    });
  }

  resign() {
    return this.http.post("/api/resign", {});
  }

  restart() {
    return this.http.post("/api/restart", {});
  }

  sync() {
    return this.http.post("/api/sync", {});
  }
}
