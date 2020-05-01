import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map, withLatestFrom, take } from 'rxjs/operators';
import { ItemType, MetaDataSelectors, AttributeType, EditActions } from 'backend-access';

import * as BasicsActions from '../../../shared/store/basics/basics.actions';

import { AppState } from '../../../shared/store/app.reducer';
import { Model } from '../../../shared/objects/model.model';
import { getRouterState } from '../../../shared/store/router/router.reducer';
import { ExtendedAppConfigService } from '../../../shared/app-config.service';

@Component({
  selector: 'app-model-item',
  templateUrl: './model-item.component.html',
  styleUrls: ['./model-item.component.scss']
})
export class ModelItemComponent implements OnInit {
  @Input() model: Model;
  @Input() itemType: ItemType;
  formOpen = false;
  private modelItemType: ItemType;
  private attributeTypes: AttributeType[];

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.pipe(
      select(MetaDataSelectors.selectSingleItemTypeByName, ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Model),
      withLatestFrom(this.store.select(MetaDataSelectors.selectAttributeTypes)),
      take(1),
    ).subscribe(([itemType, attributeTypes]) => {
      this.modelItemType = itemType;
      this.attributeTypes = attributeTypes;
    });
  }

  get route() {
    return this.store.pipe(
      select(getRouterState),
      map(routerState => routerState.state),
    );
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
