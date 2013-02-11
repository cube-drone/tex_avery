// A prototypal object for things that have recordable state information. 
define(function() {
    var public = {};

    // The first synonym in the set is always the one we use on the object.
    var synonym_groups = [
        ["look", "examine", "look_at"],
        ["smell", "sniff"],
        ["take", "grab", "get"],
        ["eat", "consume"]
    ];

    public.combining_prepositions = [
        "with",
        "as", 
        "on",
        "at", 
        "to", 
        "and", 
        "against"
    ];

    public.discardable_words = [
        "the", 
        "in", 
        "an", 
        "a"
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
