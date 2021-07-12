import { Component, OnInit, Input } from '@angular/core';
import { ItemLink } from 'backend-access';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})
export class LinksComponent implements OnInit {
  @Input() links: ItemLink[];

  constructor() { }

  ngOnInit() {
  }

}
