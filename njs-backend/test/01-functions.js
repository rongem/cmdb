const { accountNameField, passphraseField, attributeGroupIdField, idField } = require('../dist/util/fields.constants');

function getAuthObject(role) {
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

function getAllowedAttributeTypes(itemType, attributeTypes) {
    const attributeGroups = itemType.attributeGroups.map(g => g[idField]);
    return attributeTypes.filter(a => attributeGroups.includes(a[attributeGroupIdField]));
}

function getDisallowedAttributeTypes(itemType, attributeTypes) {
    const attributeGroups = itemType.attributeGroups.map(g => g[idField]);
    return attributeTypes.filter(a => !attributeGroups.includes(a[attributeGroupIdField]));
}

module.exports.getAuthObject = getAuthObject;
module.exports.getAllowedAttributeTypes = getAllowedAttributeTypes;
module.exports.getDisallowedAttributeTypes = getDisallowedAttributeTypes;
