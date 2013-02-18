// The History is the DOM list of all events. 
define(function() {

    var id = 0;
    var dialog = function( title, html ){
        title = title.replace(/'/g, '&amp;');
        $("#dialog").remove();
        var dialog = $( "<div id='dialog' title='"+title+"'> </div> " );
        dialog.append( html );
        $( dialog ).dialog( );
        $(document).append(dialog);
    };

    return {
    append: function(message, author, popup){
        if(typeof(message) !== 'string' && ! message instanceof jQuery ){
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

        var li = $("<li class='"+author+"' id='history-"+id+"'> </li>" )
        if( typeof(popup) !== 'undefined' ){
            li.addClass("clickable").click( function(){
                dialog( message, popup );
            });
            li.append("<i class='icon-eye-open icon-white' />");
        };
        li.append( message ); 
        $("#history").append( li );
        $("#history").scrollTop($("#history")[0].scrollHeight);
        $("#history-"+id+" .object").each( function( i, obj ){
            $(obj).hover( function(){ 
                if( $(".choices").length === 0 ){
                    $("#target").autocomplete( 'search', $(obj).html() ) ;
                }
            }, function() { 
            } );
        });
        id++;
    }
}

});
