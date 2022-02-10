import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { map, of, Subscription, switchMap, take, tap, withLatestFrom } from 'rxjs';
import { AttributeType, FullConfigurationItem, FullConnection, MetaDataSelectors, ValidatorService } from 'backend-access';
import { MultiEditActions, MultiEditSelectors, SearchFormSelectors } from '../shared/store/store.api';
import { MultiEditService } from './services/multi-edit.service';
import { TargetConnections } from '../shared/objects/target-connections.model';

@Component({
  selector: 'app-multi-edit',
  templateUrl: './multi-edit.component.html',
  styleUrls: ['./multi-edit.component.scss']
})
export class MultiEditComponent implements OnInit, OnDestroy {
  form: FormGroup;
  attributeForm: FormGroup;
  itemTypeId: string;
  subscriptions: Subscription[] = [];
  private deletableConnectionsByRule: Map<string, TargetConnections[]> = new Map();

  constructor(private store: Store,
              private router: Router,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private val: ValidatorService,
              private mes: MultiEditService,
              public dialog: MatDialog) { }

  get items() {
    return this.store.select(MultiEditSelectors.selectedItems);
  }

  get resultColumns() {
    return this.store.select(MultiEditSelectors.selectResultListFullColumns);
  }

  get attributeTypes() {
    if (!this.itemTypeId) {
      return of([] as AttributeType[]);
    }
    return this.store.select(MetaDataSelectors.selectAttributeTypesForItemType(this.itemTypeId));
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

  ngOnInit(): void {
    this.subscriptions.push(this.items.pipe(
      withLatestFrom(this.store.select(SearchFormSelectors.searchItemType)),
    ).subscribe(([items, itemType]) => {
      // check if there are items and are all of the same type
      if (!items || items.length === 0 || [...new Set(items.map(i => i.typeId))].length !== 1) {
        const target = ['display'];
        if (itemType) {
          target.push(itemType.id);
        }
        this.router.navigate(target);
      } else {
        this.itemTypeId = itemType?.id ?? items[0].typeId;
        // extract all target ids from connections
        const targetIds = [...new Set(items.map(item => item.connectionsToLower.map(c => c.targetId)).flat())];
        // check if target is connected to all items and place it into new array if so
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
      }
    }));
    this.subscriptions.push(this.attributeTypes.subscribe(attributeTypes => {
      const form: {[key: string]: AbstractControl} = {};
      attributeTypes.forEach(attributeType => {
        form[attributeType.id] = this.fb.control('', [Validators.required, this.val.validateMatchesRegex(attributeType.validationExpression)]);
      });
      this.attributeForm = this.fb.group(form);
    }));
    this.form = this.fb.group({
      connectionsToAdd: this.fb.array([]),
      linksToDelete: this.fb.array([]),
      linksToAdd: this.fb.array([]),
    });
  }

  ngOnDestroy(): void {
      this.subscriptions.forEach(s => s.unsubscribe());
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

  clearKey(key: string) {
    if (key.includes(':')) {
      return key.split(':')[1];
    }
    return key;
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  onChangeAttribute(typeId: string, value?: string) {
    if (value) { // set new value
      this.items.pipe(take(1)).subscribe(items => this.mes.setAttributeValues(items, typeId, value));
    } else { // delete attribute
      this.items.pipe(take(1)).subscribe(items => this.mes.deleteAttributes(items, typeId));
    }
  }

  onDeleteConnections(connections: TargetConnections) {
    this.mes.deleteConnections(connections);
  }

  onRemoveItem(item: FullConfigurationItem) {
    this.store.dispatch(MultiEditActions.removeSelectedItem({item}));
  }

  onSubmit() {
    this.mes.change(this.form.value);
    this.router.navigate(['working'], {relativeTo: this.route });
  }

}
