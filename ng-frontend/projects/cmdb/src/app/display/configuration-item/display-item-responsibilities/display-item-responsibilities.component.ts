import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-display-item-responsibilities',
  templateUrl: './display-item-responsibilities.component.html',
  styleUrls: ['./display-item-responsibilities.component.scss']
})
export class DisplayItemResponsibilitiesComponent implements OnInit {
  @Input() responsibilities: string[];
  @Input() mailSubject: string;

  constructor() { }

  ngOnInit() {
  }

}
