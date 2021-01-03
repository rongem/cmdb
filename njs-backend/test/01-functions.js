const { accountNameField, passphraseField, roleField } = require('../dist/util/fields.constants');

const workstationName = 'TEST';
const adminUsername = 'TEST';
const editorUsername = 'TEST1';

function getAdminAuthReq() {
    return { 
        ntlm: {
            DomainName: '.',
            Workstation: workstationName,
            UserName: adminUsername
        }
    };
}

function getEditorAuthReq() {
    return { 
        ntlm: {
            DomainName: '.',
            Workstation: workstationName,
            UserName: editorUsername
        }
    };
}

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

function getResponse(callback) {
    return {
        statusinfo: 0,
        sendStatus: function(value) {
            this.statusinfo = value;
            callback();
        },
        status: function(value) {
            this.statusinfo = value;
            return this;
        },
        json: function(value) {
            if (this.statusinfo === 0) {
                this.statusinfo = 200;
            }
            this.payload = value;
            callback();
        }
    };
}

module.exports.workstationName = workstationName;
module.exports.adminUsername = adminUsername;
module.exports.editorUsername = editorUsername;
module.exports.getAdminAuthReq = getAdminAuthReq;
module.exports.getEditorAuthReq = getEditorAuthReq;
module.exports.getResponse = getResponse;
module.exports.getAuthObject = getAuthObject;
