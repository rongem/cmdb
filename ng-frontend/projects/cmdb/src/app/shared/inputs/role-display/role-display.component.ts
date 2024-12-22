import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-role-display',
    templateUrl: './role-display.component.html',
    styleUrls: ['./role-display.component.scss'],
    standalone: false
})
export class RoleDisplayComponent implements OnInit {
  @Input() role: number;

  constructor() { }

  ngOnInit() {
    if (this.role < 0 || this.role > 2) {
      this.role = 0;
    }
  }

}
