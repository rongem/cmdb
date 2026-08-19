# REST API object model documentation
This describes object model of the REST API.

## Object model for meta data
### AttributeGroup
An attribute group concentrates attribute types and binds them to item types.

* id: string; // MongoID and primary key
* name: string; // Name of the attribute group

### AttributeType
An attribute type represents a named property of an configuration item. Every attribute type can only be set once per configuration item. It must be grouped to an attribute group, which is bound to the item type.

* id: string; // MongoID and primary key
* name: string; // Name of the attribute group
* attributeGroupId: string; // MongoID and and foreign key to the attribute group
* attributeGroupName?: string; // Populated name of the attribute group for convenience, not used for requests
* validationExpression: string; // Regular Expression rules for valid attribute values and ranges

### ItemType
An item type represents an object type in the CMDB data model. It has a name, attributes and connections to other items as well as hyperlinks.

* id: string; // MongoID and primary key
* name: string; // Name of the attribute group
* backColor: string; // Hash and 6 digit hex color code for displaying the item type, e.g. #0000FF
* attributeGroups?: AttributeGroup[]; Container for all attribute groups mapped to the item

### ConnectionType
Connection types for connections between exactly two configuration items: the upper item and the lower item.

* id: string; // MongoID and primary key
* name: string; // Name for the connection from a top-down perspective (from upper to lower item)
* reverseName: string; // Name for the connection from a bottom-up perspective (from lower to upper item)

### ConnectionRule
A connection rule allows connecting two items of different types, and the number of maximum connections in each direction.

* id: string; // MongoID and primary key
* upperItemTypeId: string; // Foreign key for the item type of the upper item
* connectionTypeId: string; // Foreign key for the connection type
* lowerItemTypeId: string; // Foreign key for the item type of the lower item
* maxConnectionsToUpper: number; // maximum number of connections allowed from a bottom-up perspective
* maxConnectionsToLower: number; // maximum number of connections allowed from a top-down perspective
* validationExpression: string; // Regular Expression rules for valid connection description values and ranges

#### UserInfo
* accountName: string; // Account name, for NTLM DOMAIN\AccountName
* role!: number; // Role enum:
  * Reader = 0,
  * Editor = 1,
  * Administrator = 2

### MetaData
A collected object with all relevant meta data. This is introduced for performance purposes, since it is much quicker to get all meta data with one roundtrip to the server than with multiple calls for different data. Identical in version 2.

* attributeGroups: AttributeGroup[];
* attributeTypes: AttributeType[];
* connectionRules: ConnectionRule[];
* connectionTypes: ConnectionType[];
* itemTypes: ItemType[];
* userName: string; // Name of the user that made the REST API call
* userRole: UserRole; // Role of the user that made the REST API call


## Object model for data
### ConfigurationItem
The configuration item is the main object in the CMDB. Everything is connected to the configuration item, and items can be connected to each other.

* id: string; // MongoID and primary key
* typeId: string; // Foreigh key for the item type
* type?: string; // Name of the item type that belongs to the id referenced with the foreign key. Filled for convenience when retrieving item data, but not used in requests.
* name: string; // Name of the item. Must be unique per item type.
* lastChange?: Date; // Last change time of the item, one of its attributes or connections.
* version?: number; // The version of the item. Every change of the name, attributes, links or responsibilities increments this by one. Starts with 0.
* attributes?: ItemAttribute[]; // List of all item attributes. Only one attribute of each allowed type can be set in each item.
* links?: ItemLink[]; // List of all links belonging to the item. Each URL must be used only once per item.
* responsibleUsers?: string[]; // List of users' account names that are responsible for the item.

### ItemAttribute
An attribute is a property of an item. Each item can have only one attribute of each attribute type.

typeId: string; // Foreign key for the attribute type.
type?: string; // Name of the attribute type. Filled for convenience when retrieving the attribute, but not used in requests.
value: string; // Value of the attribute

### ItemLink
Hyperlink for a configuration item that can point to any URL

* uri: string; // URL of the link.
* description: string; // Description for the link

### Connection
A connection between two configuration items. There is always an upper and a lower item. The connection can have its own description.

* id: string; // MongoID and primary key
* typeId: string; // Foreign key of the connection type. Filled for convenience from the connection rule used. Maybe not relevant for requests, but validated at the moment.
* upperItemId: string; // Foreign key of the upper configuration item
* lowerItemId: string; // Foreign key of the lower configuration item
* ruleId: string; // Foreign key of the connection rule this connections was built with
* description: string; // Description of the connection.

### Item
Full Configuration items contain the configuration items together with connections and connected items. They are for performance reasons, since it would take several roundtrips to retrieve all the data for one item.

 * see Configuration Item for basic properties
 * connectionsToUpper: Connection[] // list of all connections and connected items above the current item
 * connectionsToLower: Connection[] // list of all connections and connected items below the current item
 * userIsResponsible: boolean // Whether the current user is responsible for the item or not

