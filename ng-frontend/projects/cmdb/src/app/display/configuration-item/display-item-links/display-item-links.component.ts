import { Component, OnInit, Input } from '@angular/core';
import { ItemLink } from 'backend-access';

@Component({
  selector: 'app-display-item-links',
  templateUrl: './display-item-links.component.html',
  styleUrls: ['./display-item-links.component.scss']
})
export class DisplayItemLinksComponent implements OnInit {
  @Input() links: ItemLink[];

  constructor() { }

  ngOnInit() {
  }

}
