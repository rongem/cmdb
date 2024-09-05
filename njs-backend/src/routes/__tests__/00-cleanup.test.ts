import { userModel } from '../../models/mongoose/user.model';
import { attributeGroupModel } from '../../models/mongoose/attribute-group.model';
import { attributeTypeModel } from '../../models/mongoose/attribute-type.model';
import { connectionTypeModel } from '../../models/mongoose/connection-type.model';
import { connectionRuleModel } from '../../models/mongoose/connection-rule.model';
import { itemTypeModel } from '../../models/mongoose/item-type.model';
import { configurationItemModel } from '../../models/mongoose/configuration-item.model';
import { connectionModel } from '../../models/mongoose/connection.model';
import { historicCiModel } from '../../models/mongoose/historic-ci.model';
import { historicConnectionModel } from '../../models/mongoose/historic-connection.model';

describe('Pre-flight cleanup', () => {
    it('should delete connection history', () => {
        return historicConnectionModel.deleteMany({})
            .then((response: { deletedCount: number }) => {
                expect(response.deletedCount).toBeGreaterThanOrEqual(0);
            });
    });
    
    it('should delete configuration item history', () => {
        return historicCiModel.deleteMany({})
            .then((response: { deletedCount: number }) => {
                expect(response.deletedCount).toBeGreaterThanOrEqual(0);
            });
    });

    it('should delete all existing connections', () => {
        return connectionModel.deleteMany({})
            .then((response: { deletedCount: number }) => {
                expect(response.deletedCount).toBeGreaterThanOrEqual(0);
            });
    });

    it('should delete all existing configuration items', () => {
        return configurationItemModel.deleteMany({})
            .then((response: { deletedCount: number }) => {
                expect(response.deletedCount).toBeGreaterThanOrEqual(0);
            });
    });

    it('should delete all existing connection rules', () => {
        return connectionRuleModel.deleteMany({})
            .then((response: { deletedCount: number }) => {
                expect(response.deletedCount).toBeGreaterThanOrEqual(0);
            });
    });

    it('should delete all existing item types', () => {
        return itemTypeModel.deleteMany({})
            .then((response: { deletedCount: number }) => {
                expect(response.deletedCount).toBeGreaterThanOrEqual(0);
            });
    });

    it('should delete all existing connection types', () => {
        return connectionTypeModel.deleteMany({})
            .then((response: { deletedCount: number }) => {
                expect(response.deletedCount).toBeGreaterThanOrEqual(0);
            });
    });

    it('should delete all existing attribute types', () => {
        return attributeTypeModel.deleteMany({})
            .then((response: { deletedCount: number }) => {
                expect(response.deletedCount).toBeGreaterThanOrEqual(0);
            });
    });

    it('should delete all existing attribute groups', () => {
        return attributeGroupModel.deleteMany({})
            .then((response: { deletedCount: number }) => {
                expect(response.deletedCount).toBeGreaterThanOrEqual(0);
            });
    });

    it('should delete all existing users', () => {
        return userModel.deleteMany({})
            .then((response: { deletedCount: number }) => {
                expect(response.deletedCount).toBeGreaterThanOrEqual(0);
            });
    });
});
