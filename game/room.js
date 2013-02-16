// A Room in the Game.
//  The room must have the same name as the name of it's file - 
//  so kitchen is in 'kitchen.js'
//  and that file's module must contain a 'room' object.
define(["engine/core_object",
        "engine/registry",
        "engine/objects",
        "ui/history"],
        function( core, registry, objects, history ){

var public = {}
public.change_location = function( path_to_new_location, callback ){
    require([path_to_new_location], function(new_location){
        var new_room = new new_location.room();
        if( typeof( new_room ) === 'undefined' ){
            History.append("Oh, holy shit, that room doesn't exist.", "error" );
            return;
        };
        var root = objects.get_root();
        var current_location = root.get_state('current_location');
        root.remove_child(current_location);
        root.set_state('current_location', new_room );
        root.add_child(new_room);
        new_room.look_at();
        if( typeof( callback ) !== 'undefined' ) {
            callback();
        };
    });
};

return public;
});
