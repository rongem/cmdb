import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { FullConfigurationItem, ItemLink, EditActions } from 'backend-access';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as fromSelectDisplay from 'projects/cmdb/src/app/display/store/display.selectors';

import { AddLinkComponent } from './add-link/add-link.component';

@Component({
  selector: 'app-edit-item-links',
  templateUrl: './edit-item-links.component.html',
  styleUrls: ['./edit-item-links.component.scss']
})
export class EditItemLinksComponent implements OnInit {
  itemId: string;

  constructor(private store: Store<fromApp.AppState>,
              public dialog: MatDialog) { }

  ngOnInit() {
  }

  get configurationItem() {
    return this.store.pipe(
      select(fromSelectDisplay.selectDisplayConfigurationItem),
      tap((item: FullConfigurationItem) => this.itemId = item ? item.id : undefined),
    );
  }

  onAddLink() {
    const dialogRef = this.dialog.open(AddLinkComponent, {
      width: 'auto',
      // class:
      data: this.itemId,
    });
    dialogRef.afterClosed().subscribe(itemLink => {
      if (itemLink instanceof ItemLink) {
        this.store.dispatch(EditActions.createLink({itemLink}));
      }
    });
  }

  onDeleteLink(linkId: string) {
    const itemLink = new ItemLink();
    itemLink.itemId = this.itemId;
    itemLink.id = linkId;
    this.store.dispatch(EditActions.deleteLink({itemLink}));
  }
}
