# General information
The REST API interface can be accessed under the path 'API/REST.svc/<method>'. Windows Authentication must be enabled on the web server, and anonymous authentication must be disallowed.

# Methods, grouped by purpose
## General functions
### Meta data
Path: MetaData

Method: GET

Expects: void

Returns: MetaData object

This method reads all the meta data in the database and returns it at once.

### Text proposals
Path: Proposals/{text}

Method: GET

Expects: At least two characters in the text part of the URI

Returns: string[]

This methods looks of object or attribute names that include the given text, and returns the names or values. Can be used for auto completion.

## [Attribute groups](REST-API-Object-Model#AttributeGroup)
### Create Attribute group
Path: AttributeGroup

Method: POST

Expects: { attributeGroup: AttributeGroup } object

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

### Read single attribute group
Path: AttributeGroup/{id}

Method: GET

Expects: Guid of the desired attribute group

Returns: AttributeGroup object

### Check if attribute group can be deleted
Path: AttributeGroup/{id}/CanDelete

Method: GET

Expects: Guid of the desired attribute group

Returns: bool

Checks, if an attribute group is mapped to item types or contains attribute types. If there are no mappings, true is returned.

### Update attribute group
Path: AttributeGroup/{id}

Method: PUT

Expects: Guid in the path and { attributeGroup: AttributeGroup } object in the body

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

### Delete attribute group
Path: AttributeGroup/{id}

Method: DELETE

Expects: Guid

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

### Read all attribute groups
Path: AttributeGroups

Method: GET

Expects: void

Returns: AttributeGroup[]

### Read attribute groups mapped to an item type
Path: AttributeGroups/InItemType/{id}

Method: GET

Expects: Guid of the item type

Returns: AttributeGroup[]

### Read attribute groups that are not mapped to a given item type
Path: AttributeGroups/NotInItemType/{id}

Method: GET

Expects: Guid of the item type

Returns: AttributeGroup[]

## [Attribute types](REST-API-Object-Model#AttributeType)
### Create Attribute type
Path: AttributeType

Method: POST

Expects: AttributeType object

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

### Read single attribute type
Path: AttributeType/{id}

Method: GET

Expects: Guid of the desired attribute type

Returns: { attributeType: AttributeType } object

### Check if attribute type can be deleted
Path: AttributeType/{id}/CanDelete

Method: GET

Expects: Guid of the desired attribute type

Returns: bool

Checks, if an attribute type is mapped to item types or contains attribute types. If there are no mappings, true is returned.

### Update attribute type
Path: AttributeType/{id}

Method: PUT

Expects: Guid in the path and { attributeType: AttributeType } object in the body

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

Updating the validation expression will lead to a check of current attribute values. If one or more attribute values don't match the validation expression, the update fails.

### Delete attribute type
Path: AttributeType/{id}

Method: DELETE

Expects: Guid

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

### Count item attributes for attribute type
Path: AttributeType/{id}/ItemAttributes/Count

Method: GET

Expects: Guid of the attribute type

Returns: number

### Convert an attribute type into an item type
Path: AttributeType/{id}/ConvertToItemType

Method: PUT

Expects: Guid of the attribute type in the path and { newItemTypeName: string, colorCode: string, connectionTypeId: Guid, position: number (0 = above, 1 = below), attributeTypesToTransfer: AttributeType[] } object in the body.

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

This method tries to convert an attribute type into an item type. All attributes are converted to new configuration items, and a list of attribute types will be transferred to them. If it succeeds, the converted attribute type will be deleted.

The operation may fail underway, so that only part of the operation completes. It can be repeated as often as necessary.

### Get all attribute types that can be transferred
Path: AttributeTypes/CorrespondingValuesOfType/{id}

Method: GET

Expects: Guid of the attribute type that shall be converted to an item type

Returns: AttributeType[]

This method searches for attribute types that seem to have corresponding values with attributes of the given type, so that they can be transferred to the new item type during the conversion of the given attribute type.

### Read all attribute types
Path: AttributeTypes

Method: GET

Expects: void

Returns: AttributeType[]

### Read all attribute types that are in a given group
Path: AttributeTypes/ForGroup/{id}

Method: GET

Expects: Guid of the desired attribute group

Returns: AttributeType[]

### Read all attribute types that are mapped via an attribute group to an item type
Path: AttributeTypes/ForItemType/{id}

Method: GET

Expects: Guid of the item type

Returns: AttributeType[]

## [Item types](REST-API-Object-Model#ItemType)
### Create item type
Path: ItemType

Method: POST

Expects: { itemType: ItemType } object

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

### Read single item type
Path: ItemType/{id}

Method: GET

Expects: Guid of the desired item type

Returns: ItemType object

### Check if item type can be deleted
Path: ItemType/{id}/CanDelete

Method: GET

Expects: Guid of the desired item type

Returns: bool

Checks, if an item type is mapped to item types or contains item types. If there are no mappings, true is returned.

### Update item type
Path: ItemType/{id}

Method: PUT

Expects: Guid in the path and { itemType: ItemType } object in the body

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

### Delete item type
Path: ItemType/{id}

Method: DELETE

Expects: Guid

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

### Read all item types
Path: ItemTypes

Method: GET

Expects: void

Returns: ItemType[]

### Get all item types that can be connected als upper item type to a given item type an connection type
Path: ItemType/ForUpper/{upper}/ConnectionType/{connType}

Method: GET

Expects: Guid of the upper item type and connection type

Returns: ItemType[]

