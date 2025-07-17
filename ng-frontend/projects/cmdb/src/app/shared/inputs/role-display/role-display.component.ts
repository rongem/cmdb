import { Component, Input } from '@angular/core';
function realRole(role: number) {
  if (role < 0 || role > 2) {
    return 0;
  }
  return role;
}


@Component({
    selector: 'app-role-display',
    templateUrl: './role-display.component.html',
    styleUrls: ['./role-display.component.scss'],
    standalone: false
})
export class RoleDisplayComponent {
  @Input({required: true, transform: realRole}) role: 0 | 1 | 2;

}
