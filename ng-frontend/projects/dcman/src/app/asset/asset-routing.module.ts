import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RackComponent } from './rack/rack.component';
import { ContentsComponent } from './contents/contents.component';
import { EnclosureComponent } from './enclosure/enclosure.component';
import { RacksComponent } from './racks/racks.component';
import { AssetComponent } from './asset/asset.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', component: ContentsComponent },
  { path: 'enclosure', component: EnclosureComponent },
  { path: 'racks', component: RacksComponent },
  { path: 'rack/:id', component: RackComponent },
  { path: ':id', component: AssetComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetRoutingModule { }
