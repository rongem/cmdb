import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  visibilityState = false;

  constructor() { }

  ngOnInit() {
  }

  toggleVisibility() {
    console.log('Was here');
    this.visibilityState = !this.visibilityState;
  }

}
