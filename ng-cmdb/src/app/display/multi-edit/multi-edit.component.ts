import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { tap } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';
import * as fromSelectMultiEdit from 'src/app/display/store/multi-edit.selectors';

@Component({
  selector: 'app-multi-edit',
  templateUrl: './multi-edit.component.html',
  styleUrls: ['./multi-edit.component.scss']
})
export class MultiEditComponent implements OnInit {

  constructor(private store: Store<fromApp.AppState>,
              private router: Router) { }

  ngOnInit() {
  }

  get items() {
    return this.store.pipe(
      select(fromSelectMultiEdit.selectItems),
      tap(items => {
        if (!items || items.length === 0) {
          this.router.navigate(['display', 'search']);
        }
      })
    );
  }

}
