import { SearchContent } from '../../models/item-data/search/search-content.model';
import { ItemFilterConditions } from '../../models/mongoose/configuration-item.model';
import { typeField } from '../../util/fields.constants';
import { configurationItemModelFind } from './configuration-item.al';

export async function modelSearchItems(search: SearchContent) {
    const filter: ItemFilterConditions = {};
    console.log(search);
    if (search.itemTypeId) {
        filter.type = search.itemTypeId;
    }
    if (search.changedAfter && !search.changedBefore) {
        filter.updatedAt = { $gt: search.changedAfter.toISOString() };
    } else  if (search.changedBefore && !search.changedAfter) {
        filter.updatedAt = { $lt: search.changedBefore.toISOString() };
    } else if (search.changedAfter && search.changedBefore) {
        filter.$and = [
            {updatedAt: { $gt: search.changedAfter.toISOString() }},
            {updatedAt: { $lt: search.changedBefore.toISOString() }}
        ];
    }
    let items = await configurationItemModelFind(filter);
    if (search.nameOrValue) {
        items = items.filter(item => {
            const regex = new RegExp(search.nameOrValue!, 'i');
            if (regex.test(item.name)) { return true; }
            item.attributes.forEach(attribute => {
                if (regex.test(attribute.value)) { return true; }
            });
            return false;
        });
    }
    search.attributes?.forEach(searchAtt => {
        items = items.filter(item => {
            const attribute = item.attributes.find(a => a.typeId === searchAtt.typeId);
            if (!attribute) { return !searchAtt.value; } // if no search value is set, return true if no attribute exists
            if (searchAtt.value === '!') { return true; } // if seach value is only !, then search for existing attributes was successful
            if (searchAtt.value.startsWith('!')) { // find all attribute values that do not contain search value
                return !attribute.value.toLocaleLowerCase().includes(searchAtt.value.substr(1).toLocaleLowerCase());
            }
            return attribute.value.toLocaleLowerCase().includes(searchAtt.value.toLocaleLowerCase());
        });
    });
    return items;
}
