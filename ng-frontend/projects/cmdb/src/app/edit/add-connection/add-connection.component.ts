import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { ConnectionRule, Connection, ConfigurationItem, ErrorActions, MetaDataSelectors, ReadFunctions } from 'backend-access';
import { ItemSelectors } from '../../shared/store/store.api';

@Component({
    selector: 'app-add-connection',
    templateUrl: './add-connection.component.html',
    styleUrls: ['./add-connection.component.scss'],
    standalone: false
})
export class AddConnectionComponent implements OnInit {
  @Input({required: true}) rule: ConnectionRule;
  @Input({required: true}) itemId: string;
  @Output() connectionSaved = new EventEmitter<Connection>();
  connection = new Connection();
  configurationItems: ConfigurationItem[] = [];
  loading = false;
  error = false;
  noResult = false;

  constructor(private http: HttpClient,  private store: Store) { }

  get configurationItem() {
    return this.store.select(ItemSelectors.configurationItem);
  }

  get connectionType() {
    return this.store.select(MetaDataSelectors.selectSingleConnectionType(this.rule.connectionTypeId));
  }

  get connectionRule() {
    return this.rule;
  }

  get targetItemType() {
    return this.store.select(MetaDataSelectors.selectSingleItemType(this.rule.lowerItemTypeId));
  }

  get isDescriptionValid() {
    return new RegExp(this.connectionRule.validationExpression).test(this.connection.description);
  }

  ngOnInit() {
    this.loading = true;
    this.connection.ruleId = this.rule.id;
    this.connection.typeId = this.rule.connectionTypeId;
    this.connection.upperItemId = this.itemId;
    this.connection.description = '';
    ReadFunctions.connectableItemsForItem(this.http, this.itemId, this.rule.id).subscribe((configurationItems) => {
        this.configurationItems = configurationItems;
        this.loading = false;
        this.noResult = configurationItems.length === 0;
        this.error = false;
        if (!this.noResult) {
          this.connection.lowerItemId = configurationItems[0].id;
        }
      }, (error: HttpErrorResponse) => {
        this.configurationItems = [];
        this.loading = false;
        this.error = true;
        this.noResult = true;
        this.store.dispatch(ErrorActions.error({error, fatal: false}));
      });
  }

  onSave() {
    this.connectionSaved.emit(this.connection);
  }

  onCancel() {
    this.connectionSaved.emit(undefined);
  }

}
