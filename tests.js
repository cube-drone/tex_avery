
// State
require(["state"], function(state){
    
    test( "Object goes to default state if no key is found.", function() { 
        var object = new state.WithState();
        ok( object, "Object is created" );
        object.delete("all_glory_to_the_hypnotoad");
        object.default_state["all_glory_to_the_hypnotoad"] = "clap";
        equal( object.get_state("all_glory_to_the_hypnotoad"), "clap", "Object fetches 'clap' from default state." );
    });

    test( "Object goes to saved state if key is found.", function() {
        var object = new state.WithState();
        object.default_state["best_korea"] = "south korea";
        object.set_state("best_korea", "north korea");
        equal( object.get_state("best_korea"), "north korea", "Object fetches 'north_korea' from localStorage." );
        object.delete("best_korea");
        equal( object.get_state("best_korea"), "south korea", "After deleting best_korea, default state is used.." );
    });
    
    test( "Different objects have different states.", function() {
        var object = new state.WithState();
        var object2 = new state.WithState();

        object.set_state("best_korea", "north korea");
        object2.set_state("best_korea", "south korea");
        equal( object.get_state("best_korea"), "north korea", "Object fetches 'north_korea' from localStorage." );
        equal( object2.get_state("best_korea"), "south korea", "Object2 fetches 'south korea' from localStorage." );
    });

    test( "Prototype Registration", function() { 
        state.register_prototype("awesome", state.prototype);
        equal( state.find_prototype("awesome"), state.prototype );
    });
    
    test( "Objects can contain other objects / circular references.", function() {
        var object = new state.WithState();
        var object2 = new state.WithState();
        object.set_state("object2", object2);
        object2.set_state("object", object);
        object2.set_state("moustache", "MOUSTACHE!" );

        equal( object.get_state("object2").name, object2.name, "Same name." );
        equal( object.get_state("object2").get_state("moustache"), "MOUSTACHE!", "Can get state information." );
        equal( object.get_state("object2").get_state("object").get_state("object2").get_state("moustache"), "MOUSTACHE!", "Circular reference." );
    });
    
    test( "Objects can contain lists of objects.", function() {
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

test( "Tests are being tested.", function() {
    ok( true, "True." );
});
