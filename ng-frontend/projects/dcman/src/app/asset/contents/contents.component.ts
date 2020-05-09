import { Component, OnInit } from '@angular/core';
import { ExtendedAppConfigService } from '../../shared/app-config.service';

@Component({
  selector: 'app-contents',
  templateUrl: './contents.component.html',
  styleUrls: ['./contents.component.scss']
})
export class ContentsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  get rackName() {
    return ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.Rack;
  }

  get enclosureName() {
    return ExtendedAppConfigService.objectModel.ConfigurationItemTypeNames.BladeEnclosure;
  }

}