### Get all item types that can be connected als lower item type to a given item type an connection type
Path: ItemType/ForLower/{lower}/ConnectionType/{connType}

Method: GET

Expects: Guid of the lower item type and connection type

Returns: ItemType[]

## [Connection types](REST-API-Object-Model#ConnectionType)
### Create connection type
Path: ConnectionType

Method: POST

Expects: { connectionType: ConnectionType } object

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

### Read single connection type
Path: ConnectionType/{id}

Method: GET

Expects: Guid of the desired connection type

Returns: ConnectionType object

### Check if connection type can be deleted
Path: ConnectionType/{id}/CanDelete

Method: GET

Expects: Guid of the desired connection type

Returns: bool

Checks, if an connection type is mapped to item types or contains connection types. If there are no mappings, true is returned.

### Update connection type
Path: ConnectionType/{id}

Method: PUT

Expects: Guid in the path and { connectionType: ConnectionType } object in the body

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

### Delete connection type
Path: ConnectionType/{id}

Method: DELETE

Expects: Guid

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

### Count item connections for connection type
Path: ConnectionType/{id}/ItemConnections/Count

Method: GET

Expects: Guid of the connection type

Returns: number

### Read all connection types
Path: ConnectionTypes

Method: GET

Expects: void

Returns: ConnectionType[]

### Read all connection types that are in a given group
Path: ConnectionTypes/ForGroup/{id}

Method: GET

Expects: Guid of the desired connection group

Returns: ConnectionType[]

### Read all connection types that are allowed by a rule for a given item type
Path: ConnectionTypes/AllowedDownward/itemtype/{id}

Method: GET

Expects: Guid of the item type

Returns: ConnectionType[]

## [Connection rules](REST-API-Object-Model#ConnectionRules)
### Create new connection rule
Path: ConnectionRule

Method: POST

Expects: { connectionRule: ConnectionRule } object

Returns: [OperationResult](REST-API-Object-Model#OperationResult)
### Read single ConnectionRule
Path: ConnectionRule/{id}

Method: GET

Expects: Guid of the connection rule

Returns: ConnectionRule object

### Count connections depending from this rule
Path: ConnectionRule/{id}/Connections/Count

Method: GET

Expects: Guid of the connection rule

Returns: number

### Read connection rule by its content
Path: ConnectionRule/upperItemType/{upper}/connectionType/{conn}/lowerItemType/{lower}

Method: GET

Expects: Guid of upper item type, connection and lower item type

Returns: ConnectionRule object

### Check if connection rule can be deleted
Path: ConnectionRule/{id}/CanDelete

Method: GET

Expects: Guid of the connection rule

Returns: bool

If there are any connections depending on this rule, false will be returned.

### Update connection rule
Path: ConnectionRule/{id}

Method: PUT

Expects: Guid of the connection rule in the path and { connectionRule: ConnectionRule } object in the body

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

Only the numbers of maximum connections and the validation expression can be changed, item types and connection types are immutable. If changing the validation expression, and there are connections with descriptions that don't match the new validation expression, then the method fails.

### Delete connection rule
Path: ConnectionRule/{id}

Method: DELETE

Expects: Guid of the connection rule

Returns: [OperationResult](REST-API-Object-Model#OperationResult)
### Read all Connection rules
Path: ConnectionRules

Method: GET

Expects: void

Returns: ConnnectionRule[]

### Read all connection rules where a given item type is involved
Path: ConnectionRules/ForItemType/{id}

Method: GET

Expects: Guid for the desired item type

Returns: ConnectionRule[]

### Read all connection rules where a given item type is in the upper position
Path: ConnectionRules/ByUpperItemType/{id}

Method: GET

Expects: Guid for the desired item type

Returns: ConnectionRule[]

### Read all connection rules where a given item type is in the lower position
Path: ConnectionRules/ByLowerItemType/{id}

Method: GET

Expects: Guid for the desired item type

Returns: ConnectionRule[]

### Read all connection rules with a given item types in the given position
Path: ConnectionRules/ByUpperItemType/{upper}/ByLowerItemType/{lower}

Method: GET

Expects: Guid for the desired upper and lower item type

Returns: ConnectionRule[]

## Mappings between item types and attribute groups
### Create mapping between item type and attribute group
Path: ItemTypeAttributeGroupMapping

Method: POST

Expects: { itemTypeAttributeGroupMapping: [ItemTypeAttributeGroupMapping](REST-API-Object-Model#ItemTypeAttributeGroupMapping) } object

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

### Read all mappings between item type and attribute group
Path: ItemTypeAttributeGroupMappings

Method: GET

Expects: void

Returns: [ItemTypeAttributeGroupMapping](REST-API-Object-Model#ItemTypeAttributeGroupMapping)[]
### Count attributes depending on an item type to attribute group mapping
Path: ItemTypeAttributeGroupMapping/group/{group}/itemType/{itemType}/CountAttributes

Method: GET

Expects: Guid of attribute group and item type

Returns: number
### Check if mapping can be deleted
Path: ItemTypeAttributeGroupMapping/group/{group}/itemType/{itemType}/CanDelete

Method: GET

Expects: Guid of attribute group and item type

Returns: bool

### Delete mapping between item type and attribute group
Path: ItemTypeAttributeGroupMapping/group/{attributeGroup}/itemType/{itemType}

Method: DELETE

Expects: Guid of attribute group and item type

Returns: [OperationResult](REST-API-Object-Model#OperationResult)
