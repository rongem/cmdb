import { ItemType } from '../models/meta-data/item-type.model';
import { AttributeType } from '../models/meta-data/attribute-type.model';
import { accountNameField, passphraseField, attributeGroupIdField, idField } from '../util/fields.constants';

export type TokenType = {
    admin: string | undefined;
    editor: string | undefined;
    reader: string | undefined
};
export const validButNotExistingMongoId: string = '1234e5678ff46200204e22f2';
export const notAMongoId: string = 'abxwxcef';

export function getAuthObject(role: number): { [key: string]: string } {
    switch (role) {
        case 1:
            return {
                [accountNameField]: 'TestEditor',
                [passphraseField]: 'vms8XZYz!'
            };
        case 2:
            return {
                [accountNameField]: 'TestAdmin',
                [passphraseField]: 'vms8XZYz!'
            };
        default:
            return {
                [accountNameField]: 'TestReader',
                [passphraseField]: 'vms8XZYz!',
            }
    }
}

export function getAllowedAttributeTypes(itemType: ItemType, attributeTypes: AttributeType[]): AttributeType[] {
    const attributeGroups: string[] = itemType.attributeGroups!.map(g => g[idField]);
    return attributeTypes.filter(a => attributeGroups.includes(a[attributeGroupIdField]));
}

export function getDisallowedAttributeTypes(itemType: ItemType, attributeTypes: AttributeType[]): AttributeType[] {
    const attributeGroups: string[] = itemType.attributeGroups!.map(g => g[idField]);
    return attributeTypes.filter(a => !attributeGroups.includes(a[attributeGroupIdField]));
}

