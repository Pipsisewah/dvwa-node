# How SSPP works in this example

- The `config` object is focused around the configuration of this page and should have nothing to do with users
- SSPP allows us to pollute the `config` object through the `user` object
- This happens because the `user` object goes through a deep merge which if given `__proto__` can change the default Object


## How Objects Work In Javascript

- Default Object - Contains all the default values of a standard Javascript Object
- Instance of Object - Contains all default values of a standard Javascript Object + any values set to this object

- When we attempt to read a field on an Instance of an Object and that field does not exist, Javascript will then check the Default Object to see if it has the field

- Default Object -> Prototype ('field-A':value, 'field-B':value)
- Instance Of Object -> ('field-C':value, Default Object Prototype)

## How The Attack Works In This Case

- Anything (field:value pairs) we send to [PUT]`/api/users/:username` will be appended to the `:username` User
- If we send a value that modifies the Prototype, we can cause Javascript to add a field to the Default Object
- Since `config.allowEval` is not explicitly set to `false` in the Object Instance, Javascript will find the field in the Default Object (Prototype) and use that (which is whatever we set)

## Attack Execution
1. [GET] `http://localhost:3000/sspp/admin` - Expect response `AllowEval not set!`
2. [PUT] `http://localhost:3000/sspp/api/users/__proto__` + Payload: `{"allowEval":true}` - Expect 201
3. [GET] `http://localhost:3000/sspp/admin` - Expect response `AllowEval IS set.  RCE could have been executed!`