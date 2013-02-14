// A prototypal object for things that have recordable state information. 
define(function() {
    var public = {};

    // The first synonym in the set is always the one we use on the object.
    var synonym_groups = [
        ["look_at", "examine"],
        ["smell", "sniff"],
        ["take", "grab", "get"],
        ["eat", "consume"],
        ["lick", "taste"]
    ];

    public.combining_prepositions = [
        "with",
        "on",
        "and", 
        "against"
    ];

    public.find = function( verb ){
        var matches = [verb];
        _.each( synonym_groups, function(synonyms){
            if ( _.contains( synonyms, verb ) ){
                matches = synonyms;;
            }
        });
        return matches;
    }

    return public;
});
