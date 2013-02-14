// The History is the DOM list of all events. 
define(function() {

    var id = 0;

    return {
    pagebreak: function() {
        $("#history").append( "<li class='pagebreak'> </li>" );
    },
    append: function(message, author){
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
