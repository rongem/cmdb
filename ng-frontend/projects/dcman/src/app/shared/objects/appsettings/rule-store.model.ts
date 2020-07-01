import { ConnectionTypeTemplate } from './app-object.model';
import { ConnectionRule } from 'backend-access';

export class RuleStore {
    connectionTypeTemplate: ConnectionTypeTemplate;
    upperItemTypeName: string;
    lowerItemTypeName: string;
    connectionRule: ConnectionRule;
}
