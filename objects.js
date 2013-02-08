
var you = { 
    are_in: rooms.antechamber,
    inventory: []
}

var all_actions = function(){ 
    var actions = [];
    // todo: Underscore magic here. 
    //for k in you.are_in.verbs:
    //    actions.push[k]
    return actions;
}

var rooms = { 
    antechamber: {
        state: {
            contains: [ objects.fridge ]
        },
        initial: function() {
            history.append( "You are in a 10x10 steel box. In front of you is a refridgerator." )
        }
        verbs: {
            look_around: function() { 
                rooms.first.initial()
            }
            
        }
    }
}

var objects = {
    fridge: { 
        state: { 
            open: false,
            contains: [ objects.orange ]
        }, 
        verbs: { 
            smell: function() { 
                history.append("It smells fridgy.");
            },
            look_at: function() {
                if( ! objects.fridge.state.open ){ 
                    history.append("It's a Fridgit Jones 5000.");
                }
                else{
                    history.append("It's a Fridgit Jones 5000. Inside it? A vegetable crisper.");
                }
            },
            open: function() { 
                if( ! objects.fridge.state.open ){
                    objects.fridge.state.open = true; 
                    history.append( "You open the fridge." );
                }
                else{
                    history.append( "The fridge remains open." );
                }
            }, 
            close: function() { 
                if( objects.fridge.state.open ){
                    objects.fridge.state.open = false; 
                    history.append( "You close the fridge.");
                }
                else{
                    history.append( "The fridge remains closed.");
                }
            },
            take: function() {
                history.append( "The fridge is a little too heavy for that." );
            }
            throw: function() {
                history.append( "The fridge is a little too heavy for that." );
            }
        }
    }
}

