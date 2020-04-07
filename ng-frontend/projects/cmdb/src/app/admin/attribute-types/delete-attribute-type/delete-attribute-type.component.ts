import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { AttributeType, ItemAttribute } from 'backend-access';
import { AdminService } from 'projects/cmdb/src/app/admin/admin.service';

@Component({
  selector: 'app-delete-attribute-type',
  templateUrl: './delete-attribute-type.component.html',
  styleUrls: ['./delete-attribute-type.component.scss']
})
export class DeleteAttributeTypeComponent implements OnInit {
  attributes: Observable<ItemAttribute[]>;
  constructor(
    public dialogRef: MatDialogRef<DeleteAttributeTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AttributeType,
    private adminService: AdminService) {}

  ngOnInit() {
    (this.attributes = this.adminService.getAttributesForAttributeType(this.data)).subscribe();
  }
}
