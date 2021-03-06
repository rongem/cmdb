import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as fromSelectDisplay from 'projects/cmdb/src/app/display/store/display.selectors';

import { ExportService } from 'projects/cmdb/src/app/display/shared/export.service';

@Component({
  selector: 'app-export-item',
  templateUrl: './export-item.component.html',
  styleUrls: ['./export-item.component.scss']
})
export class ExportItemComponent implements OnInit {
  exportType = 'excel';
  exportDepth = '1';
  exportData = 'connections';

  constructor(public dialogRef: MatDialogRef<ExportItemComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string,
              public dialog: MatDialog,
              private store: Store<fromApp.AppState>,
              private exportService: ExportService) { }

  ngOnInit() {
  }

  exportFile() {
    switch (this.exportType) {
      case 'csv':
        switch (this.exportData) {
          case 'connections':
            this.downloadConnectionsAsCsvFile();
            break;
          case 'links':
            break;
        }
        break;
      case 'excel':
        switch (this.exportData) {
          case 'connections':
            this.downloadConnectionsAsExcelFile();
            break;
          case 'links':
            break;
        }
        break;
    }
  }

  get configurationItem() {
    return this.store.select(fromSelectDisplay.selectDisplayConfigurationItem);
  }

  get connections() {
    return this.configurationItem.pipe(
      take(1),
      map(item => {
        const connections: {
          upperItemType: string;
          upperItemName: string;
          connectionType: string;
          lowerItemType: string;
          lowerItemName: string;
          description: string;
        }[] = [];
        item.connectionsToLower.forEach(conn => connections.push({
          upperItemType: item.type,
          upperItemName: item.name,
          connectionType: conn.typeId,
          lowerItemType: conn.targetType,
          lowerItemName: conn.targetName,
          description: conn.description,
        }));
        item.connectionsToUpper.forEach(conn => connections.push({
          upperItemType: conn.targetType,
          upperItemName: conn.targetName,
          connectionType: conn.typeId,
          lowerItemType: item.type,
          lowerItemName: item.name,
          description: conn.description,
        }));
        return connections;
      })
    );
  }

  downloadConnectionsAsExcelFile() {
    this.connections.subscribe(connections => {
      this.exportService.exportAsExcelFile(connections, 'download.xlsx');
      this.dialogRef.close();
    });
  }

  downloadConnectionsAsCsvFile() {
    this.connections.subscribe(connections => {
      this.exportService.exportAsCsvFile(connections, 'download.csv');
    });
  }
}
