"use strict";
//create the event listener
var create_project = "<div class='home panel' id='create_project'><div class='panel-heading'><h2 class='panel-title'>Create Project</h2></div><div class='panel-body'>Name your project<div class='input-group project_name'><span class='input-group-addon' id='sizing-addon2'>Name</span><input type='text' class='form-control' placeholder='Project Name' aria-describedby='sizing-addon2'></div><button type='button' class='btn btn-default project_name'>Create</button></div></div>";
var select_var = '<div class="home panel" id="variable-select"><div class="panel-heading"><h2 class="panel-title">Select Variable</h2></div><div class="panel-body">Choose a varibale to predict!</div><div><select id="varSelect" class="dropdown" onchange="selectVar(event)"><option value="">---</option><option value="salinity">Salinity</option><option value="temperature">Temperature</option><option value="density">Density</option><option value="other">Other</option></select></div></div> <div class="home panel" id="variable-require"><div class="panel-heading"><h2 class="panel-title">Prepare to Upload your Data</h2></div><div class="panel-body">The required varables needed to predict</div><div><p id="variable-require-result"></p></div></div>';
var upload_data = "<div class='home panel' id='upload_data'><div class='panel-heading'><h2 class='panel-title'>Upload Data</h2></div><div class='panel-body'>Choose the file to uploadupload_data<input type='file' name='File Upload' id='txtFileUpload' onChange='upload(event)' accept='.csv'/></div><button type='button' class='btn btn-default project_name'>Upload</button></div></div>";
console.log("call")
document.getElementById('create_project_btn').addEventListener("click", function(){
    document.getElementById('stage_content').innerHTML = select_var;
    document.getElementById("creat_pro_stg").classList.remove('active');
    document.getElementById("creat_pro_stg").classList.add('complete');
    document.getElementById("select_var_stg").classList.remove('disabled');
    document.getElementById("select_var_stg").classList.add("active");
})
function selectVar(evt){
    console.log("selectVar")
     evt.preventDefault();
     var varSelect = document.getElementById("varSelect");
    if(varSelect){
        console.log(varSelect.value)
        var varRequire = document.getElementById("variable-require-result");
        if(varSelect.value == "salinity") {
            varRequire.innerHTML = "<button type='button' class='mdl-chip' id='csvFileUpload' accept='.csv'><span class='mdl-chip__text'>Temperature</span></button> <button type='button' class='mdl-chip'><span class='mdl-chip__text'>Density</span></button> <button type='button' id='nextStep' class='mdl-chip' onClick='startUpload()'><span class='mdl-chip__text'>Next</span></button>"
            //fileUploaeded = document.getElementById('txtFileUpload');
        }
        if(varSelect.value == "temperature") {
            varRequire.innerHTML = "<button type='button' class='mdl-chip' id='csvFileUpload' accept='.csv'><span class='mdl-chip__text'>Density</span></button> <button type='button' class='mdl-chip'><span class='mdl-chip__text'>Salinity</span></button>  <button type='button' id='nextStep' class='mdl-chip' onClick='startUpload()'><span class='mdl-chip__text'>Next</span></button>"
            //fileUploaeded = document.getElementById('txtFileUpload');
        }
        if(varSelect.value == "density") {
            varRequire.innerHTML = "<button type='button' class='mdl-chip' id='csvFileUpload' accept='.csv'><span class='mdl-chip__text'>Temperature</span></button> <button type='button' class='mdl-chip'><span class='mdl-chip__text'>salinity</span></button>  <button type='button' id='nextStep' class='mdl-chip' onClick='startUpload()'><span class='mdl-chip__text'>Next</span></button>"
            //fileUploaeded = document.getElementById('txtFileUpload');
        }
    }else{
        console.log("null")
    }
}

function startUpload(){
    // Method that checks that the browser supports the HTML5 File API
    document.getElementById("select_var_stg").classList.remove('active');
    document.getElementById("select_var_stg").classList.add('complete');
    document.getElementById("upload_dt_stg").classList.remove('disabled');
    document.getElementById("upload_dt_stg").classList.add("active");
    document.getElementById('stage_content').innerHTML=upload_data;
}
// upload(evt);
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
    evt.preventDefault();
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
                viewOutput(data);
            }else{
                reader.onerror = function() {
                    alert('Unable to read ' + file.fileName);
                };
            }
        }
    }   
}


function viewOutput(data){
    alert('Imported -' + data.length + '- rows successfully!');
    var output_dt='<table class="table table-striped"><thead><tr><th>#</th><th>First Name</th><th>Last Name</th><th>Username</th></tr></thead><tbody><tr><th scope="row">1</th><td>Mark</td><td>Otto</td><td>@mdo</td></tr><tr><th scope="row">2</th><td>Jacob</td><td>Thornton</td><td>@fat</td></tr><tr><th scope="row">3</th><td>Larry</td><td>the Bird</td><td>@twitter</td></tr></tbody></table>'
    document.getElementById("upload_dt_stg").classList.remove('active');
    document.getElementById("upload_dt_stg").classList.add('complete');
    document.getElementById("view_dt_stg").classList.remove('disabled');
    document.getElementById("view_dt_stg").classList.add("complete");
    document.getElementById('stage_content').innerHTML = output_dt;
}


