import { Types } from 'mongoose';
import { connectionRuleModel } from './connection-rule.model';
import { notFoundError } from '../../controllers/error.controller';
import { configurationItemModel } from './configuration-item.model';
import { connectionFilterConditions, connectionModel } from './connection.model';

export const getAllowedLowerConfigurationItemsForRule = async (ruleId: string | Types.ObjectId, disallowedUpperItemId?: string | Types.ObjectId) => {
    connectionRuleModel.findById(ruleId)
    .then(async (connectionRule) => {
      if (!connectionRule) {
        throw notFoundError;
      }
      const items = await configurationItemModel.findAndReturnItems({type: connectionRule.lowerItemType});
      const existingItemIds: string[] = items.map(i => i.id);
      const conditions: connectionFilterConditions = { lowerItem: { $in: existingItemIds } };
      if (disallowedUpperItemId) {
        conditions.upperItem = { $not: disallowedUpperItemId };
      }
      const connections = await connectionModel.find(conditions);
      const allowedItemIds: string[] = [];
      if (connections.length > 0) {
        existingItemIds.forEach(id => {
          if (connectionRule.maxConnectionsToUpper > connections.filter(c => c.lowerItem.toString() === id).length) {
            allowedItemIds.push(id);
          }
        });
      }
      return items.filter((item) => allowedItemIds.includes(item.id));
    });
  };

