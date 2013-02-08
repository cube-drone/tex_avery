
var objects = {
    fridge: { 
        state: { 
            open: false
        }, 
        noun: "fridge",
        room: "There is a fridge in the room. ",
        verb: { 
            smell: function() { 
                history.append("It smells fridgy.");
            },
            look_at: function() {
                if( ! objects.fridge.state.open ){ 
                    history.append("It's a Fridgit Jones 5000.");
                }
                else{
                    history.append("
                }
            },
            open: function() { 
                if( ! objects.fridge.state.open ){
                    objects.fridge.state = "open"; 
                    history.append( "You open the fridge.", "narrator" );
                }
                else{
                    history.append( "The fridge remains open.", "narrator" );
                }
            }, 
            close: function() { 
                if( objects.fridge.state === "open" ){
                    objects.fridge.state = "closed"; 
                    history.append( "You close the fridge.", "narrator" );
                }
                else{
                    history.append( "The fridge remains closed.", "narrator" );
                }
            },
        }
    }
}

