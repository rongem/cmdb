# General information
The REST API interface can be accessed under the path 'API/REST.svc/<method>'. Windows Authentication must be enabled on the web server, and anonymous authentication must be disallowed.

There is deliberately no method for reading all item attributes at once. In a large environment with thousands of items, this would crash most applications, since there are much more attributes than items.

# Methods for [item attributes](REST-API-Object-Model#ItemAttribute)
## Read single item attribute
Path: ItemAttribute/{id}

Method: GET

Expects: Guid of the desired item attribute

Returns: ItemAttribute object

## Read single attribute of a specified attribute type for a given configuration item
Path: ItemAttribute/item/{item}/attributeType/{attributeType}

Method: GET

Expects: Guid of the desired item type and attribute type

Returns: ItemAttribute object

Returns null, if no attribute is found.

## Read single attribute of a specified attribute type for a given configuration item
Path: ItemAttribute/item/{item}/attributeTypeName/{attributeTypeName}

Method: GET

Expects: Guid of the desired item type and name of the attribute type

Returns: ItemAttribute object

## Create a new item attribute
Path: ItemAttribute

Method: POST

Expects: { attribute: ItemAttribute } object

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

## Update an existing item attribute
Path: ItemAttribute/{id}

Method: PUT

Expects: Guid of the desired item attribute in the path and { attribute: ItemAttribute } object in the body

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

## Delete an existing item attribute
Path: ItemAttribute/{id}

Method: DELETE

Expects: Guid of the desired item attribute

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

## Read all attributes of a configuration item
Path: ConfigurationItem/{id}/Attributes

Method: GET

Expects: Guid of the desired configuration item

Returns: ItemAttribute[]

## Read all item attributes of a given attribute type
Path: AttributeType/{id}/Attributes

Method: GET

Expects: Guid of the desired attribute type

Returns: ItemAttribute object

