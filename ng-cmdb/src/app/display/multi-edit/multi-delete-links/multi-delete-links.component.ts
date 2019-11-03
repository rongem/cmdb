import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';

import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';
import { FullLink } from 'src/app/shared/objects/full-link.model';

@Component({
  selector: 'app-multi-delete-links',
  templateUrl: './multi-delete-links.component.html',
  styleUrls: ['./multi-delete-links.component.scss']
})
export class MultiDeleteLinksComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() items: FullConfigurationItem[];
  links: FullLink[] = [];
  targets: string[] = [];

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    const tmpTargets: string[] = [];
    this.items.forEach(item => item.links.forEach(link => {
      if (!tmpTargets.includes(link.uri)) {
        tmpTargets.push(link.uri);
      }
    }));
    tmpTargets.forEach(target => {
      const tmpLinks: FullLink[] = [];
      const found = this.items.every(item => {
        if (item.links.findIndex(link => link.uri === target) === -1) {
          return false;
        }
        tmpLinks.push(item.links.find(link => link.uri === target));
        return true;
      });
      if (found) {
        this.links = this.links.concat(tmpLinks);
        this.targets.push(target);
      }
    });
    this.targets.sort();
    this.targets.forEach(target => (this.form.get('linksToDelete') as FormArray).push(this.fb.group({
      delete: false,
      target,
    })));
  }

  getLinkDescriptions(target: string) {
    return [...new Set(this.links.filter(link => link.uri === target).map(link => link.description).sort())];
  }

}
