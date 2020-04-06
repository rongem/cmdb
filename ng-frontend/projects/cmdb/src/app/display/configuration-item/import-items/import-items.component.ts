import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, catchError, withLatestFrom } from 'rxjs/operators';

import * as fromApp from 'projects/cmdb/src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'projects/cmdb/src/app/shared/store/meta-data.selectors';
import * as fromSelectDataExchange from 'projects/cmdb/src/app/display/store/data-exchange.selectors';
import * as MetaDataActions from 'projects/cmdb/src/app/shared/store/meta-data.actions';
import * as DataExchangeActions from 'projects/cmdb/src/app/display/store/data-exchange.actions';

import { Guid } from 'backend-access';
import { getUrl, getHeader } from 'projects/cmdb/src/app/shared/store/functions';
import { ColumnMap } from '../../objects/column-map.model';
import { ConfigurationItem } from 'projects/cmdb/src/app/shared/objects/configuration-item.model';
import { TransferTable } from '../../objects/transfer-table.model';
import { LineMessage } from '../../objects/line-message.model';

@Component({
  selector: 'app-import-items',
  templateUrl: './import-items.component.html',
  styleUrls: ['./import-items.component.scss']
})
export class ImportItemsComponent implements OnInit {
  form: FormGroup;
  @ViewChild('file') file: ElementRef;
  fileContent: string[][];
  columnNames: string[];
  listItems: string[];
  existingItemNames: string[];
  dataTable: TransferTable;
  errorList: LineMessage[] = [];
  resultList: LineMessage[];
  busy = false;

