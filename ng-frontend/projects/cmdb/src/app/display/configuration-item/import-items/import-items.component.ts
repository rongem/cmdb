import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, ValidatorFn } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, catchError, withLatestFrom, take } from 'rxjs/operators';
import { TransferTable, LineMessage, MetaDataSelectors, ErrorActions, EditFunctions, ReadFunctions,
  ImportResult, ImportSheet } from 'backend-access';

import * as fromApp from '../../../shared/store/app.reducer';
import * as fromSelectDataExchange from '../../store/data-exchange.selectors';
import * as DataExchangeActions from '../../store/data-exchange.actions';

import { Column } from '../../objects/column.model';

@Component({
  selector: 'app-import-items',
  templateUrl: './import-items.component.html',
  styleUrls: ['./import-items.component.scss']
})
export class ImportItemsComponent implements OnInit {
  form: FormGroup;
  @ViewChild('file') file: ElementRef;
  fileContent: ImportResult;
  sheet: ImportSheet;
  sheetIndex = 0;
  columnNames: string[];
  listItems: string[];
  existingItemNames: string[];
  columns: Column[];
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
    return this.store.select(MetaDataSelectors.selectItemTypes);
  }

  get selectedItemType() {
    return this.store.select(fromSelectDataExchange.selectImportItemType);
  }

  get targetColumns() {
    return this.store.select(fromSelectDataExchange.selectTargetColumns);
  }

  get displayedColumns() {
    return this.columns.map(c => c.name);
  }

  get errorsInResults() {
    return this.resultList && this.resultList.filter(r => r.severity > 0).length;
  }

  get previewLines() {
    return this.fileContent.sheets[this.sheetIndex].lines.slice(0, 5);
  }

  getPreviewCells(line: string[]) {
    return line.slice(0, 5);
  }

  onChangeItemType(itemTypeId: string) {
    this.store.dispatch(DataExchangeActions.setImportItemType({itemTypeId}));
    this.getExistingItemsList();
  }

  onChangeElements(elements: string[]) {
    this.store.dispatch(DataExchangeActions.setElements({elements}));
  }

  onSubmit() {
    this.busy = true;
    EditFunctions.importDataTable(this.http, this.form.get('itemType').value, this.dataTable).subscribe(messages => {
      this.resultList = messages;
      this.busy = false;
    }, (error) => {
      this.store.dispatch(ErrorActions.error({error, fatal: false}));
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
        if (this.fileContent.sheets.length === 1) {
          this.onSelectSheet(0);
        }
        this.busy = false;
      }, (error) => {
        this.store.dispatch(ErrorActions.error({error, fatal: false}));
        this.fileContent = undefined;
        this.busy = false;
      });
    }
  }

  onSelectSheet(sheetIndex: number) {
    this.sheet = this.fileContent.sheets[sheetIndex];
    this.columnNames = [];
    if (this.form.get('headlines').value === true) {
      // set headings and remove heading line
      this.sheet.lines[0].forEach((value) => this.columnNames.push(value));
      this.sheet.lines.splice(0, 1);
    } else {
      // set numbers as headings
      this.sheet.lines[0].forEach((value, index) => this.columnNames.push('(' + index + ')'));
    }
    const cols = this.form.get('columns') as FormArray;
    this.targetColumns.pipe(take(1)).subscribe(columns => {
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
      });
    });

  }

  onContinue() {
    this.busy = true;
    this.targetColumns.pipe(
      map(allColumns => {
        const columns = (this.form.get('columns') as FormArray).value as string[];
        const activeColumns: Column[] = [];
        columns.forEach((c, i) => {
          if (c !== '<ignore>') {
            activeColumns.push(new Column(i, c, allColumns.find(col => col.key === c).value));
          }
        });
        return activeColumns;
      }),
    ).subscribe(activeColumns => {
      this.getTable(activeColumns);
      this.busy = false;
    }, (error) => {
      this.store.dispatch(ErrorActions.error({error, fatal: false}));
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

  validateFile: ValidatorFn = (c: FormControl) => {
    if (this.file && this.file.nativeElement) {
      const file = this.file.nativeElement as HTMLInputElement;
      if (file && file.files && file.files.length > 0 && (file.files[0].type === 'text/csv' ||
        file.files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        (file.files[0].type === 'application/vnd.ms-excel' && file.files[0].name.endsWith('.csv')))) {
          return null;
      }
    }
    return {invalidFileTypeError: true};
  }

  validateColumns: ValidatorFn = (a: FormArray) => {
    const t1 = a.value.filter((v: string) => v !== '<ignore>');
    const t2 = [...new Set(t1)];
    if (t1.length !== t2.length) {
      return {duplicateValuesError: true};
    }
    if (!t2.includes('name')) {
      return {noNameColumnError: true};
    }
    if (t2.includes('linkdescription') && !t2.includes('linkaddress')) {
      return {descriptionButNoLinkAddressError: true};
    }
    return null;
  }

  postFile(file: File): Observable<ImportResult> {
    return EditFunctions.uploadAndConvertFileToTable(this.http, file).pipe(
      catchError((e) => of(null)),
    );
  }

  getExistingItemsList() {
    ReadFunctions.configurationItemsByTypes(this.http, [this.form.get('itemType').value]).subscribe(items => {
      this.existingItemNames = items.map(item => item.name);
    });
  }

  getTable(columns: Column[]) {
    const columnIds = columns.map(c => c.number);
    const nameColumn = columns.findIndex(c => c.targetType === 'name');
    const rows: string[][] = [];
    const rowNames: string[] = [];
    this.errorList = [];
    this.sheet.lines.forEach((line, index) => {
      if (!line[nameColumn] || line[nameColumn] === '') {
        this.errorList.push({index, message: 'Ignoring line with empty name.'});
        return;
      }
      if (rowNames.includes(line[nameColumn])) {
        this.errorList.push({index, message: 'Ignoring line with duplicate name.'});
        return;
      }
      if (this.form.get('ignoreExisting').value === true && this.existingItemNames.includes(line[nameColumn])) {
        this.errorList.push({index, message: 'existing item ignored'});
        return;
      }
      // If columns at the end of the row are empty, they may be missing, so this is filling them up
      while (line.length < columnIds[columnIds.length - 1] + 1) {
        line.push('');
      }
      rows.push(line.filter((val, i) => columnIds.includes(i)));
    });
    this.columns = columns;
    this.dataTable = { columns: columns.map(c => c.columnMap), rows };
  }

}
