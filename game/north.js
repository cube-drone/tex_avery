define(["engine/core_object",
        "engine/registry",
        "engine/command",
        "game/room",
        "ui/history"], function( core, registry, command, room, history){

var public = {};

public.room = function(){
    this.name = "north";    
    this.base_setup();
    this.register_special_verb("go_south");
};

public.room.prototype = new core();

public.room.prototype.go_south_from = function(){
    room.change_location("game/kitchen");
}

public.room.prototype.go_south = function(){
    this.go_south_from();
}

public.room.prototype.look_at = function(){
    var string = [ "Having gone north, you discover that there is nothing ", 
    " around for miles. It is nothing but a formless void. An empty wasteland. ", 
    " the only exit is <em>south</em>."] 
    history.append( string.join(" ") );
}
registry.register_object( "north", public.room );

return public;
});
