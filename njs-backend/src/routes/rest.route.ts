import express from 'express';

import attributeGroupRouter from './meta-data/attribute-group.route';
import attributeGroupsRouter from './meta-data/attribute-groups.route';
import attributeTypeRouter from './meta-data/attribute-type.route';
import attributeTypesRouter from './meta-data/attribute-types.route';
import connectionRuleRouter from './meta-data/connection-rule.route';
import connectionRulesRouter from './meta-data/connection-rules.route';
import connectionTypeRouter from './meta-data/connection-type.route';
import connectionTypesRouter from './meta-data/connection-types.route';
import itemTypeRouter from './meta-data/item-type.route';
import itemTypesRouter from './meta-data/item-types.route';
import metaDataRouter from './meta-data/meta-data.route';
import userRouter from './meta-data/user.route';
import usersRouter from './meta-data/users.route';
import configurationItemRouter from './item-data/configuration-item.route';
import configurationItemsRouter from './item-data/configuration-items.route';
import connectionRouter from './item-data/connection.route';
import connectionsRouter from './item-data/connections.route';
import importRouter from './item-data/import.route';
import proposalsRouter from './item-data/proposals.route';

const router = express.Router();

// MetaData
router.use('/AttributeGroups', attributeGroupsRouter);
router.use('/AttributeGroup', attributeGroupRouter);
router.use('/AttributeTypes', attributeTypesRouter);
router.use('/AttributeType', attributeTypeRouter);
router.use('/ConnectionTypes', connectionTypesRouter);
router.use('/ConnectionType', connectionTypeRouter);
router.use('/ItemTypes', itemTypesRouter);
router.use('/ItemType', itemTypeRouter);
router.use('/ConnectionRules', connectionRulesRouter);
router.use('/ConnectionRule', connectionRuleRouter);
router.use('/MetaData', metaDataRouter);
router.use('/Users', usersRouter);
router.use('/User', userRouter);

// Data
router.use('/ConfigurationItems', configurationItemsRouter);
router.use('/ConfigurationItem', configurationItemRouter);
router.use('/Connections', connectionsRouter);
router.use('/Connection', connectionRouter);

// Special routes
router.use('/Proposals', proposalsRouter);
router.use('/Import', importRouter);

export default router;
