import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map, withLatestFrom, take } from 'rxjs';
import { ItemType, MetaDataSelectors, AttributeType } from 'backend-access';

import * as BasicsActions from '../../../shared/store/basics/basics.actions';
import * as fromSelectBasics from '../../../shared/store/basics/basics.selectors';

import { AppState } from '../../../shared/store/app.reducer';
import { Model } from '../../../shared/objects/model.model';
import { getRouterState } from '../../../shared/store/router/router.reducer';
import { ExtendedAppConfigService } from '../../../shared/app-config.service';

@Component({
    selector: 'app-model-item',
    templateUrl: './model-item.component.html',
    styleUrls: ['./model-item.component.scss'],
    standalone: false
})
export class ModelItemComponent implements OnInit {
  @Input() model: Model;
  @Input() itemType: ItemType;
  formOpen = false;
  private modelItemType: ItemType;
  private attributeTypes: AttributeType[];

  constructor(private store: Store<AppState>) { }

  get route() {
    return this.store.pipe(
      select(getRouterState),
      map(routerState => routerState.state),
    );
  }

  ngOnInit(): void {
    this.store.pipe(
      select(MetaDataSelectors.selectSingleItemTypeByName(ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Model)),
      withLatestFrom(this.store.select(MetaDataSelectors.selectAttributeTypes)),
      take(1),
    ).subscribe(([itemType, attributeTypes]) => {
      this.modelItemType = itemType;
      this.attributeTypes = attributeTypes;
    });
  }

  isModelIncomplete(modelId: string) {
    return this.store.select(fromSelectBasics.selectIncompleteModelIds).pipe(map(ids => ids.includes(modelId)));
  }

  onSubmit(newModel: Model) {
    this.formOpen = false;
    this.store.dispatch(BasicsActions.updateModel({currentModel: this.model, updatedModel: newModel}));
  }

  onDelete() {
    this.formOpen = false;
    this.store.dispatch(BasicsActions.deleteModel({modelId: this.model.id}));
  }

}
