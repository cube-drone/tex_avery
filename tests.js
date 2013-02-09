
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
    
    test( "Objects can contain other objects / circular references.", function() {
        var object = new state.WithState();
        var object2 = new state.WithState();

        object.set_state("object2", object2);
        object2.set_state("object", object);
        console.log( object );
        equal( object.get_state("object2"), object2, "Hell Yeah." );
    });
});

test( "Tests are being tested.", function() {
    ok( true, "True." );
});
