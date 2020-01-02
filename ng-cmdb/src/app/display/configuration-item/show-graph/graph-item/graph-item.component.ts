import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';

import { Store } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';

import { PositionSize } from 'src/app/display/objects/position-size.model';
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
  @Output() positionSize: EventEmitter<number> = new EventEmitter();
  maxWidth = 0;

  constructor(private store: Store<fromApp.AppState>) { }

  get itemIdsToExpandAbove() {
    return this.store.select(fromSelectDisplay.selectGraphItemsToExpandAbove);
  }

  get itemIdsToExpandBelow() {
    return this.store.select(fromSelectDisplay.selectGraphItemsToExpandBelow);
  }

  get itemsAbove() {
    return this.store.select(fromSelectDisplay.selectGraphItemsByLevel, this.item.level - 1);
  }

  get itemsBelow() {
    return this.store.select(fromSelectDisplay.selectGraphItemsByLevel, this.item.level + 1);
  }

  ngOnInit() {
  }

  private emitPosition() {
    this.positionSize.emit(this.container.nativeElement.offsetLeft + this.container.nativeElement.offsetWidth / 2);
  }

  ngAfterViewChecked() {
    this.emitPosition();
  }

  getMaxWidth(width: number) {
    this.maxWidth = Math.max(width, this.maxWidth);
    return this.maxWidth;
  }

  upperElementsChanged(position: number) {
    const upperContext = this.upperCanvas.nativeElement.getContext('2d');
    const height = this.upperCanvas.nativeElement.height;
    const el = this.container.nativeElement;
    upperContext.beginPath();
    upperContext.moveTo(position, 0);
    upperContext.lineTo(position, 5);
    upperContext.lineTo(el.offsetLeft + el.offsetWidth / 2, height - 5);
    upperContext.lineTo(el.offsetLeft + el.offsetWidth / 2, height);
    upperContext.stroke();
  }

  lowerElementsChanged(position: number) {
    const lowerContext = this.lowerCanvas.nativeElement.getContext('2d');
    const height = this.lowerCanvas.nativeElement.height;
    const el = this.container.nativeElement;
    lowerContext.beginPath();
    lowerContext.moveTo(el.offsetLeft + el.offsetWidth / 2, 0);
    lowerContext.lineTo(el.offsetLeft + el.offsetWidth / 2, 5);
    lowerContext.lineTo(position, height - 5);
    lowerContext.lineTo(position, height);
    lowerContext.stroke();
  }

}
