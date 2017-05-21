"use strict"
console.log("common.js called");
var config = {
apiKey: "AIzaSyANfwhjv-oRcJhVp6sQfArTorgh4jsZFJw",
authDomain: "datashore-7057d.firebaseapp.com",
databaseURL: "https://datashore-7057d.firebaseio.com",
projectId: "datashore-7057d",
storageBucket: "datashore-7057d.appspot.com",
messagingSenderId: "352958906618"
};
firebase.initializeApp(config);

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