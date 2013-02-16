// Central object registry.
define(["engine/core_object",
        "engine/registry",
        "ui/history"], function( core, registry, history ){

var public = {};

// At the root of every scene is an object.
// By convention, the player. 
var root_object = "";
public.set_root = function( object ){
    root_object = object;
}
public.get_root = function() {
    return root_object;
}

// When registering objects against the universe, it is useful
// to know their origin file. That way, when we're unpacking
// the objects, we know which files to load. 
var object_file = "";
public.set_file = function( file ) {
    object_file = file;
}

// Before objects will work in the universe, you need to call
//  'add_to_universe' on them. 
public.add_to_universe = function( name, object ){
    var name = name;
    var object = object;
    
    var thing = function(){ 
        this.name = name; 
        this.origin = object_file;
        this.base_setup();
        var that = this;
        if ( typeof(object.init) !== 'undefined' ){
            object.init.apply( this );
        }
        if ( typeof(object.special_verbs) !== 'undefined' ){
            _.each( object.special_verbs, function( verb ){
                that.register_special_verb( verb );
            });
        }
    }; 
    thing.prototype = new core();
    _.each( _.keys(object), function( key ){
        if( key !== 'use' && key !== 'special_verbs') {
            thing.prototype[key] = object[key]
        }
    });
    if( typeof(object.use) !== 'undefined') {
        thing.prototype.use = function(obj){
            if( typeof(obj) === 'undefined'){
                if( typeof(object.use["undefined"]) !== 'undefined' ){
                    object.use["undefined"]();
                    return;
                }
            };
            var success = _.some( _.keys( object.use ), function(key){
                if( obj.name === key ){
                    object.use[key](obj);
                    return true;
                }
                return false;
            });
            if( success !== true ){
                history.append("I couldn't figure out how to use the " + obj.name + " with the " + this.name );
            }
        }
    }
    registry.register_object( name, thing );
    return thing;
};

return public;
});
