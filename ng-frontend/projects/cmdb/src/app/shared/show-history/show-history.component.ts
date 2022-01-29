import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { withLatestFrom } from 'rxjs';
import { ReadFunctions } from 'backend-access';

import { ItemSelectors } from '../store/store.api';

@Component({
  selector: 'app-show-history',
  templateUrl: './show-history.component.html',
  styleUrls: ['./show-history.component.scss']
})
export class ShowHistoryComponent implements OnInit {
  history: MatTableDataSource<any>;
  displayedColumns = ['date', 'subject', 'text', 'responsible'];

  constructor(public dialogRef: MatDialogRef<ShowHistoryComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string,
              public dialog: MatDialog,
              private store: Store,
              private http: HttpClient) { }

  ngOnInit() {
    ReadFunctions.itemHistory(this.http, this.data).pipe(
      withLatestFrom(this.store.select(ItemSelectors.configurationItem))
    ).subscribe(([entry, item]) => {
      const entries: {dateTime: Date; subject: string; text: string; responsible: string}[] = [];
      let nextVersion: {
        name: string;
        type?: string;
        attributes?: {
          type?: string;
          value: string;
        }[];
        responsibleUsers?: string[];
      } = {...item};
      entry.item.oldVersions.forEach(oldVersion => {
        if (oldVersion.name !== nextVersion.name) {
          entries.push({
            dateTime: oldVersion.changedAt,
            subject: 'name',
            text: oldVersion.name + ' -> ' + nextVersion.name,
            responsible: oldVersion.responsibleUsers.join(','),
          });
        }
        if (oldVersion.type !== nextVersion.type) {
          entries.push({
            dateTime: oldVersion.changedAt,
            subject: 'type',
            text: oldVersion.type + ' -> ' + nextVersion.type,
            responsible: oldVersion.responsibleUsers.join(','),
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
          });
        }
        if (addedUsers.length > 0) {
          entries.push({
            dateTime: oldVersion.changedAt,
            subject: 'added responsible users',
            text: addedUsers.join(','),
            responsible: oldVersion.responsibleUsers.join(','),
          });
        }
        // move one up in time
        nextVersion = oldVersion;
      });
      this.history = new MatTableDataSource(entries);
      this.history.filterPredicate = (data, filter) => filter === '' || data.scope === filter;
      }
    );
  }
}
