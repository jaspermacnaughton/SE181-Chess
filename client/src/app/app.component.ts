import { Component } from '@angular/core';
import { RequestService } from './request.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'client';

  constructor(private requestService: RequestService) {}

  colorHasBeenSelected(): boolean {
    return this.requestService.getAssignedColor() !== "";
  }
}
