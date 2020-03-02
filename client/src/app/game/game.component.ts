import { Component, OnInit } from '@angular/core';
import { RequestService } from '../request.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  color: string;

  constructor(private requestService: RequestService) { }

  ngOnInit(): void {
    this.color = this.requestService.getAssignedColor();
  }
}
