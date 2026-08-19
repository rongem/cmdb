# General information
The REST API interface can be accessed under the path 'API/REST.svc/<method>'. Windows Authentication must be enabled on the web server, and anonymous authentication must be disallowed.

# Methods for [connections](REST-API-Object-Model#Connection)
There is deliberately no method for reading all connections apart from their configuration items. In large environments with thousands of items, this would crash most applications, since there are much more connections than items.

## Read single connection
Path: Connection/{id}

Method: GET

Expects: Guid of the desired connection

Returns: Connection object

## Get single connection by content
Path: Connection/upperItem/{upperItem}/connectionType/{connType}/lowerItem/{lowerItem}

Method: GET

Expects: Guid of the desired upper and lower item and connection type

Returns: Connection object

## Create a new connection
Path: Connection

Method: POST

Expects: { connection: Connection } object

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

## Update existing connection
Path: Connection/{id}

Method: PUT

Expects: Guid of the desired connection in the path and { connection: Connection } object in the body

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

Only the connection description can be altered, upper and lower item an connection type and rule are immutable. If the connection description does not match the validation expression, the update fails.

## DELETE existing connection
Path: Connection/{id}

Method: DELETE

Expects: Guid of the desired connection

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

## Read all connections that belong to a given configuration item
Path: ConfigurationItem/{id}/Connections

Method: GET

Expects: Guid of the desired configuration item

Returns: Connection[]

## Read all connections where the given configuration item is the upper item
Path: ConfigurationItem/{id}/Connections/ToLower

Method: GET

Expects: Guid of the desired configuration item

Returns: Connection[]

## Read all connections where the given configuration item is the lower item
Path: ConfigurationItem/{id}/Connections/ToUpper

Method: GET

Expects: Guid of the desired configuration item

Returns: Connection[]

