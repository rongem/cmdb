import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, catchError, withLatestFrom, switchMap } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectDataExchange from 'src/app/display/store/data-exchange.selectors';
import * as DataExchangeActions from 'src/app/display/store/data-exchange.actions';

import { Guid } from 'src/app/shared/guid';
import { getUrl, getHeader } from 'src/app/shared/store/functions';
import { ColumnMap } from '../objects/column-map.model';

@Component({
  selector: 'app-import-items',
  templateUrl: './import-items.component.html',
  styleUrls: ['./import-items.component.scss']
})
export class ImportItemsComponent implements OnInit {
  form: FormGroup;
  @ViewChild('file', {static: false}) file: ElementRef;
  fileContent: string[][];
  columnNames: string[];
  listItems: string[];
  dataTable: any;
  busy = false;

  constructor(private router: Router,
              private actions$: Actions,
              private store: Store<fromApp.AppState>,
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

  onChangeItemType(itemTypeId: Guid) {
    this.store.dispatch(DataExchangeActions.setImportItemType({itemTypeId}));
  }

  onSubmit() {
    console.log(this.form.value);
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
            activeColumns.push({number: i, name: c, caption: allColumns[i].value});
          }
        });
        return activeColumns;
      }),
      switchMap(activeColumns => this.http.put<any>(getUrl('GetDataTable'), {
        lines: this.fileContent,
        activeColumns,
        itemTypeId: this.form.get('itemType').value,
        ignoreExisting: this.form.get('ignoreExisting').value,
      })),
    ).subscribe(data => {
      console.log(data);
    });
  }

  onBackToFirst() {
    this.fileContent = undefined;
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
    const t1 = a.value.filter(v => v !== '<ignore>');
    const t2 = [...new Set(t1)];
    if (t1.length !== t2.length) {
      return 'duplicate values';
    }
    if (!t2.includes('name')) {
      return 'no name column present';
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

}
