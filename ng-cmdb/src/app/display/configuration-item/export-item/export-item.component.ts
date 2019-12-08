import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { tap } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';

import { Guid } from 'src/app/shared/guid';
import { getUrl } from 'src/app/shared/store/functions';
import { ExcelService } from 'src/app/display/shared/excel.service';

@Component({
  selector: 'app-export-item',
  templateUrl: './export-item.component.html',
  styleUrls: ['./export-item.component.scss']
})
export class ExportItemComponent implements OnInit {
  exportType = 'excel';
  exportDepth: '1';
  exportData: 'connections';

  constructor(public dialogRef: MatDialogRef<ExportItemComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Guid,
              public dialog: MatDialog,
              private http: HttpClient,
              private store: Store<fromApp.AppState>,
              private excel: ExcelService) { }

  ngOnInit() {
  }

  exportFile() {
    switch (this.exportType) {
      case 'csv':
        this.downloadFile('text/comma-separated-value');
        break;
      case 'excel':
        this.downloadFile('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        break;
      case 'graphml':
        this.downloadGraph();
        break;
    }
  }

  get configurationItem() {
    return this.store.select(fromSelectDisplay.selectDisplayConfigurationItem);
  }

  downloadFile(accept: string) {
    const sub = this.configurationItem.subscribe(item => {
      const param: {
        upperItemType: string;
        upperItemName: string;
        connectionType: string;
        lowerItemType: string;
        lowerItemName: string;
        description: string;
      }[] = [];
      item.connectionsToLower.forEach(conn => param.push({
        upperItemType: item.type,
        upperItemName: item.name,
        connectionType: conn.connectionType,
        lowerItemType: conn.targetType,
        lowerItemName: conn.targetName,
        description: conn.description,
      }));
      item.connectionsToUpper.forEach(conn => param.push({
        upperItemType: conn.targetType,
        upperItemName: conn.targetName,
        connectionType: conn.connectionType,
        lowerItemType: item.type,
        lowerItemName: item.name,
        description: conn.description,
      }));
      this.excel.exportAsExcelFile(param, 'download.xslx');
      this.dialogRef.close();
      sub.unsubscribe();
    });
    // const urlPart = this.exportData === 'connections' ? 'Connections' : 'Links';
    // this.http.get(getUrl('Export/Table/ForItem/' + urlPart + '/' + this.data),
    //   { headers: new HttpHeaders({ 'Accept' : accept}) }
    // ).subscribe((data) => {
    //   console.log(data);
    //   const blob = new Blob([data.toString()], { type: accept });
    //   console.log(blob);
    //   const url = window.URL.createObjectURL(blob);
    //   window.open(url);
    // });
  }

  downloadGraph() {
    this.http.get(getUrl('Export/Graph/ForItem/' + this.data + '/' + this.exportDepth),
      { headers: new HttpHeaders({'Accept' : 'application/graphml+xml'}), responseType: 'blob' }
    ).subscribe(data => console.log(data));
  }

}
