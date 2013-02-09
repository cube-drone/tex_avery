Tex-Avery
==========

State and Objects
----------

- Interested in querying contextually relevant objects for behaviour
- Perhaps describe all relationships in terms of 'verb' and 'noun'
- Input would be sent through a multiplexer, which scrapes for verb noun pairs, 
    perhaps subject/object relationships, and begins a query of relevant objects
- Relevant objects would be inventory, those attached to the scene, and perhaps a set of globals
- Objects should be able to redirect to other objects in some way, ie "Use bucket 
    on ham" would fill a bucket with ham, or some such
- Want it to be relatively simple to add objects and rooms, keep an active verb/noun list (w/synonyms)

Thoughts on Data
----------

- Want all bad input piped to a remote host for live analysis
- Need a way of either seeing current state for above, or replaying a -specific- game 
    given their past input; that means live-updating would mean versioning the game data
