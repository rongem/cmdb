import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MultiEditService } from '../services/multi-edit.service';

@Component({
  selector: 'app-multi-working',
  templateUrl: './multi-working.component.html',
  styleUrls: ['./multi-working.component.scss']
})
export class MultiWorkingComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private mes: MultiEditService) { }
  ngOnInit(): void {
    this.subscription = this.mes.operationsLeftSubject.subscribe(x => {
      if (x === 0) {
        this.router.navigate(['..', 'done'], { relativeTo: this.route });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  get operationsLeft() {
    return this.mes.operationsLeft();
  }

  get totalOperations() {
    return this.mes.connectionsToChange + this.mes.itemsToChange;
  }

}
