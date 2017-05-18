"use strict";

// init variables
var USER; // the current user
var stage_content = document.getElementById('stage_content');
var project_name;
var stg_count=0;
var csvData;
var file;
var data;
var output_res;
var res_len;
var pred_var;
var upload_var;
var template_var = [];
var stg_array=['creat_pro_stg','select_var_stg','upload_dt_stg','view_dt_stg'];
//############## Initialize Firebase ##############//
var config = {
    apiKey: "AIzaSyANfwhjv-oRcJhVp6sQfArTorgh4jsZFJw",
    authDomain: "datashore-7057d.firebaseapp.com",
    databaseURL: "https://datashore-7057d.firebaseio.com",
    projectId: "datashore-7057d",
    storageBucket: "datashore-7057d.appspot.com",
    messagingSenderId: "352958906618"
  };
firebase.initializeApp(config);
var database = firebase.database();
//############## Authentication User ##############//
init();
function authenticateUser(){
    firebase.auth().onAuthStateChanged(function(currUser) {
        if (currUser) {
            // User is signed in.
            USER = currUser;
            console.log(USER.displayName);
            sessionStorage.USER = USER.displayName;
        } else {
            // No user is signed in.
            window.location.href = "src/html/signin.html";
        }
    });
}

//##############Different Process Stage###########//
var create_project = "<div class='home panel' id='create_project'><div class='panel-heading'><h2 class='panel-title'>Create Project</h2></div><div class='panel-body'>Name your project<div class='input-group project_name'><span class='input-group-addon' id='sizing-addon2'>Name</span><input type='text' class='form-control' placeholder='Project Name' aria-describedby='sizing-addon2' id='project_name'></div><button type='button' class='btn btn-default stg_btn' onClick=creatPro()>Create</button></div></div>";
var select_var = '<div class="home panel" id="variable-select"><div class="panel-heading"><h2 class="panel-title">Select Variable</h2></div><div class="panel-body">Choose a varibale to predict!</div><div><select id="varSelect" class="dropdown" onchange="selectVar(event)"><option value="">---</option><option value="salinity">Salinity</option><option value="temperature">Temperature</option><option value="density">Density</option><option value="other">Other</option></select></div></div> <div class="home panel" id="variable-require"><div class="panel-heading"><h2 class="panel-title">Prepare to Upload your Data</h2></div><div class="panel-body">The required varables needed to predict</div><div><p id="variable-require-result"></p></div></div>';
var upload_data = "<div class='home panel' id='upload_data'><div class='panel-heading'><h2 class='panel-title'>Upload Data</h2></div><div class='panel-body'>Choose the file to uploadupload_data<input type='file' name='File Upload' id='txtFileUpload' onChange='browse(event)' accept='.csv'/><button type='button' class='btn btn-default stg_btn' onClick='upload()'>Upload</button></div></div>";
var output_dt="<div class='home panel' id='output_dt'><div class='panel-heading'><h2 class='panel-title'>View Output</h2></div><div class='panel-body'><div id=table_div'><table class='table table-striped' id='output_table'></table></div><button type='button' class='btn btn-default stg_btn' onClick=download()>Download Output and Exit</button><a href='src/html/visualize.html' type='button' class='btn btn-default'>Continue to Dashboard</a></div></div>"

//##############End of Different Process Stage###########//
//#### init ####//
function init(){
    authenticateUser();
    console.log(sessionStorage.USER);
    var dataRef = database.ref('project/').child(sessionStorage.USER);
    dataRef.once("value",function(snapshot){
        if(snapshot.toJSON() != null){
            console.log("get_list");
            get_list();
        }else{
            console.log("create_project");
            creat_project();
        }
    })
    $("#signout").click(function(){
            firebase.auth().signOut().then(function() {
                window.location.href = "src/html/signin.html";
            }, function(error) {
                console.error('Sign Out Error', error);
            });
        });
}

