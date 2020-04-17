import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AttributeType, AdminFunctions } from 'backend-access';

@Component({
  selector: 'app-delete-attribute-type',
  templateUrl: './delete-attribute-type.component.html',
  styleUrls: ['./delete-attribute-type.component.scss']
})
export class DeleteAttributeTypeComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeleteAttributeTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AttributeType,
    private http: HttpClient) {}

  ngOnInit() {
  }

  get attributes() {
    return AdminFunctions.getAttributesForAttributeType(this.http, this.data.id);
  }
}
