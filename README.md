# moose (like_swagger)

Moose is a command-line tool that looks for YAML-formatted [Swagger](http://swagger.wordnik.com/) resource declarations, stitches them together, and outputs json resource files.

![The moose himself](http://aaronmccall.github.com/moose_like_swagger.js/docs/the_moose_himself.png)

## Example:
Let's say you have the following Javascript code in views.js.

```javascript
/*
$$$
---
swaggerMeta:
  name: user.json
  description: Operations for users
resourcePath: /user
basePath: url
swaggerVersion: 1.1-SHAPSHOT.121026
apiVersion: 0.1
apis:
$$$
*/
// USER resource
/*
  $$$
  - # begin API endppoint
    path: /user
    description: Create a user
    operations:
      - # create a user (createUser)
        parameters:
        -
          description:        Create instance of User
          dataType:           user
          required:           true
          valueTypeInternal:  models.user.User
          allowMultiple:      false
          paramType:          body
        httpMethod:           POST
        responseTypeInternal: models.user.User
        nickname:             createUser
        responseClass:        user
  $$$
  ## createUser ##
  API endpoint for creating a new user.
  Accepts express **req**uest and **res**ponse objects.
*/
exports.createUser = function (req, res) {
    users.create(req.body, respond(res))
}

/*
$$$
---
swaggerMeta:
  name: resources.json
  description: API resource definition
basePath: url
swaggerVersion: 1.1-SHAPSHOT.121026
apiVersion: 0.1
apis:

$$$
*/
```
Calling `moose -o spec views.js` will 

First.  extract the YAML data between the '$$$' delimiters. Creating a YAML multi-doc that looks like so: 

```yaml
    ---
    swaggerMeta:
      name: user.json
      description: Operations for users
    resourcePath: /user
    basePath: url
    swaggerVersion: 1.1-SHAPSHOT.121026
    apiVersion: 0.1
    apis:
      - # begin API endppoint
        path: /user
        description: Create a user
        operations:
          - # create a user (createUser)
            parameters:
            -
              description:        Create instance of User
              dataType:           user
              required:           true
              valueTypeInternal:  models.user.User
              allowMultiple:      false
              paramType:          body
            httpMethod:           POST
            responseTypeInternal: models.user.User
            nickname:             createUser
            responseClass:        user
    ---
    swaggerMeta:
      name: resources.json
      description: API resource definition
    basePath: url
    swaggerVersion: 1.1-SHAPSHOT.121026
    apiVersion: 0.1
    apis:
```

Second. Convert the YAML into two separate JSON documents in the `spec` folder

```javascript
// resources.json
{
  "basePath": "url",
  "swaggerVersion": "1.1-SHAPSHOT.121026",
  "apiVersion": 0.1,
  "apis": [
    {
      "path": "/user.{format}",
      "description": "Operations for users"
    }
  ]
}

// user.json
{
  "resourcePath": "/user",
  "basePath": "url",
  "swaggerVersion": "1.1-SHAPSHOT.121026",
  "apiVersion": 0.1,
  "apis": [
    {
      "path": "/user",
      "description": "Create user",
      "operations": [
        {
          "parameters": [
            {
              "description": "Create instance of User",
              "dataType": "user",
              "required": true,
              "valueTypeInternal": "models.user.User",
              "allowMultiple": false,
              "paramType": "body"
            }
          ],
          "httpMethod": "POST",
          "responseTypeInternal": "models.user.User",
          "nickname": "createUser",
          "responseClass": "user"
        }
      ]
    }
  ]
}
```