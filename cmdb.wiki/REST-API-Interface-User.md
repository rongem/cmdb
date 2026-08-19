# General information
The REST API interface can be accessed under the path 'API/REST.svc/<method>'. Windows Authentication must be enabled on the web server, and anonymous authentication must be disallowed.

# Methods for user token operations
## Read name of current user
Path: User/Current

Method: GET

Expects: void

Returns: string with the user token

## Read role of current user
Path: User/Role

Method: GET

Expects: void

Returns: number (0 = Reader, 1 = Editor, 2 = Administrator)

## Read role of current user
Path: Users

Method: GET

Expects: void

Returns: string[] with all users configured in the database

Readers are not part of the database, since everyone who can authenticate successfully against the web server is a reader. So only editors and administrator are returned. Since users can be deleted from the access list, but stay responsible for configuration items, you will see only users with access rights, not users responsible for items.

## Get more information from user store for list of user tokens
Path: Users

Method: POST

Expects: { accountNames: string[] } object

Returns: [UserInfo](REST-API-Object-Model#UserInfo)[]

## Read role of current user
Path: Users/search/{searchText}

Method: GET

Expects: part of a user name in the user store

Returns: [UserInfo](REST-API-Object-Model#UserInfo)[]

This method operates on the LDAP user store that is being used for authentication. If no Windows domain is available, it works on the local machines SAM accounts.

## Toggle user rights for user 
Path: User

Method: PUT

Expects: { userToken: string } object

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

This method makes an existing user token an administrator, if he was an editor before, and vica versa.

## Grant role for user or group
Path: User

Method: POST

Expects: { userRoleMapping: [UserRoleMapping](REST-API-Object-Model#UserRoleMapping) } object

Returns: [OperationResult](REST-API-Object-Model#OperationResult)

## Revoke role for user or group
Path: User/{domain}/{user}/{role}/{deleteResponsibilities}

Method: DELETE

Expects: domain name and user name for user, role to revoke and bool whether to also delete existing responsibilities for configuration items

Returns: [OperationResult](REST-API-Object-Model#OperationResult)
