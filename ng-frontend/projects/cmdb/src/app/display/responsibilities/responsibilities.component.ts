import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-responsibilities',
  templateUrl: './responsibilities.component.html',
  styleUrls: ['./responsibilities.component.scss']
})
export class ResponsibilitiesComponent implements OnInit {
  @Input() responsibilities: string[];
  @Input() mailSubject: string;

  constructor() { }

  ngOnInit() {
  }

}
