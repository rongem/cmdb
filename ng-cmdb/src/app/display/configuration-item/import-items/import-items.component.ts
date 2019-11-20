import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';

import { Guid } from 'src/app/shared/guid';

@Component({
  selector: 'app-import-items',
  templateUrl: './import-items.component.html',
  styleUrls: ['./import-items.component.scss']
})
export class ImportItemsComponent implements OnInit {
  form: FormGroup;
  fileToUpload: File = null;

  constructor(private router: Router,
              private actions$: Actions,
              private store: Store<fromApp.AppState>,
              private http: HttpClient,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      itemType: '',
      elements: new Array(['attributes']),
      ignoreExisting: false,
      headlines: true,
      file: undefined,
    });
  }

  get itemTypes() {
    return this.store.pipe(select(fromSelectMetaData.selectItemTypes));
  }

  onSubmit() {
    console.log(this.form.value);
    console.log(this.fileToUpload);
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  postFile(fileToUpload: File) : Observable<boolean> {
    const endpoint = 'your-destination-url';
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    return of(true);
    // return this.http.post(endpoint, formData, { headers: yourHeadersConfig })
    //   .map(() => { return true; })
    //   .catch((e) => this.handleError(e));
}

}
