// Popup provides tools for poppin' stuff up for the user.
define(function() {
    var public = {};

    public.dialog( title, html ){
        // TODO: properly html escape the title 
        title = title.replace(/'/g, '&amp;');
        var dialog = $( "<div id='dialog' title='"+title+"'> </div> " );
        dialog.append( html );
        $( dialog ).dialog( { modal: true } );
    };

});
