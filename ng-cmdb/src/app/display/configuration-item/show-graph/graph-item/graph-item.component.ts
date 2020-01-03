import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { skipWhile, switchMap, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';
import * as DisplayActions from 'src/app/display/store/display.actions';

import { GraphItem } from 'src/app/display/objects/graph-item.model';

@Component({
  selector: 'app-graph-item',
  templateUrl: './graph-item.component.html',
  styleUrls: ['./graph-item.component.scss']
})
export class GraphItemComponent implements OnInit, AfterViewChecked {
  @Input() item: GraphItem;
  @Input() expand = true;
  @ViewChild('container', {static: true}) container: ElementRef<HTMLDivElement>;
  @ViewChild('cv1', {static: false}) upperCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('cv2', {static: false}) lowerCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('bc1', {static: false}) upperBoxContainer: ElementRef<HTMLDivElement>;
  @ViewChild('bc2', {static: false}) lowerBoxContainer: ElementRef<HTMLDivElement>;
  @ViewChild('cc', {static: false}) componentContainer: ElementRef<HTMLDivElement>;
  @Output() positionSize: EventEmitter<number> = new EventEmitter();
  maxWidth: BehaviorSubject<number> = new BehaviorSubject(50);

  constructor(private store: Store<fromApp.AppState>,
              private cd: ChangeDetectorRef) { }

  get itemsAbove() {
    return this.store.select(fromSelectDisplay.selectGraphItemsByLevel, this.item.level - 1);
  }

  get itemsBelow() {
    return this.store.select(fromSelectDisplay.selectGraphItemsByLevel, this.item.level + 1);
  }

  ngOnInit() {
    if (this.item.level < 0) {
      this.store.pipe(
        select(fromSelectDisplay.selectGraphItemMinLevel),
        skipWhile(val => val < this.item.level),
        switchMap(() => this.store.select(fromSelectDisplay.selectProcessedItemIds)),
        take(1),
      ).subscribe(processedIds => {
        this.item.itemIdsAbove.forEach(id => {
          if (!processedIds.includes(id)) {
            this.store.dispatch(DisplayActions.readGraphItem({ id, level: this.item.level - 1}));
          }
        });
      });
    }
    if (this.item.level > 0) {
      this.store.pipe(
        select(fromSelectDisplay.selectGraphItemMaxLevel),
        skipWhile(val => val > this.item.level),
        switchMap(() => this.store.select(fromSelectDisplay.selectProcessedItemIds)),
        take(1),
      ).subscribe(processedIds => {
        this.item.itemIdsBelow.forEach(id => {
          if (!processedIds.includes(id)) {
            this.store.dispatch(DisplayActions.readGraphItem({ id, level: this.item.level + 1}));
          }
        });
      });
    }
  }

  private setMaxWidth(width: number) {
    if (width > this.maxWidth.value) {
      this.maxWidth.next(width);
      this.cd.detectChanges();
    }
  }

  private emitPosition() {
    this.setMaxWidth(this.container.nativeElement.offsetWidth);
    this.positionSize.emit(this.container.nativeElement.offsetLeft + this.container.nativeElement.offsetWidth / 2);
  }

  ngAfterViewChecked() {
    this.emitPosition();
  }

  expandClick() {
    this.expand = true;
  }

  upperElementsChanged(position: number) {
    const upperContext = this.upperCanvas.nativeElement.getContext('2d');
    const height = this.upperCanvas.nativeElement.height;
    const el = this.container.nativeElement;
    this.setMaxWidth(this.upperBoxContainer.nativeElement.offsetWidth);
    upperContext.beginPath();
    upperContext.moveTo(position, 0);
    upperContext.lineTo(position, 5);
    upperContext.lineTo(el.offsetLeft + el.offsetWidth / 2, height - 5);
    upperContext.lineTo(el.offsetLeft + el.offsetWidth / 2, height);
    upperContext.stroke();
  }

  lowerElementsChanged(position: number) {
    if (!this.lowerCanvas) { console.log(this.item.name, 'not existing'); return; }
    const lowerContext = this.lowerCanvas.nativeElement.getContext('2d');
    const height = this.lowerCanvas.nativeElement.height;
    const offset = this.lowerCanvas.nativeElement.offsetLeft - 1;
    const el = this.container.nativeElement;
    this.setMaxWidth(this.lowerBoxContainer.nativeElement.offsetWidth);
    console.log(this.item.name, 'off', this.lowerCanvas.nativeElement.offsetLeft, this.componentContainer.nativeElement.offsetLeft);
    lowerContext.beginPath();
    lowerContext.moveTo(el.offsetLeft - offset + el.offsetWidth / 2, 0);
    lowerContext.lineTo(el.offsetLeft - offset + el.offsetWidth / 2, 5);
    lowerContext.lineTo(position - offset, height - 5);
    lowerContext.lineTo(position - offset, height);
    lowerContext.stroke();
  }
}