///#####++++++++++++++++#####//
///###  GET PROJECT LIST  ###//
///#####               #####//
function get_list(){
    $("#creat_new_project").css("display","none");
    $("#view_project_list").css("display","block");
    var dataRef = database.ref('project/' + sessionStorage.USER);
    var project_list_div =document.getElementById("project_list");
    dataRef.once('value', function(snapshot) {
        snapshot.forEach(function(child) {
                var project = child.toJSON();
                console.log(project);
                var projectName = project.Project_Tittle;
                var creatDate = project.CreateDate;
                var project_div = document.createElement("div");
                project_div.setAttribute("class","project_card demo-card-square mdl-card mdl-shadow--2dp");
                project_div.innerHTML="<div class='mdl-card__title mdl-card--expand'><h2 class='project_tit_text mdl-card__title-text'>"+projectName+"</h2></div><div class='project_card_content mdl-card__supporting-text'>"+creatDate+"</div><div class='mdl-card__actions mdl-card--border'><a class='project_link mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect' href='src/html/visualize.html'>View Updates</a></div>"
                project_list_div.appendChild(project_div);
                $('.project_link').click(function(){
                    sessionStorage.project_name = projectName;
                });
        });
    });
    $("#add_project_btn").click(function(){
        creat_project();
    })
}




///#####++++++++++++++++#####//
///###CREATE NEW PROJECT###//
///#####              #####//
//#### tutorial ####//
function creat_project(){
    $("#creat_new_project").css("display","block");
    $("#view_project_list").css("display","none");
    stage_content.innerHTML = create_project;
}

function showTut(){
    var tut_innerHTML='<div><img src="src/tut_1.1.png" alt="tutorial_1" id="tut_img_1"><img src="src/tut_2.png" alt="tutorial_2" id="tut_img_2"></div>';
    var tut_btn = '<button type="button" class="mdl-button mdl-button--fab" id="tut_btn_done" onClick="removeTut()"><i class="material-icons" id="tut_icon">clear</i></button>'
    $("#modal_tut").modal();
        $("#tut_leave").click(function(){
            var tut_2_height = $(".process_bar").css('height');
            console.log(tut_2_height);
            $(".bs-wizard-info").css("visibility","hidden");
            var tut_btn_div = document.createElement('div');
            tut_btn_div.setAttribute('id','tut_btn_div');
            tut_btn_div.innerHTML = tut_btn;
            var container = document.getElementById('container');
            container.appendChild(tut_btn_div);
            var body = document.getElementById('body');
            var tut_descr_div = document.createElement('div');
            tut_descr_div.setAttribute('id','tutorial');
            tut_descr_div.innerHTML = tut_innerHTML;
            body.appendChild(tut_descr_div);
    })
}

function removeTut(){
    alert('exit the tutorial');
    var tut_descr_div = document.getElementById('tutorial');
    tut_descr_div.innerHTML = "";
    var body = document.getElementById('body');
    body.removeChild(tut_descr_div);
    var tut_btn_div = document.getElementById('tut_btn_div');
    var container = document.getElementById('container');
    container.removeChild(tut_btn_div);
    $(".bs-wizard-info").css("visibility","visible");
}
//#### end of tutorial ####//

//#### modal ####//
function rollbaclModal(clicked_id){
    if(stg_count < stg_array.indexOf(clicked_id)){
        alert("you cannot skip this page without finish it or please cick the next button to continue");
    }else{
        $("#myModal").modal();
        $("#modal_leave").click(function(){
            rollback(clicked_id);
        })
    }
}

//rollback to the desired stage
function rollback(clicked_id){
    var prev_stg_count = stg_count;
    stg_count = stg_array.indexOf(clicked_id);
    console.log("stg_count", stg_count);
    document.getElementById(stg_array[prev_stg_count]).classList.remove('active');
    console.log("prev_stg_count",prev_stg_count);
    while(prev_stg_count > stg_count){
        document.getElementById(stg_array[prev_stg_count]).classList.remove('complete');
        document.getElementById(stg_array[prev_stg_count]).classList.add('disabled');
        prev_stg_count --;
        console.log("prev_stg_count",prev_stg_count);
    }
    document.getElementById(stg_array[stg_count]).classList.remove('complete');
    document.getElementById(stg_array[stg_count]).classList.add('active');
    if(stg_count == 0){
        stage_content.innerHTML = create_project;
    }else if(stg_count == 1){
        stage_content.innerHTML = select_var;
    }else if(stg_count == 2){
        stage_content.innerHTML = upload_data;
    }else if(stg_count == 3){
        stage_content.innerHTML = output_dt;
    }
}

