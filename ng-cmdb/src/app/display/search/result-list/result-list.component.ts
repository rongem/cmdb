import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Guid } from 'guid-typescript';

import { SearchService } from '../search.service';

@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss']
})
export class ResultListComponent implements OnInit {

  constructor(protected search: SearchService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
  }

  onEditList() {
    this.search.setVisibilityState(false);
    this.router.navigate(['configuration-item', 'results'], { relativeTo: this.route});
  }

  onDisplayItem(guid: Guid) {
    this.search.setVisibilityState(false);
    this.router.navigate(['configuration-item', guid], { relativeTo: this.route});
  }

}
