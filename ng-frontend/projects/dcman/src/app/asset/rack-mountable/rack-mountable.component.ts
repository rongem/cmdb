import { Component, OnInit, Input } from '@angular/core';

import { RackMountable } from '../../shared/objects/asset/rack-mountable.model';

@Component({
  selector: 'app-rack-mountable',
  templateUrl: './rack-mountable.component.html',
  styleUrls: ['./rack-mountable.component.scss']
})
export class RackMountableComponent implements OnInit {
  @Input() rackMountable: RackMountable;

  constructor() { }

  ngOnInit(): void {
  }

}
