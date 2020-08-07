import { Request, Response, NextFunction } from 'express';

import { handleValidationErrors } from '../../routes/validators';
import attributeGroupModel from '../../models/mongoose/attribute-group.model';
import attributeTypeModel from '../../models/mongoose/attribute-type.model';
import connectionTypeModel from '../../models/mongoose/connection-type.model';
import connectionRuleModel from '../../models/mongoose/connection-rule.model';
import itemTypeModel from '../../models/mongoose/item-type.model';
import { AttributeGroup } from '../../models/meta-data/attribute-group.model';
import { AttributeType } from '../../models/meta-data/attribute-type.model';
import { ConnectionType } from '../../models/meta-data/connection-type.model';
import { ConnectionRule } from '../../models/meta-data/connection-rule.model';
import { ItemType } from '../../models/meta-data/item-type.model';
import { ItemTypeAttributeGroupMapping } from '../../models/meta-data/item-type-attribute-group-mapping.model';
import { MetaData } from '../../models/meta-data/meta-data.model';
import { serverError } from '../error.controller';

//read
export function getMetaData(req: Request, res: Response, next: NextFunction) {
    handleValidationErrors(req);
    const meta = new MetaData();
    if(req.authentication) {
        meta.userRole = req.authentication.role;
        meta.userName = req.authentication.name;
    } else if (req.userName){
        meta.userRole = 0;
        meta.userName = req.userName;
    }
    attributeGroupModel.find()
        .then(attributeGroups => {
            meta.attributeGroups = attributeGroups.map(ag => new AttributeGroup(ag));
            return attributeTypeModel.find();
        })
        .then(attributeTypes => {
            meta.attributeTypes = attributeTypes.map(at => new AttributeType(at));
            return connectionTypeModel.find();
        })
        .then(connectionTypes => {
            meta.connectionTypes = connectionTypes.map(ct => new ConnectionType(ct));
            return itemTypeModel.find();
        })
        .then(itemTypes => {
            meta.itemTypes = itemTypes.map(it => new ItemType(it));
            meta.itemTypeAttributeGroupMappings = ItemTypeAttributeGroupMapping.createAllMappings(itemTypes);
            return connectionRuleModel.find();
        })
        .then(connectionRules => {
            meta.connectionRules = connectionRules.map(cr => new ConnectionRule(cr));
            res.json(meta);
        })
        .catch(error => serverError(next, error));
}

