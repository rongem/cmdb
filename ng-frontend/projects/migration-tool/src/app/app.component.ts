import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  AppConfigService,
  ReadFunctions,
  AdminActions,
  AttributeGroup,
  AttributeType,
  ConnectionType,
  ItemType,
  ConnectionRule,
  ItemTypeAttributeGroupMapping,
  MetaData,
} from 'backend-access';
import { take, tap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  step = 0;
  targetUrl = 'http://localhost:8000/rest/';
  targetVersion = 2;
  sourceBackend = { ...AppConfigService.settings.backend };
  targetBackend = { url: this.targetUrl, version: +this.targetVersion };
  invalidSourceUrl = true;
  invalidTargetUrl = true;

  oldMetaData: MetaData;
  newMetaData: MetaData;

  mappedAttributeGroups = new Map<string, AttributeGroup>();
  mappedAttributeTypes = new Map<string, AttributeType>();
  mappedConnectionTypes = new Map<string, ConnectionType>();
  mappedItemTypes = new Map<string, ItemType>();
  mappedConnectionRules = new Map<string, ConnectionRule>();
  mappingsCount = 0;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.checkTargetUrl();
    this.step = 1;
    ReadFunctions.readMetaData(this.http).pipe(
      take(1),
      tap(metaData => {
        this.invalidSourceUrl = false;
        this.oldMetaData = metaData;
      }),
      catchError(() => {
        this.invalidSourceUrl = true;
        return of(null);
      })
    ).subscribe();
  }

  private getHeader() {
    return { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  }

  mapAttributeGroups() {
    const promises: Promise<AttributeGroup>[] = [];
    this.oldMetaData.attributeGroups.forEach(value => {
      const newAttributeGroup = this.newMetaData.attributeGroups.find(ag => value.name.toLocaleLowerCase() === ag.name.toLocaleLowerCase());
      if (!newAttributeGroup) {
        promises.push(
          this.http.post<AttributeGroup>(this.targetUrl + 'AttributeGroup',
            { name: value.name }, this.getHeader()).toPromise()
            .then(attributeGroup => {
              this.newMetaData.attributeGroups.push(attributeGroup);
              this.mappedAttributeGroups.set(value.id, attributeGroup);
              return attributeGroup;
            })
        );
      } else {
        this.mappedAttributeGroups.set(value.id, newAttributeGroup);
      }
    });
    if (promises.length > 0) {
      Promise.all(promises).then(() => this.mapConnectionTypes()).catch(() => this.step = 1);
    } else {
      this.mapConnectionTypes();
    }
  }

  mapAttributeTypes() {
    const promises: Promise<AttributeType>[] = [];
    this.oldMetaData.attributeTypes.forEach(value => {
      const newAttributeType = this.newMetaData.attributeTypes.find(at => value.name.toLocaleLowerCase() === at.name.toLocaleLowerCase());
      if (!this.mappedAttributeGroups.has(value.attributeGroupId)) {
        throw new Error('Attribute group missing for ' + value.id + ': ' + value.name);
      }
      const correspondingGroup = this.mappedAttributeGroups.get(value.attributeGroupId);
      if (newAttributeType) {
        if (correspondingGroup.id !== newAttributeType.attributeGroupId) {
          console.log(newAttributeType, correspondingGroup);
          throw new Error('Attribute group id does not match');
        }
        this.mappedAttributeTypes.set(value.id, newAttributeType);
        // tbd: Check validation expression
      } else {
        promises.push(
          this.http.post<AttributeType>(this.targetUrl + 'AttributeType', {
            name: value.name,
            attributeGroupId: correspondingGroup.id,
            validationExpression: value.validationExpression,
          }, this.getHeader()).toPromise()
            .then(attributeType => {
              this.mappedAttributeTypes.set(value.id, attributeType);
              this.newMetaData.attributeTypes.push(attributeType);
              return attributeType;
            })
        );
      }
    });
    if (promises.length > 0) {
      Promise.all(promises).then(() => this.mapItemTypes()).catch(() => this.step = 1);
    } else {
      this.mapItemTypes();
    }
  }

  mapItemTypes() {
    const promises: Promise<ItemType>[] = [];
    const newMappings: { old: ItemTypeAttributeGroupMapping, new?: ItemTypeAttributeGroupMapping }[] = [];
    this.oldMetaData.itemTypes.forEach(value => {
      const newItemType = this.newMetaData.itemTypes.find(it => value.name.toLocaleLowerCase() === it.name.toLocaleLowerCase());
      const expectedIds = this.oldMetaData.itemTypeAttributeGroupMappings.filter(m => m.itemTypeId === value.id).map(m =>
        this.mappedAttributeGroups.get(m.attributeGroupId).id);
      if (newItemType) {
        this.mappedItemTypes.set(value.id, newItemType);
        let changed = false;
        expectedIds.forEach(id => {
          if (newItemType.attributeGroups.find(ag => ag.id === id)) {
            this.mappingsCount++;
          } else {
            newItemType.attributeGroups.push(this.newMetaData.attributeGroups.find(ag => ag.id === id));
            changed = true;
          }
          if (changed) {
            promises.push(this.http.put<ItemType>(this.targetUrl + 'ItemType/' + newItemType.id, { ...newItemType },
              this.getHeader()).toPromise()
              .then(itemType => {
                this.mappedItemTypes.set(value.id, itemType);
                this.newMetaData.itemTypes[this.newMetaData.itemTypes.findIndex(i => i.id === itemType.id)] = itemType;
                this.mappingsCount++;
                return itemType;
              })
            );
          }
        });
      } else {
        promises.push(this.http.post<ItemType>(this.targetUrl + 'ItemType', {
          name: value.name,
          backColor: value.backColor,
          attributeGroups: expectedIds.map(id => ({id})),
        }, this.getHeader()).toPromise()
          .then(itemType => {
            this.mappingsCount += expectedIds.length;
            this.mappedItemTypes.set(value.id, itemType);
            this.newMetaData.itemTypes.push(itemType);
            return itemType;
          })
        );
      }
    });
    if (promises.length > 0) {
      Promise.all(promises).then(() => this.mapConnectionRules()).catch(() => this.step = 1);
    } else {
      this.mapConnectionRules();
    }
  }

  mapConnectionTypes() {
    const promises: Promise<ConnectionType>[] = [];
    this.oldMetaData.connectionTypes.forEach(value => {
      const newConnectionType = this.newMetaData.connectionTypes.find(ct =>
        value.name.toLocaleLowerCase() === ct.name.toLocaleLowerCase() &&
        value.reverseName.toLocaleLowerCase() === ct.reverseName.toLocaleLowerCase());
      if (newConnectionType) {
        this.mappedConnectionTypes.set(value.id, newConnectionType);
      } else {
        promises.push(this.http.post<ConnectionType>(this.targetUrl + 'ConnectionType', {
          name: value.name,
          reverseName: value.reverseName,
        }, this.getHeader()).toPromise()
          .then(connectionType => {
            this.mappedConnectionTypes.set(value.id, connectionType);
            this.newMetaData.connectionTypes.push(connectionType);
            return connectionType;
          })
        );
      }
    });
    if (promises.length > 0) {
      Promise.all(promises).then(() => this.mapAttributeTypes()).catch(() => this.step = 1);
    } else {
      this.mapAttributeTypes();
    }
  }

  mapConnectionRules() {
    const promises: Promise<ConnectionRule>[] = [];
    this.oldMetaData.connectionRules.forEach(value => {
      const connectionTypeId = this.mappedConnectionTypes.get(value.connectionTypeId).id;
      const upperItemTypeId = this.mappedItemTypes.get(value.upperItemTypeId).id;
      const lowerItemTypeId = this.mappedItemTypes.get(value.lowerItemTypeId).id;
      const newRule = this.newMetaData.connectionRules.find(cr => cr.lowerItemTypeId === lowerItemTypeId &&
        cr.upperItemTypeId === upperItemTypeId && cr.connectionTypeId === connectionTypeId);
      if (newRule) {
        this.mappedConnectionRules.set(value.id, newRule);
        // tbd: Check validation expression
      } else {
        promises.push(this.http.post<ConnectionRule>(this.targetUrl + 'ConnectionRule', {
            connectionTypeId,
            upperItemTypeId,
            lowerItemTypeId,
            maxConnectionsToUpper: value.maxConnectionsToUpper,
            maxConnectionsToLower: value.maxConnectionsToLower,
            validationExpression: value.validationExpression,
          }, this.getHeader()).toPromise()
          .then(connectionRule => {
            this.mappedConnectionRules.set(value.id, connectionRule);
            this.newMetaData.connectionRules.push(connectionRule);
            return connectionRule;
          })
        );
      }
    });
  }

  startMigration() {
    this.step = 2;
    AppConfigService.settings.backend = { ...this.targetBackend };
    ReadFunctions.readMetaData(this.http).toPromise()
      .then(metaData => {
        this.newMetaData = metaData;
        this.mapAttributeGroups();
      });
  }

  checkTargetUrl() {
    this.targetUrl = this.targetUrl.trim();
    if (!this.targetUrl.endsWith('/')) {
      this.targetUrl += '/';
    }
    this.targetBackend = { url: this.targetUrl, version: +this.targetVersion };
    this.http.get<{ role: number }>(this.targetUrl + 'user/current').pipe(
      take(1),
      tap(({ role }) => this.invalidTargetUrl = role !== 2),
      catchError(() => {
        this.invalidTargetUrl = true;
        return of(null);
      }),
    ).subscribe();
  }

  getUnmatchedCount(array: { old: any, new: any }[]) {
    return array.filter(v => !v.new).length;
  }
}
