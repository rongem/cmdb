import { attributeTypeModel } from '../mongoose/attribute-type.model';
import { configurationItemModel, IAttribute, IConfigurationItem, ILink } from '../mongoose/configuration-item.model';
import { itemTypeModel } from '../mongoose/item-type.model';
import { populateItem } from './item-data/configuration-item.al';
import { updateItemHistory, buildHistoricItemVersion } from './item-data/historic-item.al';

let houseKeepinginstance: HouseKeeping;
export class HouseKeeping {
    static getInstance() {
        if (!houseKeepinginstance) {
            houseKeepinginstance = new HouseKeeping();
        }
        return houseKeepinginstance;
    }

    async start() {
        // await this.removeIdsFromAttributes(); // no longer needed, reactivate it if you used it before the schema changed
        await this.setItemTypeNames();
        await this.setAttributeTypeNames();
    }

    // check if all type names in items are equal to their item type, and correct if necessary
    async setItemTypeNames() {
        let counter = 0;
        const itemTypes = await itemTypeModel.find().sort('name').exec();
        for (let i = 0; i < itemTypes.length; i++) {
            const itemType = itemTypes[i];
            const filter = {type: itemType._id, $or: [{typeName: {$ne: itemType.name}}, {typeColor: {$ne: itemType.color}}]};
            const itemIds = (await configurationItemModel.find(filter)).map(i => i._id);
            if (itemIds.length > 0) {
                counter += itemIds.length;
                await configurationItemModel.updateMany(filter, {$set: {typeName: itemType.name, typeColor: itemType.color}}).exec();
                const changedItems = await configurationItemModel.find({_id: {$in: itemIds}})
                    .populate({ path: 'responsibleUsers', select: 'name' });
                for (let index = 0; index < changedItems.length; index++) {
                    const item = changedItems[index];
                    updateItemHistory(item!._id, buildHistoricItemVersion(item!, 'SYSTEM'), false);
                }
            }
        }
        if (counter > 0) {
            console.log(counter, 'configuration items updated for item type');
        }
    }

    // check if all attribute type names in attributes of items are equal to their attribute type, and correct them if necessary
    async setAttributeTypeNames() {
        let counter = 0;
        const attributeTypes = await attributeTypeModel.find().sort('name').exec();
        for (let i = 0; i < attributeTypes.length; i++) {
            const attributeType = attributeTypes[i];
            const itemIds = (await configurationItemModel.find({'attributes.type': attributeType._id, 'attributes.typeName': {$ne: attributeType.name}})).map(i => i._id);
            if (itemIds.length > 0) {
                counter += itemIds.length;
                await configurationItemModel.updateMany({'attributes.type': attributeType._id, 'attributes.typeName': {$ne: attributeType.name}},
                    {$set: {'attributes.$.typeName': attributeType.name}}).exec();
                const changedItems = await configurationItemModel.find({_id: {$in: itemIds}})
                    .populate({ path: 'responsibleUsers', select: 'name' });
                for (let index = 0; index < changedItems.length; index++) {
                    const item = changedItems[index];
                    updateItemHistory(item!._id, buildHistoricItemVersion(item!, 'SYSTEM'), false);
                }
            }
        }
        if (counter > 0) {
            console.log(counter, 'configuration items updated for attribute type');
        }
    }

    // This function searches for configuration items that have attributes or links still with _id values and removes them.
    async removeIdsFromAttributes() {
        const items = await configurationItemModel.find({$or: [{'attributes._id': {$exists: true}}, {'links._id': {$exists: true}}]});
        if (items.length === 0) {
            return;
        }
        const promises: Promise<IConfigurationItem | undefined>[] = [];
        items.forEach(item => {
            item.attributes = item.attributes.map(a => ({type: a.type, value: a.value}) as IAttribute);
            item.links = item.links.map(l => ({uri: l.uri, description: l.description}) as ILink);
            promises.push(item.save().then(populateItem));
        })
        
        const changedItems = await Promise.all(promises);
        for (let index = 0; index < changedItems.length; index++) {
            const item = changedItems[index];
            updateItemHistory(item!._id, buildHistoricItemVersion(item!, 'SYSTEM'), false);
        }
    }
}