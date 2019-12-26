import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { ExportService } from '../../shared/export.service';

interface ExportElement {
  Name: string;
  ItemType: string;
  [key: string]: string;
}

@Component({
  selector: 'app-export-items',
  templateUrl: './export-items.component.html',
  styleUrls: ['./export-items.component.scss']
})
export class ExportItemsComponent implements OnInit {
  exportType = 'excel';

  constructor(public dialogRef: MatDialogRef<ExportItemsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: FullConfigurationItem[],
              private exportService: ExportService,
              public dialog: MatDialog) { }

  ngOnInit() {
  }

  exportFile() {
    const elements: ExportElement[] = [];
    this.data.forEach(item => {
      let el: ExportElement = { Name: item.name, ItemType: item.type };
      item.attributes.forEach(att => {
        el = Object.assign(el, {[att.type]: att.value});
      });
      item.connectionsToLower.forEach(conn => {
        const val = conn.description ? conn.targetName + ' (' + conn.description + ')' : conn.targetName;
        const key = conn.connectionType + ' ' + conn.targetType;
        el = Object.assign(el, {[key]: val});
      });
      item.connectionsToUpper.forEach(conn => {
        const val = conn.description ? conn.targetName + ' (' + conn.description + ')' : conn.targetName;
        const key = conn.connectionType + ' ' + conn.targetType;
        el = Object.assign(el, {[key]: val});
      });
      elements.push(el);
    });
    switch (this.exportType) {
      case 'excel':
        this.exportService.exportAsExcelFile(elements, 'download.xlsx');
        break;
      case 'csv':
        this.exportService.exportAsCsvFile(elements, 'download.csv');
        break;
    }
    this.dialogRef.close();
  }

}
