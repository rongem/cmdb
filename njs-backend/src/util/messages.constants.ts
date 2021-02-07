import { columnsField, targetIdField, targetTypeField } from './fields.constants';
import { aboveValue, belowValue, targetTypeValues } from './values.constants';

export const conversionIncompleteMsg = 'Did not remove all attributes, something went wrong.';
export const deviatingArrayLengthMsg = 'Lenght of the array is not equal to length of columns array.';
export const disallowedAttributeTypeMsg = 'Attribute type is not allowed for this item type.';
export const disallowedChangingOfAttributeTypeMsg = 'Changing the attribute type is not allowed.';
export const disallowedChangingOfConnectionRuleMsg = 'Changing the connection rule is not allowed.';
export const disallowedChangingOfConnectionTypeMsg = 'Changing the connection type is not allowed.';
export const disallowedChangingOfItemTypeMsg = 'Changing the item type is not allowed.';
export const disallowedChangingOfLowerItemMsg = 'Changeing the lower item in a connection is not allowed.';
export const disallowedChangingOfTypesMsg = 'Changing types is not allowed.';
export const disallowedChangingOfUpperItemMsg = 'Changing the upper item in a connection is not allowed.';
export const disallowedConnectionRuleMsg = 'One or more connection rules are not allowed for given item type.';
export const disallowedDeletionOfAttributeGroupMsg = 'Attribute group still needed by existing attribute types.';
export const disallowedDeletionOfAttributeTypeMsg = 'Attribute type still needed by existing attributes.';
export const disallowedDeletionOfConnectionRuleMsg = 'Connection rule is still used by connections.';
export const disallowedDeletionOfConnectionTypeMsg = 'Connection type is still used by connection rules.';
export const disallowedDeletionOfItemTypeMsg = 'Item type still holds attribute group mappings.';
export const disallowedDeletionOfItemTypeWithItemsOrRulesMsg = 'Item type still is in use by configuration items or connection rules.';
export const disallowedDeletionOfMappingMsg = 'Mapping of item type and attribute group cannot be deleted as long as attributes exist on the items.';
export const duplicateConnectionMsg = 'Connection with this content already exists. No duplicates allowed.';
export const duplicateConnectionRuleMsg = 'Connection rule with this content already exists. No duplicates allowed.';
export const disallowedItemByRuleMsg = 'The connection rule does not allow to connect to this item any more.';
export const duplicateObjectNameMsg = 'Object with this name and type already exists. No duplicates allowed.';
export const idMismatchMsg = 'Id in path is not equal to id in body.';
export const importConnectionCreatedMsg = 'Created connection.';
export const importConnectionUpdatedMsg = 'Updated connection description.';
export const importIgnoringDuplicateNameMsg = 'Ignoring line with duplicate name.';
export const importIgnoringEmptyNameMsg = 'Ignoring line with empty name.';
export const importItemCreatedMsg = 'New item created.';
export const importItemUpdatedMsg = 'Updated item.';
export const invalidAttributeGroupMsg = 'No valid attribute group id.';
export const invalidAttributeGroupsArrayMsg = 'No valid attribute group id array.';
export const invalidAttributesMsg = 'Not valid attributes array.';
export const invalidAttributeTypeMsg = 'Not a valid attribute type id.';
export const invalidAttributeTypesMsg = 'Not all attribute type ids are valid.';
export const invalidAttributeValueMsg = 'No valid attribute value.';
export const invalidAuthentication = 'No valid username or password.';
export const invalidAuthenticationMethod = 'No valid authentication method configured.';
export const invalidAuthorizationMsg = 'User is not allowed to edit or manage.';
export const invalidChangedAfterMsg = 'No valid date format for changed after.';
export const invalidChangedBeforeMsg = 'No valid date format for changed before.';
export const invalidColorMsg = 'No valid color code.';
export const invalidColumnsArray = 'No valid array in columns.';
export const invalidConfigurationItemIdMsg = 'No valid configuration item id.';
export const invalidConnectionContentMsg = 'Content of connection is invalid.';
export const invalidConnectionIdMsg = 'No valid connection id.';
export const invalidConnectionRuleMsg = 'No valid connection rule.';
export const invalidConnectionsSearchWithoutItemTypeMsg = 'Connections to upper or lower can only be search with a given item type.';
export const invalidConnectionsToLowerArrayMsg = 'No valid array for connections to lower.';
export const invalidConnectionsToLowerPresentMsg = 'No valid connections to lower present.';
export const invalidConnectionsToUpperArrayMsg = 'No valid array for connections to upper.';
export const invalidConnectionsToUpperPresentMsg = 'No valid connections to upper present.';
export const invalidConnectionTypeMsg = 'No valid connection type.';
export const invalidCountMsg = 'No valid count.';
export const invalidDateOrderMsg = 'Date before must be greater than date after.';
export const invalidDescriptionMsg = 'No valid description.';
export const invalidDomainNameMsg = 'No valid domain name.';
export const invalidFileTypeMsg = 'No excel or csv file.';
export const invalidIdInBodyMsg = 'No valid id in body.';
export const invalidIdInParamsMsg = 'No valid id in path.';
export const invalidItemTypeMsg = 'No valid item type id.';
export const invalidListOfItemIdsMsg = 'No valid list of item ids.';
export const invalidLowerIdInParamsMsg = 'No valid lower id in path.';
export const invalidLowerItemIdMsg = 'No valid lower item id.';
export const invalidLowerItemTypeMsg = 'No valid lower item type id.';
export const invalidMappingMsg = 'No valid mapping of item type and attribute group.';
export const invalidMaxLevelsMsg = 'No valid number of maximum levels for neighbor search (min: 1, max: 10).';
export const invalidMultipleLinksMsg = 'No more than one link is allowed per row.';
export const invalidNameMsg = 'No valid name.';
export const invalidNumberMsg = 'Not a valid number.';
export const invalidPageMsg = 'Not a valid page number';
export const invalidPassphraseMsg = 'Passphrase is invalid or does not match the complexity criteria.';
export const invalidPositionMsg = 'Position must be ' + aboveValue + ' or ' + belowValue + '.';
export const invalidRegexMsg = 'No valid regular expression.';
export const invalidResponsibilityFlagMsg = 'No valid flag for deleting with or without responsibilities.';
export const invalidResponsibleUserMsg = 'No valid responsible user.';
export const invalidReverseNameMsg = 'No valid reverse name given.';
export const invalidRoleMsg = 'No valid role.';
export const invalidRowsMsg = 'No valid array for rows.';
export const invalidSearchDirectionMsg = 'No valid search direction.';
export const invalidSearchTextMsg = 'No valid search text.';
export const invalidTargetIdMsg = 'No valid id for target.';
export const invalidTargetIdWithNameMsg = 'Setting the ' + targetIdField + ' is not allowed for ' + targetTypeField + ' ' + targetTypeValues[0] + '.';
export const invalidTargetTypeMsg = 'No valid target type. Must be one of ' + targetTypeValues.join(', ') + '.';
export const invalidTextMsg = 'No valid text.';
export const invalidUpperIdInParamsMsg = 'No valid upper id in path.';
export const invalidUpperItemIdMsg = 'No valid upper item id.';
export const invalidUpperItemTypeMsg = 'No valid upper item type id.';
export const invalidURIMsg = 'No valid URL.';
export const invalidUserNameMsg = 'No valid user name.';
export const mappingAlreadyExistsMsg = 'Mapping between this item type and this attribute group already exists.';
export const maximumNumberOfConnectionsToLowerExceededMsg = 'The maximum number of connections is reached. No more connections for the upper item are allowed.';
export const maximumNumberOfConnectionsToUpperExceededMsg = 'The maximum number of connections is reached. No more connections for the lower item are allowed.';
export const missingResponsibilityMsg = 'User is not responsible for this item. Take responsibility before updating.';
export const missingTargetIdMsg = 'No ' + targetIdField + ' present for ' + targetTypeField + '.';
export const missingTargetTypeMsg = 'The ' + columnsField + ' array must contain exactly one ' + targetTypeField + ' of ' + targetTypeValues[0] + '.';
export const noAttributesArrayMsg = 'Attributes is not an array.';
export const noAuthenticationMsg = 'No authentication.';
export const noCommaSeparatedListMsg = 'Not a comma separated list of ids.';
export const noCriteriaForSearchMsg = 'At least one criteria must be set for search.';
export const noDuplicateIdsMsg = 'Each item id may be used only once.';
export const noDuplicateTypesMsg = 'Each type id may be used only once per item.';
export const noDuplicateUserNamesMsg = 'Each username may be used only once per item, and null values are not allowed.';
export const noDuplicateUrisMsg = 'Each Uri may be used only once per item.';
export const noItemFoundMsg = 'No item matches this name and type.';
export const noFileMsg = 'No file uploaded.';
export const noLinksArrayMsg = 'Links is not an array.';
export const noMatchForRegexMsg = 'Value did not match regular expression.';
export const noResourceWithThisIdMsg = 'No resource matches this id.';
export const notAStringValueMsg = 'Not a string value.';
export const nothingChangedMsg = 'Nothing changed.';
export const onlyAlphanumericMsg = 'Only characters and numbers are allowed.';
export const ruleAndconnectionIdMismatchMsg = 'Connection type id is not configured in given rule.';
export const userCreationFailedMsg = 'Failed to create user.';
export const userNotAdminMsg = 'User is not in admin role.';
export const userNotEditorMsg = 'User is not in editor role.';
export const validationErrorsMsg = 'Validation errors occured. See data for details.';
