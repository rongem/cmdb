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
  sourceBackend = {...AppConfigService.settings.backend};
  targetBackend = { url: this.targetUrl, version: +this.targetVersion };
  invalidSourceUrl = true;
  invalidTargetUrl = true;

  attributeGroups: {old: AttributeGroup, new?: AttributeGroup}[] = [];
  attributeTypes: {old: AttributeType, new?: AttributeType}[] = [];
  connectionTypes: {old: ConnectionType, new?: ConnectionType}[] = [];
  itemTypes: {old: ItemType, new?: ItemType}[] = [];
  connectionRules: {old: ConnectionRule, new?: ConnectionRule}[] = [];
  mappings: {old: ItemTypeAttributeGroupMapping, new?: ItemTypeAttributeGroupMapping}[] = [];

  mapAttributeGroups = new Map<string, AttributeGroup>();
  mapAttributeTypes = new Map<string, AttributeType>();
  mapConnectionTypes = new Map<string, ConnectionType>();
  mapItemTypes = new Map<string, ItemType>();
  mapConnectionRule = new Map<string, ConnectionRule>();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.checkTargetUrl();
    this.step = 1;
    ReadFunctions.readMetaData(this.http).pipe(
      take(1),
      tap(metaData => {
        this.invalidSourceUrl = false;
        metaData.attributeGroups.forEach(ag => this.attributeGroups.push({old: ag}));
        metaData.attributeTypes.forEach(at => this.attributeTypes.push({old: at}));
        metaData.connectionTypes.forEach(ct => this.connectionTypes.push({old: ct}));
        metaData.itemTypes.forEach(it => this.itemTypes.push({old: it}));
        metaData.connectionRules.forEach(cr => this.connectionRules.push({old: cr}));
        metaData.itemTypeAttributeGroupMappings.forEach(mapping => this.mappings.push({old: mapping}));
      }),
      catchError(() => {
        this.invalidSourceUrl = true;
        return of(null);
      })
    ).subscribe();
  }

  private getHeader() {
    return { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
  }

  async startMigration() {
    this.step = 2;
    AppConfigService.settings.backend = {...this.targetBackend};
    const metaData = await ReadFunctions.readMetaData(this.http).toPromise()
      .then(md => {
        const attributeGroups: {old: AttributeGroup, new?: AttributeGroup}[] = [];
        this.attributeGroups.forEach(async (value, index) => {
          let newAttributeGroup = md.attributeGroups.find(ag => value.old.name.toLocaleLowerCase() === ag.name.toLocaleLowerCase());
          if (!newAttributeGroup) {
            newAttributeGroup = await this.http.post<AttributeGroup>(this.targetUrl + 'AttributeGroup',
              { name: value.old.name }, this.getHeader())
              .toPromise();
            console.log('created: ', newAttributeGroup);
          }
          this.mapAttributeGroups.set(value.old.id, newAttributeGroup);
          attributeGroups.push({...value, new: newAttributeGroup});
        });
        this.attributeGroups = attributeGroups;
        return md;
      })
      .then(md => {
        const connectionTypes: {old: ConnectionType, new?: ConnectionType}[] = [];
        this.connectionTypes.forEach(async value => {
          let newConnectionType = md.connectionTypes.find(ct =>
            value.old.name.toLocaleLowerCase() === ct.name.toLocaleLowerCase() &&
            value.old.reverseName.toLocaleLowerCase() === ct.reverseName.toLocaleLowerCase());
          if (newConnectionType) {
            value.new = newConnectionType;
          } else {
            console.log('creating: ', value.old);
            newConnectionType = await this.http.post<ConnectionType>(this.targetUrl + 'ConnectionType', {
              name: value.old.name,
              reverseName: value.old.reverseName,
            }, this.getHeader()).toPromise();
          }
          this.mapConnectionTypes.set(value.old.id, newConnectionType);
          connectionTypes.push({...value, new: newConnectionType});
        });
        this.connectionTypes = connectionTypes;
        return md;
      })
      .then(md => {
        const itemTypes: {old: ItemType, new?: ItemType}[] = [];
        const newMappings: {old: ItemTypeAttributeGroupMapping, new?: ItemTypeAttributeGroupMapping}[] = [];
        this.itemTypes.forEach(async value => {
          let newItemType = md.itemTypes.find(it => value.old.name.toLocaleLowerCase() === it.name.toLocaleLowerCase());
          if (newItemType) {
            value.new = newItemType;
          } else {
            console.log('creating: ', value.old);
            newItemType = await this.http.post<ItemType>(this.targetUrl + 'ItemType', {
              name: value.old.name,
              backColor: value.old.backColor,
              attributeGroupIds: this.mappings.filter(m => m.old.itemTypeId === value.old.id).map(m =>
                this.mapAttributeGroups.get(m.old.attributeGroupId).id),
            }, this.getHeader()).toPromise();
          }
          const mappings = this.mappings.filter(m => m.old.itemTypeId === value.old.id);
          mappings.forEach(async m => {
            const targetId = this.mapAttributeGroups.get(m.old.attributeGroupId).id;
            if (!newItemType.attributeGroups) {
              newItemType.attributeGroups = [];
            }
            if (!newItemType.attributeGroups.find(ag => ag.id === targetId)) {
              newItemType.attributeGroups.push(this.mapAttributeGroups.get(m.old.attributeGroupId));
              const newMapping = await this.http.post<ItemTypeAttributeGroupMapping>(this.targetUrl + 'ItemTypeAttributeGroupMapping',
                { itemTypeId: newItemType.id, attributeGroupId: targetId }, this.getHeader()).toPromise();
              newMappings.push({...m, new: newMapping});
            }
          });
          this.mapItemTypes.set(value.old.id, newItemType);
          itemTypes.push({...value, new: newItemType});
        });
        this.itemTypes = itemTypes;
        return md;
      })
      .then(md => {
        const attributeTypes: {old: AttributeType, new?: AttributeType}[] = [];
        this.attributeTypes.forEach(async value => {
          let newAttributeType = md.attributeTypes.find(at => value.old.name.toLocaleLowerCase() === at.name.toLocaleLowerCase());
          const correspondingGroup = this.attributeGroups.find(ag => ag.old.id === value.old.attributeGroupId);
          if (!correspondingGroup || !correspondingGroup.new) {
            throw new Error('Attribute group missing for ' + value.old.id + ': ' + value.old.name);
          }
          if (newAttributeType) {
            if (correspondingGroup.new.id !== newAttributeType.attributeGroupId)
            {
              console.log(newAttributeType, correspondingGroup);
              throw new Error('Attribute group id does not match');
            }
          } else {
            console.log('creating: ', value.old);
            newAttributeType = await this.http.post<AttributeType>(this.targetUrl + 'AttributeType', {
              name: value.old.name,
              attributeGroupId: correspondingGroup.new.id,
              validationExpression: value.old.validationExpression,
            }, this.getHeader()).toPromise();
          }
          this.mapAttributeTypes.set(value.old.id, newAttributeType);
          attributeTypes.push({...value, new: newAttributeType});
        });
        this.attributeTypes = attributeTypes;
        return md;
      });
  }

  checkTargetUrl() {
    this.targetUrl = this.targetUrl.trim();
    if (!this.targetUrl.endsWith('/')) {
      this.targetUrl += '/';
    }
    this.targetBackend = { url: this.targetUrl, version: +this.targetVersion };
    this.http.get<{role: number}>(this.targetUrl + 'user/current').pipe(
      take(1),
      tap(({role}) => this.invalidTargetUrl = role !== 2),
      catchError(() => {
        this.invalidTargetUrl = true;
        return of(null);
      }),
    ).subscribe();
  }

  getUnmatchedCount(array: {old: any, new: any}[]) {
    return array.filter(v => !v.new).length;
  }
}
