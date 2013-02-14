Tex-Avery
==========

State and Objects
----------

### engine/core_object.js ###
- Contextually relevant objects with behaviour
- All relationships described in terms of 'verb' and 'noun' - 'nouns' are subclasses
    of engine/core_object that register verbs. 

### engine/command.js ###
- Input multiplexer, which scrapes for verb noun pairs, 
    perhaps subject/object relationships, and creates a query of relevant objects
- The player is the root object, on the top of a tree that also contains the scene (/room), the inventory, 
    and any other globals that one might attach to the player.
- Objects are able to redirect to other objects, ie "Use bucket 
    on ham" can fill a bucket with ham. Currently this is only implemented as 'use x on y', although
    we can look at other types of relationship. 
- It is relatively simple to add objects and rooms and keep an active verb/noun list (w/synonyms)


Thoughts on Data
----------
- Want all bad input piped to a remote host for live analysis
- Need a way of either seeing current state for above, or replaying a -specific- game 
    given their past input; that means live-updating would mean versioning the game data
