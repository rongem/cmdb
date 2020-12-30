import { Types } from 'mongoose';
import { connectionRuleModel, IConnectionRule } from './connection-rule.model';
import { notFoundError } from '../../controllers/error.controller';
import { configurationItemModel } from './configuration-item.model';
import { connectionFilterConditions, connectionModel, IConnection } from './connection.model';
import { ConfigurationItem } from '../item-data/configuration-item.model';

export const getAllowedLowerConfigurationItemsForRule =
  async (ruleId: string | Types.ObjectId, disallowedUpperItemId?: string | Types.ObjectId): Promise<ConfigurationItem[]> => {
  return connectionRuleModel.findById(ruleId)
    .then(async (connectionRule: IConnectionRule) => {
      if (!connectionRule) {
        throw notFoundError;
      }
      const items = await configurationItemModel.findAndReturnItems({type: connectionRule.lowerItemType});
      const existingItemIds: string[] = items.map(i => i.id);
      const conditions: connectionFilterConditions = { lowerItem: { $in: existingItemIds } };
      if (disallowedUpperItemId) {
        conditions.upperItem = { $not: disallowedUpperItemId };
      }
      const connections: IConnection[] = await connectionModel.find(conditions);
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

export const getAllowedUpperConfigurationItemsForRule =
  async (ruleId: string | Types.ObjectId, disallowedLowerItemId?: string | Types.ObjectId): Promise<ConfigurationItem[]> => {
  return connectionRuleModel.findById(ruleId)
    .then(async (connectionRule: IConnectionRule) => {
      if (!connectionRule) {
        throw notFoundError;
      }
      const items = await configurationItemModel.findAndReturnItems({type: connectionRule.upperItemType});
      const existingItemIds: string[] = items.map(i => i.id);
      const conditions: connectionFilterConditions = { lowerItem: { $in: existingItemIds } };
      if (disallowedLowerItemId) {
        conditions.lowerItem = { $not: disallowedLowerItemId };
      }
      const connections: IConnection[] = await connectionModel.find(conditions);
      const allowedItemIds: string[] = [];
      if (connections.length > 0) {
        existingItemIds.forEach(id => {
          if (connectionRule.maxConnectionsToLower > connections.filter(c => c.upperItem.toString() === id).length) {
            allowedItemIds.push(id);
          }
        });
      }
      return items.filter((item) => allowedItemIds.includes(item.id));
    });
};

