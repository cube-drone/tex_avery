define(["engine/objects",
        "game/room",
        "ui/history"], function( objects, room, history){

objects.set_file( "game/north" );

var app = history.append;
var public = {};

var north = {
    special_verbs:["go_south"], 
    go_south: function(){
        room.change_location("game/kitchen");
    },
    look_at: function(){
        var string = [ "Having gone north, you discover that there is nothing ", 
        " around for miles. It is nothing but a formless void. An empty wasteland. ", 
        " the only exit is <em>south</em>."] 
        app( string );
    }
};
public.room = objects.add_to_universe( "north", north );

return public;
});
