import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { AppState } from '../../../shared/store/app.reducer';
import { Model } from '../../../shared/objects/model.model';
import { getRouterState, selectRouterStateId } from '../../../shared/store/router/router.reducer';

@Component({
  selector: 'app-model-item',
  templateUrl: './model-item.component.html',
  styleUrls: ['./model-item.component.scss']
})
export class ModelItemComponent implements OnInit {
  @Input() model: Model;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
  }

  get route() {
    return this.store.pipe(
      select(getRouterState),
      map(routerState => routerState.state),
    );
  }

  get routerStateId() {
    return this.store.select(selectRouterStateId);
  }

}
