import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { VisibleComponent } from '../../../shared/store/display/visible-component.enum';
import { DisplayActions, DisplaySelectors } from '../../../shared/store/store.api';

@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss']
})
export class ResultListComponent implements OnInit {

  get resultList() {
    return this.store.select(DisplaySelectors.selectResultList);
  }

  get resultListPresent() {
    return this.store.select(DisplaySelectors.selectResultListPresent);
  }

  constructor(private router: Router,
              private store: Store,
              private route: ActivatedRoute) { }

  ngOnInit() {}

  onEditList() {
    this.store.dispatch(DisplayActions.setVisibilityState({visibilityState: VisibleComponent.none}));
    this.router.navigate(['results'], { relativeTo: this.route});
  }

  onDisplayItem(guid: string) {
    this.store.dispatch(DisplayActions.setVisibilityState({visibilityState: VisibleComponent.none}));
    this.router.navigate(['configuration-item', guid], { relativeTo: this.route});
  }

}
