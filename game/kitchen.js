define(["engine/core_object",
        "engine/registry",
        "engine/command",
        "game/room",
        "ui/history"], function( core, registry, command, room, history){

var public = {};

public.toaster = function(){
    this.name = "toaster";
}
public.toaster.prototype = new core();
public.toaster.prototype.use_target = true;
public.toaster.prototype.look_at = function(){
    history.append("It's a Toastmaster.");
}
public.toaster.prototype.debate = function(){
    history.append("It's not <em>that</em> kind of Toastmaster.");
}
public.toaster.prototype.use = function(obj){
    if( typeof(obj) === 'undefined' ){
        history.append("Without bread, the <strong class='object'>toaster</strong> serves little purpose.");
        return;
    }
    if( obj.name === 'fork' ){
        history.append("Seriously?");
        history.append("Okay, you electrocute yourself.");
        command.get_root().die();
    }
    if( obj.name === 'bacon' ){
        history.append("You use the <strong class='object'>toaster</strong> to very clumsily cook the <strong class='object'>bacon</strong>." );
        history.append("Somehow this manages not to explode and kill everyone.");
        obj.set_state("cooked", true);
    }
    if( obj.name === 'me' ){
        history.append("You lightly toast your hand." );
        history.append("ow. ow ow ow ow ow ow. ow." );
    }
}
public.toaster.prototype.take = function(){
    history.append("The <strong class='object'>toaster</strong> is yours. Bask in the slightly more well-laden glow.");
    this.delete();
    command.get_root().recursive_find('inventory').add_child(this);
}
registry.register_object( "toaster", public.toaster );

public.stove = function(){
    this.name = "stove";
}
public.stove.prototype = new core();
public.stove.prototype.use_target = true;
public.stove.prototype.look_at = function(){
    history.append("It's a small, greasy electric <strong class='object'>stove</strong>." ); 
}
public.stove.prototype.lick = function(){
    history.append("It tastes incomprehensibly vile, something like buttered rust." );
}
public.stove.prototype.open = function(){
    history.append("You attempt to open the oven on the <strong class='object'>stove</strong>. ");
    history.append("However, it is stuck shut.");
}
public.stove.prototype.take = function(){
    history.append("HNNNRRRRGGGGH. Nope. It's not going to budge." );
}
public.stove.prototype.use = function(obj){
    if( typeof(obj) === 'undefined') {
        history.append("You turn the <strong class='object'>stove</strong> on and off a couple of times.");
        history.append("Yep, working stove.");
    }
    switch( obj.name ){
        case 'bacon':
            history.append("You attempt to cook the bacon directly over the stove, but the grease dripping on to the element causes a fire.");
            history.append("Attempting to put out the fire, you, instead, manage to catch fire yourself." );
            history.append("Why - why do you have to wear such flammable clothing?");
            command.get_root().die();
            return;
        case 'me':
            history.append("No.");
            return;
        case 'fork':
            history.append("You try to use the <strong class='object'>fork</strong> to wedge open the <strong class='object'>stove</strong>'s door.");
            history.append("Then, you realize that the stove is nothing more than a prop, and give up.");
            return;
        default:
            history.append("I'm not sure how to use " + this.name + " with " + obj.name );
            return;
    }

}
registry.register_object( "stove", public.stove );

public.bacon = function(){
    this.name = "bacon";
}
public.bacon.prototype = new core();
public.bacon.prototype.use_target = true;
public.bacon.prototype.look_at = function(){
    history.append("A kilogram of uncooked Maple Star Smokey Back <strong class='object'>Bacon</strong>, richly marbled with fat." ); 
}
public.bacon.prototype.eat = function(){
    if( this.get_state("cooked") ){
        history.append("You eat the rich, delicious, smoky bacon, thereby winning the game. ");
        command.get_root().win();
    }
    else{
        history.append("You eat a full kilogram of uncooked bacon. Afterwards, you cry to yourself for a few minutes.");
        this.delete();
    }
}
public.bacon.prototype.lick = function(){
    history.append("... tastes like <strong class='object'>bacon</strong>."); 
}
public.bacon.prototype.smell = function(){
    history.append("It smells salty and fatty and an awful lot like <strong class='object'>bacon</strong>.");
}
public.bacon.prototype.take = function(){
    history.append("You <strong class='object'>stash</strong> the bacon on your person for later use.");
    this.delete();
    command.get_root().recursive_find('inventory').add_child(this);
}
public.bacon.prototype.use = function(obj){
    if( typeof(obj) === 'undefined' ){
        this.eat();
        return;
    }
    switch( obj.name ){
        case 'fork':
            history.append("You lightly perforate the <strong class='object'>bacon</strong>.");
            return;
        case 'toaster':
            history.append("You use the toaster to very clumsily cook the <strong class='object'>bacon</strong>." );
            history.append("Somehow this manages not to explode and kill everyone.");
            this.set_state("cooked", true);
            return;
        case 'stove':
            history.append("You attempt to cook the bacon directly over the stove, but the grease dripping on to the element causes a fire.");
            history.append("Attempting to put out the fire, you, instead, manage to catch fire yourself." );
            history.append("Why - why do you have to wear such flammable clothing?");
            command.get_root().die();
            return;
        default:
            history.append("I dunno how to do that to bacon.");
            return;
    }
}
registry.register_object( "bacon", public.bacon );

public.mirror = function(){
    this.name = "mirror";
}
public.mirror.prototype = new core();
public.mirror.prototype.use_target = true;
public.mirror.prototype.look_at = function(){
    history.append("It's <strong class='object'>me</strong>! God, I'm ugly." ); 
}
public.mirror.prototype.smash = function(){
    history.append("You smash the mirror. 7 years of bad luck are now all up on your plate.");
}
public.mirror.prototype.use = function(obj){
    if( typeof(obj) === 'undefined') {
        this.look_at();
        return;
    }
    switch( obj.name ){
        case 'bacon':
            command.get_root().win();
            return;
        case 'stove':
            history.append("Both of those things are attached to the walls.");
            return;
        case 'fork':
            history.append("It's as if there were two forks!");
            return;
        case 'toaster':
            this.smash();
            return;
        case 'me':
            this.look_at();
            return;
        default:
            history.append("I can't do that with the mirror.");
            return;
    }
}
registry.register_object( "mirror", public.mirror );

public.fridge = function(){
    this.name = "fridge";
    this.base_setup();
}
public.fridge.prototype = new core();
public.fridge.prototype.setup = function(){
    this.hide_verb("close");
    this.add_child( new public.bacon() );
    this.hide_child( "bacon" );
}
public.fridge.prototype.look_at = function(){
    history.append("It's a perfectly normal fridge." ); 
    if( this.get_state('open') ){
        if( this.has_child( "bacon" ) )
        {
            history.append("Inside is a package of bacon and a flask of mustard." );
        }
        else{
            history.append("There's a flask of mustard in there." );
        }
    };
};
public.fridge.prototype.lick = function(){
    history.append("Why? Why would you lick that? It tastes of bad decision-making skills." );
};
public.fridge.prototype.take = function(){
    history.append("Despite a pretty heroic effort, you cannot take the fridge with you.");
}
public.fridge.prototype.make_love_to = function(){
    history.append(".. good lord.");
}
public.fridge.prototype.open = function(){
    this.set_state('open', true); 
    this.show_verb("close");
    this.hide_verb("open");
    history.append( "You open the fridge. Inside the fridge is a cornucopia of.. well, nothing."); 
    this.show_child( "bacon" );
    if( this.has_child( "bacon" ) )
    {
        history.append("Just a package of <strong class='object'>bacon</strong> and a flask of mustard." );
    }
    else{
        history.append("Just a flask of mustard." );
    }
}
public.fridge.prototype.close = function(){
    this.set_state('open', false); 
    this.hide_verb("close");
    this.show_verb("open");
    history.append("You close the fridge.");
    this.hide_child( "bacon" );
}
registry.register_object( "fridge", public.fridge );

public.room = function(){
    this.name = "kitchen";    
    this.base_setup();
    this.register_special_verb("go_north");
    this.register_special_verb("go_through_door");
};

public.room.prototype = new core();
public.room.prototype.setup = function(){
    this.add_child( new public.toaster() );
    this.add_child( new public.fridge() );
    this.add_child( new public.stove() );
    this.add_child( new public.mirror() );
}

public.room.prototype.go_north_from = function(){
    room.change_location("game/north");
}

public.room.prototype.go_north = function(){
    this.go_north_from();
}

public.room.prototype.go_through_door = function(){
    this.go_north_from();
}

public.room.prototype.look_at = function(){
    var string = [ "You are standing in a small, tidy kitchen. ", 
    "It's unfamiliar to you, but it seems like most kitchens you've seen", 
    " before. There's a <strong class='object'>stove</strong>, a ", 
    " <strong class='object'>fridge</strong>, a <strong class='object'>toaster</strong>, ", 
    " and a <strong class='object'>mirror</strong>. " ];
    history.append( string.join(" ") );
}

registry.register_object( "kitchen", public.room );

return public;
});
