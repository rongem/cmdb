import { Component, OnInit, Input } from '@angular/core';
import { Rack } from '../../../shared/objects/asset/rack.model';

@Component({
  selector: 'app-rack-form',
  templateUrl: './rack-form.component.html',
  styleUrls: ['./rack-form.component.scss']
})
export class RackFormComponent implements OnInit {
  @Input() rack: Rack;

  constructor() { }

  ngOnInit(): void {
  }

}
