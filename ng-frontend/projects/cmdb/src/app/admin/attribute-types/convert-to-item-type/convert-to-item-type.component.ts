import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, style, transition, animate } from '@angular/animations';
import { Store } from '@ngrx/store';
import { map, withLatestFrom, take, switchMap, skipWhile } from 'rxjs';
import { AttributeType, ItemType, ConnectionType, AdminActions,
  MetaDataSelectors, AdminFunctions } from 'backend-access';

@Component({
  selector: 'app-convert-to-item-type',
  templateUrl: './convert-to-item-type.component.html',
  styleUrls: ['./convert-to-item-type.component.scss'],
  animations: [
    trigger('swapDirectionOfUpper', [
      transition('above => below', [
        style({
          transform: 'translateY(150px)',
        }),
        animate(200, style({
          transform: 'translateY(50px) translateX(20px)',
        })),
        animate(300)
      ]),
      transition('below => above', [
        style({
          transform: 'translateY(-150px)',
        }),
        animate(200, style({
          transform: 'translateY(-50px) translateX(-20px)',
        })),
        animate(300)
      ]),
    ]),
    trigger('swapDirectionOfLower', [
      transition('below => above', [
        style({
          transform: 'translateY(150px)',
        }),
        animate(200, style({
          transform: 'translateY(50px) translateX(20px)',
        })),
        animate(300)
      ]),
      transition('above => below', [
        style({
          transform: 'translateY(-150px)',
        }),
        animate(200, style({
          transform: 'translateY(-50px) translateX(-20px)',
        })),
        animate(300)
      ]),
    ]),
  ],
})
export class ConvertToItemTypeComponent implements OnInit {
  typeId: string;
  attributeTypeToConvert: AttributeType;
  itemType: ItemType;
  transferrableAttributeTypes: AttributeType[];
  transferAttributeTypes: AttributeType[] = [];
  conversionMethod = 'merge';
  newName = '';
  newColor = '#FFFFFF';
  newPosition: 'above' | 'below' = 'above';
  newConnectionType: string;
  connectionType: ConnectionType;
  draggingItemType?: string;
  draggingAttributeType?: AttributeType;
  draggingRemoveAttributeType?: boolean;
  connectionMenuOpen = false;

  constructor(private store: Store,
              private route: ActivatedRoute,
              private router: Router,
              private http: HttpClient) { }

    get connectionTypes() {
      return this.store.select(MetaDataSelectors.selectConnectionTypes).pipe(
        map(connectionTypes => connectionTypes.filter(c => c.id !== this.newConnectionType)),
      );
    }

    ngOnInit() {
    if (this.route.snapshot.params.id && this.route.snapshot.routeConfig.path.startsWith('attribute-types/convert/:id')) {
          this.typeId = this.route.snapshot.params.id;
          this.store.select(MetaDataSelectors.selectState).pipe(
            withLatestFrom(this.store.select(MetaDataSelectors.selectSingleAttributeType(this.typeId))),
            skipWhile(([status, attributeType]) => status.validData === false),
            map(([status, attributeType]) => {
              if (attributeType === undefined) {
                console.log('No attribute type with id ' + this.typeId + ' found');
                this.router.navigate(['admin', 'attribute-types']);
              }
              this.attributeTypeToConvert = attributeType;
              const itemTypes = status.itemTypes.filter(t =>
                t.name.toLocaleLowerCase() === this.attributeTypeToConvert.name.toLocaleLowerCase());
              this.itemType = itemTypes.length > 0 ? itemTypes[0] : undefined;
              this.newColor = this.itemType ? this.itemType.backColor : '#FFFFFF';
              this.newConnectionType = status.connectionTypes[0].id;
              this.connectionType = status.connectionTypes[0];
              return attributeType;
            }),
            switchMap(attributeType => AdminFunctions.getAttributeTypesForCorrespondingValuesOfType(this.http, attributeType.id)),
            map((attributeTypes) => {
              this.transferrableAttributeTypes = attributeTypes;
              return attributeTypes;
            }),
            take(1),
          ).subscribe();
    } else {
      console.log('illegal id params');
      this.router.navigate(['admin', 'attribute-types']);
    }
  }

