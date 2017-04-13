"use strict";
//create the event listener
var varSelect = document.getElementById("varSelect");
//var fileUploaeded;
console.log("call")
if(varSelect){
    varSelect.addEventListener("change", function(){
        //initate the basic sturcture for the webpage: heading and table
        //document.getElementById("report").innerHTML = "";

        //generate star war table
        console.log(varSelect.value)
        var varRequire = document.getElementById("variable-require-result");
        if(varSelect.value == "salinity") {
            varRequire.innerHTML = "<button type='button' class='mdl-chip' id='csvFileUpload' accept='.csv'><span class='mdl-chip__text'>Temperature</span></button> <button type='button' class='mdl-chip'><span class='mdl-chip__text'>Density</span></button> <input type='file' name='File Upload' id='txtFileUpload' onchange='startUpload(event)' accept='.csv'/> <button type='button' id='nextStep' class='mdl-chip'><span class='mdl-chip__text'>Next</span></button>"
            //fileUploaeded = document.getElementById('txtFileUpload');
        }
        if(varSelect.value == "temperature") {
            varRequire.innerHTML = "<button type='button' class='mdl-chip' id='csvFileUpload' accept='.csv'><span class='mdl-chip__text'>Density</span></button> <button type='button' class='mdl-chip'><span class='mdl-chip__text'>Salinity</span></button> <input type='file' name='File Upload' id='txtFileUpload' onchange='startUpload(event)' accept='.csv'/> <button type='button' id='nextStep' class='mdl-chip'><span class='mdl-chip__text'>Next</span></button>"
            //fileUploaeded = document.getElementById('txtFileUpload');
        }
        if(varSelect.value == "density") {
            varRequire.innerHTML = "<button type='button' class='mdl-chip' id='csvFileUpload' accept='.csv'><span class='mdl-chip__text'>Temperature</span></button> <button type='button' class='mdl-chip'><span class='mdl-chip__text'>salinity</span></button> <input type='file' name='File Upload' id='txtFileUpload' onchange='startUpload(event)' accept='.csv'/> <button type='button' id='nextStep' class='mdl-chip'><span class='mdl-chip__text'><a href='src/visualize.html'>Next</span></button>"
            //fileUploaeded = document.getElementById('txtFileUpload');
        }
    });
}else{
    console.log("null")
}

function startUpload(evt){
    // Method that checks that the browser supports the HTML5 File API
    evt.preventDefault();
    upload(evt);
    function browserSupportFileUpload() {
        var isCompatible = false;
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            isCompatible = true;
            //alert("isCompatible");
        }
        return isCompatible;
    }

    // Method that reads and processes the selected file
    function upload(evt) {
        if (!browserSupportFileUpload()) {
            //alert('The File APIs are not fully supported in this browser!');
        } else {
                //alert("start to read");
                var data = null;
                var file = evt.target.files[0];
                var reader = new FileReader();
                //alert(file);
                reader.readAsText(file);
                reader.onload = function(event) {
                    var csvData = event.target.result;
                    data = $.csv.toArrays(csvData);
                    if (data && data.length > 0) {
                        alert('Imported -' + data.length + '- rows successfully!');
                    
                    }else{
                        reader.onerror = function() {
                            alert('Unable to read ' + file.fileName);
                        };
                    }
                }
        }   
    }
}


