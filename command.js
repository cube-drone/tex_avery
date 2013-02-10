// Command things
define(["core_object",
        "registry",
        "synonyms", 
        "history",
        "tools"], function(core_object, registry, synonyms, history, tools){

var root_object = "";
var public = {};

public.set_root = function( object ){
    root_object = object;
}

// Get all available actions from within root object
public.get_actions = function(){
    var visible_nouns = root_object.visible_children(); 
    visible_nouns.push( root_object );
    var actions = [];

    _.each( visible_nouns, function( noun ) {
        _.each( visible_nouns, function( other_noun ){
            if( noun.name !== other_noun.name) {
                actions.push( "use " + noun.name.replace("_", " ") + " on " + other_noun.name.replace("_", " ") );
            }
        });
        var verbs = noun.visible_verbs();
        _.each( verbs, function( verb ) {
            var syns = synonyms.find( verb );
            _.each( syns, function( synonym ){
                actions.push( synonym.replace("_", " ") + " " + noun.name );
            });
        });
    });
    return actions;
};

// Execute a command
public.command = function ( command ){
    var command = tools.clean( command );
    var visible_nouns = root_object.visible_children(); 
    visible_nouns.push( root_object );

    // Verb-Object sentences. ("eat apple")
    var success = _.some( visible_nouns, function( noun ){
        if( tools.ends_with( command, noun.name ) ){
            command = tools.strip_from_end( command, noun.name );

            // Combined Object Logic
            if( _.any( synonyms.combining_prepositions, function( prep ) 
                    { return tools.ends_with( command, " "+prep ); } )){ 

                _.each( synonyms.combining_prepositions, function( prep ){
                    command = tools.strip_from_end( command, prep );
                });

                var success = _.some( visible_nouns, function( second_noun ){
                    if( tools.ends_with( command, second_noun.name ) ){
                        command = tools.strip_from_end( command, second_noun.name );
                        var success = _.some( noun.visible_verbs(), function( verb ){
                            if( tools.verb_in_command( verb, command )){
                                noun[verb](second_noun);
                                return true;
                            };
                        });
                        if( !success ){ 
                            history.append( "I couldn't figure out how to " + command + " the " + noun.name + " with the " + second_noun.name );
                            return true;
                        };
                        return true;
                    };
                });
                if( !success ){ 
                    history.append( "I couldn't figure out how to " + command + " the " + noun.name  );
                };
                return true;
            }
            else{
                // Single Object Logic
                var success = _.some( noun.visible_verbs(), function( verb ){
                    if( tools.verb_in_command( verb, command )){
                        noun[verb]();
                        return true;
                    };
                });
                if( !success ){ 
                    history.append( "I couldn't figure out how to " + command + " the " + noun  );
                };
                return true;
            }
        }
    });
    if( success ){
        return true;
    };
    
    // Root object is implicitly the object. ("Run"), ("Lie"), ("Dance")
    //  I'm expecting that the root object is the player, here. 
    var success = _.some( root_object.visible_verbs(), function( verb ){
        if( tools.verb_in_command( verb, command )){
            root_object[verb]();
            return true;
        };
    });
    if( success ){
        return true;
    }

    history.append( "I don't understand." );
    return false;
};

return public;

});
