# Perm

Server permission framework.  Used for unifying RBAC systems with content delivery to clients.

## Overview

Perm abstracts the process of converting RBAC permission systems into usable structures to hydrate client components securely. This is most commonly done in frameworks like react, where securely updating the client 'view' can be done through api calls to hydrate the internal state of the before-mentioned component.

Perm should be approached a more of a guide or paradigm to developing these systems, rather than a batteries-included solution.
We just provide the structures you need to easily facilitate this conversion process.

### View Model

A ViewModel is the structure that facilitates communication between the API and the client.

 // NOTE: I think we can condense it down into a single structure - 
 {
    data: {
        firstName: {
            value: "John",
            permissions: ["Create", "Read", "Update", "Delete"]
        },
    }
 }

_Note: If the client does not have "Read" access for that field, then it is sent with null._

TODO: We will eventually need to figure out how to handle when READ is disabled, but others aren't.  Like, how do you make sure the client isn't receiving information if they can only Delete them? 

