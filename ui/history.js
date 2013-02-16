// The History is the DOM list of all events. 
define(function() {

    var id = 0;

    return {
    append: function(message, author){
        if(typeof(message) !== 'string' ){
            if( typeof(message) === 'undefined' ){
                console.error("Undefined value passed to history.append");
                return;
            }
            if( typeof(message.length) !== 'undefined' ){
                var message = message.join(" ");
            }
            else{
                console.error("Could not determine type of message");
                return;
            }
        }
        if(typeof(author) === 'undefined'){ author = "narrator" }
        $("#history").append( "<li class='"+author+"' id='history-"+id+"'>"+ message +" </li> " );
        $("#history").scrollTop($("#history")[0].scrollHeight);
        $("#history-"+id+" .object").each( function( i, obj ){
            $(obj).hover( function(){ 
                $("#target").autocomplete( 'search', $(obj).html() ) ;
            }, function() { 
            } );
        });
        id++;
    }
}

});
