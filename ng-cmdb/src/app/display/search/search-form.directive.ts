import { Directive, Input } from '@angular/core';
import { FormGroupDirective, FormArray, FormGroup, FormControl } from '@angular/forms';
import { Guid } from 'src/app/shared/guid';
import { SearchContent } from './search-content.model';
import { SearchAttribute } from './search-attribute.model';
import { SearchConnection } from './search-connection.model';

@Directive({ selector: '[appSearchForm]' })
export class SearchFormDirective {
    @Input('appSearchForm')
    set data(val: SearchContent) {
        if (val) {
            this.formGroupDirective.form.patchValue(val);
            this.patchAttributeValues(val.Attributes);
            this.patchConnections(val.ConnectionsToLower, this.formGroupDirective.form.get('ConnectionsToLower') as FormArray);
            this.patchConnections(val.ConnectionsToUpper, this.formGroupDirective.form.get('ConnectionsToUpper') as FormArray);
            this.formGroupDirective.form.markAsDirty();
        }
    }

    constructor(private formGroupDirective: FormGroupDirective) {}

    private patchAttributeValues(attributes: SearchAttribute[]) {
        const attArray = (this.formGroupDirective.form.get('Attributes') as FormArray);
        if (attributes) {
            const attMap = new Map<Guid, SearchAttribute>();
            const indexesToRemove: number[] = [];
            attributes.forEach(a => attMap.set(a.attributeTypeId, a));
            attArray.controls.forEach((c, index) => {
                if (attMap.has(c.value.attributeTypeId)) {
                    c.patchValue(attMap.get(c.value.attributeTypeId));
                    attMap.delete(c.value.attributeTypeId);
                } else {
                    indexesToRemove.push(index);
                }
            });
            indexesToRemove.reverse().forEach(value => attArray.removeAt(value));
            attMap.forEach(value => attArray.push(new FormGroup({
                AttributeTypeId: new FormControl(value.attributeTypeId),
                AttributeValue: new FormControl(value.attributeValue),
            })));
        } else {
            attArray.reset();
        }
    }

    private patchConnections(connections: SearchConnection[], connArray: FormArray) {
        let tmpConnections = [...connections];
        if (connections) {
            const indexesToRemove: number[] = [];
            connArray.controls.forEach((c, index) => {
                const i = tmpConnections.findIndex(conn => conn.ConnectionType === c.value.ConnectionType &&
                    conn.ConfigurationItemType === c.value.ConfigurationItemType);
                if (i > -1) {
                    c.patchValue(tmpConnections[i]);
                    tmpConnections = tmpConnections.splice(i, 1);
                } else {
                    indexesToRemove.push(index);
                }
            });
            indexesToRemove.reverse().forEach(value => connArray.removeAt(value));
            tmpConnections.forEach(value => connArray.push(new FormGroup({
                ConnectionType: new FormControl(value.ConnectionType),
                ConfigurationItemType: new FormControl(value.ConfigurationItemType),
                Count: new FormControl(value.Count),
            })));
        } else {
            connArray.reset();
        }

    }
}
