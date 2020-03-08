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
    this.http.get<ColorResponse>("/api/color").subscribe(response => {
      console.log("Got colorResponse");
      console.log(response);
      this.assignedColor = response.color;
      this.router.navigateByUrl("/play");
    });
  }

  getAssignedColor() {
    return this.assignedColor;
  }

  getMoves(location: Location) {
    return this.http.get("/api/get_moves");
  }

  sendMove(start: Location, end: Location): MoveStatus {
    this.http.post("/send_move", { start, end });
    return MoveStatus.Success;
  }
}
