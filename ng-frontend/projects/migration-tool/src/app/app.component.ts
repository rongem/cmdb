import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  AppConfigService,
  ReadFunctions,
  AttributeGroup,
  AttributeType,
  ConnectionType,
  ItemType,
  ConnectionRule,
  ItemTypeAttributeGroupMapping,
  MetaData,
  ConfigurationItem,
  FullConfigurationItem,
  UserInfo,
} from 'backend-access';
import { take, tap, catchError, map, withLatestFrom } from 'rxjs/operators';
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
  error: string;

  oldMetaData: MetaData;
  newMetaData: MetaData;
  oldUsers: {IsGroup: boolean, Role: number, Username: string}[] = [];
  newUsers: {accountName: string, role: number}[] = [];

  transferUsers = false;
  overwriteAttributes = false;
  overwriteConnectionDescriptions = false;
  overwriteLinkDescriptions = false;

  attributeTypeDeviations: string[] = [];
  connectionRuleDeviations: string[] = [];
  userDeviations: string[] = [];

  finishedItemTypes: string[] = [];

  mappedAttributeGroups = new Map<string, AttributeGroup>();
  mappedAttributeTypes = new Map<string, AttributeType>();
  mappedConnectionTypes = new Map<string, ConnectionType>();
  mappedItemTypes = new Map<string, ItemType>();
  mappedConnectionRules = new Map<string, ConnectionRule>();
  mappingsCount = 0;
  mappedConfigurationItems = new Map<string, string>();

  private oldItemsCount = new Map<string, number>();

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

  private mapUsers() {
    this.userDeviations = [];
    const promises: Promise<UserInfo>[] = [];
    this.http.get<{accountName: string, role: number}[]>(this.targetUrl + 'users').toPromise()
      .then(users => {
        this.newUsers = users;
        this.oldUsers.forEach(u => {
          const newUser = users.find(us => us.accountName.toLocaleUpperCase() === u.Username.toLocaleUpperCase());
          if (newUser) {
            if (newUser.role !== u.Role) {
              this.userDeviations.push(`${u.Username} has role ${u.Role} in source and ${newUser.role} in target system.`);
            }
          } else {
            this.http.post<{accountName: string, role: number}>(this.targetUrl + 'user', {
              accountName: u.Username,
              role: u.Role,
            }).toPromise().then(user => {
              this.newUsers.push(user);
            });
          }
        });
      });

  }

  private mapAttributeGroups() {
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
      Promise.all(promises).then(() => this.mapConnectionTypes()).catch(this.setError);
    } else {
      this.mapConnectionTypes();
    }
  }

  private mapAttributeTypes() {
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
        if (value.validationExpression !== newAttributeType.validationExpression) {
          console.log(newAttributeType);
          this.attributeTypeDeviations.push(`Attribute type: ${value.name} source expression /${value.validationExpression}/ does not match target expression /${newAttributeType.validationExpression}/.`);
        }
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
      Promise.all(promises).then(() => this.mapItemTypes()).catch(this.setError);
    } else {
      this.mapItemTypes();
    }
  }

  private mapItemTypes() {
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
            this.mappingsCount++;
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
      Promise.all(promises).then(() => this.mapConnectionRules()).catch(this.setError);
    } else {
      this.mapConnectionRules();
    }
  }

  private mapConnectionTypes() {
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
      Promise.all(promises).then(() => this.mapAttributeTypes()).catch(this.setError);
    } else {
      this.mapAttributeTypes();
    }
  }

  private mapConnectionRules() {
    const promises: Promise<ConnectionRule>[] = [];
    this.oldMetaData.connectionRules.forEach(value => {
      const connectionTypeId = this.mappedConnectionTypes.get(value.connectionTypeId).id;
      const upperItemTypeId = this.mappedItemTypes.get(value.upperItemTypeId).id;
      const lowerItemTypeId = this.mappedItemTypes.get(value.lowerItemTypeId).id;
      const newRule = this.newMetaData.connectionRules.find(cr => cr.lowerItemTypeId === lowerItemTypeId &&
        cr.upperItemTypeId === upperItemTypeId && cr.connectionTypeId === connectionTypeId);
      if (newRule) {
        this.mappedConnectionRules.set(value.id, newRule);
        if (value.validationExpression !== newRule.validationExpression) {
          const ruleName = this.mappedItemTypes.get(value.upperItemTypeId).name + ' ' +
            this.mappedConnectionTypes.get(value.connectionTypeId).name + ' ' +
            this.mappedItemTypes.get(value.lowerItemTypeId).name;
          this.connectionRuleDeviations.push(`Attribute type: <${ruleName}> source expression /${value.validationExpression}/ does not match target expression /${newRule.validationExpression}/.`);
        }
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
    if (promises.length > 0){
      Promise.all(promises).then(() => this.step = 3).catch(this.setError);
    } else {
      this.step = 3;
    }
  }

  private setError(err: any) {
    console.log(err);
    this.error = JSON.stringify(err);
    this.step = 1;
  }

  startMigration() {
    this.step = 2;
    this.mappingsCount = 0;
    this.error = undefined;
    this.attributeTypeDeviations = [];
    this.connectionRuleDeviations = [];
    if (this.transferUsers === true) {
      this.http.get<{IsGroup: boolean, Role: number, Username: string}[]>(this.sourceBackend.url + 'Users').toPromise()
        .then(users => {
          this.oldUsers = users.filter(u => !u.IsGroup);
          this.mapUsers();
        });
    }
    AppConfigService.settings.backend = { ...this.targetBackend };
    ReadFunctions.readMetaData(this.http).toPromise()
      .then(metaData => {
        this.newMetaData = metaData;
        this.mapAttributeGroups();
      });
  }

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  async continueMigration() {
    this.step = 4;
    this.oldItemsCount.clear();
    this.mappedConfigurationItems.clear();
    this.finishedItemTypes = [];
    AppConfigService.settings.backend = { ...this.sourceBackend };
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < this.oldMetaData.itemTypes.length; index++) {
      const itemType = this.oldMetaData.itemTypes[index];
      const targetItemType = this.mappedItemTypes.get(itemType.id);
      let start = new Date().getTime();
      await ReadFunctions.fullConfigurationItemsByType(this.http, itemType.id).pipe(
        tap(() => {
          console.log(targetItemType.name, 'old', new Date().getTime() - start);
          start = new Date().getTime();
        }),
        tap(cis => this.oldItemsCount.set(itemType.id, cis.length)),
        withLatestFrom(this.http.get<ConfigurationItem[]>(this.targetUrl + 'ConfigurationItems/ByTypes/' + targetItemType.id)),
        tap(() => {
          console.log(targetItemType.name, 'new', new Date().getTime() - start);
          start = new Date().getTime();
        }),
        tap(([cis, targetCis]) => this.migrateConfigurationItems(cis, targetCis, targetItemType, start)),
      ).toPromise()
        .catch(this.setError);
    }
    console.log('finished items');
  }

  private migrateConfigurationItems(cis: FullConfigurationItem[], targetCis: ConfigurationItem[], targetType: ItemType, start: number) {
    const promises: Promise<void>[] = [];
    cis.forEach(ci => {
      // make sure that there are responsibilities and the current user is part of them, since he cannot update if not.
      ci.responsibilities = ci.responsibilities?.map(r => ({...r, account: r.account.toLocaleUpperCase()})) ?? [];
      if (!ci.responsibilities.map(r => r.account).includes(this.newMetaData.userName.toLocaleUpperCase())) {
        ci.responsibilities.push({
          account: this.newMetaData.userName.toLocaleUpperCase(),
          invalidAccount: false,
          mail: '',
          name: this.newMetaData.userName,
          office: '',
          phone: '',
        });
      }
      const targetCi = targetCis.find(i => i.name.toLocaleLowerCase() === ci.name.toLocaleLowerCase());
      if (targetCi) {
        let changed = false;
        this.mappedConfigurationItems.set(ci.id, targetCi.id);
        ci.attributes.forEach(a => {
          const targetAttribute = targetCi.attributes.find(an => an.typeId === this.mappedAttributeTypes.get(a.typeId).id);
          if (!targetAttribute) {
            changed = true;
            targetCi.attributes.push({
              id: undefined,
              itemId: targetCi.id,
              typeId: this.mappedAttributeTypes.get(a.typeId).id,
              value: a.value,
            });
          } else if (this.overwriteAttributes && a.value !== targetAttribute.value) {
            changed = true;
            console.log('changing ' + a.value);
            targetAttribute.value = a.value;
          }
        });
        ci.links.forEach(l => {
          const targetLink = targetCi.links.find(ln => ln.uri.toLocaleLowerCase() === l.uri.toLocaleLowerCase());
          if (!targetLink) {
            changed = true;
            targetCi.links.push({
              id: undefined,
              itemId: targetCi.id,
              uri: l.uri,
              description: l.description,
            });
          } else if (this.overwriteLinkDescriptions && l.description !== targetLink.description) {
            changed = true;
            console.log('changing ' + l.description);
            targetLink.description = l.description;
          }
        });
        ci.responsibilities.forEach(r => {
          if (!targetCi.responsibleUsers.includes(r.account.toLocaleUpperCase())) {
            changed = true;
            console.log('changing ' + r.account);
            targetCi.responsibleUsers.push(r.account.toLocaleUpperCase());
          }
        });
        if (changed) {
          console.log('changing ' + targetType.name + ': ' + targetCi.name);
          promises.push(
            this.http.put<ConfigurationItem>(this.targetUrl + 'ConfigurationItem/' + targetCi.id,
            {...targetCi}, this.getHeader()).toPromise().then(() => { return; }).catch(this.setError)
          );
        }
      } else {
        console.log('creating ' + targetType.name + ': ' + ci.name);
        promises.push(
          this.http.post<ConfigurationItem>(this.targetUrl + 'ConfigurationItem', {
            name: ci.name,
            typeId: targetType.id,
            attributes: ci.attributes?.map(a => ({
              typeId: this.mappedAttributeTypes.get(a.typeId).id,
              value: a.value,
            })),
            links: ci.links?.map(l => ({
              uri: l.uri,
              description: l.description,
            })),
            responsibleUsers: this.transferUsers ? ci.responsibilities.map(u => u.account) : [],
          }, this.getHeader()).toPromise()
          .then(item => {
            this.mappedConfigurationItems.set(ci.id, item.id);
          })
        );
      }
    });
    if (promises.length > 0) {
      Promise.all(promises)
        .then(() => {
          this.finishedItemTypes.push(targetType.id);
          console.log(targetType.name, promises.length, 'changed items', new Date().getTime() - start);
        })
        .catch(this.setError);
    } else {
      this.finishedItemTypes.push(targetType.id);
      console.log(targetType.name, 'no changes', new Date().getTime() - start);
    }
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

  getOldItemsCount(id: string) {
    return this.oldItemsCount.has(id) ? this.oldItemsCount.get(id) : 0;
  }
  getItemTypeFinished(id: string) {
    id = this.mappedItemTypes.get(id).id;
    return this.finishedItemTypes.includes(id);
  }
}
