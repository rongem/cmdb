import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, Subscription, switchMap, take, withLatestFrom } from 'rxjs';
import {
  ConfigurationItem,
  ConnectionRule,
  FullConfigurationItem,
  FullConnection,
  MetaDataSelectors,
  ReadFunctions,
  ValidatorService,
} from 'backend-access';
import { MultiEditActions, MultiEditSelectors, SearchFormSelectors } from '../../shared/store/store.api';
import { MultiEditService } from '../services/multi-edit.service';
import { TargetConnections } from '../objects/target-connections.model';

@Component({
  selector: 'app-multi-edit',
  templateUrl: './multi-edit.component.html',
  styleUrls: ['./multi-edit.component.scss']
})
export class MultiEditComponent implements OnInit, OnDestroy {
  // forms to edit items via header menu
  attributeForm: FormGroup;
  connectionForm: FormGroup;
  linkForm: FormGroup;
  // index of column that is being dragged
  sourceIndex: number | undefined;
  // index of column that dragged column is hovering on
  presumedTargetIndex: number | undefined;
  // columns for drag and drop column order change
  columns: number[] = [];
  // what data should be shown with column
  columnContents: string[] = [];
  private itemTypeId: string;
  private subscriptions: Subscription[] = [];
  private deletableConnectionsByRule: Map<string, TargetConnections[]> = new Map();
  private addableConnectionRules: ConnectionRule[] = [];
  private availableItemsForRule = new Map<string, Observable<ConfigurationItem[]>>();


  constructor(private http: HttpClient,
              private store: Store,
              private router: Router,
              private fb: FormBuilder,
              private val: ValidatorService,
              private mes: MultiEditService) { }

  get items() {
    return this.store.select(MultiEditSelectors.selectedItems);
  }

  get resultColumns() {
    return this.store.select(MultiEditSelectors.selectResultListFullColumnsForSearchItemType);
  }

  get connectionRules() {
    return this.store.select(MetaDataSelectors.selectSingleItemType(this.itemTypeId)).pipe(
      switchMap(itemType =>
        this.store.select(MetaDataSelectors.selectConnectionRulesForUpperItemType(itemType))
      )
    );
  }

  get ruleIdsCanBeDeleted() {
    return this.deletableConnectionsByRule.keys();
  }

  get working() {
    return this.store.select(MultiEditSelectors.selectOperationsLeft);
  }

  get uniqueLinks() {
    return this.store.select(MultiEditSelectors.uniqueLinks);
  }

  private get attributeTypes() {
    return this.store.select(SearchFormSelectors.attributeTypesForCurrentSearchItemType);
  }

  ngOnInit(): void {
    this.subscriptions.push(this.items.pipe(
      withLatestFrom(
        this.store.select(SearchFormSelectors.searchItemType),
        this.store.select(SearchFormSelectors.connectionRulesForCurrentIsUpperSearchItemType),
        this.attributeTypes,
      ),
    ).subscribe(([items, itemType, connectionRules, attributeTypes]) => {
      // check if there are items and are all of the same type
      if (!itemType || !items || items.length === 0 || [...new Set(items.map(i => i.typeId))].length !== 1) {
        const target = ['display'];
        if (itemType) {
          target.push(itemType.id);
        }
        this.router.navigate(target);
      } else {
        this.itemTypeId = itemType?.id ?? items[0].typeId;
        // set columns if not yet done
        if (this.columns.length === 0) {
          this.columnContents = ['name', ...attributeTypes.map(a => 'a:' + a.id), ...connectionRules.map(r => 'ctl:' + r.id), 'links'];
          this.columns = this.columnContents.map((c, index) => index);
        }
        // extract all target ids from connections
        const targetIds = [...new Set(items.map(item => item.connectionsToLower.map(c => c.targetId)).flat())];
        // check if target is connected to all items and place it into new array if so
        this.deletableConnectionsByRule.clear();
        targetIds.forEach(guid => {
          const connections: FullConnection[] = [];
          const found = items.every(item => {
            if (item.connectionsToLower.findIndex(conn => conn.targetId === guid) === -1) {
              return false;
            }
            connections.push(item.connectionsToLower.find(conn => conn.targetId === guid));
            return true;
          });
          if (found === true) {
            connections.forEach(connection => {
              const targetName = connection.targetType + ': ' + connection.targetName;
              const sourceItemId = items.find(i => i.connectionsToLower.findIndex(co => co.id === connection.id) !== -1).id;
              if (this.deletableConnectionsByRule.has(connection.ruleId)) {
                const ruleContent = this.deletableConnectionsByRule.get(connection.ruleId);
                const target = ruleContent.find(t => t.targetId === connection.targetId);
                if (target) {
                  target.connectionInfos.push({ sourceItemId, connection });
                } else {
                  ruleContent.push(new TargetConnections(connection.targetId, targetName, { sourceItemId, connection }));
                }
              } else {
                this.deletableConnectionsByRule.set(connection.ruleId, [new TargetConnections(connection.targetId, targetName, { sourceItemId, connection })]);
              }
            });
          }
        });
        // find rules that have enough connections to upper left for all items
        this.addableConnectionRules = [];
        connectionRules.filter(rule => rule.maxConnectionsToUpper >= items.length).forEach(rule => {
          const spaceLeft = items.every(item => {
            const conns = item.connectionsToLower.filter(conn => conn.ruleId === rule.id);
            return (conns.length < rule.maxConnectionsToLower);
          });
          if (spaceLeft === true) {
            this.addableConnectionRules.push(rule);
          }
        });
        const form: {[key: string]: AbstractControl} = {};
        this.addableConnectionRules.forEach(rule => {
          form[rule.id] = this.fb.group({
            ruleId: this.fb.control(rule.id),
            typeId: this.fb.control(rule.connectionTypeId),
            targetId: this.fb.control('', Validators.required),
            description: this.fb.control('', this.val.validateMatchesRegex(rule.validationExpression))
          });
        });
        this.connectionForm = this.fb.group(form);
      }
    }));
    this.subscriptions.push(this.attributeTypes.subscribe(attributeTypes => {
      const form: {[key: string]: AbstractControl} = {};
      attributeTypes.forEach(attributeType => {
        form[attributeType.id] = this.fb.control('', [Validators.required, this.val.validateMatchesRegex(attributeType.validationExpression)]);
      });
      this.attributeForm = this.fb.group(form);
    }));
    this.linkForm = this.fb.group({
      uri: this.fb.control('https://', [Validators.required, this.val.validatUrl]),
      description: this.fb.control('', [Validators.required]),
    });
  }

