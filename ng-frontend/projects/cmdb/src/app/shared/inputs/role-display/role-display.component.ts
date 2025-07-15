import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-role-display',
    templateUrl: './role-display.component.html',
    styleUrls: ['./role-display.component.scss'],
    standalone: false
})
export class RoleDisplayComponent {
  @Input() role: number;

  get realRole() {
    if (this.role < 0 || this.role > 2) {
      return 0;
    }
    return this.role;
  }

}
