import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { ItemType } from 'src/app/shared/objects/item-type.model';
import { MetaDataService } from 'src/app/shared/meta-data.service';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';

@Component({
  selector: 'app-delete-item-type',
  templateUrl: './delete-item-type.component.html',
  styleUrls: ['./delete-item-type.component.scss']
})
export class DeleteItemTypeComponent implements OnInit {
  items: Observable<ConfigurationItem[]>;

  constructor(
    public dialogRef: MatDialogRef<DeleteItemTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ItemType,
    private metaDataService: MetaDataService) { }

  ngOnInit() {
    (this.items = this.metaDataService.getItemsForItemType(this.data)).subscribe();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
