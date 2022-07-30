import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, Subscription, switchMap, take, withLatestFrom } from 'rxjs';
import {
  ConfigurationItem,
  ConnectionRule,
  ErrorActions,
  FullConfigurationItem,
  FullConnection,
  MetaDataSelectors,
  ReadFunctions,
  ValidatorService,
} from 'backend-access';
import { MultiEditActions, MultiEditSelectors, SearchFormSelectors } from '../../shared/store/store.api';
import { MultiEditService } from '../services/multi-edit.service';
import { TargetConnections } from '../objects/target-connections.model';
import { ClipboardHelper } from '../objects/clipboard-helper.model';

@Component({
  selector: 'app-multi-edit',
  templateUrl: './multi-edit.component.html',
  styleUrls: ['./multi-edit.component.scss']
})
export class MultiEditComponent implements OnInit, OnDestroy {
  // table cells for selection
  @ViewChildren('td') cells: QueryList<ElementRef<HTMLTableCellElement>>;
  // forms to edit items via header menu
  attributeForm: UntypedFormGroup;
  connectionForm: UntypedFormGroup;
  linkForm: UntypedFormGroup;
  // index of column that is being dragged
  sourceIndex: number | undefined;
  // index of column that dragged column is hovering on
  presumedTargetIndex: number | undefined;
  // columns for drag and drop column order change
  columns: number[] = [];
  // what data should be shown with column
  columnContents: string[] = [];
  // Selection information
  selectedRowStart = -1;
  selectedColStart = -1;
  selectedRowCount = 0;
  selectedColCount = 0;
  // storage for errors while updating from clipboard
  private errors = new Map<string, string[]>();
  // id of the search item type
  private itemTypeId: string;
  private subscriptions: Subscription[] = [];
  private deletableConnectionsByRule: Map<string, TargetConnections[]> = new Map();
  private addableConnectionRules: ConnectionRule[] = [];
  private availableItemsForRule = new Map<string, Observable<ConfigurationItem[]>>();


