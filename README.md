# RPF

RBAC Permission Framework

Server permission framework.  Used for unifying RBAC systems with content delivery to clients.

## Overview

RPF abstracts the process of converting RBAC permission systems into usable structures to hydrate client components securely. This is most commonly done in frameworks like react, where securely updating the client 'view' can be done through api calls to hydrate the internal state of the aforementioned component.

RPF should be approached a more of a guide or paradigm to developing these systems, rather than a batteries-included solution.
We just provide the structures you need to easily facilitate this conversion process.

### What This Does

RPF contains code that enforces serialization and permission assignments to any data delivered to the client from the api.  In simpler terms, if used properly, ensures that the api only sends back data the client is allowed to see, in a type-safe format the client can operate on.

### Field Level Access

At the core of RPF is the idea of "field-level" access.  Essentially, each piece of data that can be rendered in some front end component can have access broken down into the basic CRUD operations - 

- Read: Is the user allowed to see the value?
- Create: If the value is currently `undefined`, can a user instantiate that value?
- Update: If the value **is not** `undefined`, can a user update that value?
- Delete: If the value **is not** `undefined`, can a user delete the value? 

Breaking access down into the CRUD operations significantly reduces the amount of actions that need to be defined, and can lead to a more data-driven approach instead of relying on developer defined actions.

A `Role` can then be assigned to have access to any of the above access operations.

We don't make any assumptions as to how this data is sourced / stored.  For small applications, you can most likely use a simple file that is stored on the server itself.  For more robust applications, or those needing realtime permission updates, it is recommended to store data in some kind of persistent storage such as a database.

You will be responsible for writing the code that sources the roles and their available access. The structure and access of this data will be discussed later in [Storing and Sourcing Permissions](##Storing and Sourcing Permissions)

### Data Flow

Functionally, RPF provides the structures needed to enforce permissions when delivering data from the api to the client.

Typically, you will follow this workflow when defining a new front-end component.  

1. Determine the structure of the data you will need to hydrate your component. This might look something like this - 
```
interface ContactCardModelDataData {
    firstName: string;
    lastName: string;
    phone: number;
    address: {
        street: string;
        city: string;
        state: string;
        zip: number;
    };
    isActive: boolean;
}
```
_Note: The model must be comprised of serializable data. If you want to use more complicated structures, you will need to transform that data post-reception on the server / client._

Additionally, if your component will need any additional arguments in order to get the necessary data for the above 
defined model, you should define a structure for that as well. This is optional.
```typescript
interface ContactCardModelDataArgs {
    userId: string;
}
```

2. Define a new class that extends the abstract `Model` class, providing the above defined structures as arguments. 
You can do this wherever you would like, as long as it is not in a component that will be delivered to the client.  

`Model` requires you to implement two methods, `fund` and `map`. Both methods receive the optional object received as arguments. (In our example, defined as `ContactCardModelDataArgs`). Both methods are _**optionally async**_.
- `fund`: This is where you should perform necessary data fetching (like getting the data from the database). Must return a `ModelValues` structure, which is a valid instance of the model view defined earlier.
- `map`: This is where you map the permissions onto the data structure itself. There are several helper methods to do this, which are explained later in [Mapping Roles](#Mapping Roles). Must return a `ModelPermissions` structure, which maps an array of permissions onto each property of the model view defined earlier.

```typescript
import { type Model } from 'rpf';

class ContactCardModel extends Model<ContactCardModelData, ContactCardModelDataArgs> {
   async fund({ userId }: ContactCardModelDataArgs): ModelValues<ContactCardModelData> {
    // Here you will define your actual operations to source the necessary data.
    // This should be all the data! Even if the user is not permitted to access a particular field, you should provide the operations to get this data from wherever it is stored.

    // This is a placeholder example, but imagine that the object returned from the database matches the ContactCardModelData structure exactly
    return await db.getUserData(userId);
   } 

   async map({ userId }: ContactCardModelData): ModelPermissions<ContactCardModelData> {
    // Here you will define how the permissions will map to each field of your defined view model.  
    // You can use some nifty helper methods to avoid writing a bunch of boilerplate

    const userRoles = await getUserRoles(userId);
    this.rolePermissions<ContactCardModelData>({
        firstName: this.roleMap(
            ['Admin', "CRUD"],
            ['User', "RU"],
        );
        lastName: this.roleMap(
            ['Admin', "CRUD"],
            ['User', "RU"],
        );
        phone: this.roleMap(
            ['Admin', "CRUD"],
            ['User', "RU"],
        );
        address: {
            street: this.roleMap(
                ['Admin', "CRUD"],
                ['User', "R"],
            );
            city: this.roleMap(
                ['Admin', "CRUD"],
                ['User', "R"],
            );
            state: this.roleMap(
                ['Admin', "CRUD"],
                ['User', "R"],
            );
            zip:  this.roleMap(
                ['Admin', "CRUD"],
                ['User', "R"],
            );        
        };
        isActive:  this.roleMap(
            ['Admin', "CRUD"],
            ['User', "R"],
        );
    })
    
    return this.getPermissions(userRoles)
   }
}
```
The above functions do the following - 
- `generatePermissions`: creates a valid ModelPermissions object based on a provided object.
- `roleMap`: Takes a provided role (like `Admin` or `User`) and a string that must only contain the letters "CRUD" or "crud". Returns 
2. In the api, under your `get` handler, you will pass the request body to the `Model.parse(json)` method, which will return an instance of `ViewModel`.
```
const json = req.body.json();
try {
    const model = Model<ContactCardModelData>.parse(json);
} catch (error) {
    // Model<T>.parse() will fail if the json does not parse correctly.  
    // This uses zod under the hood to validate the incoming request.
    // Upon failure, this will throw a ModelParseError, which can give you relevant information regarding the parsing failure.
    // You will then usually return a 400 error.
}
```

3. Upon successful parsing of the request body, you `fund` the model.
```
const json = req.body.json();
try {
    const model = Model<ContactCardModelData>.parse(json); // Returns an instance of ViewModel
    model.fund(); 
} catch (error) {
    // Upon failure, model.fund() throws a ModelFundError
}
```

4. Return the model in your response object.  You can nest this structure with other data, but ensure you properly unpack it on the client side. It is recommended to define an endpoint specifically for hydrating / updating the view.

5. In the client component, you can initiate a request using the `Model<ContactCardModelData, ContactCardRequestArgs>.request("<your api endpoint>")`. In this particular example, `ContactCardRequestArgs` is a 
```typescript
export function ContactCard({ userId }: { userId: string }): {}

```

### View Model

A ViewModel is the structure that facilitates communication between the API and the client.

 {
    data: {
        firstName: {
            value: "John",
            permissions: ["Create", "Read", "Update", "Delete"]
        },
    }
 }

_Note: If the client does not have "Read" access for that field, then it is sent with null._


## Mapping Roles

## Storing and Sourcing Permissions
