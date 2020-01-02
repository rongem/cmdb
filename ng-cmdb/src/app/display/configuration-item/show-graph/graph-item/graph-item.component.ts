import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild, ElementRef } from '@angular/core';

import { Store } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';

import { PositionSize } from 'src/app/display/objects/position-size.model';
import { GraphItem } from 'src/app/display/objects/graph-item.model';
import { Guid } from 'src/app/shared/guid';

@Component({
  selector: 'app-graph-item',
  templateUrl: './graph-item.component.html',
  styleUrls: ['./graph-item.component.scss']
})
export class GraphItemComponent implements OnInit, OnChanges {
  @Input() item: GraphItem;
  @Input() expand = true;
  @ViewChild('container', {static: true}) container: ElementRef<HTMLDivElement>;
  @ViewChild('cv1', {static: false}) upperCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('cv2', {static: false}) lowerCanvas: ElementRef<HTMLCanvasElement>;
  @Output() positionSize: EventEmitter<PositionSize> = new EventEmitter();

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

  ngOnChanges() {
    this.positionSize.emit({
      height: this.container.nativeElement.offsetHeight,
      width: this.container.nativeElement.offsetWidth,
      top: this.container.nativeElement.offsetTop,
      left: this.container.nativeElement.offsetLeft,
    });
  }

  upperElementsChanged(id: Guid, positionSize: PositionSize) {
    const upperContext = this.upperCanvas.nativeElement.getContext('2d');
    const width = this.upperCanvas.nativeElement.width;
    const height = this.upperCanvas.nativeElement.height;
    const el = this.container.nativeElement;
    upperContext.strokeStyle = '#000000FF';
    upperContext.beginPath();
    upperContext.moveTo(positionSize.left + positionSize.width / 2, positionSize.top + positionSize.height / 2);
    upperContext.lineTo(el.offsetLeft + el.offsetWidth / 2, el.offsetTop);
    upperContext.stroke();
  }

  lowerElementsChanged(id: Guid, positionSize: PositionSize) {
    const lowerContext = this.lowerCanvas.nativeElement.getContext('2d');
    let width = this.lowerCanvas.nativeElement.width;
    const height = this.lowerCanvas.nativeElement.height;
    if (width < positionSize.left + positionSize.width) {
      this.lowerCanvas.nativeElement.width = positionSize.left + positionSize.width;
      width = this.lowerCanvas.nativeElement.width;
    }
    console.log(width, height);
    lowerContext.beginPath();
    lowerContext.moveTo(0, 0);
    lowerContext.lineTo(width, height);
    lowerContext.lineTo(0, 10);
    // lowerContext.closePath();
    // lowerContext.lineWidth = 6;
    // lowerContext.strokeStyle = 'black';
    lowerContext.stroke();
    lowerContext.strokeText('bla', 0, 0);
    // lowerContext.fillStyle = 'red';
    lowerContext.fillRect(5, 5, 10, 10);
    lowerContext.rect(0, 0, 5, 5);
    console.log(lowerContext);
  }

}
