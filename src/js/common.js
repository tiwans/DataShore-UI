"use strict"

// var config = {
//     apiKey: "AIzaSyDkBifE9dCgqzn4ivf5uD7RXSwfN99Na_o",
//     authDomain: "workflow-462a4.firebaseapp.com",
//     databaseURL: "https://workflow-462a4.firebaseio.com",
//     storageBucket: "workflow-462a4.appspot.com",
//     messagingSenderId: "889877406021"
// };
// firebase.initializeApp(config);

function runPyScript(input){
        var jqXHR = $.ajax({
            type: "POST",
            url: "/login",
            async: false,
            data: { mydata: input }
        });

        return jqXHR.responseText;
    }

    $('#submitbutton').click(function(){
        datatosend = 'this is my matrix';
        result = runPyScript(datatosend);
        console.log('Got back ' + result);
    });