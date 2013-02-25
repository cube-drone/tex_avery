define(["engine/objects"], 
        function( objects ){

var journal = {
    add_to_journal:function(thing){
        var current_journal = this.get_state("current_journal");
        if( current_journal === null){
            current_journal = [];
        }
        if( !_.contains( current_journal, thing )){
            current_journal.push( thing );
            this.set_state("current_journal", current_journal );
        };
    },
    get_journal:function(){
        var current_journal = this.get_state("current_journal");
        if( current_journal === null){
            current_journal = [];
        }
        return current_journal;
    }
}
var public = objects.add_to_universe("journal", journal); 

return public;
});
