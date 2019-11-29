import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Guid } from 'src/app/shared/guid';
import { getUrl } from 'src/app/shared/store/functions';

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
              private http: HttpClient) { }

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

  downloadFile(accept: string) {
    const urlPart = this.exportData === 'connections' ? 'Connections' : 'Links';
    this.http.get(getUrl('Export/Table/ForItem/' + urlPart + '/' + this.data),
      { headers: new HttpHeaders({ 'Accept' : accept}) }
    ).subscribe(data => console.log(data));
  }

  downloadGraph() {
    this.http.get(getUrl('Export/Graph/ForItem/' + this.data + '/' + this.exportDepth),
      { headers: new HttpHeaders({'Accept' : 'application/graphml+xml'}) }
    ).subscribe(data => console.log(data));
  }

}
