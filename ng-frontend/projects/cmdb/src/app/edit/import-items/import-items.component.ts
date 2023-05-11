import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl, UntypedFormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { catchError, map, Observable, of, take } from 'rxjs';
import {
  TransferTable,
  LineMessage,
  MetaDataSelectors,
  ErrorActions,
  EditFunctions,
  ReadFunctions,
  ImportResult,
  ImportSheet,
} from 'backend-access';

import { ImportSelectors, ImportActions } from '../../shared/store/store.api';
import { Column } from '../objects/column.model';
import { ImportSettings } from '../../shared/objects/import-settings.model';

@Component({
  selector: 'app-import-items',
  templateUrl: './import-items.component.html',
  styleUrls: ['./import-items.component.scss']
})
export class ImportItemsComponent implements OnInit {
  @ViewChild('file') file: ElementRef;
  form: UntypedFormGroup;
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

  constructor(private store: Store, private http: HttpClient, private fb: UntypedFormBuilder) { }

  get itemTypes() {
    return this.store.select(MetaDataSelectors.selectItemTypes);
  }

  get selectedItemType() {
    return this.store.select(ImportSelectors.itemType);
  }

  get targetColumns() {
    return this.store.select(ImportSelectors.selectTargetColumns);
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

  ngOnInit() {
    this.form = this.fb.group({
      itemTypeId: this.fb.control('', [Validators.required]),
      attributes: this.fb.control(true),
      connectionsToLower: this.fb.control(false),
      connectionsToUpper: this.fb.control(false),
      links: this.fb.control(false),
      ignoreExisting: this.fb.control(false),
      headlines: this.fb.control(true),
      file: this.fb.control('', [Validators.required, this.validateFile]),
      columns: this.fb.array([], this.validateColumns),
    });
    this.form.valueChanges.subscribe((value: ImportSettings) => {
      this.store.dispatch(ImportActions.setState(value));
    });
  }

  getPreviewCells(line: string[]) {
    return line.slice(0, 5);
  }

  onSubmit() {
    this.busy = true;
    EditFunctions.importDataTable(this.http, this.form.get('itemTypeId').value, this.dataTable).subscribe({
      next: messages => this.resultList = messages,
      error: (error) => {
        this.store.dispatch(ErrorActions.error({error, fatal: false}));
        this.onBackToFirst();
      },
      complete: () => this.busy = false,
    });
  }

  handleFileInput(target: EventTarget) { // files: FileList
    const files = (target as HTMLInputElement).files;
    if (this.form.get('file').valid) {
      this.busy = true;
      this.postFile(files[0]).subscribe({
        next: data => {
          this.fileContent = data;
          if (this.fileContent.sheets.length === 1) {
            this.onSelectSheet(0);
          }
        },
        error: error => {
          this.store.dispatch(ErrorActions.error({error, fatal: false}));
          this.fileContent = undefined;
        },
        complete: () => this.busy = false
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
    const cols = this.form.get('columns') as UntypedFormArray;
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
        const columns = (this.form.get('columns') as UntypedFormArray).value as string[];
        const activeColumns: Column[] = [];
        columns.forEach((c, i) => {
          if (c !== '<ignore>') {
            activeColumns.push(new Column(i, c, allColumns.find(col => col.key === c).value));
          }
        });
        return activeColumns;
      }),
      take(1),
    ).subscribe({
      next: activeColumns => this.getTable(activeColumns),
      error: (error) => {
        this.store.dispatch(ErrorActions.error({error, fatal: false}));
        this.dataTable = undefined;
      },
      complete: () => this.busy = false,
    });
  }

  onBackToFirst() {
    this.fileContent = undefined;
    this.dataTable = undefined;
    this.resultList = undefined;
    this.errorList = undefined;
    this.form.get('file').reset();
    (this.form.get('columns') as UntypedFormArray).clear();
  }

  private postFile(file: File): Observable<ImportResult> {
    return EditFunctions.uploadAndConvertFileToTable(this.http, file).pipe(
      catchError((e) => of(null)),
    );
  }

  private getExistingItemsList() {
    ReadFunctions.configurationItemsByTypes(this.http, [this.form.get('itemTypeId').value]).subscribe(items => {
      this.existingItemNames = items.map(item => item.name);
    });
  }

  private getTable(columns: Column[]) {
    const columnIds = columns.map(c => c.orderNumber);
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

  private validateFile: ValidatorFn = (c: AbstractControl) => {
    if (this.file && this.file.nativeElement) {
      const file = this.file.nativeElement as HTMLInputElement;
      if (file && file.files && file.files.length > 0 && (file.files[0].type === 'text/csv' ||
        file.files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        (file.files[0].type === 'application/vnd.ms-excel' && file.files[0].name.endsWith('.csv')))) {
          return null;
      }
    }
    return {invalidFileTypeError: true};
  };

  private validateColumns: ValidatorFn = (a: AbstractControl) => {
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
  };

}