  constructor(private store: Store<fromApp.AppState>,
              private http: HttpClient,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      itemType: ['', [Validators.required]],
      elements: new Array(['attributes']),
      ignoreExisting: false,
      headlines: true,
      file: ['', [Validators.required, this.validateFile.bind(this)]],
      columns: this.fb.array([], this.validateColumns.bind(this)),
    });
    this.onChangeElements(this.form.get('elements').value);
  }

  get itemTypes() {
    return this.store.select(fromSelectMetaData.selectItemTypes);
  }

  get selectedItemType() {
    return this.store.select(fromSelectDataExchange.selectImportItemType);
  }

  get targetColumns() {
    return this.store.select(fromSelectDataExchange.selectTargetColumns);
  }

  get displayedColumns() {
    return this.dataTable.columns.map(c => c.name);
  }

  get errorsInResults() {
    return this.resultList && this.resultList.filter(r => r.severity > 0).length;
  }

  onChangeItemType(itemTypeId: Guid) {
    this.store.dispatch(DataExchangeActions.setImportItemType({itemTypeId}));
    this.getExistingItemsList();
  }

  onChangeElements(elements: string[]) {
    this.store.dispatch(DataExchangeActions.setElements({elements}));
  }

  onSubmit() {
    this.busy = true;
    const sub = this.http.put<LineMessage[]>(getUrl('ImportDataTable'), {
      table: this.dataTable,
      itemTypeId: this.form.get('itemType').value
    }, { headers: getHeader() }).subscribe(messages => {
      this.resultList = messages;
      this.busy = false;
      sub.unsubscribe();
    }, (error) => {
      this.store.dispatch(MetaDataActions.error({error, invalidateData: false}));
      this.onBackToFirst();
      this.busy = false;
    });
  }

  handleFileInput(files: FileList) {
    if (this.form.get('file').valid) {
      this.busy = true;
      this.postFile(files[0]).pipe(
        withLatestFrom(this.targetColumns),
      ).subscribe(([data, columns]) => {
        this.fileContent = data;
        this.columnNames = [];
        if (this.form.get('headlines').value === true) {
          // set headings and remove heading line
          this.fileContent[0].forEach((value) => this.columnNames.push(value));
          this.fileContent.splice(0, 1);
        } else {
          // set numbers as headings
          this.fileContent[0].forEach((value, index) => this.columnNames.push('(' + index + ')'));
        }
        const cols = this.form.get('columns') as FormArray;
        // set column values according to text values
        this.columnNames.forEach((value) => {
          let val = '<ignore>';
          if (['name', 'item name', 'item-name', 'itemname', 'configuration item'].includes(value.toLowerCase())) {
            val = 'name';
          } else {
            columns.forEach(keyvalue => {
              if (keyvalue.value === value) {
                val = keyvalue.key;
              }
            });
          }
          cols.push(this.fb.control(val));
          this.busy = false;
        });
      }, (error) => {
        this.store.dispatch(MetaDataActions.error({error, invalidateData: false}));
        this.fileContent = undefined;
        this.busy = false;
      });
    }
  }

  onContinue() {
    this.busy = true;
    this.targetColumns.pipe(
      map(allColumns => {
        const columns = (this.form.get('columns') as FormArray).value as string[];
        const activeColumns: ColumnMap[] = [];
        columns.forEach((c, i) => {
          if (c !== '<ignore>') {
            activeColumns.push({number: i, name: c, caption: allColumns.find(col => col.key === c).value});
          }
        });
        return activeColumns;
      }),
    ).subscribe(activeColumns => {
      this.getTable(activeColumns);
      this.busy = false;
    }, (error) => {
      this.store.dispatch(MetaDataActions.error({error, invalidateData: false}));
      this.dataTable = undefined;
      this.busy = false;
    });
  }

  onBackToFirst() {
    this.fileContent = undefined;
    this.dataTable = undefined;
    this.resultList = undefined;
    this.errorList = undefined;
    this.form.get('file').reset();
    (this.form.get('columns') as FormArray).clear();
  }

  validateFile(c: FormControl) {
    if (this.file && this.file.nativeElement) {
      const file = this.file.nativeElement as HTMLInputElement;
      if (file && file.files && file.files.length > 0 && (file.files[0].type === 'text/csv' ||
        file.files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        (file.files[0].type === 'application/vnd.ms-excel' && file.files[0].name.endsWith('.csv')))) {
          return null;
      }
    }
    return 'invalid file type';
  }

  validateColumns(a: FormArray) {
    const t1 = a.value.filter((v: string) => v !== '<ignore>');
    const t2 = [...new Set(t1)];
    if (t1.length !== t2.length) {
      return 'duplicate values';
    }
    if (!t2.includes('name')) {
      return 'no name column present';
    }
    if (t2.includes('linkdescription') && !t2.includes('linkaddress')) {
      return 'link description without address';
    }
    return null;
  }

  postFile(file: File): Observable<string[][]> {
    const endpoint = getUrl('ConvertFileToTable');
    const formData: FormData = new FormData();
    formData.append('contentStream', file, file.name);
    return this.http.post<string[][]>(endpoint, formData).pipe(
      catchError((e) => of(null)),
    );
  }

  getExistingItemsList() {
    const sub = this.http.post<ConfigurationItem[]>(getUrl('ConfigurationItems/ByType'),
      {typeIds: [this.form.get('itemType').value]}, { headers: getHeader() }
    ).subscribe(items => {
      this.existingItemNames = items.map(item => item.ItemName);
      sub.unsubscribe();
    });
  }

  getTable(columns: ColumnMap[]) {
    const columnIds = columns.map(c => c.number);
    const nameColumn = columns.find(c => c.name === 'name').number;
    const rows: string[][] = [];
    const rowNames: string[] = [];
    this.errorList = [];
    this.fileContent.forEach((line, index) => {
      if (!line[nameColumn] || line[nameColumn] === '') {
        this.errorList.push({index, message: 'empty name'});
        return;
      }
      if (rowNames.includes(line[nameColumn])) {
        this.errorList.push({index, message: 'duplicate line'});
        return;
      }
      if (this.form.get('ignoreExisting').value === true && this.existingItemNames.includes(line[nameColumn])) {
        this.errorList.push({index, message: 'existing item ignored'});
        return;
      }
      rows.push(line.filter((val, i) => columnIds.includes(i)));
    });
    this.dataTable = { columns, rows };
  }

}