  ngOnDestroy(): void {
      this.subscriptions.forEach(s => s.unsubscribe());
  }

  getResultColumn(key: string) {
    return this.resultColumns.pipe(
      map(resultcolumns => resultcolumns.find(rc => rc.key === key).value),
    );
  }

  getValue(ci: FullConfigurationItem, attributeTypeId: string) {
    const att = ci.attributes.find(a => a.typeId === attributeTypeId);
    return att ? att.value : '-';
  }

  getValuesForAttributeType(typeId: string) {
    return this.items.pipe(
      map(items => [...new Set(items.filter(item =>
        item.attributes.findIndex(att => att.typeId === typeId) > -1).map(item => item.attributes.find(att => att.typeId === typeId).value).sort())]));
  }

  getIsItemProcessed(itemId: string) {
    return this.store.select(MultiEditSelectors.idPresent(itemId));
  }

  getDeletableConnectionsForRule(ruleId: string) {
    return this.deletableConnectionsByRule.get(ruleId) ?? [];
  }

  getConnections(ci: FullConfigurationItem, prop: string) {
    const val = prop.split(':');
    switch (val[0]) {
      case 'ctl':
        return ci.connectionsToLower.filter(c => c.ruleId.toString() === val[1]);
      case 'ctu':
        return ci.connectionsToUpper.filter(c => c.ruleId.toString() === val[1]);
      default:
        return [];
    }
  }

  getItemType(typeId: string) {
    return this.store.select(MetaDataSelectors.selectSingleItemType(typeId));
  }

  getConnectionType(typeId: string) {
    return this.store.select(MetaDataSelectors.selectSingleConnectionType(typeId));
  }

  getConnectionRuleAllowsAdding(ruleId: string) {
    return this.addableConnectionRules.map(r => r.id).includes(ruleId);
  }

  getAvailableItems(ruleId: string, items: FullConfigurationItem[]) {
    if (!this.availableItemsForRule.has(ruleId)) {
      this.availableItemsForRule.set(ruleId, ReadFunctions.availableItemsForRuleId(this.http, ruleId, items.length).pipe(
          map(configurationItems => configurationItems.filter(item => items.every(i =>
              i.connectionsToLower.findIndex(c => c.ruleId === ruleId && c.targetId === item.id) === -1
            ))
          )
        ));
    }
    return this.availableItemsForRule.get(ruleId);
  }

  clearKey = (key: string) =>  key.includes(':') ? key.split(':')[1] : key;

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  onDragStart() {}

  onDragEnd() {}

  onDragOver() {}

  onDrop() {}

  onChangeAttribute(typeId: string, value?: string) {
    if (value) { // set new value
      this.items.pipe(take(1)).subscribe(items => this.mes.setAttributeValues(items, typeId, value));
    } else { // delete attribute
      this.items.pipe(take(1)).subscribe(items => this.mes.deleteAttributes(items, typeId));
    }
  }

  onAddConnection(ruleId: string) {
    this.items.pipe(take(1)).subscribe(items => this.mes.createConnections(items, this.connectionForm.get(ruleId).value));
  }

  onDeleteConnections(connections: TargetConnections) {
    this.mes.deleteConnections(connections);
  }

  onRemoveItem(item: FullConfigurationItem) {
    this.store.dispatch(MultiEditActions.removeSelectedItem({item}));
  }

  onAddLink() {
    this.items.pipe(take(1)).subscribe(items => this.mes.addLink(items, this.linkForm.value));
  }

  onDeleteAllLinks() {
    this.items.pipe(take(1)).subscribe(items => this.mes.deleteAllLinks(items));
  }

  onDeleteLink(uri: string) {
    this.items.pipe(take(1)).subscribe(items => this.mes.deleteLink(items, uri));
  }

}
