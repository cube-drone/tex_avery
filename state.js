// A prototypal object for things that have recordable state information. 
define(["registry"], function(registry){

var public = {};
var private = {};

// WithState is the base class for objects that have recordable state.  
public.WithState = function(){
    this.default_state = {};
    this.name = "with_state"; 
};

public.WithState.prototype.key = function(key){
    return this.name + ":" + key;
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
            if( key === 'contains' 
                || key === 'hidden_objects' 
                || key ==='hidden_verbs' ){
                return [];
            }
            return null;
        }
    }
    var obj = JSON.retrocycle( JSON.parse( state ));
    registry.rehydrate( obj );
    _.each(obj, registry.rehydrate );
    return obj;
}

registry.register_object( "with_state", public.WithState );

return public;

});