  filterAttributeTypes(list: AttributeType[]) {
    if (this.attributeTypeToConvert) {
      return list.filter(at => at.attributeGroupId === this.attributeTypeToConvert.attributeGroupId);
    }
    return [];
  }

  toggleDirection() {
    this.newPosition = this.newPosition === 'above' ? 'below' : 'above';
    this.connectionMenuOpen = false;
  }

  toggleConversion() {
    this.conversionMethod = this.conversionMethod === 'merge' ? 'rename' : 'merge';
  }

  onDragStartNewType(event: DragEvent) {
    this.onDragEndType(event);
    // set index when starting drag&drop
    this.draggingItemType = 'new';
    // firefox needs this
    if (event.dataTransfer) {
      event.dataTransfer.setData('text', 'new');
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragStartExistingTypes(event: DragEvent) {
    this.onDragEndType(event);
    // set index when starting drag&drop
    this.draggingItemType = 'existing';
    // firefox needs this
    if (event.dataTransfer) {
      event.dataTransfer.setData('text', 'existing');
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragStartAttributeType(event: DragEvent, attributeType: AttributeType, remove: boolean) {
    this.onDragEndType(event);
    this.draggingAttributeType = attributeType;
    this.draggingRemoveAttributeType = remove;
    if (event.dataTransfer) {
      event.dataTransfer.setData('text', attributeType.id);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragEndType(event: DragEvent) {
    // cancel drag&drop
    this.draggingItemType = undefined;
    this.draggingAttributeType = undefined;
    this.draggingRemoveAttributeType = undefined;
  }

  onDragOverExistingType(event: DragEvent) {
    if (this.draggingItemType === 'new' || (this.draggingAttributeType !== undefined && this.draggingRemoveAttributeType === true)) {
      // enable drop
      event.preventDefault();
    }
  }

  onDragOverNewType(event: DragEvent) {
    if (this.draggingItemType === 'existing' || (this.draggingAttributeType !== undefined && this.draggingRemoveAttributeType === false)) {
      // enable drop
      event.preventDefault();
    }
  }

  onDropOnNewType(event: DragEvent) {
    if (this.draggingItemType === 'existing') {
      this.toggleDirection();
    } else if (this.draggingAttributeType !== undefined && this.draggingRemoveAttributeType === false) {
      this.onChangeAttributeToTransfer(this.draggingAttributeType.id, true);
      this.onDragEndType(event);
    }
  }

  onDropOnExistingType(event: DragEvent) {
    if (this.draggingItemType === 'new') {
      this.toggleDirection();
    } else if (this.draggingAttributeType !== undefined && this.draggingRemoveAttributeType === true) {
      this.onChangeAttributeToTransfer(this.draggingAttributeType.id, false);
      this.onDragEndType(event);
    }
  }

  onChangeItemBackgroundColor(color: string) {
    this.newColor = color.toUpperCase();
  }

  onChangeConnectionType(connType: ConnectionType) {
    this.newConnectionType = connType.id;
    this.connectionMenuOpen = false;
  }

  onChangeAttributeToTransfer(guid: string, selected: boolean) {
    if (selected) {
      this.transferAttributeTypes.push(this.transferrableAttributeTypes.find(t => t.id === guid));
      if (this.transferAttributeTypes.length > 1) {
        this.transferAttributeTypes = this.transferAttributeTypes.sort((a, b) =>
          a.name > b.name ? 1 : (a.name < b.name ? -1 : 0));
      }
    } else {
      this.transferAttributeTypes = this.transferAttributeTypes.filter(t => t.id !== guid);
    }
  }

  onSubmit() {
    this.store.dispatch(AdminActions.convertAttributeTypeToItemType({
      attributeType: this.attributeTypeToConvert,
      newItemTypeName: this.newName,
      colorCode: this.newColor,
      connectionType: this.connectionType,
      position: this.newPosition,
      attributeTypesToTransfer: this.transferAttributeTypes,
    }));
    this.router.navigate(['admin', 'item-types']);
  }

  getConnectionType(connTypeId: string) {
    return this.store.select(MetaDataSelectors.selectSingleConnectionType(connTypeId));
  }

  isAttributeTypeSelected(attributeType: AttributeType) {
    return this.transferAttributeTypes.includes(attributeType);
  }

}
