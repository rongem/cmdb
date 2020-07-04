import { HttpClient } from '@angular/common/http';
import { EditFunctions, AttributeType, FullConfigurationItem, ConnectionRule } from 'backend-access';

import * as BasicsActions from './basics/basics.actions';

import { llcc } from './functions';

export function ensureAttribute(http: HttpClient, attributeTypes: AttributeType[], name: string,
                                item: FullConfigurationItem, value: string) {
    return EditFunctions.ensureAttribute(http, item, attributeTypes.find(at => llcc(at.name, name)), value, BasicsActions.noAction());
}

export function ensureUniqueConnectionToLower(http: HttpClient, connectionRule: ConnectionRule,
                                              item: FullConfigurationItem, targetItemId: string, description: string) {
    return EditFunctions.ensureUniqueConnectionToLower(http, item, connectionRule, targetItemId, description, BasicsActions.noAction());
}
