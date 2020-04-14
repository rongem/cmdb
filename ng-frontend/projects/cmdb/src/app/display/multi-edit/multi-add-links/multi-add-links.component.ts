import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { FullConfigurationItem, AppConfigService } from 'backend-access';

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
    return AppConfigService.validURL(c.value) ? null : 'not a valid url';
  }

}
