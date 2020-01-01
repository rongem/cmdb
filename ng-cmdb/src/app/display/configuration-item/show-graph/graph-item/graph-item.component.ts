import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

import { Guid } from 'src/app/shared/guid';
import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { getUrl, getHeader } from 'src/app/shared/store/functions';
import { PositionSize } from 'src/app/display/objects/position-size.model';

@Component({
  selector: 'app-graph-item',
  templateUrl: './graph-item.component.html',
  styleUrls: ['./graph-item.component.scss']
})
export class GraphItemComponent implements OnInit, OnDestroy, OnChanges {
  @Input() itemId: Guid;
  @Input() expandAbove = false;
  @Input() expandBelow = false;
  @ViewChild('container', {static: false}) container: ElementRef;
  item: Observable<FullConfigurationItem>;
  level = 1;
  @Output() positionSize: EventEmitter<PositionSize> = new EventEmitter();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.item = this.http.get<FullConfigurationItem>(
      getUrl('ConfigurationItem/' + this.itemId + '/Full'),
      { headers: getHeader() });
  }

  ngOnChanges() {
    this.positionSize.emit({
      height: this.container.nativeElement.offsetHeight,
      width: this.container.nativeElement.offsetWidth,
      top: this.container.nativeElement.offsetTop,
      left: this.container.nativeElement.offsetLeft,
    });
  }

  ngOnDestroy() {
  }

}