// create project
function creatPro(){
    project_name = document.getElementById('project_name').value;
    document.getElementById('stage_content').innerHTML = select_var;
    document.getElementById("creat_pro_stg").classList.remove('active');
    document.getElementById("creat_pro_stg").classList.add('complete');
    document.getElementById("select_var_stg").classList.remove('disabled');
    document.getElementById("select_var_stg").classList.add("active");
    stg_count=0;
    sessionStorage.setItem('project_name', project_name);
}

//select var
function selectVar(evt){
    console.log("selectVar")
     evt.preventDefault();
     var varSelect = document.getElementById("varSelect");
    if(varSelect){
        console.log(varSelect.value)
        var varRequire = document.getElementById("variable-require-result");
        if(varSelect.value == "salinity") {
            varRequire.innerHTML = "<button type='button' class='mdl-chip' id='csvFileUpload' accept='.csv'><span class='mdl-chip__text'>Temperature</span></button> <button type='button' class='mdl-chip'><span class='mdl-chip__text'>Density</span></button> <div><button type='button' id='nextStep' class='btn btn-default stg_btn' onClick='startUpload()'><span class='mdl-chip__text'>Next</span></button></div>"
            pred_var = 'salinity';
            upload_var = ['temperature', 'density'];

        }
        if(varSelect.value == "temperature") {
            varRequire.innerHTML = "<button type='button' class='mdl-chip' id='csvFileUpload' accept='.csv'><span class='mdl-chip__text'>Density</span></button> <button type='button' class='mdl-chip'><span class='mdl-chip__text'>Salinity</span></button>  <div><button type='button' id='nextStep' class='btn btn-default stg_btn' onClick='startUpload()'><span class='mdl-chip__text'>Next</span></button></div>"
            pred_var = 'temperature';
            upload_var = ['salinity', 'density'];
        }
        if(varSelect.value == "density") {
            varRequire.innerHTML = "<button type='button' class='mdl-chip' id='csvFileUpload' accept='.csv'><span class='mdl-chip__text'>Temperature</span></button> <button type='button' class='mdl-chip'><span class='mdl-chip__text'>salinity</span></button>  <div><button type='button' id='nextStep' class='btn btn-default stg_btn' onClick='startUpload()'><span class='mdl-chip__text'>Next</span></button></div>"
            pred_var = 'density';
            upload_var = ['temperature', 'salinity'];
        }
        template_var[0]=pred_var;
        upload_var.forEach(function(data,index){
            template_var[index+1]=data;
        });
        stg_count++;
    }else{
        console.log("null")
    }
}

//download tempload before upload
function startUpload(){
    // Method that checks that the browser supports the HTML5 File API
    downloadTemplate(template_var);
    document.getElementById("select_var_stg").classList.remove('active');
    document.getElementById("select_var_stg").classList.add('complete');
    document.getElementById("upload_dt_stg").classList.remove('disabled');
    document.getElementById("upload_dt_stg").classList.add("active");
    document.getElementById('stage_content').innerHTML=upload_data;
    stg_count++;
}


function browserSupportFileUpload() {
    var isCompatible = false;
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        isCompatible = true;
    }
    return isCompatible;
}

// Method that reads and processes the selected file
function browse(evt) {
    evt.preventDefault();
    if (!browserSupportFileUpload()) {
        alert('The File APIs are not fully supported in this browser!');
    } else {
        file = evt.target.files[0];
    }   
}

//upload the file
function upload(){
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(evt) {
        csvData = evt.target.result;
        data = $.csv.toArrays(csvData);
        if (data && data.length > 0) {
            // $(document).ready(function(){
            //     $.ajax({
            //         type: "POST",
            //         url: "src/test",
            //         data: {csvData}
            //     }).done(function() {
            //     // do something
            //         alert("finished");
            //     });
            // });
            writeData(project_name);

            viewOutput(data);
        }else{
            reader.onerror = function() {
                alert('Unable to read ' + file.fileName);
            };
        }
    }
}


