
define(["engine/objects"], function( objects ){

var public = {};

public.load = function recursive_load(node){
    if( typeof(node) === 'undefined'){
        var node = objects.get_root();
    }

    // Load this node's file. 
    if( typeof(node.origin) !== 'undefined'){
        require([node.origin], function(){ });
    }

    // We need to load every object in the scene heirarchy, 
    // visible or no. 
    var children = node.children();

    _.each( children, function(child){
        recursive_load(child); 
    });
};

return public;
});