  constructor(private http: HttpClient,
              private store: Store,
              private router: Router,
              private fb: UntypedFormBuilder,
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

  @HostListener('window:paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.cancelBubble = true;
    try {
      if (event.clipboardData) {
        const lines = ClipboardHelper.getTableContent(event.clipboardData);
        // if only one line given, and array contains not enough entries for selection, duplicate existing lines as often as necessary
        if (lines.length === 1) {
          const tmpLines = [...lines];
          while (lines.length < this.selectedRowCount) {
            lines.push(...tmpLines);
          }
        } else if (lines.length < this.selectedRowCount) {
          // cut down selected lines if array contains not enough entries
          this.selectedRowCount = lines.length;
        }
        // remove lines that are out of selection range
        if (lines.length > this.selectedRowCount) {
          lines.splice(this.selectedRowCount);
        }
        lines.forEach(line => {
          // if only one column given, and array doesn't contain enough entries for selection, duplicate existing columns as often as necessary
          if (line.length === 1) {
            const tmpCols = [...line];
            while (line.length < this.selectedColCount) {
              line.push(...tmpCols);
            }
          } else if (line.length < this.selectedColCount) {
            this.selectedColCount = line.length;
          }
          // remove columns that are out of selection range
          if (line.length > this.selectedColCount) {
            line.splice(this.selectedColCount);
          }
        });
        this.items.pipe(
          take(1),
          withLatestFrom(this.attributeTypes, this.connectionRules)
        ).subscribe(([items, attributeTypes, connectionRules]) => {
          // get selected items
          const updateableItems = items.slice(this.selectedRowStart, this.selectedRowStart + this.selectedRowCount);
          // retrieve affected columns in correct order
          const columns = this.columns.slice(this.selectedColStart, this.selectedColStart + this.selectedColCount).map(i => this.columnContents[i]);
          this.errors = this.mes.updateItems(updateableItems, columns, lines, attributeTypes, connectionRules);
        });
      }
    } catch (error) {
      this.store.dispatch(ErrorActions.error({error, fatal: false}));
    }
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

  hasError(itemId: string, column: string) {
    return this.errors.has(itemId) && this.errors.get(itemId).includes(column);
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

  isInsideSelection(colIndex: number, rowIndex: number) {
    return colIndex >= this.selectedColStart && colIndex < this.selectedColCount + this.selectedColStart &&
      rowIndex >= this.selectedRowStart && rowIndex < this.selectedRowStart + this.selectedRowCount;
  }

  isOnUpperBorder(colIndex: number, rowIndex: number) {
    return this.isInsideSelection(colIndex, rowIndex) && rowIndex === this.selectedRowStart;
  }

  isOnLowerBorder(colIndex: number, rowIndex: number) {
    return this.isInsideSelection(colIndex, rowIndex) && rowIndex === this.selectedRowStart + this.selectedRowCount - 1;
  }

  isOnLeftBorder(colIndex: number, rowIndex: number) {
    return this.isInsideSelection(colIndex, rowIndex) && colIndex === this.selectedColStart;
  }

  isOnRightBorder(colIndex: number, rowIndex: number) {
    return this.isInsideSelection(colIndex, rowIndex) && colIndex === this.selectedColStart + this.selectedColCount -1;
  }

  clearKey = (key: string) =>  key.includes(':') ? key.split(':')[1] : key;

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  onDragStart(event: DragEvent, index: number) {
    // set index when starting drag&drop
    this.sourceIndex = index;
    // firefox needs this
    if (event.dataTransfer) {
      event.dataTransfer.setData('text', index.toString());
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragEnd() {
    // cancel drag&drop
    this.sourceIndex = undefined;
    this.presumedTargetIndex = undefined;
  }

  onDragOver(event: DragEvent, targetIndex: number) {
    if (this.sourceIndex !== undefined && this.sourceIndex !== targetIndex) {
      this.presumedTargetIndex = targetIndex;
      // enable drop
      event.preventDefault();
    } else {
      this.presumedTargetIndex = undefined;
    }
  }

  onDrop(targetIndex: number) {
    if (this.sourceIndex !== undefined) {
      // remove source index
      const val = this.columns.splice(this.sourceIndex, 1)[0];
      // put it into new place
      this.columns.splice(targetIndex, 0, val);
    }
    // clean up temporary variables
    this.presumedTargetIndex = undefined;
    this.sourceIndex = undefined;
  }

  onCellClick(event: FocusEvent) {
    let colIndex = -1;
    let rowIndex = -1;
    if (event.type === 'focus' && event.target instanceof HTMLTableCellElement) {
      colIndex = event.target.cellIndex - 1;
      rowIndex = (event.target.parentElement as HTMLTableRowElement).rowIndex -1;
    }
    this.selectedColStart = colIndex;
    this.selectedRowStart = rowIndex;
    this.selectedColCount = colIndex > -1 ? 1 : 0;
    this.selectedRowCount = rowIndex > -1 ? 1 : 0;
    console.log({
      colStart: this.selectedColStart,
      colCount: this.selectedColCount,
      rowStart: this.selectedRowStart,
      rowCount: this.selectedRowCount,
    });
  }

  onCellKeyPress(event: KeyboardEvent) {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code) || event.altKey || event.ctrlKey) {
      return;
    }
    const idx = this.cells.toArray().findIndex(z => z.nativeElement === event.target);
    switch (event.key) {
      case 'ArrowUp':
        if (event.shiftKey) {
          if (this.selectedRowCount > 1) {
            this.selectedRowCount--;
          }
        } else {
          const cell = this.cells.get(idx).nativeElement;
          const rowIndex = this.getRowIndex(cell);
          if (rowIndex > 1) {
            const nextCell = this.cells.find(z => z.nativeElement.cellIndex === cell.cellIndex && this.getRowIndex(z.nativeElement) === rowIndex - 1);
            nextCell.nativeElement.focus();
          }
        }
        break;
      case 'ArrowDown':
        const maxRowIndex = this.getRowIndex(this.cells.last.nativeElement);
        if (event.shiftKey) {
          if (this.selectedRowStart + this.selectedRowCount < maxRowIndex) {
            this.selectedRowCount++;
          }
        } else {
          const cell = this.cells.get(idx).nativeElement;
          const rowIndex = this.getRowIndex(cell);
          if (rowIndex < maxRowIndex) {
            const nextCell = this.cells.find(z => z.nativeElement.cellIndex === cell.cellIndex && this.getRowIndex(z.nativeElement) === rowIndex + 1);
            nextCell.nativeElement.focus();
          }
        }
        break;
      case 'ArrowLeft':
        if (event.shiftKey) {
          if (this.selectedColCount > 1) {
            this.selectedColCount--;
          }
        } else {
          if (idx > 0) {
            this.cells.get(idx - 1).nativeElement.focus();
          }
        }
        break;
      case 'ArrowRight':
        if (event.shiftKey) {
          if (this.selectedColStart + this.selectedColCount < this.columns.length) {
            this.selectedColCount++;
          }
        } else {
          if (idx < this.cells.length - 1) {
            this.cells.get(idx + 1).nativeElement.focus();
          }
        }
        break;
    }
  }

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

  private getRowIndex = (cell: HTMLTableCellElement) => (cell.parentElement as HTMLTableRowElement).rowIndex;

}
