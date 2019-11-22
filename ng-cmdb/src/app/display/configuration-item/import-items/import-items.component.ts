import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';

import { Guid } from 'src/app/shared/guid';
import { getUrl, getHeader } from 'src/app/shared/store/functions';

@Component({
  selector: 'app-import-items',
  templateUrl: './import-items.component.html',
  styleUrls: ['./import-items.component.scss']
})
export class ImportItemsComponent implements OnInit {
  form: FormGroup;
  @ViewChild('file', {static: false}) file: ElementRef;

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
    });
  }

  get itemTypes() {
    return this.store.pipe(select(fromSelectMetaData.selectItemTypes));
  }

  onSubmit() {
    console.log(this.form.value);
  }

  handleFileInput(files: FileList) {
    if (this.form.get('file').valid) {
      // (this.file.nativeElement as HTMLInputElement).disabled = true;
      this.postFile(files[0]).subscribe(data => {
        console.log(data);
      });
    }
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

  postFile(file: File): Observable<string[][]> {
    let svc = '';
    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      svc = 'ConvertExcelToTable';
    }
    if (file.type === 'text/csv' || (file.type === 'application/vnd.ms-excel' && file.name.endsWith('.csv'))) {
      svc = 'ConvertCsvToTable';
    }
    const endpoint = getUrl(svc);
    const formData: FormData = new FormData();
    formData.append('contentStream', file, file.name);
    return this.http.post<string[][]>(endpoint, formData).pipe(
      catchError((e) => of(null)),
    );
  }

}