#### Connection (Item)
 * id: Guid // UUID and primary key of the connection
 * targetId: Guid // UUID and primary key of the connected item
 * targetTypeId: Guid // UUID and primary key of the item type of the connected item
 * targetType: string // name of the item type of the connected item
 * targetName: string // name of the connected item
 * targetColor: string // color code of the item type of the connected item
 * connectionType: string // name of the connection type
 * typeId: Guid // UUID and primary key of the connection type
 * ruleId: Guid // UUID and primary key of the connection rule
 * description: string // description of the connection

#### Link
 * uri: string // URI the link is pointing towards
 * description: string // displayed text for the link

## Other object
### TransferTable
Used for importing configuration items.
 * columns: // List of column types
   * targetType: string // One of the values name, attribute, connection to upper, connection to lower, linkdescription, linkaddress
   * targetId: string // Id of the attribute or connection type, with other target types empty
 * rows: string[][] // First dimension is rows, second is cells in row

### LineMessage
Used for returning results from import by line
 * index: number // Line number
 * message: string // Message for the line and subject
 * subject: string // subject
 * details: string // Optional: more information
 * severity: number // 0 = info, 1 = warning, 2 = error, 3 = fatal

## Search Objects
### Search
The search object contains search parameters. All values are optional, but at least one value must be set.
 * nameOrValue: string // Part of an item name or attribute value to be searched for
 * itemType: Guid // UUID of the item type to search for
 * attributes: SearchAttribute[] // Attributes to be searched for
 * connectionsToUpper: SearchConnection[] // Connection prototypes that an item must have to be found. Item type must be set for this to work.
 * connectionsToLower: SearchConnection[] // Connection prototypes that an item must have to be found. Item type must be set for this to work.
 * changedBefore: date // Changes must not happened after the given date
 * changedAfter: date // Changes must have happened after that given date
 * responsibleToken: string // User token that must be responsible in item to be found

#### SearchAttribute
A search attribute searches for attribute values
 * attributeTypeId: Guid // UUID of the attribute type that is searched for. This value must be provided.
 * attributeValue: string // part of the attribute value the item must contain. Leading ! means not, so if you look for an attribute that doesn't match, use this.

#### SearchConnection
The search connection uses prototypes of connection informations.
 * connectionType: Guid // UUID of the connection type that is searched for. This value must be provided
 * configurationItemType: Guid // UUID of the configuration item type that is connected via the given connection type. This value is optional.
 * count: string // Enumeration: '0' means no connection, '1' means exactly one connection, '1+' means at least one connection, '2+' means more than one connection. This value must be provided.

### NeighborSearch
The NeighborSearch object starts the search from a given item and follows the connections.
 * sourceItem: Guid // UUID of the source item from where the search is started
 * itemType: Guid // UUID of the item type that is searched for
 * maxLevels: number // Number of connections (hops) away from the source item that must not be exceeded
 * searchDirection: string // On of the values up, down, both
 * extraSearch: Search // Extra search information in a Search object

## History Objects
### ItemHistory
Contains detailled change information for a configuration item.
 * item // Object with item information
   * id: string // Mongo Id of the item
   * typeId: string // Mongo Id of the item type
   * type: string // Name of the item type
   * lastChange: date // Date, when the last change occured
   * oldVersions: Array // Array of historic items
     * name: string // Name of the item at that stage
     * type: string // Name of the item type at that stage
     * changedAt: date // Date, when that stage was saved
     * changedBy: string // Account name of the person who saved this version
     * attributes: Array // Array with attributes
       * typeId: string // Id of the attribute type
       * type: string // Name of the attribute type at that stage
       * value: string // Value of the item at that stage
     * links: Array // Array with links to external sites
       * uri: string // Uri of the link
       * description: string // Link description
     * responsibleUsers: string [] // Array of account names of the responsible users at that stage
   * deleted: boolean // Whether the item is deleted
 * connectionsToLower: HistoricConnections[] // Array of connections to lower
 * connectionsToUpper: HistoricConnections[] // Array of connections to upper

#### HistoricConnection
Contains detailled change information for an connection.
 * id: string // Mongo Id of the connection
 * ruleId: string // Mongo Id of the connection rule
 * typeId: string // Mongo Id of the connection type
 * typeName: string // Name of the connection type at the time of change, may differ from the present type name
 * reverseName: string // Reverse name of the connection type at the time of change, may differ from the present reverse name
 * upperItemId: string // MongoId of the upper configuration item
 * lowerItemId: string // MongoId of the lower configuration item
 * lastChange: date // Date of the last change
 * deleted: boolean // Whether the connections was deleted
 * descriptions: string[] // Array of historic descriptions
