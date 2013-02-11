define(["engine/core_object",
        "engine/registry",
        "engine/command",
        "ui/history"], function( core, registry, command, history){

var public = {};

public.toaster = function(){
    this.name = "toaster";
}
public.toaster.prototype = new core.InteractiveObject();
public.toaster.prototype.look_at = function(){
    history.append("It's a Toastmaster.");
}
public.toaster.prototype.debate = function(){
    history.append("It's not <em>that</em> kind of Toastmaster.");
}
public.toaster.prototype.use = function(obj){
    if( typeof(obj) === 'undefined' ){
        history.append("Without bread, the toaster serves little purpose.");
        return;
    }
    if( obj.name === 'fork' ){
        history.append("Seriously?");
        history.append("Okay, you electrocute yourself.");
        command.get_root().die();
    }
    if( obj.name === 'bacon' ){
        history.append("You use the toaster to very clumsily cook the bacon." );
        history.append("Somehow this manages not to explode and kill everyone.");
        obj.set_state("cooked", true);
    }
}
public.toaster.prototype.take = function(){
    history.append("The toaster is yours. Bask in the slightly more well-laden glow.");
    this.delete();
    command.get_root().recursive_find('inventory').add_child(this);
}
registry.register_object( "toaster", public.toaster );

public.stove = function(){
    this.name = "stove";
}
public.stove.prototype = new core.InteractiveObject();
public.stove.prototype.look_at = function(){
    history.append("It's a small, greasy electric stove." ); 
}
public.stove.prototype.lick = function(){
    history.append("It tastes incomprehensibly vile, something like buttered rust." );
}
public.stove.prototype.use = function(obj){
    if( typeof(obj) === 'undefined') {
        history.append("You turn the stove on and off a couple of times.");
        history.append("Yep, working stove.");
    }
    if( obj.name === 'bacon' ){
        history.append("You attempt to cook the bacon directly over the stove, but the grease dripping on to the element causes a fire.");
        history.append("Attempting to put out the fire, you, instead, manage to catch fire yourself." );
        history.append("Why - why do you have to wear such flammable clothing?");
        command.get_root().die();
    }
}
registry.register_object( "stove", public.stove );

public.bacon = function(){
    this.name = "bacon";
}
public.bacon.prototype = new core.InteractiveObject();
public.bacon.prototype.look_at = function(){
    history.append("A kilogram of uncooked Maple Star Smokey Back Bacon, richly marbled with fat." ); 
}
public.bacon.prototype.eat = function(){
    if( this.get_state("cooked") ){
        history.append("You eat the rich, delicious, smoky bacon, thereby winning the game. ");
        command.get_root().win();
    }
    else{
        history.append("You eat a full kilogram of uncooked bacon. Afterwards, you cry to yourself for a few minutes.");
    }
}
public.bacon.prototype.lick = function(){
    history.append("... tastes like bacon."); 
}
public.bacon.prototype.smell = function(){
    history.append("It smells salty and fatty and an awful lot like bacon.");
}
public.bacon.prototype.take = function(){
    history.append("You stash the bacon on your person for later use.");
    this.delete();
    command.get_root().recursive_find('inventory').add_child(this);
}
public.bacon.prototype.use = function(obj){
    if( typeof(obj) === 'undefined' ){
        this.eat();
        return;
    }
    if( obj.name === 'fork' ){
        history.append("You lightly perforate the bacon.");
    }
    if( obj.name === 'toaster' ){
        history.append("You use the toaster to very clumsily cook the bacon." );
        history.append("Somehow this manages not to explode and kill everyone.");
        this.set_state("cooked", true);
    }
    if( obj.name === 'stove' ){
        history.append("You attempt to cook the bacon directly over the stove, but the grease dripping on to the element causes a fire.");
        history.append("Attempting to put out the fire, you, instead, manage to catch fire yourself." );
        history.append("Why - why do you have to wear such flammable clothing?");
        command.get_root().die();
    }
}
registry.register_object( "bacon", public.bacon );

public.mirror = function(){
    this.name = "mirror";
}
public.mirror.prototype = new core.InteractiveObject();
public.mirror.prototype.look_at = function(){
    history.append("It's you! God, you're ugly." ); 
}
public.mirror.prototype.smash = function(){
    history.append("You smash the mirror. 7 years of bad luck are now all up on your plate.");
    this.delete();
}
public.mirror.prototype.use = function(obj){
    if( typeof(obj) === 'undefined') {
        this.look_at();
    }
    if( obj.name === 'bacon' ){
        command.get_root().win();
    }
}
registry.register_object( "mirror", public.mirror );

public.fridge = function(){
    this.name = "fridge";
    this.base_setup();
}
public.fridge.prototype = new core.InteractiveObject();
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
        history.append("Just a package of bacon and a flask of mustard." );
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

public.kitchen = function(){
    this.name = "kitchen";    
    this.base_setup();
};

public.kitchen.prototype = new core.InteractiveObject();
public.kitchen.prototype.setup = function(){
    this.add_child( new public.toaster() );
    this.add_child( new public.fridge() );
    this.add_child( new public.stove() );
    this.add_child( new public.mirror() );
}

public.kitchen.prototype.look_at = function(){
    var string = [ "You are standing in a small, tidy kitchen. ", 
    "It's unfamiliar to you, but it seems like most kitchens you've seen", 
    " before. There's a <span class='object'>stove</span>, a ", 
    " <span class='object'>fridge</span>, a <span class='object'>toaster</span>, ", 
    " and a <span class='object'>mirror</span>. ", 
    " There's a door to your right. " ];
    history.append( string.join(" ") );
}

registry.register_object( "kitchen", public.kitchen );

return public;
});
