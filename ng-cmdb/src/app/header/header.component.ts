import { Component, OnInit } from '@angular/core';
import { MetaDataService } from '../shared/meta-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(protected meta: MetaDataService) { }

  ngOnInit() {
  }

}
