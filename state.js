// A prototypal object for things that have recordable state information. 
define(function() {

var public = {};
var private = {};

private.big_number = 0;
private.prototypes = {};

public.register_prototype = function( name, prototype ){
    // if an object goes into local storage and comes out later
    // we need to know which prototype to give it.
    private.prototypes[name] = prototype;
};

public.find_prototype = function( name ) {
    return private.prototypes[name];
}

private.rehydrate = function( obj ){
    if( typeof(obj.state_id) !== "undefined"){
        obj.__proto__ = public.find_prototype(obj.name); 
        if( typeof(obj.__proto__) == "undefined" || obj.__proto__ === null ){
            console.error("Unregistered prototype: " + obj.name);
        }
        console.log( obj );
    }
}

public.WithState = function(){
    this.default_state = {};
    this.name = "with_state";
    this.state_id = private.big_number;
    private.big_number ++;
};

public.WithState.prototype.key = function(key){
    return this.name + ":" + this.state_id + ":" + key;
};

public.WithState.prototype.set_state = function(key, value){
    localStorage[ this.key(key) ] = JSON.stringify( JSON.decycle( value ) );
};

public.WithState.prototype.delete = function(key){
    localStorage.removeItem( this.key(key) );
};

public.WithState.prototype.get_state = function(key){
    var state = localStorage[ this.key(key) ] ;
    if( state === null || typeof state === 'undefined' ){
        if( typeof this.default_state[key] != 'undefined' ){
            return this.default_state[key];
        }
        else
        {
            return null;
        }
    }
    var obj = JSON.retrocycle( JSON.parse( state ));
    private.rehydrate( obj );
    _.each(obj, private.rehydrate );
    return obj;
}

public.register_prototype( "with_state", public.WithState.prototype );

return public;

});
