import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent implements OnInit {
  location: Location;
  backgroundColor: string;

  constructor() { }

  ngOnInit(): void {
  }

}
