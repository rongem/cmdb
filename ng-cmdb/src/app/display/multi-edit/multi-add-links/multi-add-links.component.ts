import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';

import { FullConfigurationItem } from 'src/app/shared/objects/full-configuration-item.model';

@Component({
  selector: 'app-multi-add-links',
  templateUrl: './multi-add-links.component.html',
  styleUrls: ['./multi-add-links.component.scss']
})
export class MultiAddLinksComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() items: FullConfigurationItem[];
  links: FormArray;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.links = this.form.get('linksToAdd') as FormArray;
  }

  onAddLink() {
    this.links.push(this.fb.group({
      uri: ['https://', [Validators.required, this.validURL]],
      description: ['', Validators.required],
    }));
  }

  validURL(c: FormControl) {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !pattern.test(c.value) ? 'not a valid url' : null;
  }

}
