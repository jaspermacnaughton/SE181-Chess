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
    // console.log("numeric row = " + (8 - location.row));
    // console.log("col = " + (location.col.charCodeAt(0) - 97));
    return this.http.post<{status: MoveStatus, moves: {row: number, col: number}[]}>("/api/get_moves", {
      piece: {
        row: 8 - location.row,
        col: location.col.charCodeAt(0) - 97
      }
    });
  }

  sendMove(start: Location, end: Location) {
    return this.http.post("/send_move", { start, end });
  }
}
