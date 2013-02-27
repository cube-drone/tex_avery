// Command things
define(["engine/objects",
        "engine/synonyms", 
        "engine/tools", 
        "ui/history"], function(objects, synonyms, tools, history){

var public = {};

// Get all available actions from within root object
public.get_actions = function(){
    var root_object = objects.get_root();
    var visible_nouns = root_object.visible_children(); 
    visible_nouns.push( root_object );
    var actions = [];

    _.each( visible_nouns, function( noun ) {
        // Use X on Y
        if( noun.use_target() ){
            _.each( visible_nouns, function( other_noun ){
                if( noun.name !== other_noun.name &&
                        other_noun.use_target()) {
                    actions.push( "use " + noun.name.replace(/_/g, " ") + " on " + other_noun.name.replace(/_/g, " ") );
                }
            });
        }
        
        // Special commands
        _.each( noun.get_special_verbs(), function(verb){
            actions.push( verb.replace(/_/g, " ") );
        });

        var verbs = noun.visible_verbs();
        _.each( verbs, function( verb ) {
            actions.push( verb.replace(/_/g, " ") + " " + noun.name.replace(/_/g, " ") );
        });
    });
    return actions;
};

public.execute = function execute( noun, verb ){
    switch(typeof(noun[verb])){
        case 'undefined':
            console.error(noun + " " + verb + " not found")
            return;
        case 'function':
            noun[verb]();
            return;
        case 'string':
            history.append( noun[verb] );
            return;
        case 'object':
            //TODO: I haven't tested any of this stuff yet. 
            if(noun[verb].length > 0){
                if( verb === "look_at" ){
                    // special cases abound! 
                }
                var type_of_recurrence = noun[verb][0];
                var recurrences = noun[verb][1];
                if( type_of_recurrence === 'random') {
                    var n = Math.floor((Math.random()*noun[verb].length)+1);
                }
                else{
                    var n = noun.get_state(verb + ":recurrences");
                }
                if( typeof(n) === 'undefined' ){
                    n = 0;
                };
                if( n > noun[verb].length && type_of_recurrence === 'one_pass' ){
                    n = noun[verb].length;
                };
                if( n > noun[verb].length && type_of_recurrence === 'random' )
                {
                    n = 0;
                };
                execute( noun, noun[verb][n] );
                n++;
            }
            else{
                console.error("malformed object");
            }
            return;
    }
}

// Execute a command
public.command = function ( command ){
    var root_object = objects.get_root();
    var command = tools.clean( command );
    var visible_nouns = root_object.visible_children(); 
    visible_nouns.push( root_object );

    // First, try all special commands.
    var success = _.some( visible_nouns, function( noun ){
        return _.some( noun.get_special_verbs(), function( verb ){
            if( command === verb.replace(/_/g, " ") ){
                noun[verb]();
                return true;
            }
            return false;
        });
    });
    if( success ){
        return;
    }   

    // Verb-Object sentences. ("eat apple")
    var success = _.some( visible_nouns, function( noun ){
        if( tools.ends_with( command, noun.name.replace(/_/g, " ") ) ){
            command = tools.strip_from_end( command, noun.name.replace(/_/g, " ") );

            // Combined Object Logic
            if( _.any( synonyms.combining_prepositions, function( prep ) 
                    { return tools.ends_with( command, " "+prep ); } )){ 

                _.each( synonyms.combining_prepositions, function( prep ){
                    command = tools.strip_from_end( command, prep );
                });

                var success = _.some( visible_nouns, function( second_noun ){
                    if( tools.ends_with( command, second_noun.name.replace(/_/g, " ") ) ){
                        command = tools.strip_from_end( command, second_noun.name.replace(/_/g, " ") );
                        var success = _.some( noun.visible_verbs(), function( verb ){
                            if( tools.verb_in_command( verb, command )){
                                noun[verb](second_noun);
                                return true;
                            };
                        });
                        if( !success ){ 
                            history.append( "I couldn't figure out how to " + command + 
                                            " the " + noun.name.replace(/_/g, " ") + 
                                            " with the " + second_noun.name.replace(/_/g, " ") );
                            return true;
                        };
                        return true;
                    };
                });
                if( success ){ 
                    return true;
                };
            }
            else{
                // Single Object Logic
                var success = _.some( noun.visible_verbs(), function( verb ){
                    if( tools.verb_in_command( verb, command )){
                        public.execute( noun, verb );
                        return true;
                    };
                });
                if( !success ){ 
                    history.append( "I couldn't figure out how to " + command + " the " + noun.name.replace(/_/g, " ")  );
                };
                return true;
            }
        }
    });
    if( success ){
        return true;
    };

    history.append( "I don't understand." );
    return false;
};

return public;

});
