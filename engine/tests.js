
require.config({ 
    baseUrl: '../', 
    paths: {
        "ui/history":"engine/mock_history"
    }
});

require(["engine/tools"], function(tools){
    
    module("Tools");

    test( "Clean a variety of things.", function(){
        equal(tools.clean("EAt damn CHEESE"), "eat damn cheese", "capitalization");
        equal(tools.clean("use orange on fridge"), "use orange on fridge", "do nothing");
        equal(tools.clean("dot. dot][|///dot,"), "dot dot dot", "punctuation" );
        equal(tools.clean("dot           dot"), "dot dot", "whitespace" );
        equal(tools.clean("   dot           dot"), "dot dot", "whitespace" );
        equal(tools.clean("dot           dot   "), "dot dot", "whitespace" );
        equal(tools.clean("Rub the orange against the fridge."), "rub the orange against the fridge", "example");
        equal(tools.clean("Eat the orange."), "eat the orange", "example");
    });

    test( "Ends With", function() {
        ok( tools.ends_with( "hurf durf", "durf" ) );
        ok( !tools.ends_with( "hurf burf", "durf" ) );
    });

    test( "Strip From End", function() {
        equal( tools.strip_from_end("hurf durf burf", "burf"), "hurf durf");
        equal( tools.strip_from_end("hurf durf burf", "durf burf"), "hurf");
        equal( tools.strip_from_end("hurf durf burf", "murf burf"), "hurf durf burf");
    });

    test( "Verb in command", function() {
        ok( tools.verb_in_command("examine", "look at cheese") );
    });

});

require(["engine/synonyms"], function(synonyms){
    module("Synonyms");

    test("Find all synonyms for look_at", function(){
        var s = synonyms.find("look_at");
        ok( _.contains( s, "examine"), "Examine is a synonym for look_at" );
    });
});


