/* eslint-disable @typescript-eslint/member-ordering, @typescript-eslint/naming-convention */
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConnectionRule, FullConfigurationItem, FullConnection, ItemType, MetaDataSelectors } from 'backend-access';
import { map, withLatestFrom } from 'rxjs';

import { ExportService } from '../services/export.service';

interface ExportElement {
  Name: string;
  ItemType: string;
  [key: string]: string;
}

@Component({
  selector: 'app-export-items',
  templateUrl: './export-items.component.html',
  styleUrls: ['./export-items.component.scss']
})
export class ExportItemsComponent implements OnInit {
  @Input() items: FullConfigurationItem[];
  @Input() searchItemType: ItemType;
  @Output() exported = new EventEmitter();
  @ViewChild('table') tableElement: ElementRef<HTMLTableElement>;
  exportType = 'clipboard';

  constructor(private exportService: ExportService, private store: Store) {}

  ngOnInit() {
  }

  get attributeTypes() {
    return this.store.select(MetaDataSelectors.selectAttributeTypesForItemType(this.searchItemType.id));
  }

  get downwardConnectionRules() {
    return this.store.select(MetaDataSelectors.selectConnectionRulesForUpperItemType(this.searchItemType.id));
  }

  get upwardConnectionRules() {
    return this.store.select(MetaDataSelectors.selectConnectionRulesForLowerItemType(this.searchItemType.id));
  }

  exportFile(): void {
    const elements: ExportElement[] = [];
    this.items.forEach(item => {
      let el: ExportElement = { Name: item.name, ItemType: item.type };
      item.attributes.forEach(att => {
        el = Object.assign(el, {[att.type]: att.value});
      });
      item.connectionsToLower.forEach(conn => {
        const val = conn.description ? conn.targetName + '|' + conn.description  : conn.targetName;
        const key = conn.type + ' ' + conn.targetType;
        el = Object.assign(el, {[key]: val});
      });
      item.connectionsToUpper.forEach(conn => {
        const val = conn.description ? conn.targetName + '|' + conn.description : conn.targetName;
        const key = conn.type + ' ' + conn.targetType;
        el = Object.assign(el, {[key]: val});
      });
      elements.push(el);
    });
    switch (this.exportType) {
      case 'excel':
        this.exportService.exportAsExcelFile(elements, 'download.xlsx');
        break;
      case 'csv':
        this.exportService.exportAsCsvFile(elements, 'download.csv');
        break;
      case 'clipboard':
        this.exportService.exportToClipboard(this.tableElement.nativeElement);
        break;
    }
    this.exported.emit();
  }

  getAttributeValue(attributeTypeId: string, item: FullConfigurationItem) {
    return item.attributes?.find(a => a.typeId === attributeTypeId)?.value ?? '';
  }

  getConnectionRuleText(rule: ConnectionRule, direction: 'up' | 'down') {
    return this.store.select(MetaDataSelectors.selectSingleConnectionType(rule.connectionTypeId)).pipe(
      withLatestFrom(this.store.select(MetaDataSelectors.selectSingleItemType(direction === 'down' ? rule.lowerItemTypeId : rule.upperItemTypeId))),
      map(([connectionType, itemType]) => (direction === 'down' ? connectionType.name : connectionType.reverseName) + ' ' + itemType.name)
    );
  }

  getConnectionRuleItems(ruleId: string, connections: FullConnection[]) {
    return connections.filter(c => c.ruleId === ruleId).map(c => c.targetName).join(', ');
  }

}
