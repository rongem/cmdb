import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';

import * as fromSelectMetaData from 'src/app/shared/store/meta-data.selectors';
import * as fromSelectBasics from 'src/app/shared/store/basics/basics.selectors';
import * as fromSelectAsset from 'src/app/shared/store/asset/asset.selectors';
import * as MetaDataActions from 'src/app/shared/store/meta-data.actions';

import { AppState } from 'src/app/shared/store/app.reducer';
import { getRouterState } from 'src/app/shared/store/router/router.reducer';

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss']
})
export class ModelsComponent implements OnInit {

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
  }

}
