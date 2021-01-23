import { SearchContent } from '../../models/item-data/search/search-content.model';
import { ItemFilterConditions } from '../../models/mongoose/configuration-item.model';
import { typeField } from '../../util/fields.constants';
import { configurationItemModelFind } from './configuration-item.al';

export async function modelSearchItems(search: SearchContent) {
    const filter: ItemFilterConditions = {};
    if (search.nameOrValue) {
        filter.name = { $regex: search.nameOrValue , $options: 'i' };
        // filter.attributes = { $elemMatch: { [typeField]: { $regex: search.nameOrValue , $options: 'i' } } };
    }
    if (search.itemTypeId) {
        filter.type = search.itemTypeId;
    }
    let items;
    items = await configurationItemModelFind(filter);
    return items;
}
