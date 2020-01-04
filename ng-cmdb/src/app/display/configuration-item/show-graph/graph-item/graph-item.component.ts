import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { skipWhile, switchMap, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';
import * as DisplayActions from 'src/app/display/store/display.actions';

import { GraphItem } from 'src/app/display/objects/graph-item.model';
import { Guid } from 'src/app/shared/guid';
import { GraphService } from 'src/app/display/configuration-item/show-graph/graph.service';
import { PositionSize } from 'src/app/display/objects/position-size.model';

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
              private cd: ChangeDetectorRef,
              private graphService: GraphService) { }

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
    console.log('emit', this.item.name, this.container.nativeElement.offsetLeft, this.container.nativeElement.offsetWidth);
    this.positionSize.emit(this.container.nativeElement.offsetLeft + this.container.nativeElement.offsetWidth / 2);
  }

  ngAfterViewChecked() {
    this.emitPosition();
  }

  expandClick() {
    this.expand = true;
    this.emitPosition();
  }

  private drawLine(context: CanvasRenderingContext2D, line: PositionSize) {
    context.beginPath();
    context.moveTo(line.fromX, line.fromY);
    context.lineTo(line.fromX, line.fromY + 5);
    context.lineTo(line.toX, line.toY - 5);
    context.lineTo(line.toX, line.toY);
    context.stroke();
  }

  upperElementsChanged(id: Guid, position: number) {
    if (!this.upperCanvas) {
      setTimeout(() => this.upperElementsChanged(id, position), 500);
      console.log(this.item.name, 'upper not existing, delay');
      return;
    }
    const upperContext = this.upperCanvas.nativeElement.getContext('2d');
    const height = this.upperCanvas.nativeElement.height;
    const offset = this.upperCanvas.nativeElement.offsetLeft;
    const el = this.container.nativeElement;
    this.setMaxWidth(this.upperBoxContainer.nativeElement.offsetWidth);
    this.graphService.addLine(this.item.id + ':' + id + '->', {
      fromId: id,
      fromX: position - offset,
      fromY: 0,
      toId: this.item.id,
      toX: el.offsetLeft - offset + el.offsetWidth / 2,
      toY: height,
    });
    upperContext.clearRect(0, 0, this.upperCanvas.nativeElement.width, height);
    this.graphService.getLinesForId(this.item.id).filter(line => line.toId === this.item.id).forEach(line => {
      this.drawLine(upperContext, line);
    });
  }

  lowerElementsChanged(id: Guid, position: number) {
    if (!this.lowerCanvas) {
      setTimeout(() => this.lowerElementsChanged(id, position), 500);
      return;
    }
    const lowerContext = this.lowerCanvas.nativeElement.getContext('2d');
    const height = this.lowerCanvas.nativeElement.height;
    const offset = this.lowerCanvas.nativeElement.offsetLeft;
    const el = this.container.nativeElement;
    this.setMaxWidth(this.lowerBoxContainer.nativeElement.offsetWidth);
    this.graphService.addLine(this.item.id + ':' + '->' + id, {
      fromId: this.item.id,
      fromX: el.offsetLeft - offset + el.offsetWidth / 2,
      fromY: 0,
      toId: id,
      toX: position - offset,
      toY: height,
    });
    lowerContext.clearRect(0, 0, this.upperCanvas.nativeElement.width, height);
    this.graphService.getLinesForId(this.item.id).filter(line => line.fromId === this.item.id).forEach(line => {
      this.drawLine(lowerContext, line);
    });
  }
}