function writeData(project_name){
    database.ref('project/' + USER.displayName + "/" + project_name).set({
        Project_Tittle: project_name,
        CreateDate: Date(),
        Uploaded_File: csvData,
        Output_file: null,
        Variable: "set1",
        Chart:{},
        User:{},
        Collaboratores:{}
    });
    console.log("finished");
}

function viewOutput(data){
    alert('Imported -' + data.length + '- rows successfully!');
    document.getElementById("upload_dt_stg").classList.remove('active');
    document.getElementById("upload_dt_stg").classList.add('complete');
    document.getElementById("view_dt_stg").classList.remove('disabled');
    document.getElementById("view_dt_stg").classList.add("complete");
    document.getElementById('stage_content').innerHTML = output_dt;
    res_len = 1;
    retrive_output(project_name);
    creatTB(res_len);
    stg_count++;
}

function download(){
    var csvContent = "data:text/csv;charset=utf-8,";
    var output = data.slice(1);
    output.forEach(function(infoArray, index){
        console.log(infoArray);
        var dataString = infoArray.join(",");
        csvContent += index < output.length ? dataString+ "\n" : dataString;
    }); 

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", project_name+".csv");
    document.body.appendChild(link); // Required for FF

    link.click();
    get_list();
}

function downloadTemplate(template_var){
    var csvContent = "data:text/csv;charset=utf-8,";
    var output = [['data'],template_var];
    output.forEach(function(infoArray, index){
        console.log(infoArray);
        var dataString = infoArray.join(",");
        csvContent += index < output.length ? dataString+ "\n" : dataString;
    }); 

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", project_name+"_template.csv");
    document.body.appendChild(link); // Required for FF

    link.click();
}

function retrive_output(project_name){
    var dataRef = database.ref('project/' + USER.displayName +"/" + project_name);
    dataRef.once('value', function(snapshot) {
        snapshot.forEach(function(child) {
            if(child.key == 'Uploaded_File'){
                console.log(child.val());
                output_res = child.val();
            }
        });
    });
}

function creatTB(res_len){
    var table = document.getElementById('output_table');
    var tbody = document.createElement('tbody');
    var startParse = false;
    var nonbody_count = 0;
    var index = 0;
    output_res = $.csv.toArrays(output_res);
    while(index < output_res.length){
        console.log(output_res[index]);
        var dataRow = output_res[index];
        if(dataRow[0]=="data"){
            nonbody_count = index + 1;
            console.log(nonbody_count);
            startParse = true;
            index = index + 1;
            dataRow = output_res[index];
            var thead = document.createElement('thead');
            var head_row = document.createElement('tr');
            var head_cell = document.createElement('th');
            head_cell.innerHTML = "#";
            head_row.appendChild(head_cell);
            dataRow.forEach(function(element, i){
                var data_len = dataRow.length - res_len;
                if(i < data_len){
                    var head_cell = document.createElement('th');
                    head_cell.innerHTML = element;
                    head_row.appendChild(head_cell);
                }else{
                    var head_cell = document.createElement('th');
                    head_cell.innerHTML = element + "(result)";
                    head_row.appendChild(head_cell);
                }
            });
            thead.appendChild(head_row);
            table.appendChild(thead);
        }else if(dataRow[0]!="data" && startParse){
            var body_row = document.createElement('tr');
            var body_index = document.createElement('th');
            body_index.setAttribute("scope","row");
            body_index.innerHTML = index-nonbody_count;
            body_row.appendChild(body_index);
            dataRow.forEach(function(element, i){
                var body_cell = document.createElement('td');
                body_cell.innerHTML = dataRow[i];
                body_row.appendChild(body_cell);
            });
            tbody.appendChild(body_row);
        }else{
            //do nothing;
        }
        index = index + 1;
    }
    table.appendChild(tbody);
}
