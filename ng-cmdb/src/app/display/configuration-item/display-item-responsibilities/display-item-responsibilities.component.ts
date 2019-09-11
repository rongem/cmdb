import { Component, OnInit, Input } from '@angular/core';
import { FullResponsibility } from 'src/app/shared/objects/full-responsibility.model';

@Component({
  selector: 'app-display-item-responsibilities',
  templateUrl: './display-item-responsibilities.component.html',
  styleUrls: ['./display-item-responsibilities.component.scss']
})
export class DisplayItemResponsibilitiesComponent implements OnInit {
  @Input() responsibilities: FullResponsibility[];
  @Input() mailSubject: string;

  constructor() { }

  ngOnInit() {
  }

}
