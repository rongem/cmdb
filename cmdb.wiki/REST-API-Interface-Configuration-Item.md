# General information
The REST API interface can be accessed under the path 'API/REST.svc/<method>'. Windows Authentication must be enabled on the web server, and anonymous authentication must be disallowed.

# Methods for [configuration items](REST-API-Object-Model#ConfigurationItem)
## Read single configuration item
Path: ConfigurationItem/{id}

Method: GET

Expects: Guid of the desired configuration item

Returns: ConfigurationItem object

## Read single configuration item and return it with all related data
Path:ConfigurationItem/{itemId}/Full

Method: GET

Expects: Guid of the desired configuration item

Returns: [Item](REST-API-Object-Model#Item) object

## Read all Configuration items that can be connected to a given item with a given rule
Path: ConfigurationItem/{id}/Connectable/{ruleId}

Method: GET

Expects: Guid of the desired configuration item and the desired connection rule

Returns: ConfigurationItem[]

## Read all configuration items that can be generally connected as lower item for a given rule
Path: ConfigurationItems/Connectable/{ruleId}

Method: GET

Expects: Guid of the desired connection rule

Returns: ConfigurationItem[]

## Read the item that has the given type and name
Path: ConfigurationItem/type/{itemType}/name/{itemName}

Method: GET

Expects: Guid of the item type and name of the desired item

Returns: ConfigurationItem

## Create configuration item
Path: ConfigurationItem

Method: POST

Expects: { item: ConfigurationItem } object

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

## Create configuration item with all attributes, connections and links
Path: ConfigurationItem/Full

Method: POST

Expects: { item: [Item](REST-API-Object-Model#Item) } object

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

## Update configuration item
Path: ConfigurationItem/{id}

Method: PUT

Expects: Guid of the configuration item in path and { item: ConfigurationItem } object in body

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

## Update configuration item with all related data
Path: ConfigurationItem/{id}

Method: DELETE

Expects: Guid of the configuration item

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

## Take responsibility for configuration item
Path: ConfigurationItem/{id}/Responsibility

Method: POST

Expects: Guid of the configuration item

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

Taking responsibility adds the current user to the list of responsible persons for the item and allows the user to change item properties.

## Abandon responsibility for configuration item
Path: ConfigurationItem/{id}/Responsibility

Method: DELETE

Expects: Guid of the configuration item

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

Abandoning responsibility removes the current user from the list of responsible persons for the item and prevents the user from changing item properties.

## Remove invalid responsibility information from configuration item
Path: ConfigurationItem/{id}/Responsibility

Method: PUT

Expects: Guid of the configuration item

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

Abandoning responsibility removes all users from the list of responsible persons for the item that cannot be found in the user store.

## Read historic changes of the configuration item
Path: ConfigurationItem/{id}/History

Method: GET

Expects: Guid of the configuration item

Returns: [HistoryEntry](REST-API-Object-Model#HistoryEntry)[]

This is the short standardized format for changes in the history of an item. For detailled information use the History/Objects appendix

## Read historic changes of the configuration item
Path: ConfigurationItem/{id}/History/Objects

Method: GET

Expects: Guid of the configuration item

Returns: [HistoricConfigurationItem](REST-API-Object-Model#HistoricConfigurationItem)[]

This is the detailled format for changes.

## Read all configuration items
Path: ConfigurationItems

Method: GET

Expects: void

Returns: ConfigurationItem[]

Hint: In large environments with thousands of configuration items, you should use this method with caution.

## Read configuration items of given types
Path: ConfigurationItems/ByType/{types}

Method: GET

Expects: Comma separated list of Guids of the desired item types

Returns: ConfigurationItem[]

If not all given strings are valid Guids, this method will fail and return nothing

## Read given configuration items and return them with all related data
Path: ConfigurationItem/{itemIds}/Full

Method: GET

Expects: Comma separated list of Guids of the desired configuration items

Returns: [Item](REST-API-Object-Model#Item)[]

## Read given configuration items and return them with all related data
Path: ConfigurationItems/Search

Method: POST

Expects: { search: [Search](REST-API-Object-Model#Search) } object in the body

Returns: ConfigurationItem[]

This method returns only the configuration items themselves and is therefore fast.

## Read given configuration items and return them with all related data
Path: ConfigurationItems/Search/Full

Method: POST

Expects: { search: [Search](REST-API-Object-Model#Search) } object in the body

Returns: [Item](REST-API-Object-Model#Item)[]

This method returns full items with all related data and is therefore slow.

## Read all external hyperlinks for a configuration item
Path: ConfigurationItem/{id}/Links

Method: GET

Expects: Guid of the configuration item

Returns: [ItemLink](REST-API-Object-Model#ItemLink)[]

## Create an external hyperlink for a configuration item
Path: ItemLink

Method: POST

Expects: { link: [ItemLink](REST-API-Object-Model#ItemLink) } object

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

## Delete an external hyperlink
Path: ItemLink/{id}

Method: DELETE

Expects: Guid of the desired item link

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

## Read all responsible user tokens for a configuration item
Path: ConfigurationItem/{id}/ResponibleUsers

Method: GET

Expects: Guid of the configuration item

Returns: [ItemResponsibility](REST-API-Object-Model#ItemResponsibility)[]

## Import Excel or CSV file and return the content in an object
Path: ConvertFileToTable

Method: POST

Expects: File upload

Returns: string[][]

First dimension of the returned array is the rows, then inside the rows the cells

## Import data table and write the data
Path: ImportDataTable

Method: PUT

Expects: { table: [TransferTable](REST-API-Object-Model#TransferTable), itemTypeId: Guid } object

Returns: [LineMessage](REST-API-Object-Model#LineMessage)[]