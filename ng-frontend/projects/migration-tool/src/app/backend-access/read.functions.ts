import { HttpClient } from '@angular/common/http';
import { take, map } from 'rxjs/operators';

import { getUrl, getHeader } from './functions';
import { CONFIGURATIONITEMS, FULL,
    BYTYPE, METADATA, BYTYPES } from './old-rest-api/rest-api.constants';
import { OldRestMetaData } from './old-rest-api/meta-data/meta-data.model';
import { MetaData } from './objects/meta-data/meta-data.model';
import { OldRestFullConfigurationItem } from './old-rest-api/item-data/full/full-configuration-item.model';
import { FullConfigurationItem } from './objects/item-data/full/full-configuration-item.model';
import { RestMetaData } from './rest-api/meta-data/meta-data.model';
import { AppConfigService } from './app-config/app-config.service';

export function readMetaData(http: HttpClient) {
    return http.get<OldRestMetaData | RestMetaData>(getUrl(METADATA)).pipe(
        take(1),
        map((result: OldRestMetaData | RestMetaData) => new MetaData(result)),
    );
}

export function fullConfigurationItemsByType(http: HttpClient, typeId: string) {
    return AppConfigService.settings.backend.version === 1 ?
        http.get<OldRestFullConfigurationItem[]>(getUrl(CONFIGURATIONITEMS + BYTYPE + typeId + FULL), { headers: getHeader() }).pipe(
            take(1),
            map(items => items.map(i => new FullConfigurationItem(i)))
        ) :
        http.get<OldRestFullConfigurationItem[]>(getUrl(CONFIGURATIONITEMS + BYTYPES + typeId + FULL), { headers: getHeader() }).pipe(
            take(1),
            map(items => items.map(i => new FullConfigurationItem(i)))
        );
}

