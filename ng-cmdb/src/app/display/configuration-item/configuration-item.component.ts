import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';

import { ConfigurationItemService } from '../configuration-item.service';
import { MetaDataService } from 'src/app/shared/meta-data.service';
import { ItemAttribute } from 'src/app/shared/objects/item-attribute.model';
import { isArray } from 'util';

@Component({
  selector: 'app-configuration-item',
  templateUrl: './configuration-item.component.html',
  styleUrls: ['./configuration-item.component.scss']
})
export class ConfigurationItemComponent implements OnInit, OnDestroy {

  protected guid: Guid;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private meta: MetaDataService,
              protected itemService: ConfigurationItemService) { }

  ngOnInit() {
    if (this.route.snapshot.routeConfig.path.startsWith(':id')) {
      this.getItem();
    }
  }

  ngOnDestroy() {
  }

  getItem() {
    if (Guid.isGuid(this.route.snapshot.params.id)) {
      this.guid = this.route.snapshot.params.id as Guid;
      this.itemService.getItem(this.guid);
    } else {
      this.router.navigate(['display', 'configuration-item', 'new']);
    }
  }

  getAttributes() {
    if (this.itemService.getItemAttributes() === undefined) {
      return [];
    }
    if (!isArray(this.itemService.getItemAttributes())) {
      return [];
    }
    return this.itemService.getItemAttributes();
  }

  getattributeTypeName(guid: Guid) {
    const at = this.meta.getAttributeType(guid);
    if (at) {
      return at.TypeName;
    }
    return '';
  }
}