// State
require(["engine/state", "engine/registry"], function(state, registry){
    
    module("State");

    test( "WithState looks for saved state first.", function() {
        localStorage.clear();
        var object = new state.WithState();
        object.default_state["best_korea"] = "south korea";
        object.set_state("best_korea", "north korea");
        equal( object.get_state("best_korea"), "north korea", "Object fetches 'north_korea' from localStorage." );
        object.delete("best_korea");
        equal( object.get_state("best_korea"), "south korea", "After deleting best_korea, default state is used.." );
    });

    test( "WithState looks for default state second.", function() { 
        localStorage.clear();
        var object = new state.WithState();
        ok( object, "Object is created" );
        object.delete("all_glory_to_the_hypnotoad");
        object.default_state["all_glory_to_the_hypnotoad"] = "clap";
        equal( object.get_state("all_glory_to_the_hypnotoad"), "clap", "Object fetches 'clap' from default state." );
    });

    test( "WithState returns 'null' otherwise.", function() {
        localStorage.clear();
        var object = new state.WithState();
        equal( object.get_state("SQUIMBLETON"), null, "null returned.");
    });
    
    test( "Objects with the same name share state.", function() {
        localStorage.clear();
        var object = new state.WithState();
        var object2 = new state.WithState();
        equal( object.name, object2.name, "object names are equal" );
        
        object.set_state("best_korea", "north korea");
        object2.set_state("best_korea", "south korea");
        equal( object.get_state("best_korea"), "south korea", "Object fetches 'south_korea' from localStorage." );
    });
    
    test( "Objects with different names do not share state.", function() {
        localStorage.clear();
        var object = new state.WithState();
        var object2 = new state.WithState();
        object2.name = "some_other_name";
        notEqual( object.name, object2.name, "object names are not equal");

        object.set_state("best_korea", "north korea");
        object2.set_state("best_korea", "south korea");
        equal( object.get_state("best_korea"), "north korea", 
            "Object fetches 'north_korea' from localStorage." );
        equal( object2.get_state("best_korea"), "south korea", 
            "Object2 fetches 'south korea' from localStorage." );
    });

    test( "Objects with different names must be registered to be stored properly.", function() { 
        localStorage.clear();
        var base_object = new state.WithState();

        var registered_object = new state.WithState();
        registered_object.name = "registered_object";
        registry.register_object("registered_object", state.WithState);
        
        var unregistered_object = new state.WithState();
        unregistered_object.name = "unregistered_object";

        base_object.set_state("contains", [registered_object, unregistered_object] );
        var stored_registered_object = base_object.get_state("contains")[0];
        var stored_unregistered_object = base_object.get_state("contains")[1];

        deepEqual( registered_object, stored_registered_object, 
            "registered object stored properly.");
        notDeepEqual( unregistered_object, stored_unregistered_object, 
            "unregistered object not stored properly.");
    });
    
    test( "Objects can contain other objects / circular references.", function() {
        localStorage.clear();
        var object = new state.WithState();
        var object2 = new state.WithState();
        object2.name = "some_other_object";
        registry.register_object( "some_other_object", state.WithState );
        object.set_state("object2", object2);
        object2.set_state("object", object);
        object2.set_state("moustache", "MOUSTACHE!" );

        equal( object.get_state("object2").name, object2.name, "Same name." );
        equal( object.get_state("object2").get_state("moustache"), "MOUSTACHE!", "Can get state information." );
        equal( object.get_state("object2")
                    .get_state("object")
                    .get_state("object2")
                    .get_state("moustache"), "MOUSTACHE!", "Circular reference." );
    });

    test( "Objects have implicit defaults for contains, hidden_objects, and hidden_verbs", function(){
        localStorage.clear();
        var object = new state.WithState();
        object.name = "default";
        equal( object.get_state("contains").length, 0, " contains is [] " );
        equal( object.get_state("hidden_objects").length, 0, " hidden_objects is [] " );
        equal( object.get_state("hidden_verbs").length, 0, " hidden_verbs is [] " );
    });
    
    test( "Objects can contain lists of objects.", function() {
        localStorage.clear();
        var object = new state.WithState();
        var object2 = new state.WithState();
        var object3 = new state.WithState();
        var object4 = new state.WithState();
        object.set_state("contains", [object2, object3, object4]);
        object2.set_state("cat", "hat");
        object3.set_state("french", "chat_chapeau");
        object4.set_state("spanish", "el_gateau_with_a_sombrero");

        var list = object.get_state("contains");
        equal( list[0].get_state("cat"), "hat" )
        equal( list[1].get_state("french"), "chat_chapeau" )
        equal( list[2].get_state("spanish"), "el_gateau_with_a_sombrero" )
    });
});

require(["engine/core_object", "engine/registry"], 
    function(core, registry){

    module("Core Objects");

    test( "Create an object", function() { 
        localStorage.clear();
        var io = new core();
        ok( io, "Object is created" );
        equal( io.name, "interactive_object", "Interactive object has a name." );
    });
    
    test( "Interactive Objects can add, remove, show, and hide children.", function() {
        localStorage.clear();
        var root = new core();
        root.name = "root";
        registry.register_object( "root", core );
        var leaf = new core();
        leaf.name = "leaf";
        registry.register_object( "leaf", core );
        root.add_child( leaf );

        deepEqual( leaf.parent(), root, "Leaf's parent is root." );
        deepEqual( root.children()[0], leaf, "Root's child is leaf." );
        ok( root.has_child("leaf"), "Root's child is leaf" );
        deepEqual( root.visible_children()[0], leaf, "Root's child is visible.");
        ok( root.has_visible_child("leaf"), "Root's child is leaf" );
        root.hide_child( leaf );
        equal( root.visible_children().length, 0, "Root's child is invisible.");
        ok( !root.has_visible_child("leaf"), "Root's child is invisible" );
        ok( root.has_child("leaf"), "Root's child is still leaf" );
        equal( root.children().length, 1, "But it still exists. It's just hiding.");
        root.show_child( "leaf" );
        equal( root.visible_children().length, 1, "And now it's visible again.");
        root.hide_child( "leaf" );
        root.hide_child( "leaf" );
        root.hide_child( "leaf" );
        equal( root.get_state("hidden_objects").length, 1, 
                                                "Hiding children is idempotent." );
        root.show_child( "leaf" );
        root.show_child( "leaf" );
        root.show_child( "leaf" );
        equal( root.get_state("hidden_objects").length, 0, 
                                                "Showing children is idempotent." );
        root.remove_child( leaf );
        equal( root.children().length, 0, "Root's child is removed." );
        equal( root.get_state("hidden_objects").length, 0, 
                                                "And it's not hidden, either.");

    });
});


