import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-help',
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.scss'],
    standalone: false
})
export class HelpComponent implements OnInit {
  helpVisible = false;

  constructor() { }

  ngOnInit() {
  }

  onToggle() {
    this.helpVisible = !this.helpVisible;
  }

}
