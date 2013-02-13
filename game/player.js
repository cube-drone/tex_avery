
define(["engine/core_object",
        "engine/registry",
        "ui/history",
        "ui/prompt", 
        "game/inventory", 
        "game/kitchen"], 
        function( core, registry, history, prompt, inventory, kitchen){

var public = {};

public.me = function(){
    this.name = "me";    
    this.base_setup();
    this.register_special_verb('die');
    this.register_special_verb('win');
    this.register_special_verb('look_around');
    this.register_special_verb('debug');
    this.register_special_verb('help');
    this.register_special_verb('reset_universe');
    this.register_special_verb('get_ye_flask');
};

public.me.prototype = new core();
public.me.prototype.use_target = true;
public.me.prototype.setup = function(){
    var i = new inventory.inventory();
    var k = new kitchen.kitchen();
    this.add_child(i);
    this.add_child(k);
    this.set_state('current_location', k );
    this.hide_verb('decompose');
    this.hide_verb('reflect');
}

public.me.prototype.die = function(){
    history.append("You have died. Way to go.");
    history.append("Your only option at this point is to reset the universe.");
    this.remove_children();
    this.set_state("dead", true);
    this.show_verb('decompose');
}

public.me.prototype.win = function(){
    history.append("You have won. Way to go.");
    history.append("Take this moment to reflect; both winning and dying end the game - is there any difference? ");
    history.append("If you would like to try to win another way, try resetting the universe. ");
    this.remove_children();
    this.set_state("won", true);
    this.show_verb('reflect');
}

public.me.prototype.decompose = function(){
    history.append("You create a stink.");
}

public.me.prototype.reflect = function(){
    history.append("No, <em>you</em> reflect. We can't do it for you.");
}

public.me.prototype.look_around = function(){
    if( this.get_state('dead') ){
        history.append("You can't look around. You're dead.");
        return;
    }
    if( this.get_state('won') ){
        history.append("You've won the game. You can go home, now.");
        return;
    }
    this.get_state('current_location').look_at();
}

public.me.prototype.get_ye_flask = function(){
    history.append("You cannot get ye flask.");
}

public.me.prototype.debug = function(){
    console.log( this );
    console.log( this.visible_children() );
}

public.me.prototype.help = function(){
    if( this.get_state("dead") ){
        history.append("Nobody can help you. You're dead." );
        history.append("Try resetting the universe." );
    }
    else
    {
        history.append("Here are some commands you might try!", "help") 
        history.append("inventory - Check out what you're holding.", "help");
        history.append("reset universe - Completely reset the entire universe.", "help");
        history.append("help - See this page.", "help");
    };
}

public.me.prototype.reset_universe = function(){
    localStorage.clear();
    location.reload();
}

public.me.prototype.use = function(obj){
    if( typeof(obj) === 'undefined'){
        history.append("<a href='http://www.youtube.com/watch?v=I9zpnLBtwwg'>Use me, use me, say that you'll use me.</a>");
        return;
    };
    if( obj.name === 'fork' ){
        history.append("You fork yourself. Ow. Smooth.");
    };
    if( obj.name === 'stove' ){
        history.append("No. That is an awful idea.");
    };
    if( obj.name === 'bacon' ){
        obj.eat();
    }
    if( obj.name === 'toaster' ){
        history.append("You .. toast yourself. It is excruciatingly painful.");
    }
}

registry.register_object( "me", public.me );

return public;

});
