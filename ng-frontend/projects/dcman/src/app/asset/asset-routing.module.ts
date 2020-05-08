import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RackComponent } from './rack/rack.component';
import { ContentsComponent } from './contents/contents.component';
import { EnclosureComponent } from './enclosure/enclosure.component';
import { EnclosureMountableComponent } from './enclosure-mountable/enclosure-mountable.component';
import { RackMountableComponent } from './rack-mountable/rack-mountable.component';
import { RacksComponent } from './racks/racks.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', component: ContentsComponent },
  { path: 'enclosure', component: EnclosureComponent },
  { path: 'enclosure-mountable', component: EnclosureMountableComponent },
  { path: 'rack-mountable', component: RackMountableComponent },
  { path: 'racks', component: RacksComponent },
  { path: 'rack/:id', component: RackComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetRoutingModule { }
