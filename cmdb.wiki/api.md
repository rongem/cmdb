---
title: DCCMDB v2.2

---

<h1 id="dccmdb">DCCMDB v2.2</h1>


Base URLs:

* <a href="http://{servername}/">http://{servername}/</a>

    * **servername** - name of the server Default: localhost:8000

* <a href="https://{servername}/">https://{servername}/</a>

    * **servername** - name of the server Default: cmdb-backend

# Authentication

- HTTP Authentication, scheme: bearer 

<h1 id="dccmdb-default">Default</h1>

## get__login

`GET /login`

*Get configured authentication method*

> Example responses

> OK

```
"jwt"
```

```
"ntlm"
```

> default Response

```json
{
  "message": "string"
}
```

<h3 id="get__login-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|string|
|default|Default|Server error|Inline|

<h3 id="get__login-responseschema">Response Schema</h3>

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## post__login

`POST /login`

*Authenticate with username and password for JWT. Only available if JWT is the configured method.*

> Body parameter

```json
{
  "accountName": "string",
  "passphrase": "string"
}
```

<h3 id="post__login-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|Authentication data|
|» accountName|body|string|false|none|
|» passphrase|body|string(complex password)|false|(Only required for JWT): Passphrase for the user|

> Example responses

> 200 Response

```json
{
  "token": "string",
  "userName": "string"
}
```

<h3 id="post__login-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|415|[Unsupported Media Type](https://tools.ietf.org/html/rfc7231#section-6.5.13)|unsupported media type|string|
|default|Default|Server error|Inline|

<h3 id="post__login-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» token|string|false|none|JWT token|
|» userName|string|false|none|none|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## post__rest_attributegroup

`POST /rest/attributegroup`

*Create a new attribute group*

> Body parameter

```json
{
  "name": "string"
}
```

<h3 id="post__rest_attributegroup-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|Data for the new attribute group|
|» name|body|string|true|Unique name of the attribute group|

> Example responses

> 201 Response

```json
{
  "id": "string",
  "name": "string"
}
```

<h3 id="post__rest_attributegroup-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Created|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|415|[Unsupported Media Type](https://tools.ietf.org/html/rfc7231#section-6.5.13)|unsupported media type|string|
|default|Default|Server error|Inline|

<h3 id="post__rest_attributegroup-responseschema">Response Schema</h3>

Status Code **201**

*An attribute group object that handles multiple attribute types.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_attributegroup_{id}

`GET /rest/attributegroup/{id}`

*Get a single attribute group by id*

<h3 id="get__rest_attributegroup_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "name": "string"
}
```

<h3 id="get__rest_attributegroup_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_attributegroup_{id}-responseschema">Response Schema</h3>

Status Code **200**

*An attribute group object that handles multiple attribute types.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## put__rest_attributegroup_{id}

`PUT /rest/attributegroup/{id}`

*Update the attribute group*

> Body parameter

```json
{
  "id": "string",
  "name": "string"
}
```

<h3 id="put__rest_attributegroup_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[#/paths/~1rest~1attributegroup/post/responses/201/content/application~1json/schema](#schema#/paths/~1rest~1attributegroup/post/responses/201/content/application~1json/schema)|true|Atribute group to update|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "name": "string"
}
```

<h3 id="put__rest_attributegroup_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|304|[Not Modified](https://tools.ietf.org/html/rfc7232#section-4.1)|nothing changed|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|415|[Unsupported Media Type](https://tools.ietf.org/html/rfc7231#section-6.5.13)|unsupported media type|string|
|default|Default|Server error|Inline|

<h3 id="put__rest_attributegroup_{id}-responseschema">Response Schema</h3>

Status Code **200**

*An attribute group object that handles multiple attribute types.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete__rest_attributegroup_{id}

`DELETE /rest/attributegroup/{id}`

*Delete the attribute group*

<h3 id="delete__rest_attributegroup_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "name": "string"
}
```

<h3 id="delete__rest_attributegroup_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="delete__rest_attributegroup_{id}-responseschema">Response Schema</h3>

Status Code **200**

*An attribute group object that handles multiple attribute types.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_attributegroup_{id}_ItemType{itemTypeId}_CountAttributes

`GET /rest/attributegroup/{id}/ItemType{itemTypeId}/CountAttributes`

*Count attributes that exists in items of the given item type and where the attribute types are in the given attribute groups*

<h3 id="get__rest_attributegroup_{id}_itemtype{itemtypeid}_countattributes-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|
|itemTypeId|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of an item type|

> Example responses

> 200 Response

```
0
```

> 400 Response

```json
{
  "message": "string",
  "data": {
    "errors": [
      {
        "value": "string",
        "msg": "string",
        "param": "string",
        "location": "body"
      }
    ]
  }
}
```

<h3 id="get__rest_attributegroup_{id}_itemtype{itemtypeid}_countattributes-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|integer|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_attributegroup_{id}_itemtype{itemtypeid}_countattributes-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_attributegroup_{id}_candelete

`GET /rest/attributegroup/{id}/candelete`

*Check, if the given attribute group can be deleted (i. e. is not used in any other context)*

<h3 id="get__rest_attributegroup_{id}_candelete-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```
"true"
```

> 400 Response

```json
{
  "message": "string",
  "data": {
    "errors": [
      {
        "value": "string",
        "msg": "string",
        "param": "string",
        "location": "body"
      }
    ]
  }
}
```

<h3 id="get__rest_attributegroup_{id}_candelete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|string|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_attributegroup_{id}_candelete-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_attributegroups

`GET /rest/attributegroups`

*Returns all attribute group objects as an array*

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "string"
  }
]
```

<h3 id="get__rest_attributegroups-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_attributegroups-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_attributegroups_inItemType_{id}

`GET /rest/attributegroups/inItemType/{id}`

*Return all attribute group objects that belong to a given item type as an array*

<h3 id="get__rest_attributegroups_initemtype_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "string"
  }
]
```

<h3 id="get__rest_attributegroups_initemtype_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_attributegroups_initemtype_{id}-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_attributegroups_notInItemType_{id}

`GET /rest/attributegroups/notInItemType/{id}`

*Return all attribute group objects that do not belong to the given item type as an array*

<h3 id="get__rest_attributegroups_notinitemtype_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "string"
  }
]
```

<h3 id="get__rest_attributegroups_notinitemtype_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_attributegroups_notinitemtype_{id}-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__rest_attributetype

`POST /rest/attributetype`

*Create a new attribute type*

> Body parameter

```json
{
  "name": "string",
  "attributeGroupId": "string",
  "validationExpression": "string"
}
```

<h3 id="post__rest_attributetype-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|Data for the new attribute type|
|» name|body|string|true|Unique name of the attribute type|
|» attributeGroupId|body|string(mongo id)|true|Unique id|
|» validationExpression|body|string(regular expression)|true|Regular expression that is used for validation of attribute values|

> Example responses

> 201 Response

```json
{
  "id": "string",
  "name": "string",
  "attributeGroupId": "string",
  "validationExpression": "string",
  "attributeGroupName": "string"
}
```

<h3 id="post__rest_attributetype-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Created|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|415|[Unsupported Media Type](https://tools.ietf.org/html/rfc7231#section-6.5.13)|unsupported media type|string|
|default|Default|Server error|Inline|

<h3 id="post__rest_attributetype-responseschema">Response Schema</h3>

Status Code **201**

*An attribute type object.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|An attribute type object for creating.|
|»» name|string|true|none|Unique name of the attribute type|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|none|
|»» attributeGroupName|string|false|none|Unique name of the meta data element|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_attributetype_{id}

`GET /rest/attributetype/{id}`

*Get a single attribute type by id*

<h3 id="get__rest_attributetype_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "name": "string",
  "attributeGroupId": "string",
  "validationExpression": "string",
  "attributeGroupName": "string"
}
```

<h3 id="get__rest_attributetype_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_attributetype_{id}-responseschema">Response Schema</h3>

Status Code **200**

*An attribute type object.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|An attribute type object for creating.|
|»» name|string|true|none|Unique name of the attribute type|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|none|
|»» attributeGroupName|string|false|none|Unique name of the meta data element|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## put__rest_attributetype_{id}

`PUT /rest/attributetype/{id}`

*Update the attribute type*

> Body parameter

```json
{
  "id": "string",
  "name": "string",
  "attributeGroupId": "string",
  "validationExpression": "string",
  "attributeGroupName": "string"
}
```

<h3 id="put__rest_attributetype_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[#/paths/~1rest~1attributetype/post/responses/201/content/application~1json/schema](#schema#/paths/~1rest~1attributetype/post/responses/201/content/application~1json/schema)|true|Updated attribute type|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "name": "string",
  "attributeGroupId": "string",
  "validationExpression": "string",
  "attributeGroupName": "string"
}
```

<h3 id="put__rest_attributetype_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|304|[Not Modified](https://tools.ietf.org/html/rfc7232#section-4.1)|nothing changed|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|415|[Unsupported Media Type](https://tools.ietf.org/html/rfc7231#section-6.5.13)|unsupported media type|string|
|default|Default|Server error|Inline|

<h3 id="put__rest_attributetype_{id}-responseschema">Response Schema</h3>

Status Code **200**

*An attribute type object.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|An attribute type object for creating.|
|»» name|string|true|none|Unique name of the attribute type|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|none|
|»» attributeGroupName|string|false|none|Unique name of the meta data element|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete__rest_attributetype_{id}

`DELETE /rest/attributetype/{id}`

*Delete the attribute type*

<h3 id="delete__rest_attributetype_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "name": "string",
  "attributeGroupId": "string",
  "validationExpression": "string",
  "attributeGroupName": "string"
}
```

<h3 id="delete__rest_attributetype_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="delete__rest_attributetype_{id}-responseschema">Response Schema</h3>

Status Code **200**

*An attribute type object.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|An attribute type object for creating.|
|»» name|string|true|none|Unique name of the attribute type|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|none|
|»» attributeGroupName|string|false|none|Unique name of the meta data element|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__rest_attributetype_{id}_converttoitemtype

`POST /rest/attributetype/{id}/converttoitemtype`

*Convert attribute type to item type and migrate all attributes of that type to items*

> Body parameter

```json
{
  "newItemTypeName": "string",
  "backColor": "string",
  "connectionTypeId": "string",
  "position": "above",
  "attributeTypesToTransfer": [
    {
      "id": "string"
    }
  ]
}
```

<h3 id="post__rest_attributetype_{id}_converttoitemtype-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|
|body|body|object|true|Updated attribute type|
|» newItemTypeName|body|string|false|Unique name of the meta data element|
|» backColor|body|string(color code)|true|Color code of an item type|

> Example responses

> 200 Response

```json
{
  "itemType": {
    "id": "string",
    "name": "string",
    "backColor": "string",
    "attributeGroups": [
      {
        "id": "string",
        "name": "string"
      }
    ]
  },
  "items": [
    {
      "id": "string",
      "name": "string",
      "typeId": "string",
      "attributes": [
        {
          "typeId": "string",
          "value": "string"
        }
      ],
      "links": [
        {
          "uri": "string",
          "description": "string"
        }
      ],
      "users": [
        "string"
      ]
    }
  ],
  "connections": [
    {
      "id": "string",
      "typeId": {
        "id": "string"
      },
      "ruleId": {
        "id": "string"
      },
      "upperItem": {
        "id": "string"
      },
      "lowerItem": {
        "id": "string"
      },
      "description": "string"
    }
  ],
  "deletedAttributeType": {
    "id": "string",
    "name": "string",
    "attributeGroupId": "string",
    "validationExpression": "string",
    "attributeGroupName": "string"
  }
}
```

<h3 id="post__rest_attributetype_{id}_converttoitemtype-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="post__rest_attributetype_{id}_converttoitemtype-responseschema">Response Schema</h3>

Status Code **200**

*Results of processing the migration*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» itemType|any|false|none|An item type object.|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|object|false|none|An item type object for creation.|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[allOf]|false|none|Items that were changed in process|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»» links|[object]|false|none|Links to external websites for the item|
|»»»» uri|string(url)|false|none|Url of the link, must be http or https|
|»»»» description|string|false|none|Description|
|»»» users|[string]|false|none|List of the users that are responsible for the item, i.e. are able to change it|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» connections|[allOf]|false|none|Connections that were created while processing request|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» deletedAttributeType|any|false|none|An attribute type object.|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|object|false|none|none|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_attributetype_{id}_candelete

`GET /rest/attributetype/{id}/candelete`

*Check, if the given attribute type can be deleted (i. e. is not used in any other context)*

<h3 id="get__rest_attributetype_{id}_candelete-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```
"true"
```

> 400 Response

```json
{
  "message": "string",
  "data": {
    "errors": [
      {
        "value": "string",
        "msg": "string",
        "param": "string",
        "location": "body"
      }
    ]
  }
}
```

<h3 id="get__rest_attributetype_{id}_candelete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|string|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_attributetype_{id}_candelete-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_attributetype_{id}_attributes_count

`GET /rest/attributetype/{id}/attributes/count`

*Returns the number of existing attributes of the given attribute type*

<h3 id="get__rest_attributetype_{id}_attributes_count-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```
0
```

> 400 Response

```json
{
  "message": "string",
  "data": {
    "errors": [
      {
        "value": "string",
        "msg": "string",
        "param": "string",
        "location": "body"
      }
    ]
  }
}
```

<h3 id="get__rest_attributetype_{id}_attributes_count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|integer|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_attributetype_{id}_attributes_count-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_attributetype_{id}_correspondingValuesOfType

`GET /rest/attributetype/{id}/correspondingValuesOfType`

*Returns those attribute types whose values are coherent to the values of the given attribute type and can therefore be migrated together with the attribute type*

<h3 id="get__rest_attributetype_{id}_correspondingvaluesoftype-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "string",
    "attributeGroupId": "string",
    "validationExpression": "string",
    "attributeGroupName": "string"
  }
]
```

<h3 id="get__rest_attributetype_{id}_correspondingvaluesoftype-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_attributetype_{id}_correspondingvaluesoftype-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_attributetypes

`GET /rest/attributetypes`

*Return all attribute type objects as an array*

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "string",
    "attributeGroupId": "string",
    "validationExpression": "string",
    "attributeGroupName": "string"
  }
]
```

<h3 id="get__rest_attributetypes-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_attributetypes-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_attributetypes_forGroup_{id}

`GET /rest/attributetypes/forGroup/{id}`

*Return all attribute type objects that belong to the given attribute group as an array*

<h3 id="get__rest_attributetypes_forgroup_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "string",
    "attributeGroupId": "string",
    "validationExpression": "string",
    "attributeGroupName": "string"
  }
]
```

<h3 id="get__rest_attributetypes_forgroup_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_attributetypes_forgroup_{id}-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_attributetypes_forItemType_{id}

`GET /rest/attributetypes/forItemType/{id}`

*Return all attribute type objects that belong to the given item type as an array*

<h3 id="get__rest_attributetypes_foritemtype_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "string",
    "attributeGroupId": "string",
    "validationExpression": "string",
    "attributeGroupName": "string"
  }
]
```

<h3 id="get__rest_attributetypes_foritemtype_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_attributetypes_foritemtype_{id}-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__rest_connectiontype

`POST /rest/connectiontype`

*Create a new connection type*

> Body parameter

```json
{
  "name": "string",
  "reverseName": "string"
}
```

<h3 id="post__rest_connectiontype-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|Data for the new connection type|

> Example responses

> 201 Response

```json
{
  "id": "string",
  "name": "string",
  "reverseName": "string"
}
```

<h3 id="post__rest_connectiontype-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Created|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|415|[Unsupported Media Type](https://tools.ietf.org/html/rfc7231#section-6.5.13)|unsupported media type|string|
|default|Default|Server error|Inline|

<h3 id="post__rest_connectiontype-responseschema">Response Schema</h3>

Status Code **201**

*A connection type object.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_connectiontype_{id}

`GET /rest/connectiontype/{id}`

*Get a single connection type by id*

<h3 id="get__rest_connectiontype_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "name": "string",
  "reverseName": "string"
}
```

<h3 id="get__rest_connectiontype_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_connectiontype_{id}-responseschema">Response Schema</h3>

Status Code **200**

*A connection type object.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## put__rest_connectiontype_{id}

`PUT /rest/connectiontype/{id}`

*Update the connection type*

> Body parameter

```json
{
  "id": "string",
  "name": "string",
  "reverseName": "string"
}
```

<h3 id="put__rest_connectiontype_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[#/paths/~1rest~1connectiontype/post/responses/201/content/application~1json/schema](#schema#/paths/~1rest~1connectiontype/post/responses/201/content/application~1json/schema)|true|Updated connection type|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "name": "string",
  "reverseName": "string"
}
```

<h3 id="put__rest_connectiontype_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|304|[Not Modified](https://tools.ietf.org/html/rfc7232#section-4.1)|nothing changed|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|415|[Unsupported Media Type](https://tools.ietf.org/html/rfc7231#section-6.5.13)|unsupported media type|string|
|default|Default|Server error|Inline|

<h3 id="put__rest_connectiontype_{id}-responseschema">Response Schema</h3>

Status Code **200**

*A connection type object.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete__rest_connectiontype_{id}

`DELETE /rest/connectiontype/{id}`

*Delete the connection type*

<h3 id="delete__rest_connectiontype_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "name": "string",
  "reverseName": "string"
}
```

<h3 id="delete__rest_connectiontype_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="delete__rest_connectiontype_{id}-responseschema">Response Schema</h3>

Status Code **200**

*A connection type object.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_connectiontype_{id}_candelete

`GET /rest/connectiontype/{id}/candelete`

*Check, if the given connection type can be deleted (i. e. is not used in any other context)*

<h3 id="get__rest_connectiontype_{id}_candelete-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
"true"
```

<h3 id="get__rest_connectiontype_{id}_candelete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|string|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_connectiontype_{id}_candelete-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_connectiontypes

`GET /rest/connectiontypes`

*Return all connection type objects as an array*

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "string",
    "reverseName": "string"
  }
]
```

<h3 id="get__rest_connectiontypes-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_connectiontypes-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_AllowedDownward_itemtype_{id}

`GET /rest/AllowedDownward/itemtype/{id}`

*Return all connection type objects that can be used with the given item type as upper item type*

<h3 id="get__rest_alloweddownward_itemtype_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "string",
    "reverseName": "string"
  }
]
```

<h3 id="get__rest_alloweddownward_itemtype_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_alloweddownward_itemtype_{id}-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__rest_itemtype

`POST /rest/itemtype`

*Create a new item type*

> Body parameter

```json
{
  "name": "string",
  "backColor": "string",
  "attributeGroups": [
    {
      "id": "string",
      "name": "string"
    }
  ]
}
```

<h3 id="post__rest_itemtype-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|Data for the new item type|
|» name|body|string|true|Unique name of the meta data element|
|» backColor|body|string(color code)|true|Color code of an item type|
|» attributeGroups|body|[allOf]|false|Attribute groups that are mapped to the item type|
|»» *anonymous*|body|object|false|none|
|»»» id|body|string(mongo id)|true|Unique id|
|»» *anonymous*|body|object|false|An attribute group object that handles multiple attribute types, without id, for creating.|
|»»» name|body|string|true|Unique name of the attribute group|

> Example responses

> 201 Response

```json
{
  "id": "string",
  "name": "string",
  "backColor": "string",
  "attributeGroups": [
    {
      "id": "string",
      "name": "string"
    }
  ]
}
```

<h3 id="post__rest_itemtype-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Created|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|415|[Unsupported Media Type](https://tools.ietf.org/html/rfc7231#section-6.5.13)|unsupported media type|string|
|default|Default|Server error|Inline|

<h3 id="post__rest_itemtype-responseschema">Response Schema</h3>

Status Code **201**

*An item type object.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_itemtype_{id}

`GET /rest/itemtype/{id}`

*Get a single item type by id*

<h3 id="get__rest_itemtype_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "name": "string",
  "backColor": "string",
  "attributeGroups": [
    {
      "id": "string",
      "name": "string"
    }
  ]
}
```

<h3 id="get__rest_itemtype_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_itemtype_{id}-responseschema">Response Schema</h3>

Status Code **200**

*An item type object.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## put__rest_itemtype_{id}

`PUT /rest/itemtype/{id}`

*Update the item type*

> Body parameter

```json
{
  "id": "string",
  "name": "string",
  "backColor": "string",
  "attributeGroups": [
    {
      "id": "string",
      "name": "string"
    }
  ]
}
```

<h3 id="put__rest_itemtype_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[#/paths/~1rest~1itemtype/post/responses/201/content/application~1json/schema](#schema#/paths/~1rest~1itemtype/post/responses/201/content/application~1json/schema)|true|Updated item type|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "name": "string",
  "backColor": "string",
  "attributeGroups": [
    {
      "id": "string",
      "name": "string"
    }
  ]
}
```

<h3 id="put__rest_itemtype_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|304|[Not Modified](https://tools.ietf.org/html/rfc7232#section-4.1)|nothing changed|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|415|[Unsupported Media Type](https://tools.ietf.org/html/rfc7231#section-6.5.13)|unsupported media type|string|
|default|Default|Server error|Inline|

<h3 id="put__rest_itemtype_{id}-responseschema">Response Schema</h3>

Status Code **200**

*An item type object.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete__rest_itemtype_{id}

`DELETE /rest/itemtype/{id}`

*Delete the item type*

<h3 id="delete__rest_itemtype_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "name": "string",
  "backColor": "string",
  "attributeGroups": [
    {
      "id": "string",
      "name": "string"
    }
  ]
}
```

<h3 id="delete__rest_itemtype_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="delete__rest_itemtype_{id}-responseschema">Response Schema</h3>

Status Code **200**

*An item type object.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_itemtype_{id}_candelete

`GET /rest/itemtype/{id}/candelete`

*Check, if the given item type can be deleted (i. e. is not used in any other context)*

<h3 id="get__rest_itemtype_{id}_candelete-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```
"true"
```

> 400 Response

```json
{
  "message": "string",
  "data": {
    "errors": [
      {
        "value": "string",
        "msg": "string",
        "param": "string",
        "location": "body"
      }
    ]
  }
}
```

<h3 id="get__rest_itemtype_{id}_candelete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|string|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_itemtype_{id}_candelete-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_itemtypes

`GET /rest/itemtypes`

*Returns an array with all item types.*

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "string",
    "backColor": "string",
    "attributeGroups": [
      {
        "id": "string",
        "name": "string"
      }
    ]
  }
]
```

<h3 id="get__rest_itemtypes-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_itemtypes-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_itemtypes_forUpper_{id}_connectionType_{connectionType}

`GET /rest/itemtypes/forUpper/{id}/connectionType/{connectionType}`

*Returns the lower item types, that are allowed to be connected to for a given upper item type and connection type, in an array*

<h3 id="get__rest_itemtypes_forupper_{id}_connectiontype_{connectiontype}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|
|connectionType|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the connection type|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "string",
    "backColor": "string",
    "attributeGroups": [
      {
        "id": "string",
        "name": "string"
      }
    ]
  }
]
```

<h3 id="get__rest_itemtypes_forupper_{id}_connectiontype_{connectiontype}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_itemtypes_forupper_{id}_connectiontype_{connectiontype}-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_itemtypes_forLower_{id}_connectionType_{connectionType}

`GET /rest/itemtypes/forLower/{id}/connectionType/{connectionType}`

*Returns the uppwer item types, that are allowed to be connected to for a given lowper item type and connection type, in an array*

<h3 id="get__rest_itemtypes_forlower_{id}_connectiontype_{connectiontype}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|
|connectionType|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the connection type|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "string",
    "backColor": "string",
    "attributeGroups": [
      {
        "id": "string",
        "name": "string"
      }
    ]
  }
]
```

<h3 id="get__rest_itemtypes_forlower_{id}_connectiontype_{connectiontype}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_itemtypes_forlower_{id}_connectiontype_{connectiontype}-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_itemtypes_byAllowedAttributeType_{id}

`GET /rest/itemtypes/byAllowedAttributeType/{id}`

*Returns the item types, that have the same attribute group mapped as the given attribute type*

<h3 id="get__rest_itemtypes_byallowedattributetype_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "string",
    "backColor": "string",
    "attributeGroups": [
      {
        "id": "string",
        "name": "string"
      }
    ]
  }
]
```

<h3 id="get__rest_itemtypes_byallowedattributetype_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_itemtypes_byallowedattributetype_{id}-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__rest_connectionrule

`POST /rest/connectionrule`

*Create a new connection rule*

> Body parameter

```json
{
  "upperItemTypeId": "string",
  "connectionTypeId": "string",
  "lowerItemTypeId": "string",
  "maxConnectionsToUpper": 1,
  "maxConnectionsToLower": 1,
  "validationExpression": "string"
}
```

<h3 id="post__rest_connectionrule-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|Data for the new connection rule|

> Example responses

> 201 Response

```json
{
  "id": "string",
  "upperItemTypeId": "string",
  "connectionTypeId": "string",
  "lowerItemTypeId": "string",
  "maxConnectionsToUpper": 1,
  "maxConnectionsToLower": 1,
  "validationExpression": "string"
}
```

<h3 id="post__rest_connectionrule-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Created|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|415|[Unsupported Media Type](https://tools.ietf.org/html/rfc7231#section-6.5.13)|unsupported media type|string|
|default|Default|Server error|Inline|

<h3 id="post__rest_connectionrule-responseschema">Response Schema</h3>

Status Code **201**

*A connection rule object. It allows connections between items of two different types.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|A connection rule object for creating. It allows connections between items of two different types.|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_connectionrule_{id}

`GET /rest/connectionrule/{id}`

*Get a single connection rule by id*

<h3 id="get__rest_connectionrule_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "upperItemTypeId": "string",
  "connectionTypeId": "string",
  "lowerItemTypeId": "string",
  "maxConnectionsToUpper": 1,
  "maxConnectionsToLower": 1,
  "validationExpression": "string"
}
```

<h3 id="get__rest_connectionrule_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_connectionrule_{id}-responseschema">Response Schema</h3>

Status Code **200**

*A connection rule object. It allows connections between items of two different types.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|A connection rule object for creating. It allows connections between items of two different types.|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## put__rest_connectionrule_{id}

`PUT /rest/connectionrule/{id}`

*Update the connection rule*

> Body parameter

```json
{
  "id": "string",
  "upperItemTypeId": "string",
  "connectionTypeId": "string",
  "lowerItemTypeId": "string",
  "maxConnectionsToUpper": 1,
  "maxConnectionsToLower": 1,
  "validationExpression": "string"
}
```

<h3 id="put__rest_connectionrule_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[#/paths/~1rest~1connectionrule/post/responses/201/content/application~1json/schema](#schema#/paths/~1rest~1connectionrule/post/responses/201/content/application~1json/schema)|true|Updated connection rule|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "upperItemTypeId": "string",
  "connectionTypeId": "string",
  "lowerItemTypeId": "string",
  "maxConnectionsToUpper": 1,
  "maxConnectionsToLower": 1,
  "validationExpression": "string"
}
```

<h3 id="put__rest_connectionrule_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|304|[Not Modified](https://tools.ietf.org/html/rfc7232#section-4.1)|nothing changed|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|conflict with existing entities|Inline|
|415|[Unsupported Media Type](https://tools.ietf.org/html/rfc7231#section-6.5.13)|unsupported media type|string|
|default|Default|Server error|Inline|

<h3 id="put__rest_connectionrule_{id}-responseschema">Response Schema</h3>

Status Code **200**

*A connection rule object. It allows connections between items of two different types.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|A connection rule object for creating. It allows connections between items of two different types.|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **409**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete__rest_connectionrule_{id}

`DELETE /rest/connectionrule/{id}`

*Delete the connection rule*

<h3 id="delete__rest_connectionrule_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "upperItemTypeId": "string",
  "connectionTypeId": "string",
  "lowerItemTypeId": "string",
  "maxConnectionsToUpper": 1,
  "maxConnectionsToLower": 1,
  "validationExpression": "string"
}
```

<h3 id="delete__rest_connectionrule_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="delete__rest_connectionrule_{id}-responseschema">Response Schema</h3>

Status Code **200**

*A connection rule object. It allows connections between items of two different types.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|A connection rule object for creating. It allows connections between items of two different types.|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_connectionrule_{id}_candelete

`GET /rest/connectionrule/{id}/candelete`

*Check, if the given connection rule can be deleted (i. e. is not used in any other context)*

<h3 id="get__rest_connectionrule_{id}_candelete-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```
"true"
```

> 400 Response

```json
{
  "message": "string",
  "data": {
    "errors": [
      {
        "value": "string",
        "msg": "string",
        "param": "string",
        "location": "body"
      }
    ]
  }
}
```

<h3 id="get__rest_connectionrule_{id}_candelete-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|string|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_connectionrule_{id}_candelete-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_connectionrule_{id}_connections_count

`GET /rest/connectionrule/{id}/connections/count`

*Returns the number of existing connections of the given connection rule*

<h3 id="get__rest_connectionrule_{id}_connections_count-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```
0
```

> 400 Response

```json
{
  "message": "string",
  "data": {
    "errors": [
      {
        "value": "string",
        "msg": "string",
        "param": "string",
        "location": "body"
      }
    ]
  }
}
```

<h3 id="get__rest_connectionrule_{id}_connections_count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|integer|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_connectionrule_{id}_connections_count-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_connectionrule_upperItemType_{upperId}_connectionType_{connectionType}_lowerItemType_{lowerId}

`GET /rest/connectionrule/upperItemType/{upperId}/connectionType/{connectionType}/lowerItemType/{lowerId}`

*Returns a single connection rule defined by its unique content.*

<h3 id="get__rest_connectionrule_upperitemtype_{upperid}_connectiontype_{connectiontype}_loweritemtype_{lowerid}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|upperId|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the upper item or item type|
|connectionType|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the connection type|
|lowerId|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the lower item or item type|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "upperItemTypeId": "string",
    "connectionTypeId": "string",
    "lowerItemTypeId": "string",
    "maxConnectionsToUpper": 1,
    "maxConnectionsToLower": 1,
    "validationExpression": "string"
  }
]
```

<h3 id="get__rest_connectionrule_upperitemtype_{upperid}_connectiontype_{connectiontype}_loweritemtype_{lowerid}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_connectionrule_upperitemtype_{upperid}_connectiontype_{connectiontype}_loweritemtype_{lowerid}-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_connectionrules

`GET /rest/connectionrules`

*Return all connection rule objects as an array*

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "upperItemTypeId": "string",
    "connectionTypeId": "string",
    "lowerItemTypeId": "string",
    "maxConnectionsToUpper": 1,
    "maxConnectionsToLower": 1,
    "validationExpression": "string"
  }
]
```

<h3 id="get__rest_connectionrules-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_connectionrules-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_connectionrules_forItemType_{id}

`GET /rest/connectionrules/forItemType/{id}`

*Return all connection rule objects that belong to the given item type in any position as an array*

<h3 id="get__rest_connectionrules_foritemtype_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "upperItemTypeId": "string",
    "connectionTypeId": "string",
    "lowerItemTypeId": "string",
    "maxConnectionsToUpper": 1,
    "maxConnectionsToLower": 1,
    "validationExpression": "string"
  }
]
```

<h3 id="get__rest_connectionrules_foritemtype_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_connectionrules_foritemtype_{id}-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_connectionrules_forUpperItemType_{upperId}_forLowerItemType_{lowerId}

`GET /rest/connectionrules/forUpperItemType/{upperId}/forLowerItemType/{lowerId}`

*Returns all connection rules that exists between two item types as an array*

<h3 id="get__rest_connectionrules_forupperitemtype_{upperid}_forloweritemtype_{lowerid}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|upperId|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the upper item or item type|
|lowerId|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the lower item or item type|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "upperItemTypeId": "string",
    "connectionTypeId": "string",
    "lowerItemTypeId": "string",
    "maxConnectionsToUpper": 1,
    "maxConnectionsToLower": 1,
    "validationExpression": "string"
  }
]
```

<h3 id="get__rest_connectionrules_forupperitemtype_{upperid}_forloweritemtype_{lowerid}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_connectionrules_forupperitemtype_{upperid}_forloweritemtype_{lowerid}-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_connectionrules_forUpperItemType_{upperId}

`GET /rest/connectionrules/forUpperItemType/{upperId}`

*Returns all connection rules that contain the given upper item type*

<h3 id="get__rest_connectionrules_forupperitemtype_{upperid}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|upperId|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the upper item or item type|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "upperItemTypeId": "string",
    "connectionTypeId": "string",
    "lowerItemTypeId": "string",
    "maxConnectionsToUpper": 1,
    "maxConnectionsToLower": 1,
    "validationExpression": "string"
  }
]
```

<h3 id="get__rest_connectionrules_forupperitemtype_{upperid}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_connectionrules_forupperitemtype_{upperid}-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_connectionrules_forLowerItemType_{lowerId}

`GET /rest/connectionrules/forLowerItemType/{lowerId}`

*Returns all connection rules that that contain the given lower item type*

<h3 id="get__rest_connectionrules_forloweritemtype_{lowerid}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|lowerId|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the lower item or item type|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "upperItemTypeId": "string",
    "connectionTypeId": "string",
    "lowerItemTypeId": "string",
    "maxConnectionsToUpper": 1,
    "maxConnectionsToLower": 1,
    "validationExpression": "string"
  }
]
```

<h3 id="get__rest_connectionrules_forloweritemtype_{lowerid}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_connectionrules_forloweritemtype_{lowerid}-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_metaData

`GET /rest/metaData`

*Return all meta data objects in one huge object, for performance reasons*

> Example responses

> 200 Response

```json
{
  "attributeGroups": [
    {
      "id": "string",
      "name": "string"
    }
  ],
  "attributeTypes": [
    {
      "id": "string",
      "name": "string",
      "attributeGroupId": "string",
      "validationExpression": "string",
      "attributeGroupName": "string"
    }
  ],
  "connectionTypes": [
    {
      "id": "string",
      "name": "string",
      "reverseName": "string"
    }
  ],
  "itemTypes": [
    {
      "id": "string",
      "name": "string",
      "backColor": "string",
      "attributeGroups": [
        {
          "id": "string",
          "name": "string"
        }
      ]
    }
  ],
  "connectionRules": [
    {
      "id": "string",
      "upperItemTypeId": "string",
      "connectionTypeId": "string",
      "lowerItemTypeId": "string",
      "maxConnectionsToUpper": 1,
      "maxConnectionsToLower": 1,
      "validationExpression": "string"
    }
  ],
  "userRole": 0,
  "userName": "string"
}
```

<h3 id="get__rest_metadata-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_metadata-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» attributeGroups|[allOf]|false|none|[An attribute group object that handles multiple attribute types.]|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|object|false|none|An attribute group object that handles multiple attribute types, without id, for creating.|
|»»» name|string|true|none|Unique name of the attribute group|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» attributeTypes|[allOf]|false|none|none|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|object|false|none|none|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» connectionTypes|[allOf]|false|none|none|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» itemTypes|[allOf]|false|none|none|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» connectionRules|[allOf]|false|none|none|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» userRole|number|false|none|User role: 0 - Reader, 1 - Editor, 2 - Administrator|
|» userName|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|userRole|0|
|userRole|1|
|userRole|2|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__rest_user

`POST /rest/user`

*Create credential*

> Body parameter

```json
{
  "accountName": "string",
  "role": 0,
  "passphrase": "string"
}
```

<h3 id="post__rest_user-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[#/paths/~1rest~1user/post/requestBody/content/application~1json/schema](#schema#/paths/~1rest~1user/post/requestbody/content/application~1json/schema)|true|Data for the new user|

> Example responses

> 201 Response

```json
{
  "accountName": "string",
  "role": 0,
  "roleName": "Reader"
}
```

<h3 id="post__rest_user-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Created|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|415|[Unsupported Media Type](https://tools.ietf.org/html/rfc7231#section-6.5.13)|unsupported media type|string|
|default|Default|Server error|Inline|

<h3 id="post__rest_user-responseschema">Response Schema</h3>

Status Code **201**

*Object with data about a user*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## put__rest_user

`PUT /rest/user`

*Update credential*

> Body parameter

```json
{
  "accountName": "string",
  "role": 0,
  "passphrase": "string"
}
```

<h3 id="put__rest_user-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[#/paths/~1rest~1user/post/requestBody/content/application~1json/schema](#schema#/paths/~1rest~1user/post/requestbody/content/application~1json/schema)|true|Updated user data|

> Example responses

> 200 Response

```json
{
  "accountName": "string",
  "role": 0,
  "roleName": "Reader"
}
```

<h3 id="put__rest_user-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|415|[Unsupported Media Type](https://tools.ietf.org/html/rfc7231#section-6.5.13)|unsupported media type|string|
|default|Default|Server error|Inline|

<h3 id="put__rest_user-responseschema">Response Schema</h3>

Status Code **200**

*Object with data about a user*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_user_current

`GET /rest/user/current`

*Returns information about the user currently authenticated*

> Example responses

> 200 Response

```json
{
  "accountName": "string",
  "role": 0,
  "roleName": "Reader"
}
```

<h3 id="get__rest_user_current-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_user_current-responseschema">Response Schema</h3>

Status Code **200**

*Object with data about a user*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_user_role

`GET /rest/user/role`

*Returns the role of the currently authenticated user*

> Example responses

> 200 Response

```json
0
```

<h3 id="get__rest_user_role-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|number|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_user_role-responseschema">Response Schema</h3>

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_users

`GET /rest/users`

*Returns all users as an array*

> Example responses

> 200 Response

```json
[
  {
    "accountName": "string",
    "role": 0,
    "roleName": "Reader"
  }
]
```

<h3 id="get__rest_users-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_users-responseschema">Response Schema</h3>

Status Code **200**

*Array of user info objects*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_users_search_{text}

`GET /rest/users/search/{text}`

*Returns a list of users where the account name matches a part of the given text.*

<h3 id="get__rest_users_search_{text}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|text|path|string|true|search text|

> Example responses

> 200 Response

```json
[
  {
    "accountName": "string",
    "role": 0,
    "roleName": "Reader"
  }
]
```

<h3 id="get__rest_users_search_{text}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|415|[Unsupported Media Type](https://tools.ietf.org/html/rfc7231#section-6.5.13)|unsupported media type|string|
|default|Default|Server error|Inline|

<h3 id="get__rest_users_search_{text}-responseschema">Response Schema</h3>

Status Code **200**

*Array of user info objects*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__rest_configurationItem

`POST /rest/configurationItem`

*Create a new Configuration item*

> Body parameter

```json
{
  "name": "string",
  "typeId": "string",
  "attributes": [
    {
      "typeId": "string",
      "value": "string"
    }
  ],
  "links": [
    {
      "uri": "string",
      "description": "string"
    }
  ],
  "users": [
    "string"
  ]
}
```

<h3 id="post__rest_configurationitem-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|Data for the new configuration item|
|» name|body|string|true|Name of the configuration item|
|» links|body|[object]|false|Links to external websites for the item|
|»» uri|body|string(url)|false|Url of the link, must be http or https|
|»» description|body|string|false|Description|
|» users|body|[string]|false|List of the users that are responsible for the item, i.e. are able to change it|

> Example responses

> 201 Response

```json
{
  "id": "string",
  "name": "string",
  "typeId": "string",
  "attributes": [
    {
      "typeId": "string",
      "value": "string"
    }
  ],
  "links": [
    {
      "uri": "string",
      "description": "string"
    }
  ],
  "users": [
    "string"
  ]
}
```

<h3 id="post__rest_configurationitem-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Created|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|415|[Unsupported Media Type](https://tools.ietf.org/html/rfc7231#section-6.5.13)|unsupported media type|string|
|default|Default|Server error|Inline|

<h3 id="post__rest_configurationitem-responseschema">Response Schema</h3>

Status Code **201**

*A configuration item object*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|A configuration item object for creating.|
|»» name|string|true|none|Name of the configuration item|
|»» links|[object]|false|none|Links to external websites for the item|
|»»» uri|string(url)|false|none|Url of the link, must be http or https|
|»»» description|string|false|none|Description|
|»» users|[string]|false|none|List of the users that are responsible for the item, i.e. are able to change it|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__rest_configurationItem_full

`POST /rest/configurationItem/full`

*Create a new Configuration item with connections*

> Body parameter

```json
{
  "name": "string",
  "typeId": "string",
  "attributes": [
    {
      "typeId": "string",
      "value": "string"
    }
  ],
  "links": [
    {
      "uri": "string",
      "description": "string"
    }
  ],
  "users": [
    "string"
  ],
  "connectionsToUpper": [
    {
      "ruleId": "string",
      "typeId": "string",
      "targetId": "string",
      "description": "string"
    }
  ],
  "connectionsToLower": [
    {
      "ruleId": "string",
      "typeId": "string",
      "targetId": "string",
      "description": "string"
    }
  ]
}
```

<h3 id="post__rest_configurationitem_full-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|Data for the new configuration item|
|» name|body|string|true|Name of the configuration item, unique for each item type|
|» links|body|[object]|false|Links to external websites for the item|
|» users|body|[string]|false|List of the users that are responsible for the item, i.e. are able to change it|
|» connectionsToUpper|body|[object]|false|Data for full connections to create|
|» connectionsToLower|body|[object]|false|Data for full connections to create|

> Example responses

> 201 Response

```json
{
  "id": "string",
  "name": "string",
  "typeId": "string",
  "attributes": [
    {
      "typeId": "string",
      "value": "string"
    }
  ],
  "links": [
    {
      "uri": "string",
      "description": "string"
    }
  ],
  "users": [
    "string"
  ],
  "connectionsToLower": [
    {
      "id": "string",
      "ruleId": "string",
      "typeId": "string",
      "type": "string",
      "targetId": "string",
      "targetTypeId": "string",
      "targetName": "string",
      "targetColor": "string",
      "description": "string"
    }
  ],
  "connectionsToUpper": [
    {
      "id": "string",
      "ruleId": "string",
      "typeId": "string",
      "type": "string",
      "targetId": "string",
      "targetTypeId": "string",
      "targetName": "string",
      "targetColor": "string",
      "description": "string"
    }
  ]
}
```

<h3 id="post__rest_configurationitem_full-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Created|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|415|[Unsupported Media Type](https://tools.ietf.org/html/rfc7231#section-6.5.13)|unsupported media type|string|
|default|Default|Server error|Inline|

<h3 id="post__rest_configurationitem_full-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_configurationItem_{id}

`GET /rest/configurationItem/{id}`

*Get a single configuration item by id*

<h3 id="get__rest_configurationitem_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "name": "string",
  "typeId": "string",
  "attributes": [
    {
      "typeId": "string",
      "value": "string"
    }
  ],
  "links": [
    {
      "uri": "string",
      "description": "string"
    }
  ],
  "users": [
    "string"
  ]
}
```

<h3 id="get__rest_configurationitem_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_configurationitem_{id}-responseschema">Response Schema</h3>

Status Code **200**

*A configuration item object*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|A configuration item object for creating.|
|»» name|string|true|none|Name of the configuration item|
|»» links|[object]|false|none|Links to external websites for the item|
|»»» uri|string(url)|false|none|Url of the link, must be http or https|
|»»» description|string|false|none|Description|
|»» users|[string]|false|none|List of the users that are responsible for the item, i.e. are able to change it|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## put__rest_configurationItem_{id}

`PUT /rest/configurationItem/{id}`

*Update the configuration item*

> Body parameter

```json
{
  "id": "string",
  "name": "string",
  "typeId": "string",
  "attributes": [
    {
      "typeId": "string",
      "value": "string"
    }
  ],
  "links": [
    {
      "uri": "string",
      "description": "string"
    }
  ],
  "users": [
    "string"
  ]
}
```

<h3 id="put__rest_configurationitem_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[#/paths/~1rest~1configurationItem/post/responses/201/content/application~1json/schema](#schema#/paths/~1rest~1configurationitem/post/responses/201/content/application~1json/schema)|true|Updated configuration item|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "name": "string",
  "typeId": "string",
  "attributes": [
    {
      "typeId": "string",
      "value": "string"
    }
  ],
  "links": [
    {
      "uri": "string",
      "description": "string"
    }
  ],
  "users": [
    "string"
  ]
}
```

<h3 id="put__rest_configurationitem_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|304|[Not Modified](https://tools.ietf.org/html/rfc7232#section-4.1)|nothing changed|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|415|[Unsupported Media Type](https://tools.ietf.org/html/rfc7231#section-6.5.13)|unsupported media type|string|
|default|Default|Server error|Inline|

<h3 id="put__rest_configurationitem_{id}-responseschema">Response Schema</h3>

Status Code **200**

*A configuration item object*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|A configuration item object for creating.|
|»» name|string|true|none|Name of the configuration item|
|»» links|[object]|false|none|Links to external websites for the item|
|»»» uri|string(url)|false|none|Url of the link, must be http or https|
|»»» description|string|false|none|Description|
|»» users|[string]|false|none|List of the users that are responsible for the item, i.e. are able to change it|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete__rest_configurationItem_{id}

`DELETE /rest/configurationItem/{id}`

*Delete the configuration item type*

<h3 id="delete__rest_configurationitem_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "name": "string",
  "typeId": "string",
  "attributes": [
    {
      "typeId": "string",
      "value": "string"
    }
  ],
  "links": [
    {
      "uri": "string",
      "description": "string"
    }
  ],
  "users": [
    "string"
  ]
}
```

<h3 id="delete__rest_configurationitem_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="delete__rest_configurationitem_{id}-responseschema">Response Schema</h3>

Status Code **200**

*A configuration item object*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|A configuration item object for creating.|
|»» name|string|true|none|Name of the configuration item|
|»» links|[object]|false|none|Links to external websites for the item|
|»»» uri|string(url)|false|none|Url of the link, must be http or https|
|»»» description|string|false|none|Description|
|»» users|[string]|false|none|List of the users that are responsible for the item, i.e. are able to change it|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__rest_configurationItem_{id}_Search

`POST /rest/configurationItem/{id}/Search`

*Search for specific items along connections, beginning at the given configuration item type*

> Body parameter

```json
{
  "itemTypeId": "string",
  "maxLevels": 1,
  "searchDirection": "up",
  "extraSearch": {
    "nameOrValue": "string",
    "itemTypeId": "string",
    "attributes": [
      {
        "typeId": "string",
        "value": "string"
      }
    ],
    "connectionsToUpper": [
      {
        "connectionTypeId": "string",
        "itemTypeId": "string",
        "count": "0"
      }
    ],
    "connectionsToLower": [
      {
        "connectionTypeId": "string",
        "itemTypeId": "string",
        "count": "0"
      }
    ],
    "changedAfter": "2019-08-24",
    "changedBefore": "2019-08-24",
    "responsibleUser": "string"
  }
}
```

<h3 id="post__rest_configurationitem_{id}_search-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|
|body|body|object|true|Content for the search criteria|
|»» connectionsToUpper|body|[object]|false|Array of connection criteria to search for.|
|»» connectionsToLower|body|[object]|false|Array of connection criteria to search for.|

> Example responses

> 200 Response

```json
[
  {
    "level": 10,
    "path": "string",
    "direction": -1,
    "id": {
      "id": "string"
    },
    "item": {
      "id": "string",
      "name": "string",
      "typeId": "string",
      "attributes": [
        {
          "typeId": "string",
          "value": "string"
        }
      ],
      "links": [
        {
          "uri": "string",
          "description": "string"
        }
      ],
      "users": [
        "string"
      ]
    },
    "fullItem": {
      "id": "string",
      "name": "string",
      "typeId": "string",
      "attributes": [
        {
          "typeId": "string",
          "value": "string"
        }
      ],
      "links": [
        {
          "uri": "string",
          "description": "string"
        }
      ],
      "users": [
        "string"
      ],
      "connectionsToLower": [
        {
          "id": "string",
          "ruleId": "string",
          "typeId": "string",
          "type": "string",
          "targetId": "string",
          "targetTypeId": "string",
          "targetName": "string",
          "targetColor": "string",
          "description": "string"
        }
      ],
      "connectionsToUpper": [
        {
          "id": "string",
          "ruleId": "string",
          "typeId": "string",
          "type": "string",
          "targetId": "string",
          "targetTypeId": "string",
          "targetName": "string",
          "targetColor": "string",
          "description": "string"
        }
      ]
    }
  }
]
```

<h3 id="post__rest_configurationitem_{id}_search-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|415|[Unsupported Media Type](https://tools.ietf.org/html/rfc7231#section-6.5.13)|unsupported media type|string|
|default|Default|Server error|Inline|

<h3 id="post__rest_configurationitem_{id}_search-responseschema">Response Schema</h3>

Status Code **200**

*Array with an object of items that were found.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» level|integer|true|none|Levels apart from the origin item|
|» path|string|true|none|Path from the origin item that leads to this item|
|» direction|integer|true|none|Direction, in which the path was created. -1 = up, 0 = both, 1 = down|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»» links|[object]|false|none|Links to external websites for the item|
|»»»» uri|string(url)|false|none|Url of the link, must be http or https|
|»»»» description|string|false|none|Description|
|»»» users|[string]|false|none|List of the users that are responsible for the item, i.e. are able to change it|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» fullItem|any|true|none|none|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»» connectionsToUpper|[[#/paths/~1rest~1configurationItem~1%7Bid%7D~1Search/post/responses/200/content/application~1json/schema/items/properties/fullItem/allOf/1/properties/connectionsToLower/items](#schema#/paths/~1rest~1configurationitem~1%7bid%7d~1search/post/responses/200/content/application~1json/schema/items/properties/fullitem/allof/1/properties/connectionstolower/items)]|false|none|Array of full connections|

#### Enumerated Values

|Property|Value|
|---|---|
|direction|-1|
|direction|0|
|direction|1|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_configurationItem_{id}_full

`GET /rest/configurationItem/{id}/full`

*Get a configuration item with connections by id*

<h3 id="get__rest_configurationitem_{id}_full-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "name": "string",
  "typeId": "string",
  "attributes": [
    {
      "typeId": "string",
      "value": "string"
    }
  ],
  "links": [
    {
      "uri": "string",
      "description": "string"
    }
  ],
  "users": [
    "string"
  ],
  "connectionsToLower": [
    {
      "id": "string",
      "ruleId": "string",
      "typeId": "string",
      "type": "string",
      "targetId": "string",
      "targetTypeId": "string",
      "targetName": "string",
      "targetColor": "string",
      "description": "string"
    }
  ],
  "connectionsToUpper": [
    {
      "id": "string",
      "ruleId": "string",
      "typeId": "string",
      "type": "string",
      "targetId": "string",
      "targetTypeId": "string",
      "targetName": "string",
      "targetColor": "string",
      "description": "string"
    }
  ]
}
```

<h3 id="get__rest_configurationitem_{id}_full-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_configurationitem_{id}_full-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_configurationItem_{id}_history

`GET /rest/configurationItem/{id}/history`

*Get a configuration item's history by id, even for deleted items*

<h3 id="get__rest_configurationitem_{id}_history-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
{
  "item": {
    "id": "string",
    "typeId": "string",
    "type": "string",
    "lastChange": "2019-08-24",
    "changedBy": "string",
    "deleted": true,
    "oldVersions": [
      {
        "name": "string",
        "type": "string",
        "changedAt": "2019-08-24",
        "attributes": [
          {
            "typeId": "string",
            "type": "string",
            "value": "string"
          }
        ],
        "links": [
          {
            "uri": "string",
            "description": "string"
          }
        ]
      }
    ]
  },
  "connectionsToLower": [
    {
      "id": "string",
      "ruleId": "string",
      "typeId": "string",
      "typeName": "string",
      "reverseName": "string",
      "upperItemId": "string",
      "lowerItemId": "string",
      "lastChange": "2019-08-24",
      "deleted": true,
      "descriptions": [
        "string"
      ]
    }
  ],
  "connectionsToUpper": [
    {
      "id": "string",
      "ruleId": "string",
      "typeId": "string",
      "typeName": "string",
      "reverseName": "string",
      "upperItemId": "string",
      "lowerItemId": "string",
      "lastChange": "2019-08-24",
      "descriptions": [
        "string"
      ]
    }
  ]
}
```

<h3 id="get__rest_configurationitem_{id}_history-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_configurationitem_{id}_history-responseschema">Response Schema</h3>

Status Code **200**

*An object representing all historic states of a configuration item*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» item|object|false|none|none|
|»»» links|[object]|false|none|Array with hyperlinks.|
|»»»» uri|string(url)|false|none|Url of the link, must be http or https|
|» connectionsToLower|[object]|false|none|Array of objects with historic connections that belonged to the item as upper item.|
|» connectionsToUpper|[object]|false|none|Array of objects with historic connections that belonged to the item as lower item.|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_configurationitem_type_{itemTypeId}_name_{name}

`GET /rest/configurationitem/type/{itemTypeId}/name/{name}`

*Returns an item that matches the given item type and name.*

<h3 id="get__rest_configurationitem_type_{itemtypeid}_name_{name}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|itemTypeId|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of an item type|
|name|path|string|true|name of an item or type|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "name": "string",
  "typeId": "string",
  "attributes": [
    {
      "typeId": "string",
      "value": "string"
    }
  ],
  "links": [
    {
      "uri": "string",
      "description": "string"
    }
  ],
  "users": [
    "string"
  ]
}
```

<h3 id="get__rest_configurationitem_type_{itemtypeid}_name_{name}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_configurationitem_type_{itemtypeid}_name_{name}-responseschema">Response Schema</h3>

Status Code **200**

*A configuration item object*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|A configuration item object for creating.|
|»» name|string|true|none|Name of the configuration item|
|»» links|[object]|false|none|Links to external websites for the item|
|»»» uri|string(url)|false|none|Url of the link, must be http or https|
|»»» description|string|false|none|Description|
|»» users|[string]|false|none|List of the users that are responsible for the item, i.e. are able to change it|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__rest_configurationItem_{id}_responsibility

`POST /rest/configurationItem/{id}/responsibility`

*Take responsibility for the item.*

<h3 id="post__rest_configurationitem_{id}_responsibility-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "name": "string",
  "typeId": "string",
  "attributes": [
    {
      "typeId": "string",
      "value": "string"
    }
  ],
  "links": [
    {
      "uri": "string",
      "description": "string"
    }
  ],
  "users": [
    "string"
  ]
}
```

<h3 id="post__rest_configurationitem_{id}_responsibility-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|304|[Not Modified](https://tools.ietf.org/html/rfc7232#section-4.1)|nothing changed|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="post__rest_configurationitem_{id}_responsibility-responseschema">Response Schema</h3>

Status Code **200**

*A configuration item object*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|A configuration item object for creating.|
|»» name|string|true|none|Name of the configuration item|
|»» links|[object]|false|none|Links to external websites for the item|
|»»» uri|string(url)|false|none|Url of the link, must be http or https|
|»»» description|string|false|none|Description|
|»» users|[string]|false|none|List of the users that are responsible for the item, i.e. are able to change it|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete__rest_configurationItem_{id}_responsibility

`DELETE /rest/configurationItem/{id}/responsibility`

*Abandon responsibility for the item.*

<h3 id="delete__rest_configurationitem_{id}_responsibility-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "name": "string",
  "typeId": "string",
  "attributes": [
    {
      "typeId": "string",
      "value": "string"
    }
  ],
  "links": [
    {
      "uri": "string",
      "description": "string"
    }
  ],
  "users": [
    "string"
  ]
}
```

<h3 id="delete__rest_configurationitem_{id}_responsibility-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|304|[Not Modified](https://tools.ietf.org/html/rfc7232#section-4.1)|nothing changed|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="delete__rest_configurationitem_{id}_responsibility-responseschema">Response Schema</h3>

Status Code **200**

*A configuration item object*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|A configuration item object for creating.|
|»» name|string|true|none|Name of the configuration item|
|»» links|[object]|false|none|Links to external websites for the item|
|»»» uri|string(url)|false|none|Url of the link, must be http or https|
|»»» description|string|false|none|Description|
|»» users|[string]|false|none|List of the users that are responsible for the item, i.e. are able to change it|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_configurationItem_{id}_connections

`GET /rest/configurationItem/{id}/connections`

*Get a configuration item's connections*

<h3 id="get__rest_configurationitem_{id}_connections-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "typeId": {
      "id": "string"
    },
    "ruleId": {
      "id": "string"
    },
    "upperItem": {
      "id": "string"
    },
    "lowerItem": {
      "id": "string"
    },
    "description": "string"
  }
]
```

<h3 id="get__rest_configurationitem_{id}_connections-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_configurationitem_{id}_connections-responseschema">Response Schema</h3>

Status Code **200**

*Array with connection objects belonging to the given item*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_configurationItem_{id}_connections_toUpper

`GET /rest/configurationItem/{id}/connections/toUpper`

*Get a configuration item's connections to items above the current*

<h3 id="get__rest_configurationitem_{id}_connections_toupper-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "typeId": {
      "id": "string"
    },
    "ruleId": {
      "id": "string"
    },
    "upperItem": {
      "id": "string"
    },
    "lowerItem": {
      "id": "string"
    },
    "description": "string"
  }
]
```

<h3 id="get__rest_configurationitem_{id}_connections_toupper-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_configurationitem_{id}_connections_toupper-responseschema">Response Schema</h3>

Status Code **200**

*Array with connection objects belonging to the given item*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_configurationItem_{id}_connections_toLower

`GET /rest/configurationItem/{id}/connections/toLower`

*Get a configuration item's connections below the current item*

<h3 id="get__rest_configurationitem_{id}_connections_tolower-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "typeId": {
      "id": "string"
    },
    "ruleId": {
      "id": "string"
    },
    "upperItem": {
      "id": "string"
    },
    "lowerItem": {
      "id": "string"
    },
    "description": "string"
  }
]
```

<h3 id="get__rest_configurationitem_{id}_connections_tolower-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_configurationitem_{id}_connections_tolower-responseschema">Response Schema</h3>

Status Code **200**

*Array with connection objects belonging to the given item*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_configurationItems

`GET /rest/configurationItems`

*Get all configuration items*

<h3 id="get__rest_configurationitems-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|page|query|integer|false|Starting page for retrieving items, in portions of 1000 at max|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "typeId": "string",
      "attributes": [
        {
          "typeId": "string",
          "value": "string"
        }
      ],
      "links": [
        {
          "uri": "string",
          "description": "string"
        }
      ],
      "users": [
        "string"
      ]
    }
  ],
  "totalItems": 0
}
```

<h3 id="get__rest_configurationitems-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_configurationitems-responseschema">Response Schema</h3>

Status Code **200**

*Returns a portion of the whole number of configuration items.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[allOf]|false|none|Array with connection objects belonging to the given item|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|object|false|none|none|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|object|false|none|A configuration item object for creating.|
|»»» name|string|true|none|Name of the configuration item|
|»»» links|[object]|false|none|Links to external websites for the item|
|»»»» uri|string(url)|false|none|Url of the link, must be http or https|
|»»»» description|string|false|none|Description|
|»»» users|[string]|false|none|List of the users that are responsible for the item, i.e. are able to change it|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» totalItems|integer|false|none|Number of all items to be found. If it is greater than the count of the items array, then more pages can be retrieved.|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_configurationItems_full

`GET /rest/configurationItems/full`

*Get all configuration items*

<h3 id="get__rest_configurationitems_full-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|page|query|integer|false|Starting page for retrieving items, in portions of 1000 at max|

> Example responses

> 200 Response

```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "typeId": "string",
      "attributes": [
        {
          "typeId": "string",
          "value": "string"
        }
      ],
      "links": [
        {
          "uri": "string",
          "description": "string"
        }
      ],
      "users": [
        "string"
      ],
      "connectionsToLower": [
        {
          "id": "string",
          "ruleId": "string",
          "typeId": "string",
          "type": "string",
          "targetId": "string",
          "targetTypeId": "string",
          "targetName": "string",
          "targetColor": "string",
          "description": "string"
        }
      ],
      "connectionsToUpper": [
        {
          "id": "string",
          "ruleId": "string",
          "typeId": "string",
          "type": "string",
          "targetId": "string",
          "targetTypeId": "string",
          "targetName": "string",
          "targetColor": "string",
          "description": "string"
        }
      ]
    }
  ],
  "totalItems": 0
}
```

<h3 id="get__rest_configurationitems_full-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_configurationitems_full-responseschema">Response Schema</h3>

Status Code **200**

*Returns a portion of the whole number of configuration items with connections.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» items|[allOf]|false|none|Array with connection objects belonging to the given item|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|any|false|none|A configuration item object|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»» *anonymous*|object|false|none|none|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»»» *anonymous*|object|false|none|A configuration item object for creating.|
|»»»» name|string|true|none|Name of the configuration item|
|»»»» links|[object]|false|none|Links to external websites for the item|
|»»»»» uri|string(url)|false|none|Url of the link, must be http or https|
|»»»»» description|string|false|none|Description|
|»»»» users|[string]|false|none|List of the users that are responsible for the item, i.e. are able to change it|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|»» *anonymous*|object|false|none|none|
|»»» connectionsToLower|[[#/paths/~1rest~1configurationItems~1full/get/responses/200/content/application~1json/schema/properties/items/items/allOf/1/properties/connectionsToLower/items](#schema#/paths/~1rest~1configurationitems~1full/get/responses/200/content/application~1json/schema/properties/items/items/allof/1/properties/connectionstolower/items)]|false|none|Array of full connections|
|»»» connectionsToUpper|[[#/paths/~1rest~1configurationItems~1full/get/responses/200/content/application~1json/schema/properties/items/items/allOf/1/properties/connectionsToLower/items](#schema#/paths/~1rest~1configurationitems~1full/get/responses/200/content/application~1json/schema/properties/items/items/allof/1/properties/connectionstolower/items)]|false|none|Array of full connections|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» totalItems|integer|false|none|Number of all items to be found. If it is greater than the count of the items array, then more pages can be retrieved.|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_configurationitems_recent_{listcount}

`GET /rest/configurationitems/recent/{listcount}`

*Get the most recently changed configuration items with a maximum given in the parameter.*

<h3 id="get__rest_configurationitems_recent_{listcount}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|listcount|path|integer|true|Number of items expected.|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "string",
    "typeId": "string",
    "attributes": [
      {
        "typeId": "string",
        "value": "string"
      }
    ],
    "links": [
      {
        "uri": "string",
        "description": "string"
      }
    ],
    "users": [
      "string"
    ]
  }
]
```

<h3 id="get__rest_configurationitems_recent_{listcount}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_configurationitems_recent_{listcount}-responseschema">Response Schema</h3>

Status Code **200**

*List of configuration items that match the given criteria.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|A configuration item object for creating.|
|»» name|string|true|none|Name of the configuration item|
|»» links|[object]|false|none|Links to external websites for the item|
|»»» uri|string(url)|false|none|Url of the link, must be http or https|
|»»» description|string|false|none|Description|
|»» users|[string]|false|none|List of the users that are responsible for the item, i.e. are able to change it|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__rest_configurationitems_search

`POST /rest/configurationitems/search`

*performs a search for configuration items in the database and returns a list with results.*

> Body parameter

```json
{
  "nameOrValue": "string",
  "itemTypeId": "string",
  "attributes": [
    {
      "typeId": "string",
      "value": "string"
    }
  ],
  "connectionsToUpper": [
    {
      "connectionTypeId": "string",
      "itemTypeId": "string",
      "count": "0"
    }
  ],
  "connectionsToLower": [
    {
      "connectionTypeId": "string",
      "itemTypeId": "string",
      "count": "0"
    }
  ],
  "changedAfter": "2019-08-24",
  "changedBefore": "2019-08-24",
  "responsibleUser": "string"
}
```

<h3 id="post__rest_configurationitems_search-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[#/paths/~1rest~1configurationitems~1search/post/requestBody/content/application~1json/schema](#schema#/paths/~1rest~1configurationitems~1search/post/requestbody/content/application~1json/schema)|true|Search criteria to filter the list|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "string",
    "typeId": "string",
    "attributes": [
      {
        "typeId": "string",
        "value": "string"
      }
    ],
    "links": [
      {
        "uri": "string",
        "description": "string"
      }
    ],
    "users": [
      "string"
    ]
  }
]
```

<h3 id="post__rest_configurationitems_search-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|415|[Unsupported Media Type](https://tools.ietf.org/html/rfc7231#section-6.5.13)|unsupported media type|string|
|default|Default|Server error|Inline|

<h3 id="post__rest_configurationitems_search-responseschema">Response Schema</h3>

Status Code **200**

*List of configuration items that match the given criteria.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|A configuration item object for creating.|
|»» name|string|true|none|Name of the configuration item|
|»» links|[object]|false|none|Links to external websites for the item|
|»»» uri|string(url)|false|none|Url of the link, must be http or https|
|»»» description|string|false|none|Description|
|»» users|[string]|false|none|List of the users that are responsible for the item, i.e. are able to change it|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__rest_configurationitems_full_search

`POST /rest/configurationitems/full/search`

*performs a search for configuration items in the database and returns a list with results, including the connections.*

> Body parameter

```json
{
  "nameOrValue": "string",
  "itemTypeId": "string",
  "attributes": [
    {
      "typeId": "string",
      "value": "string"
    }
  ],
  "connectionsToUpper": [
    {
      "connectionTypeId": "string",
      "itemTypeId": "string",
      "count": "0"
    }
  ],
  "connectionsToLower": [
    {
      "connectionTypeId": "string",
      "itemTypeId": "string",
      "count": "0"
    }
  ],
  "changedAfter": "2019-08-24",
  "changedBefore": "2019-08-24",
  "responsibleUser": "string"
}
```

<h3 id="post__rest_configurationitems_full_search-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[#/paths/~1rest~1configurationitems~1search/post/requestBody/content/application~1json/schema](#schema#/paths/~1rest~1configurationitems~1search/post/requestbody/content/application~1json/schema)|true|Search criteria to filter the list|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "string",
    "typeId": "string",
    "attributes": [
      {
        "typeId": "string",
        "value": "string"
      }
    ],
    "links": [
      {
        "uri": "string",
        "description": "string"
      }
    ],
    "users": [
      "string"
    ]
  }
]
```

<h3 id="post__rest_configurationitems_full_search-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|415|[Unsupported Media Type](https://tools.ietf.org/html/rfc7231#section-6.5.13)|unsupported media type|string|
|default|Default|Server error|Inline|

<h3 id="post__rest_configurationitems_full_search-responseschema">Response Schema</h3>

Status Code **200**

*List of configuration items that match the given criteria.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|A configuration item object for creating.|
|»» name|string|true|none|Name of the configuration item|
|»» links|[object]|false|none|Links to external websites for the item|
|»»» uri|string(url)|false|none|Url of the link, must be http or https|
|»»» description|string|false|none|Description|
|»» users|[string]|false|none|List of the users that are responsible for the item, i.e. are able to change it|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_configurationitems_{idList}

`GET /rest/configurationitems/{idList}`

*Get all configurations items with the given ids. If an id cannot be found, no error is thrown.*

<h3 id="get__rest_configurationitems_{idlist}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|idList|path|string|true|Single mongo id or comma separated list of ids.|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "string",
    "typeId": "string",
    "attributes": [
      {
        "typeId": "string",
        "value": "string"
      }
    ],
    "links": [
      {
        "uri": "string",
        "description": "string"
      }
    ],
    "users": [
      "string"
    ]
  }
]
```

<h3 id="get__rest_configurationitems_{idlist}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_configurationitems_{idlist}-responseschema">Response Schema</h3>

Status Code **200**

*List of configuration items that match the given criteria.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|A configuration item object for creating.|
|»» name|string|true|none|Name of the configuration item|
|»» links|[object]|false|none|Links to external websites for the item|
|»»» uri|string(url)|false|none|Url of the link, must be http or https|
|»»» description|string|false|none|Description|
|»» users|[string]|false|none|List of the users that are responsible for the item, i.e. are able to change it|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_configurationitems_{idList}_full

`GET /rest/configurationitems/{idList}/full`

*Get all configurations items with their connections with the given ids. If an id cannot be found, no error is thrown.*

<h3 id="get__rest_configurationitems_{idlist}_full-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|idList|path|string|true|Single mongo id or comma separated list of ids.|

> Example responses

> 200 Response

```json
null
```

<h3 id="get__rest_configurationitems_{idlist}_full-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_configurationitems_{idlist}_full-responseschema">Response Schema</h3>

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_configurationitems_byTypes_{idList}

`GET /rest/configurationitems/byTypes/{idList}`

*Get all configurations items that belong to the given type(s).*

<h3 id="get__rest_configurationitems_bytypes_{idlist}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|idList|path|string|true|Single mongo id or comma separated list of ids.|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "string",
    "typeId": "string",
    "attributes": [
      {
        "typeId": "string",
        "value": "string"
      }
    ],
    "links": [
      {
        "uri": "string",
        "description": "string"
      }
    ],
    "users": [
      "string"
    ]
  }
]
```

<h3 id="get__rest_configurationitems_bytypes_{idlist}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_configurationitems_bytypes_{idlist}-responseschema">Response Schema</h3>

Status Code **200**

*List of configuration items that match the given criteria.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|A configuration item object for creating.|
|»» name|string|true|none|Name of the configuration item|
|»» links|[object]|false|none|Links to external websites for the item|
|»»» uri|string(url)|false|none|Url of the link, must be http or https|
|»»» description|string|false|none|Description|
|»» users|[string]|false|none|List of the users that are responsible for the item, i.e. are able to change it|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_configurationitems_byTypes_{idList}_full

`GET /rest/configurationitems/byTypes/{idList}/full`

*Get all configurations items with their connections, that belong to the given type(s).*

<h3 id="get__rest_configurationitems_bytypes_{idlist}_full-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|idList|path|string|true|Single mongo id or comma separated list of ids.|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "string",
    "typeId": "string",
    "attributes": [
      {
        "typeId": "string",
        "value": "string"
      }
    ],
    "links": [
      {
        "uri": "string",
        "description": "string"
      }
    ],
    "users": [
      "string"
    ]
  }
]
```

<h3 id="get__rest_configurationitems_bytypes_{idlist}_full-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_configurationitems_bytypes_{idlist}_full-responseschema">Response Schema</h3>

Status Code **200**

*List of configuration items that match the given criteria.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|A configuration item object for creating.|
|»» name|string|true|none|Name of the configuration item|
|»» links|[object]|false|none|Links to external websites for the item|
|»»» uri|string(url)|false|none|Url of the link, must be http or https|
|»»» description|string|false|none|Description|
|»» users|[string]|false|none|List of the users that are responsible for the item, i.e. are able to change it|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_configurationitems_available_{ruleId}_{count}

`GET /rest/configurationitems/available/{ruleId}/{count}`

*Returns configuration items that are not connected due to the given rule or whose connections count plus the given count doesn't exceed the allowed range.*

<h3 id="get__rest_configurationitems_available_{ruleid}_{count}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ruleId|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the connection rule|
|count|path|integer|true|Number of items to be connected to.|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "string",
    "typeId": "string",
    "attributes": [
      {
        "typeId": "string",
        "value": "string"
      }
    ],
    "links": [
      {
        "uri": "string",
        "description": "string"
      }
    ],
    "users": [
      "string"
    ]
  }
]
```

<h3 id="get__rest_configurationitems_available_{ruleid}_{count}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_configurationitems_available_{ruleid}_{count}-responseschema">Response Schema</h3>

Status Code **200**

*List of configuration items that match the given criteria.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|A configuration item object for creating.|
|»» name|string|true|none|Name of the configuration item|
|»» links|[object]|false|none|Links to external websites for the item|
|»»» uri|string(url)|false|none|Url of the link, must be http or https|
|»»» description|string|false|none|Description|
|»» users|[string]|false|none|List of the users that are responsible for the item, i.e. are able to change it|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_configurationitems_connectableAsLowerItem_rule_{ruleId}

`GET /rest/configurationitems/connectableAsLowerItem/rule/{ruleId}`

*Returns configuration items that are connectable as lower item for the given rule.*

That means, they are of the appropriate type and do have at least one free connection.

<h3 id="get__rest_configurationitems_connectableasloweritem_rule_{ruleid}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|ruleId|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the connection rule|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "string",
    "typeId": "string",
    "attributes": [
      {
        "typeId": "string",
        "value": "string"
      }
    ],
    "links": [
      {
        "uri": "string",
        "description": "string"
      }
    ],
    "users": [
      "string"
    ]
  }
]
```

<h3 id="get__rest_configurationitems_connectableasloweritem_rule_{ruleid}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_configurationitems_connectableasloweritem_rule_{ruleid}-responseschema">Response Schema</h3>

Status Code **200**

*List of configuration items that match the given criteria.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|A configuration item object for creating.|
|»» name|string|true|none|Name of the configuration item|
|»» links|[object]|false|none|Links to external websites for the item|
|»»» uri|string(url)|false|none|Url of the link, must be http or https|
|»»» description|string|false|none|Description|
|»» users|[string]|false|none|List of the users that are responsible for the item, i.e. are able to change it|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_configurationitems_connectableAsLowerItem_{id}_rule_{ruleId}

`GET /rest/configurationitems/connectableAsLowerItem/{id}/rule/{ruleId}`

*Returns configuration items that are connectable as lower item for the given configuration item and rule.*

That means, they are of the appropriate type, do have at least one free connection and are not already connected to the current item.

<h3 id="get__rest_configurationitems_connectableasloweritem_{id}_rule_{ruleid}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|
|ruleId|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the connection rule|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "string",
    "typeId": "string",
    "attributes": [
      {
        "typeId": "string",
        "value": "string"
      }
    ],
    "links": [
      {
        "uri": "string",
        "description": "string"
      }
    ],
    "users": [
      "string"
    ]
  }
]
```

<h3 id="get__rest_configurationitems_connectableasloweritem_{id}_rule_{ruleid}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_configurationitems_connectableasloweritem_{id}_rule_{ruleid}-responseschema">Response Schema</h3>

Status Code **200**

*List of configuration items that match the given criteria.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|A configuration item object for creating.|
|»» name|string|true|none|Name of the configuration item|
|»» links|[object]|false|none|Links to external websites for the item|
|»»» uri|string(url)|false|none|Url of the link, must be http or https|
|»»» description|string|false|none|Description|
|»» users|[string]|false|none|List of the users that are responsible for the item, i.e. are able to change it|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_configurationitems_connectableAsUpperItem_{id}_rule_{ruleId}

`GET /rest/configurationitems/connectableAsUpperItem/{id}/rule/{ruleId}`

*Returns configuration items that are connectable as upper item for the given configuration item and rule.*

That means, they are of the appropriate type, do have at least one free connection and are not already connected to the current item.

<h3 id="get__rest_configurationitems_connectableasupperitem_{id}_rule_{ruleid}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|
|ruleId|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the connection rule|

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "name": "string",
    "typeId": "string",
    "attributes": [
      {
        "typeId": "string",
        "value": "string"
      }
    ],
    "links": [
      {
        "uri": "string",
        "description": "string"
      }
    ],
    "users": [
      "string"
    ]
  }
]
```

<h3 id="get__rest_configurationitems_connectableasupperitem_{id}_rule_{ruleid}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_configurationitems_connectableasupperitem_{id}_rule_{ruleid}-responseschema">Response Schema</h3>

Status Code **200**

*List of configuration items that match the given criteria.*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|A configuration item object for creating.|
|»» name|string|true|none|Name of the configuration item|
|»» links|[object]|false|none|Links to external websites for the item|
|»»» uri|string(url)|false|none|Url of the link, must be http or https|
|»»» description|string|false|none|Description|
|»» users|[string]|false|none|List of the users that are responsible for the item, i.e. are able to change it|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__rest_connection

`POST /rest/connection`

*Create a new connection*

> Body parameter

```json
{
  "typeId": {
    "id": "string"
  },
  "ruleId": {
    "id": "string"
  },
  "upperItem": {
    "id": "string"
  },
  "lowerItem": {
    "id": "string"
  },
  "description": "string"
}
```

<h3 id="post__rest_connection-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|Data for the new connection|

> Example responses

> 201 Response

```json
{
  "id": "string",
  "typeId": {
    "id": "string"
  },
  "ruleId": {
    "id": "string"
  },
  "upperItem": {
    "id": "string"
  },
  "lowerItem": {
    "id": "string"
  },
  "description": "string"
}
```

<h3 id="post__rest_connection-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Created|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|415|[Unsupported Media Type](https://tools.ietf.org/html/rfc7231#section-6.5.13)|unsupported media type|string|
|default|Default|Server error|Inline|

<h3 id="post__rest_connection-responseschema">Response Schema</h3>

Status Code **201**

*A connection object, linking two configuration items together in a hierarchy*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_connection_{id}

`GET /rest/connection/{id}`

*Get a single connection by id*

<h3 id="get__rest_connection_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "typeId": {
    "id": "string"
  },
  "ruleId": {
    "id": "string"
  },
  "upperItem": {
    "id": "string"
  },
  "lowerItem": {
    "id": "string"
  },
  "description": "string"
}
```

<h3 id="get__rest_connection_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_connection_{id}-responseschema">Response Schema</h3>

Status Code **200**

*A connection object, linking two configuration items together in a hierarchy*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## delete__rest_connection_{id}

`DELETE /rest/connection/{id}`

*Delete the connection*

<h3 id="delete__rest_connection_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "typeId": {
    "id": "string"
  },
  "ruleId": {
    "id": "string"
  },
  "upperItem": {
    "id": "string"
  },
  "lowerItem": {
    "id": "string"
  },
  "description": "string"
}
```

<h3 id="delete__rest_connection_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|default|Default|Server error|Inline|

<h3 id="delete__rest_connection_{id}-responseschema">Response Schema</h3>

Status Code **200**

*A connection object, linking two configuration items together in a hierarchy*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## put__rest_connection_{id}_description

`PUT /rest/connection/{id}/description`

*Update the connection description*

> Body parameter

```json
{
  "description": "string"
}
```

<h3 id="put__rest_connection_{id}_description-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|[#/paths/~1rest~1attributegroup~1%7Bid%7D/parameters/0/schema](#schema#/paths/~1rest~1attributegroup~1%7bid%7d/parameters/0/schema)|true|Id of the object|
|body|body|object|true|Updated connection description|
|» description|body|string|false|Description|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "typeId": {
    "id": "string"
  },
  "ruleId": {
    "id": "string"
  },
  "upperItem": {
    "id": "string"
  },
  "lowerItem": {
    "id": "string"
  },
  "description": "string"
}
```

<h3 id="put__rest_connection_{id}_description-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|304|[Not Modified](https://tools.ietf.org/html/rfc7232#section-4.1)|nothing changed|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|415|[Unsupported Media Type](https://tools.ietf.org/html/rfc7231#section-6.5.13)|unsupported media type|string|
|default|Default|Server error|Inline|

<h3 id="put__rest_connection_{id}_description-responseschema">Response Schema</h3>

Status Code **200**

*A connection object, linking two configuration items together in a hierarchy*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## get__rest_connections

`GET /rest/connections`

*Return a portion of the whole number of connection objects as an array*

> Example responses

> 200 Response

```json
{
  "connections": [
    {
      "id": "string",
      "typeId": {
        "id": "string"
      },
      "ruleId": {
        "id": "string"
      },
      "upperItem": {
        "id": "string"
      },
      "lowerItem": {
        "id": "string"
      },
      "description": "string"
    }
  ],
  "totalConnections": 0
}
```

<h3 id="get__rest_connections-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|default|Default|Server error|Inline|

<h3 id="get__rest_connections-responseschema">Response Schema</h3>

Status Code **200**

*Object with connections*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» connections|[allOf]|true|none|Array of connection objects|

*allOf*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*and*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

*continued*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» totalConnections|number|true|none|Total number of connections in database|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## post__rest_import_convertFileToTable

`POST /rest/import/convertFileToTable`

*Uploads an XLSX or CSV file and converts it into a JSON structure*

> Body parameter

```yaml
workbook: string

```

<h3 id="post__rest_import_convertfiletotable-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|XLSX or CSV file with a workbook name|
|» workbook|body|string(binary)|false|none|

> Example responses

> 200 Response

```json
{
  "fileName": "string",
  "fileType": "string",
  "sheets": [
    {
      "name": "string",
      "lines": [
        [
          "string"
        ]
      ]
    }
  ]
}
```

<h3 id="post__rest_import_convertfiletotable-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|object not found|Inline|
|415|[Unsupported Media Type](https://tools.ietf.org/html/rfc7231#section-6.5.13)|unsupported media type|string|
|default|Default|Server error|Inline|

<h3 id="post__rest_import_convertfiletotable-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» fileName|string(filename)|false|none|none|
|» fileType|string|false|none|none|
|» sheets|[object]|false|none|none|
|»» name|string|false|none|none|
|»» lines|[array]|false|none|none|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **404**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

## put__rest_import_dataTable

`PUT /rest/import/dataTable`

*Imports objects from a table of data*

> Body parameter

```json
{
  "itemTypeId": "string",
  "columns": [
    {
      "targetType": "name",
      "targetId": "string"
    }
  ],
  "rows": [
    [
      "string"
    ]
  ]
}
```

<h3 id="put__rest_import_datatable-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|A table that has the column descriptions and cells with data|
|» rows|body|[array]|true|none|

> Example responses

> 200 Response

```json
[
  {
    "index": 1,
    "message": "string",
    "subject": "string",
    "details": "string",
    "severity": 0
  }
]
```

<h3 id="put__rest_import_datatable-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Bad request or validation errors occured|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|invalid username or password|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|not admin user|Inline|
|415|[Unsupported Media Type](https://tools.ietf.org/html/rfc7231#section-6.5.13)|unsupported media type|string|
|default|Default|Server error|Inline|

<h3 id="put__rest_import_datatable-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» index|integer(int64)|false|none|Line number|
|» message|string|false|none|Result of the action that was performed|
|» subject|string|false|none|Object that was used|
|» details|string|false|none|More information about the action|
|» severity|integer|false|none|Severity of the message: 0 = info, 1 = warning, 2 = error (line could not be imported completely), 3 = fatal (stopped import)|

#### Enumerated Values

|Property|Value|
|---|---|
|severity|0|
|severity|1|
|severity|2|
|severity|3|

Status Code **400**

*An error object that enumerates all validation errors*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» message|string|false|none|Main error message|
|» data|object|false|none|Detailed errors|
|»» errors|[object]|false|none|none|
|»»» value|string|false|none|Problematic value that was sent|
|»»» msg|string|false|none|Validation error message|
|»»» param|string|false|none|Parameter name with validation problem|
|»»» location|string|false|none|Location of the parameter|

#### Enumerated Values

|Property|Value|
|---|---|
|location|body|
|location|path|
|location|params|

Status Code **401**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **403**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **default**

*An error object with a message*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

