import { Component, OnInit } from '@angular/core';
import { DataAccessService } from '../shared/data-access.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {

  constructor(private data: DataAccessService) { }

  ngOnInit() {
  }

}
