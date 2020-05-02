import { HttpClient } from '@angular/common/http';
import { EditFunctions, AttributeType, FullConfigurationItem } from 'backend-access';

import * as BasicsActions from './basics/basics.actions';

export function ensureAttribute(http: HttpClient, attributeTypes: AttributeType[], name: string,
                                item: FullConfigurationItem, value: string) {
    return EditFunctions.ensureAttribute(http, item, attributeTypes.find(at =>
        at.name.toLocaleLowerCase() === name.toLocaleLowerCase()), value, BasicsActions.noAction
    );
}
