import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { iif, of, Subscription, switchMap, tap } from 'rxjs';
import { AttributeType, AdminFunctions, MetaDataSelectors, AdminActions } from 'backend-access';

@Component({
    selector: 'app-delete-attribute-type',
    templateUrl: './delete-attribute-type.component.html',
    styleUrls: ['./delete-attribute-type.component.scss'],
    standalone: false
})
export class DeleteAttributeTypeComponent implements OnInit, OnDestroy {
  attributeType?: AttributeType;
  attributesCount = 0;
  private subscription?: Subscription;

  constructor(private http: HttpClient, private store: Store, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.subscription = this.route.params.pipe(
      tap(params => {
        if (!params || !params.id) {
          this.routeToAttributeTypes();
        }
      }),
      switchMap(params => this.store.select(MetaDataSelectors.selectSingleAttributeType(params.id))),
      tap(attributeType => {
        if (!attributeType) {
          this.routeToAttributeTypes();
        }
        this.attributeType = attributeType;
      }),
      switchMap(attributeType => iif(() => !!attributeType, AdminFunctions.getAttributesCountForAttributeType(this.http, attributeType?.id), of(0))),
      tap(count => this.attributesCount = count),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onDelete() {
    this.store.dispatch(AdminActions.deleteAttributeType({attributeType: this.attributeType}));
  }

  routeToAttributeTypes() {
    this.router.navigate(['admin', 'attribute-types']);
  }

}
