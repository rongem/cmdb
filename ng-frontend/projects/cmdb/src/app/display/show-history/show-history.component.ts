import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { skipWhile, switchMap, take, withLatestFrom } from 'rxjs';
import { ReadFunctions } from 'backend-access';

import { ItemSelectors } from '../../shared/store/store.api';
import { ItemHistoryEntry } from '../../shared/objects/item-history-entry.model';
import { HistoryEntry } from '../../shared/objects/history-entry.model';
import { History } from '../../shared/objects/history.model';

@Component({
    selector: 'app-show-history',
    templateUrl: './show-history.component.html',
    styleUrls: ['./show-history.component.scss'],
    standalone: false
})
export class ShowHistoryComponent implements OnInit {
  displayedColumns = ['date', 'subject', 'text', 'responsible'];
  history: History;

  constructor(private store: Store,
              private http: HttpClient) { }

  get itemReady() {
    return this.store.select(ItemSelectors.itemReady);
  }

  get configurationItem() {
    return this.store.select(ItemSelectors.configurationItem);
  }

  ngOnInit() {
    this.itemReady.pipe(
      skipWhile(ready => !ready),
      switchMap(() => this.configurationItem),
      take(1),
      switchMap(item => ReadFunctions.itemHistory(this.http, item.id)),
      withLatestFrom(this.configurationItem),
    ).subscribe(([entry, item]) => {
      const entries: HistoryEntry[] = [];
      let nextVersion: ItemHistoryEntry = {...item};
      entry.item.oldVersions.forEach(oldVersion => {
        if (oldVersion.name !== nextVersion.name) {
          entries.push({
            dateTime: oldVersion.changedAt,
            subject: 'name',
            text: oldVersion.name + ' -> ' + nextVersion.name,
            responsible: oldVersion.responsibleUsers.join(','),
            type: 'C',
          });
        }
        if (oldVersion.type !== nextVersion.type) {
          entries.push({
            dateTime: oldVersion.changedAt,
            subject: 'type',
            text: oldVersion.type + ' -> ' + nextVersion.type,
            responsible: oldVersion.responsibleUsers.join(','),
            type: 'C'
          });
        }
        // get all attributes that are existing in old versions
        oldVersion.attributes.forEach(oldAttribute => {
          const nextAttribute = nextVersion.attributes.find(a => a.type === oldAttribute.type);
          if (!nextAttribute || oldAttribute.value !== nextAttribute.value) {
            entries.push({
              dateTime: oldVersion.changedAt,
              subject: oldAttribute.type,
              text: oldAttribute.value + ' -> ' + (nextAttribute?.value ?? '(deleted)'),
              responsible: oldVersion.responsibleUsers.join(','),
              type: 'A'
            });
          }
        });
        // get all other attributes (i.e. that are newly created)
        const attributeTypes = oldVersion.attributes.map(a => a.type);
        nextVersion.attributes.filter(a => !attributeTypes.includes(a.type)).forEach(nextAttribute => {
          entries.push({
            dateTime: oldVersion.changedAt,
            subject: nextAttribute.type,
            text: nextAttribute.value + ' (created)',
            responsible: oldVersion.responsibleUsers.join(','),
            type: 'A'
          });
        });
        // compare responsible users
        const oldUsers = oldVersion.responsibleUsers ?? [];
        const nextUsers = nextVersion.responsibleUsers ?? [];
        const deletedUsers = oldUsers.filter(u => !nextUsers.includes(u));
        const addedUsers = nextUsers.filter(u => !oldUsers.includes(u));
        if (deletedUsers.length > 0) {
          entries.push({
            dateTime: oldVersion.changedAt,
            subject: 'delete responsible users',
            text: deletedUsers.join(','),
            responsible: oldVersion.responsibleUsers.join(','),
            type: 'C'
          });
        }
        if (addedUsers.length > 0) {
          entries.push({
            dateTime: oldVersion.changedAt,
            subject: 'added responsible users',
            text: addedUsers.join(','),
            responsible: oldVersion.responsibleUsers.join(','),
            type: 'C'
          });
        }
        // move one up in time
        nextVersion = oldVersion;
      });
      this.history = new History(entries, '');
      }
    );
  }
}
