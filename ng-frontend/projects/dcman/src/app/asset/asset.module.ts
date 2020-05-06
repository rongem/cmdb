import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AssetRoutingModule } from './asset-routing.module';

import { RackComponent } from './rack/rack.component';
import { EnclosureComponent } from './enclosure/enclosure.component';
import { ServerHardwareComponent } from './server-hardware/server-hardware.component';
import { HardwareComponent } from './hardware/hardware.component';
import { ItemsComponent } from './items/items.component';
import { ItemComponent } from './items/item/item.component';
import { ItemListComponent } from './items/item-list/item-list.component';
import { ItemFormComponent } from './items/item-form/item-form.component';

@NgModule({
    declarations: [
      RackComponent,
      EnclosureComponent,
      ServerHardwareComponent,
      HardwareComponent,
      ItemsComponent,
      ItemComponent,
      ItemListComponent,
      ItemFormComponent
    ],
    imports: [
      AssetRoutingModule,
      SharedModule,
    ],
  })
  export class AssetModule { }
