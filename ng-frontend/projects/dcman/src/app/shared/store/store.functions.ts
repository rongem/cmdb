import { HttpClient } from '@angular/common/http';
import { EditFunctions, AttributeType, FullConfigurationItem, ConfigurationItem, ConnectionRule } from 'backend-access';

import * as BasicsActions from './basics/basics.actions';

import { llcc } from './functions';


export function ensureAttribute(item: ConfigurationItem, attributeTypes: AttributeType[], typeName: string, expectedValue: string, changed: boolean) {
    const attributeType = attributeTypes.find(at => llcc(at.name, typeName));
    if (!item.attributes) {
        item.attributes = [];
    }
    const attribute = item.attributes.find(a => a.typeId === attributeType.id);
    if (attribute) {
        if (!expectedValue || expectedValue.trim() === '') { // delete attribute
            item.attributes.splice(item.attributes.findIndex(a => a.typeId === attributeType.id), 1);
            changed = true;
        } else if (attribute.value !== expectedValue) {
            attribute.value = expectedValue;
            changed = true;
        }
    } else if (!expectedValue || expectedValue.trim() === '') {
        item.attributes.push({
            itemId: item.id,
            typeId: attributeType.id,
            type: attributeType.name,
            value: expectedValue,
        });
        changed = true;
    }
    return changed;
}

export function ensureUniqueConnectionToLower(http: HttpClient, connectionRule: ConnectionRule,
                                              item: FullConfigurationItem, targetItemId: string, description: string) {
    return EditFunctions.ensureUniqueConnectionToLower(http, item, connectionRule, targetItemId, description, BasicsActions.noAction());
}
