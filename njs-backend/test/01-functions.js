const { accountNameField, passphraseField, attributeGroupIdField, idField } = require('../dist/util/fields.constants');

const tokens = {
    admin: undefined,
    editor: undefined,
    reader: undefined,
};

const validButNotExistingMongoId = '1234e5678ff46200204e22f2';
const notAMongoId = 'abxwxcef';

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

function getToken(type) {
    return tokens[type];
}

function setToken(type, value) {
    tokens[type] = value;
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
module.exports.getToken = getToken;
module.exports.setToken = setToken;
module.exports.getAllowedAttributeTypes = getAllowedAttributeTypes;
module.exports.getDisallowedAttributeTypes = getDisallowedAttributeTypes;
module.exports.validButNotExistingMongoId = validButNotExistingMongoId;
module.exports.notAMongoId = notAMongoId;
