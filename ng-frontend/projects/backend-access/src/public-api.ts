/*
 * Public API Surface of backend-access
 */

// export * from './lib/backend-access.module';

// General objects
export { Guid } from './lib/guid';

export { Result } from './lib/rest-api/result.model';
export { LineMessage } from './lib/rest-api/line-message.model';

export { AppConfigService } from './lib/app-config/app-config.service';

// Meta Data objects
export { AttributeGroup } from './lib/rest-api/meta-data/attribute-group.model';
export { AttributeType } from './lib/rest-api/meta-data/attribute-type.model';
export { ConnectionRule } from './lib/rest-api/meta-data/connection-rule.model';
export { ConnectionType } from './lib/rest-api/meta-data/connection-type.model';
export { ItemType } from './lib/rest-api/meta-data/item-type.model';
export { ItemTypeAttributeGroupMapping } from './lib/rest-api/meta-data/item-type-attribute-group-mapping.model';
export { MetaData } from './lib/rest-api/meta-data/meta-data.model';
export { UserRole } from './lib/rest-api/meta-data/user-role.enum';

// Data objects
export { ConfigurationItem } from './lib/rest-api/item-data/configuration-item.model';
export { Connection } from './lib/rest-api/item-data/connection.model';
export { ItemAttribute } from './lib/rest-api/item-data/item-attribute.model';
export { ItemLink } from './lib/rest-api/item-data/item-link.model';
export { UserInfo } from './lib/rest-api/item-data/user-info.model';
export { UserRoleMapping } from './lib/rest-api/user-role-mapping.model';
export { ColumnMap } from './lib/rest-api/item-data/column-map.model';
export { HistoryEntry } from './lib/rest-api/item-data/history-entry.model';
export { TransferTable } from './lib/rest-api/item-data/transfer-table.model';

// Search objects
export { NeighborItem } from './lib/rest-api/item-data/search/neighbor-item.model';
export { NeighborSearch } from './lib/rest-api/item-data/search/neighbor-search.model';
export { SearchAttribute } from './lib/rest-api/item-data/search/search-attribute.model';
export { SearchConnection } from './lib/rest-api/item-data/search/search-connection.model';
export { SearchContent } from './lib/rest-api/item-data/search/search-content.model';

// Full Item objects
export { FullAttribute } from './lib/rest-api/item-data/full/full-attribute.model';
export { FullConfigurationItem } from './lib/rest-api/item-data/full/full-configuration-item.model';
export { FullConnection } from './lib/rest-api/item-data/full/full-connection.model';
export { FullLink } from './lib/rest-api/item-data/full/full-link.model';
export { FullResponsibility } from './lib/rest-api/item-data/full/full-responsibility.model';

// Store
export * as StoreConstants from './lib/store/constants';
export * as ErrorStore from './lib/store/error-handling/error.reducer';
export * as ErrorActions from './lib/store/error-handling/error.actions';
export * as MetaDataStore from './lib/store/meta-data/meta-data.reducer';
export { MetaDataEffects } from './lib/store/meta-data/meta-data.effects';
export * as MetaDataActions from './lib/store/meta-data/meta-data.actions';
export * as MetaDataSelectors from './lib/store/meta-data/meta-data.selectors';
export * as AdminActions from './lib/store/admin/admin.actions';
export { AdminEffects } from './lib/store/admin/admin.effects';
export * as Functions from './lib/functions';

// Interceptors
export { WinAuthInterceptor } from './lib/interceptors/win-auth.interceptor';
