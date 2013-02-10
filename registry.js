// Registers object names to object classes. 
// Currently necessary for object serialization to work properly. 
define(function() {

var public = {};
var private = {};

private.prototypes = {};

public.register_object = function( name, object ){
    // if an object goes into local storage and comes out later
    // we need to know which prototype to give it.
    private.prototypes[name] = object.prototype;
};

private.find_prototype = function( name ) {
    return private.prototypes[name];
}

public.rehydrate = function( obj ){
    if( obj === null ){
        return;
    }
    if( typeof(obj.name) !== "undefined"){
        obj.__proto__ = private.find_prototype(obj.name); 
        if( typeof(obj.__proto__) == "undefined" || obj.__proto__ === null ){
            console.error("Unregistered prototype: " + obj.name);
        }
    }
}

return public;
});
