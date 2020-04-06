import { Component, OnInit, Input } from '@angular/core';
import { FullLink } from 'projects/cmdb/src/app/shared/objects/full-link.model';

@Component({
  selector: 'app-display-item-links',
  templateUrl: './display-item-links.component.html',
  styleUrls: ['./display-item-links.component.scss']
})
export class DisplayItemLinksComponent implements OnInit {
  @Input() links: FullLink[];

  constructor() { }

  ngOnInit() {
    // console.log(this.links);
  }

}
