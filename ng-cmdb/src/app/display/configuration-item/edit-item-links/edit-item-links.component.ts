import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';
import * as EditActions from 'src/app/display/store/edit.actions';

import { AddLinkComponent } from './add-link/add-link.component';
import { Guid } from 'src/app/shared/guid';
import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { ItemLink } from 'src/app/shared/objects/item-link.model';

@Component({
  selector: 'app-edit-item-links',
  templateUrl: './edit-item-links.component.html',
  styleUrls: ['./edit-item-links.component.scss']
})
export class EditItemLinksComponent implements OnInit {
  itemId: Guid;
  displayedLinkColumns = ['link', 'description', 'id'];

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

  onDeleteLink(linkId: Guid) {
    const itemLink = new ItemLink();
    itemLink.ItemId = this.itemId;
    itemLink.LinkId = linkId;
    this.store.dispatch(EditActions.deleteLink({itemLink}));
  }
}
