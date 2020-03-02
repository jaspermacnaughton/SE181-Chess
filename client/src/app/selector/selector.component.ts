import { Component, OnInit } from '@angular/core';
import { RequestService } from '../request.service';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class SelectorComponent implements OnInit {

  constructor(private requestService: RequestService) { }

  ngOnInit(): void {
  }

  onSelect(requestedColor: string) {
    this.requestService.requestColor(requestedColor);
  }

}
