// A prototypal object for things that have recordable state information. 
define(function() {

var public = {};
var private = {};

var big_number = 0;

public.WithState = function(){
    this.default_state = {};
    this.name = "object_with_state";
    this.state_id = big_number;
    big_number ++;
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
    if( typeof(obj.state_id) !== "undefined"){
        obj.prototype = public.WithState.prototype;
    }
    return obj;
}

return public;

});
