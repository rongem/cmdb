import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { take, tap, withLatestFrom } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { FullConfigurationItem, ItemLink, EditActions, ConfigurationItem } from 'backend-access';

import * as fromSelectDisplay from '../../store/display.selectors';

import { AddLinkComponent } from './add-link/add-link.component';

@Component({
  selector: 'app-edit-item-links',
  templateUrl: './edit-item-links.component.html',
  styleUrls: ['./edit-item-links.component.scss']
})
export class EditItemLinksComponent implements OnInit {
  itemId: string;

  constructor(private store: Store,
              public dialog: MatDialog) { }

  ngOnInit() {
  }

  get configurationItem() {
    return this.store.select(fromSelectDisplay.selectDisplayConfigurationItem).pipe(
      tap((item: FullConfigurationItem) => this.itemId = item ? item.id : undefined),
    );
  }

  onAddLink() {
    const dialogRef = this.dialog.open(AddLinkComponent, {
      width: 'auto',
      // class:
      data: this.itemId,
    });
    dialogRef.afterClosed().pipe(withLatestFrom(this.configurationItem)).subscribe(([itemLink, item]) => {
      if (itemLink instanceof ItemLink) {
        const configurationItem = ConfigurationItem.copyItem(item);
        configurationItem.links.push(itemLink);
        this.store.dispatch(EditActions.updateConfigurationItem({configurationItem}));
      }
    });
  }

  onDeleteLink(linkUri: string) {
    this.configurationItem.pipe(
      take(1),
      tap(item => {
        const configurationItem = ConfigurationItem.copyItem(item);
        const linkIndex = configurationItem.links.findIndex(l => l.uri === linkUri);
        configurationItem.links.splice(linkIndex, 1);
        this.store.dispatch(EditActions.updateConfigurationItem({configurationItem}));
      })
    ).subscribe();
  }
}
