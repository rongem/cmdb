import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from './backend-access/app-config/app-config.service';
import * as ReadFunctions from './backend-access/read.functions';
import { AttributeGroup } from './backend-access/objects/meta-data/attribute-group.model';
import { AttributeType } from './backend-access/objects/meta-data/attribute-type.model';
import { ConnectionType } from './backend-access/objects/meta-data/connection-type.model';
import { ConnectionRule } from './backend-access/objects/meta-data/connection-rule.model';
import { ItemType } from './backend-access/objects/meta-data/item-type.model';
import { ItemTypeAttributeGroupMapping } from './backend-access/objects/meta-data/item-type-attribute-group-mapping.model';
import { MetaData } from './backend-access/objects/meta-data/meta-data.model';
import { ConfigurationItem } from './backend-access/objects/item-data/configuration-item.model';
import { Connection } from './backend-access/objects/item-data/connection.model';
import { UserInfo } from './backend-access/objects/item-data/user-info.model';
import { FullConfigurationItem } from './backend-access/objects/item-data/full/full-configuration-item.model';
import { take, tap, catchError, mergeMap } from 'rxjs/operators';
import { of, from } from 'rxjs';
import { RestConnection, ConnectionResult } from './backend-access/rest-api/rest-connection.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  step = 0;
  targetUrl = 'http://localhost:8000/rest/';
  targetVersion = 2;
  targetAuthMethod = 'jwt';
  targetUserName = '';
  targetPassword = '';
  sourceBackend = { ...AppConfigService.settings.backend };
  targetBackend = { url: this.targetUrl, version: +this.targetVersion, authMethod: this.targetAuthMethod };
  invalidSourceUrl = true;
  invalidTargetUrl = true;
  invalidAuthMethod = true;
  get authenticated() { return !!AppConfigService.authentication; }
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
  tempMappedItems: {oldId: string, newTypeId: string, name: string}[] = [];

  private oldItemsCount = new Map<string, number>();
  private itemsToChangeCount = new Map<string, number>();
  private itemsChanged = new Map<string, number>();

  connectionsCount = 0;
  connectionsToChange = 0;
  connectionsMigrated = 0;
  connectionsFinished = false;

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

  private getOptions() {
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
            { name: value.name }, this.getOptions()).toPromise()
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
          throw new Error('Attribute group id does not match');
        }
        this.mappedAttributeTypes.set(value.id, newAttributeType);
        if (value.validationExpression !== newAttributeType.validationExpression) {
          this.attributeTypeDeviations.push(`Attribute type: ${value.name} source expression /${value.validationExpression}/ does not match target expression /${newAttributeType.validationExpression}/.`);
        }
      } else {
        promises.push(
          this.http.post<AttributeType>(this.targetUrl + 'AttributeType', {
            name: value.name,
            attributeGroupId: correspondingGroup.id,
            validationExpression: value.validationExpression,
          }, this.getOptions()).toPromise()
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
              this.getOptions()).toPromise()
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
        }, this.getOptions()).toPromise()
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
        }, this.getOptions()).toPromise()
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
          }, this.getOptions()).toPromise()
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

  async continueMigration() {
    this.step = 4;
    this.oldItemsCount.clear();
    this.mappedConfigurationItems.clear();
    this.finishedItemTypes = [];
    AppConfigService.settings.backend = { ...this.sourceBackend };
    await this.migrateItems();
    this.step = 5;
    await this.migrateConnections();
    console.log('finished items');
  }

  private async migrateItems() {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let index = 0; index < this.oldMetaData.itemTypes.length; index++) {
      const itemType = this.oldMetaData.itemTypes[index];
      const targetItemType = this.mappedItemTypes.get(itemType.id);
      let start = new Date().getTime();
      AppConfigService.settings.backend = { ...this.sourceBackend };
      const cis = await ReadFunctions.fullConfigurationItemsByType(this.http, itemType.id).toPromise();
      this.oldItemsCount.set(itemType.id, cis.length);
      if (cis.length > 0) {
        AppConfigService.settings.backend = { ...this.targetBackend };
        const targetCis = await this.http.get<ConfigurationItem[]>(
          this.targetUrl + 'ConfigurationItems/ByTypes/' + targetItemType.id).toPromise();
        console.log(targetItemType.name, 'read', new Date().getTime() - start);
        start = new Date().getTime();
        const itemsToChange = this.getConfigurationItemsToChange(cis, targetCis, targetItemType, start);
        this.itemsToChangeCount.set(targetItemType.id, itemsToChange.length);
        await from(itemsToChange).pipe(
          mergeMap(item => item.id ?
            // update
            this.http.put<ConfigurationItem>(this.targetUrl + 'ConfigurationItem/' + item.id,
              { ...item }, this.getOptions()) :
            // create
            this.http.post<ConfigurationItem>(this.targetUrl + 'ConfigurationItem', { ...item }, this.getOptions()).pipe(
              tap(targetCi => {
                const pos = this.tempMappedItems.findIndex(i => i.newTypeId === targetCi.typeId && i.name === targetCi.name);
                this.mappedConfigurationItems.set(this.tempMappedItems[pos].oldId, targetCi.id);
                this.tempMappedItems.splice(pos, 1);
              })
            ),
            2),
          tap(() => this.itemsChanged.set(targetItemType.id,
            this.itemsChanged.has(targetItemType.id) ? this.itemsChanged.get(targetItemType.id) + 1 : 1)),
          ).toPromise().catch(this.setError);
      } else {
        this.itemsToChangeCount.set(targetItemType.id, 0);
      }
      if (this.tempMappedItems.length > 0) {
        console.log('non-created items', this.tempMappedItems);
      }
      console.log('finished', targetItemType.name, new Date().getTime() - start);
      this.finishedItemTypes.push(targetItemType.id);
    }
  }

  private getConfigurationItemsToChange(cis: FullConfigurationItem[], targetCis: ConfigurationItem[], targetType: ItemType, start: number) {
    const itemsToChange: ConfigurationItem[] = [];
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
            targetLink.description = l.description;
          }
        });
        ci.responsibilities.forEach(r => {
          if (!targetCi.responsibleUsers.includes(r.account.toLocaleUpperCase())) {
            changed = true;
            targetCi.responsibleUsers.push(r.account.toLocaleUpperCase());
          }
        });
        if (changed) {
          itemsToChange.push({...targetCi});
        }
      } else {
        this.tempMappedItems.push({oldId: ci.id, newTypeId: targetType.id, name: ci.name});
        itemsToChange.push({
          id: undefined,
          name: ci.name,
          typeId: targetType.id,
          attributes: ci.attributes?.map(a => ({
            id: undefined,
            itemId: undefined,
            typeId: this.mappedAttributeTypes.get(a.typeId).id,
            value: a.value,
          })),
          links: ci.links?.map(l => ({
            id: undefined,
            itemId: undefined,
            uri: l.uri,
            description: l.description,
          })),
          responsibleUsers: this.transferUsers ? ci.responsibilities.map(u => u.account) : [],
        });
      }
    });
    return itemsToChange;
  }

  private async migrateConnections() {
    AppConfigService.settings.backend = { ...this.sourceBackend };
    const oldConnections = await this.http.get<RestConnection[]>(this.sourceBackend.url + 'Connections', this.getOptions()).toPromise();
    this.connectionsCount = oldConnections.length;
    const newConnections = await this.getNewConnections();
    console.log(newConnections);
    const connectionsForChange: Connection[] = [];
    const start = new Date().getTime();
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let index = 0; index < oldConnections.length; index++) {
      const oldConn = oldConnections[index];
      const newConnectionRule = this.mappedConnectionRules.get(oldConn.RuleId);
      const newUpperItem = this.mappedConfigurationItems.get(oldConn.ConnUpperItem);
      const newLowerItem = this.mappedConfigurationItems.get(oldConn.ConnLowerItem);
      if (!newConnectionRule || !newUpperItem || !newLowerItem) {
        console.log(oldConn, newConnectionRule, newUpperItem, newLowerItem);
        break;
      }
      let newConn = newConnections.find(c => c.ruleId === newConnectionRule.id && c.upperItemId === newUpperItem &&
        c.lowerItemId === newLowerItem);
      let changed = !newConn;
      if (!newConn) {
        newConn = {
          id: undefined,
          ruleId: newConnectionRule.id,
          upperItemId: newUpperItem,
          lowerItemId: newLowerItem,
          typeId: newConnectionRule.connectionTypeId,
          description: oldConn.Description,
        };
      } else {
        console.log('found', newConn);
        if (this.overwriteConnectionDescriptions && newConn.description !== oldConn.Description) {
          newConn.description = oldConn.Description;
          changed = true;
        }
      }
      if (changed) {
        this.connectionsToChange++;
        connectionsForChange.push(newConn);
      }
    }
    AppConfigService.settings.backend = { ...this.targetBackend };
    await from(connectionsForChange).pipe(
      mergeMap(connection => {
        this.connectionsMigrated++;
        if (connection.id) { // update
          return this.http.put<Connection>(this.targetUrl + 'Connection/' + connection.id, {...connection}, this.getOptions());
        } else { // create
          return this.http.post<Connection>(this.targetUrl + 'Connection', {...connection}, this.getOptions());
        }
      }, 2),
    ).toPromise();
    console.log('finished connections', new Date().getTime() - start);
    this.connectionsFinished = true;
  }

  private async getNewConnections() {
    AppConfigService.settings.backend = { ...this.targetBackend };
    let connContainer = await this.http.get<ConnectionResult>(this.targetUrl + 'Connections', this.getOptions()).toPromise();
    let connections = connContainer.connections;
    let page = 1;
    while (connContainer.totalConnections > connections.length) {
      page++;
      connContainer = await this.http.get<ConnectionResult>(this.targetUrl + 'Connections?page=' + page, this.getOptions()).toPromise();
      connections = connections.concat(connContainer.connections);
    }
    return connections;
  }

  checkTargetUrl() {
    this.targetUrl = this.targetUrl.trim();
    if (!this.targetUrl.endsWith('/')) {
      this.targetUrl += '/';
    }
    if (this.targetVersion > 1 && !this.targetUrl.endsWith('/rest/')) {
      this.targetUrl += 'rest/';
    }
    this.targetBackend = { url: this.targetUrl, version: +this.targetVersion, authMethod: this.targetAuthMethod };
    switch (this.targetAuthMethod) {
      case 'ntlm':
        this.http.get<{ role: number }>(this.targetUrl + 'user/current').pipe(
          take(1),
          tap(({ role }) => {
            this.invalidTargetUrl = role !== 2;
            this.invalidAuthMethod = this.invalidTargetUrl;
          }),
          catchError(() => {
            this.invalidTargetUrl = true;
            return of(null);
          }),
        ).subscribe();
        break;
      case 'jwt':
        if (this.targetUserName.length > 0 && this.targetPassword.length > 0) {
          this.login();
        }
        break;
      default:
        this.invalidAuthMethod = true;
    }
  }

  login() {
    let url = this.targetUrl;
    if (url.endsWith('rest/')) {
      url = url.slice(0, -5);
    }
    this.http.post<{token: string}>(url + 'login', {
      accountName: this.targetUserName,
      passphrase: this.targetPassword,
    }).pipe(
      take(1),
      tap(({token}) => {
        AppConfigService.authentication = 'Bearer ' + token;
        this.invalidTargetUrl = false;
        this.invalidAuthMethod = false;
      }),
      catchError((error) => {
        console.log(error);
        let errMsg: string;
        if (error.error) {
          if (error.error.data && error.error.data.errors) {
            errMsg = JSON.stringify(error.error.data.errors.map((e: { msg: string; }) => e.msg));
          } else if (error.message) {
            errMsg = error.message;
          }
        } else {
          errMsg = JSON.stringify(error);
        }
        this.error = errMsg;
        AppConfigService.authentication = null;
        this.invalidTargetUrl = true;
        this.invalidAuthMethod = true;
        return of(null);
      })
    ).subscribe();
  }

  clearLogin() {
    AppConfigService.authentication = null;
  }

  getUnmatchedCount(array: { old: any, new: any }[]) {
    return array.filter(v => !v.new).length;
  }

  getOldItemsCount(id: string) {
    return this.oldItemsCount.has(id) ? this.oldItemsCount.get(id) : 'n.a.';
  }

  getItemsToChangeForType(id: string) {
    id = this.mappedItemTypes.get(id).id;
    return this.itemsToChangeCount.has(id) ? this.itemsToChangeCount.get(id) : 'n.a.';
  }

  getItemsChangedForType(id: string) {
    id = this.mappedItemTypes.get(id).id;
    return this.itemsChanged.has(id) ? this.itemsChanged.get(id) : 0;
  }

  getItemTypeFinished(id: string) {
    id = this.mappedItemTypes.get(id).id;
    return this.finishedItemTypes.includes(id);
  }
}
