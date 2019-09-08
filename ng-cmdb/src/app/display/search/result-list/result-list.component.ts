import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Guid } from 'src/app/shared/guid';

import { SearchService } from '../search.service';
import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromDisplay from 'src/app/display/store/display.reducer';
import * as DisplayActions from 'src/app/display/store/display.actions';

@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss']
})
export class ResultListComponent implements OnInit {

  displayStore: Observable<fromDisplay.State>;

  constructor(public search: SearchService,
              private router: Router,
              private store: Store<fromApp.AppState>,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.displayStore = this.store.select(fromApp.DISPLAY);
  }

  onEditList() {
    this.store.dispatch(DisplayActions.setVisibilityState({visibilityState: fromDisplay.VisibleComponent.None}));
    this.router.navigate(['results'], { relativeTo: this.route});
  }

  onDisplayItem(guid: Guid) {
    this.store.dispatch(DisplayActions.setVisibilityState({visibilityState: fromDisplay.VisibleComponent.None}));
    this.router.navigate(['configuration-item', guid], { relativeTo: this.route});
  }

}