require(["engine/sample_objects"], 
    function(sample_objects){

    test( "Verbs" , function() {
        localStorage.clear();
        var fridge = new sample_objects.fridge();
        ok( _.contains( fridge.visible_verbs(), "eat" ), "Can eat fridge." ); 
        fridge.hide_verb("eat");
        ok( !_.contains( fridge.visible_verbs(), "eat" ), "Can't eat fridge after verb is hidden." ); 
        fridge.show_verb("eat");
        ok( _.contains( fridge.visible_verbs(), "eat" ), "Can eat fridge again." ); 
    });
});
    
require(["engine/sample_objects", "engine/command", "ui/history"], 
    function(sample_objects, command, history){

    module( "Fridge World" );

    test( "Here's a fridge!", function() {
        localStorage.clear();
        var fridge = new sample_objects.fridge();
        ok( fridge, "Fridge!" );
        equal( fridge.name, "fridge" );
    });

    test( "Getting actions", function() {
        localStorage.clear();
        var fridge = new sample_objects.fridge();
        command.set_root( fridge );
        ok( _.contains( command.get_actions(), "open fridge" ), "Can open fridge" );
        ok( ! _.contains( command.get_actions(), "use fridge on fridge" ), "Use X on itself is not a valid move." );
        fridge.look();
        equal( history.pop(), "It's a Fridgit Jones 5000.", "Looked at the fridge"); 
        fridge.open();
        console.log( command.get_actions() );
        ok( _.contains( command.get_actions(), "use orange on fridge" ), "Use X on X is a valid move." );
        ok( _.contains( command.get_actions(), "think orangey thoughts" ), "Can hide the noun from certain actions.");
        ok( !_.contains( command.get_actions(), "think orangey thoughts orange"), "Can hide the noun from certain actions.");
        ok( _.contains( command.get_actions(), "eat orange" ), "Can see the orange in the fridge.");
        var orange = fridge.recursive_find("orange");
        orange.eat();
        equal( history.pop(), "The orange is delicious.", "OM NOM NOM" ); 
        ok( !_.contains( command.get_actions(), "eat orange" ), "Can't see the orange after it's been eaten.");
    });

    test( "Start parsing commands", function() {
        localStorage.clear();
        var fridge = new sample_objects.fridge();        
        command.set_root( fridge );
        
        ok( command.command("Look"), "Verbs are implicitly tied to the root element.");
        equal( history.pop(), "It's a Fridgit Jones 5000.", "IMPLICIT." );

        fridge.open();
        ok( _.contains( command.get_actions(), "look at orange" ), "Can see the orange in the fridge.");
        ok( command.command("Look at orange"), "Look at that orange." );
        equal( history.pop(), "It's .. orange.", "Look at it!" );
        ok( command.command("Use orange on fridge"), "Rub orange against fridge." );
        equal( history.pop(), "You rub the orange sensually against the fridge.", "Rubbed."); 
        
        ok( command.command("Eat the orange"), "Command executed");
        equal( history.pop(), "The orange is delicious.", "OM NOM NOM" ); 
        ok( !_.contains( command.get_actions(), "eat orange" ), "Can't see the orange after it's been eaten.");
        
        ok(! command.command("Punch a bear"), "Incorrect command not executed.");
    });
});

localStorage.clear();
