import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { map, skipWhile, take } from 'rxjs';
import { ConfigurationItem, EditActions, MetaDataSelectors, ReadActions, ValidatorService } from 'backend-access';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.scss']
})
export class CreateItemComponent implements OnInit {
  itemForm: FormGroup;

  constructor(private router: Router,
              private actions$: Actions,
              private store: Store,
              private validator: ValidatorService,
              private fb: FormBuilder) { }

  get itemTypes() {
    return this.store.select(MetaDataSelectors.selectItemTypes);
  }

  ngOnInit() {
    this.itemForm = this.fb.group({
        typeId: '',
        name: '',
      }, { asyncValidators: [this.validator.validateNameAndType]}
    );
    this.store.select(MetaDataSelectors.selectState).pipe(
      skipWhile(meta => !meta.validData),
      take(1),
    ).subscribe(meta => {
      if (meta.itemTypes && meta.itemTypes.length > 0) {
        this.itemForm.get('typeId').setValue(meta.itemTypes[0].id);
      }
    });
    this.store.dispatch(ReadActions.clearConfigurationItem({ success: true }));
    this.actions$.pipe(
      ofType(ReadActions.setConfigurationItem),
      take(1),
      map(action => action.configurationItem.id)
    ).subscribe(id => this.router.navigate(['display', 'configuration-item', id, 'edit']));
  }

  onSubmit() {
    this.store.dispatch(EditActions.createConfigurationItem({configurationItem: this.itemForm.value as ConfigurationItem}));
  }

}
