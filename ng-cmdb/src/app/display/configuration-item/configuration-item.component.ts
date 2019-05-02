import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { DataAccessService } from 'src/app/shared/data-access.service';
import { ConfigurationItem } from 'src/app/shared/objects/configuration-item.model';
import { Subscription } from 'rxjs';
import { ItemAttribute } from 'src/app/shared/objects/item-attribute.model';

@Component({
  selector: 'app-configuration-item',
  templateUrl: './configuration-item.component.html',
  styleUrls: ['./configuration-item.component.scss']
})
export class ConfigurationItemComponent implements OnInit, OnDestroy {

  protected item = new ConfigurationItem();
  protected itemAttributes: ItemAttribute[];
  private itemSubscription: Subscription;
  private attributeSubscription: Subscription;
  private connectionsToUpperSubscription: Subscription;
  private connectionsToLowerSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private data: DataAccessService) { }

  ngOnInit() {
    if (this.route.snapshot.routeConfig.path.startsWith(':id')) {
      this.getItem();
    }
  }

  ngOnDestroy() {
    this.itemSubscription.unsubscribe();
    this.attributeSubscription.unsubscribe();
    // this.connectionsToLowerSubscription.unsubscribe();
    // this.connectionsToUpperSubscription.unsubscribe();
  }

  private getItem() {
    if (Guid.isGuid(this.route.snapshot.params.id)) {
      const guid = this.route.snapshot.params.id as Guid;
      this.itemSubscription = this.data.fetchConfigurationItem(guid)
        .subscribe((item: ConfigurationItem) => {
          if (item === null || item === undefined) {
            this.router.navigate(['display', 'configuration-item', 'new']);
          }
          this.item = item;
          console.log(item);
      });
      this.attributeSubscription = this.data.fetchAttributesForItem(guid)
        .subscribe((attributes: ItemAttribute[]) => {
          this.itemAttributes = attributes;
          console.log(attributes);
        });
    } else {
      this.router.navigate(['display', 'configuration-item', 'new']);
    }
  }
}
