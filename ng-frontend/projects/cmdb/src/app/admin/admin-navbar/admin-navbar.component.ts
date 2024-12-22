import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { SearchFormSelectors } from '../../shared/store/store.api';

@Component({
    selector: 'app-admin-navbar',
    templateUrl: './admin-navbar.component.html',
    styleUrls: ['./admin-navbar.component.scss'],
    standalone: false
})
export class AdminNavbarComponent implements OnInit {

  constructor(private store: Store, private router: Router) { }

  ngOnInit() {
  }

  gotoList() {
    this.store.select(SearchFormSelectors.searchItemType).pipe(take(1)).subscribe(itemType => {
      if (itemType) {
        this.router.navigate(['display', 'item-type', itemType.id]);
      } else {
        this.router.navigate(['display']);
      }
    });
  }

}
