import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private assignedColor: string;

  constructor(private http: HttpClient, private router: Router) { }

  requestColor(requestedColor: string) {
    // this.http.get("/color", ).subscribe(response => {
      this.assignedColor = requestedColor;
      this.router.navigateByUrl("/play");
    // });
  }

  getAssignedColor() {
    return this.assignedColor;
  }
}
