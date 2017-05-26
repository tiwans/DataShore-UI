"use strict";

//############## Initialize ##############//
var USER;
var output_res=[];
var dataRef;
var headers;
var myObject;
//init firebase
var database = firebase.database();
//get the project name
var s1 = window.location.search.substring(1, location.search.length).split('=');
var project_name = decodeURI(s1[1]);
var pro_content = document.getElementById("page_content_profile");
var chart_content = document.getElementById("page_content_chart");
var static_content = document.getElementById("page_content_static");
//init the style of site
chart_content.setAttribute("style","display:none");
static_content.setAttribute("style","display:none");
//fill out nav bar project name
$("#nav_bead_pn").html(project_name);
$("#signout").click(function(){
    console.log("click");
    firebase.auth().signOut().then(function() {
        window.location.href = "signin.html";
    }, function(error) {
        console.error('Sign Out Error', error);
    });
});
authenticateUser_vis();
function authenticateUser_vis(){
    firebase.auth().onAuthStateChanged(function(currUser) {
        if (currUser) {
            // User is signed in.
            USER = currUser;
            $("#nav_user_pro h4").html(USER.displayName);
            dataRef = database.ref('project/' + USER.displayName + "/" + project_name);
            console.log(USER.displayName,project_name);
            sessionStorage.USER = USER.displayName;
            init_vis();
        } else {
            // No user is signed in.
            window.location.href = "signin.html";
        }
    });
}
function init_vis(){
    dataRef = database.ref('project/' + USER.displayName + "/" + project_name);
    dataRef.once('value', function(snapshot) {
        snapshot.forEach(function(child) {
            //find the file and parse it into map//
            if(child.key == 'Uploaded_File'){
                console.log("unploaded file called");
                output_res = child.val();
                output_res = $.csv.toArrays(output_res);
                output_res = output_res.slice(1);
                var lineArray = [];
                output_res.forEach(function(infoArray, index){
                    var dataString = infoArray.join(",");
                    lineArray.push(dataString);
                }); 
                var csvContent = lineArray.join("\n");
                var data= d3.csv.parse(csvContent);
                headers = d3.keys(data[0]);
                myObject = {};
                headers.forEach(function(d) {
                    myObject[d] = [];
                });
                data.forEach(function(d) {
                    for (var key in d) {
                        myObject[key].push(d[key]);
                    }
                });
                window.data=myObject;
                creat_profolie(myObject,headers);
                display_chart()
                output_res = child.val();
                display_static(1);
            }  
        });
    });
//############## End of Initialize ##############//

//############## Strat of Page Swicth ##############//
    $("#nav_pro").click(function(){
        pro_content.setAttribute("style","display:block");
        static_content.setAttribute("style","display:none");
        chart_content.setAttribute("style","display:none");
        $("#nav_bead_li").html("Profile");
        $("#nav_pro").prop("class","active");
        $("#nav_chart").prop("class","abled");
        $("#nav_static").prop("class","abled");
    })
    $("#nav_chart").click(function(){
        chart_content.setAttribute("style","display:block");
        pro_content.setAttribute("style","display:none");
        static_content.setAttribute("style","display:none");
        $("#nav_bead_li").html("Chart");
        $("#nav_chart").prop("class","active");
        $("#nav_pro").prop("class","abled");
        $("#nav_static").prop("class","abled");
    })
    $("#nav_static").click(function(){
        static_content.setAttribute("style","display:block");
        chart_content.setAttribute("style","display:none");
        pro_content.setAttribute("style","display:none");
        $("#nav_bead_li").html("Static");
        $("#nav_static").prop("class","active");
        $("#nav_pro").prop("class","abled");
        $("#nav_chart").prop("class","abled");
    })
}

// $.each($(".pin:checkbox:checked"), function(){ 
//         var $div = $(this).parent().parent();
//         var $sub_div = $div.find(".js-plotly-plot");  
//         $("#pined_chart").html($sub_div);
//         console.log("content",$sub_div);
// });

$(".pin").change(function() {
    console.log("click");
    // if(this.checked) {
    //     var $div = $(this).parent().parent();
    //     var $sub_div = $div.find(".js-plotly-plot");  
    //     $("#pined_chart").html($sub_div);
    //     console.log("content",$sub_div);
    // }
});

function creat_profolie(myObject,headers){
    console.log("create profolie called",myObject);
    var temp = {
                y: myObject['pressure'],
                x: myObject['temperature'],
                mode: 'markers+lines',
                type: 'scatter',
                name: 'temperature',
                line: {shape: 'spline'},
                marker: { size: 5,
                        color: 'rgb(93, 164, 214)'},
            }
    var density = {
        y: myObject['pressure'],
        x: myObject['density'],
        mode: 'markers+lines',
        type: 'scatter',
        name: 'density',
        line: {shape: 'spline'},
        marker: { 
            size: 5,
            color: 'rgb(255, 65, 54)',
            sizeref: 2,
            symbol: 'square'},
    };

    var salinity = {
        y: myObject['pressure'],
        x: myObject['salinity'],
        mode: 'markers+lines',
        type: 'scatter',
        name: 'salinity',
        line: {shape: 'spline'},
        marker: { 
            size: 5,
            color: 'rgb(44, 160, 101)',
            sizeref: 2,
            symbol: 'diamond'},
    };

    //intergrated line chart--default//
    var dataset1 =[temp,density,salinity];
    var layout1 = {
        title:'Basic Profile',
        xaxis: {
            side: 'top',
            title: headers.toString()},
        yaxis: {
            autorange: 'reversed',
            title: 'pressure'},
        height: 700,
        width:500
    };
    Plotly.newPlot('it_line_chart',dataset1,layout1);

    //seperated line chart
    var temp_layout = {
        title:'Basic Profile',
        xaxis: {
            side: 'top',
            title: "temperature"},
        yaxis: {
            autorange: 'reversed',
            title: 'pressure'},
        height: 500
    };
    var density_layout = {
        title:'Basic Profile',
        xaxis: {
            side: 'top',
            title: "density"},
        yaxis: {
            autorange: 'reversed',
            title: 'pressure'},
        height: 500
    };
    var salinity_layout = {
        title:'Basic Profile',
        xaxis: {
            side: 'top',
            title: "salinity"},
        yaxis: {
            autorange: 'reversed',
            title: 'pressure'},
        height: 500
    };
    Plotly.newPlot('temp',[temp],temp_layout);
    Plotly.newPlot('density',[density],density_layout);
    Plotly.newPlot('salinity',[salinity],salinity_layout);
    var it_line_chart = document.getElementById("it_line_chart");
    var sp_line_chart = document.getElementById("sp_line_chart");
    sp_line_chart.setAttribute("style","display:none");
    //switch between intergrated and seperated chart
    $(".mdl-switch__input").click(function(){
        var checked=$(this).prop('checked');
        if (checked){
            it_line_chart.setAttribute("style","display:block");
            sp_line_chart.setAttribute("style","display:none");
        }else{
            it_line_chart.setAttribute("style","display:none");
            sp_line_chart.setAttribute("style","display:block");
        }
    })
}


function display_chart(){
    var chart_type;
    var pined_chart =document.getElementById("pined_chart");
    dataRef.child("/chart").once('value', function(snapshot) {
        snapshot.forEach(function(chart) {
            var chart = chart.toJSON();
            console.log("draw graph called");
            if(chart.chart_type =="line_chart" || chart.chart_type=="scatter_plot"){
                create_scatter_line(chart.var[0],chart.var[1],chart.chart_type);
            }else if(chart.chart_type=="box plot" || chart.chart_type=="histogram"){
                create_box_hist(chart.var[0],chart.chart_type);
            }
        });
    });
    //show the create chart modal
    $('#add_chart_btn').on('click',function(){
       model_default();
    });
    //select chart type
    $('.list-group-item').click(function() {
        model_default();
        $(this).addClass("active");
        $("#chart_img_src").prop("src","src/img/" +$(this).prop("id")+".png");
        $(".var").prop("checked", false);
        chart_type = $(this).prop("id");
    });
    $("#modal_next").click(function(){
        var chart_id;
        var variable=[];
        $("#modal_next").css("display","none");
        console.log("chart_type",chart_type);
        $("#modal_next_next").css("display","inline-block");
        $('#chart_type_preview').css("display","none");
        $('#scatter_line').css("display","block");
        if(chart_type=="scatter_plot"||chart_type=="line_chart"){
            $("#modal_next_next").click(function(){
                var x = {};
                var y ={};
                $.each($(".var:checkbox:checked"), function(){     
                    var $div = $(this).parent().parent();
                    var $btn = $div.find(".jscolor");
                    if($btn.css("visibility")=="hidden"){
                        x[""+$(this).val()]=myObject[""+$(this).val()]
                    }
                    if($btn.css("visibility")!="hidden"){
                        y[""+$(this).val()]=myObject[""+$(this).val()]
                        y["color"]=$btn.css("background-color");
                    }
                });
                chart_id=Object.keys(x)[0]+"_"+Object.keys(y)[0]+"_"+chart_type;
                variable.push(x);
                variable.push(y);
                dataRef.child("/chart/"+chart_id).set({
                    chart_type:chart_type,
                    var:variable,
                    pin:false,
                });
                $(".var").prop("checked", false);
                $('#chart_list').css("display","block");
                create_scatter_line(x,y,chart_type);
            });
        }else if(chart_type=="box plot" || chart_type=="histogram"){
            $("#modal_next_next").click(function(){
                var y ={};
                $.each($(".var:checkbox:checked"), function(){     
                    var $div = $(this).parent().parent();
                    var $btn = $div.find(".jscolor");
                    if($btn.css("visibility")!="hidden"){
                        y[""+$(this).val()]=myObject[""+$(this).val()]
                        y["color"]=$btn.css("background-color");
                    }
                });
                variable.push(y);
                chart_id=Object.keys(y)[0]+"_"+chart_type;
                dataRef.child("/chart/"+chart_id).set({
                    chart_type:chart_type,
                    var:variable,
                    pin:false,
                });
                $(".var").prop("checked", false);
                $('#chart_list').css("display","block");
                create_box_hist(y,chart_type);
            });
        }
    });
    $(".modal_leave").click(function(){
            $('#chart_list').css("display","block");
        $('#chart_sel_modal').prop("style","display:none");
    })
}

function display_static(res_len){
    creatTB(res_len)
}

//helper function to static site
function creatTB(res_len){
    var table = document.getElementById('output_table');
    var tbody = document.createElement('tbody');
    var startParse = false;
    var nonbody_count = 0;
    var index = 0;
    output_res = $.csv.toArrays(output_res);
    while(index < output_res.length){
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

//helper function to static site
function download(){
    var csvContent = "data:text/csv;charset=utf-8,";
    var output = output_res.slice(1);
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
}

//############## End of Page Swicth ##############//

//take in para: 
//@x:array || @y:array ||@z_ary: dict,object ||@color_ary: dict,object
function create_heatmap(x,y,z_ary,color_ary){
    // console.log(x,y,z_ary,color_ary);
    var parent_div=document.getElementById("chart_list");
    var map_var_count=Object.keys(z_ary).length;
    var column_length=4; //x.length;
    var row_length=9; //y.length;
    for(var i=0; i <map_var_count; i++){
        var child_div = document.createElement("div");
        child_div.setAttribute("class","heatmap");
        var z = reorgZ_ary(z_ary[Object.keys(z_ary)[i]],column_length,row_length);
        //x: time
        var xValues = [1,2,3,4];
        //y: pressure
        var yValues = [1,2,3,4,5,6,7,8,9];

        var zValues = z
        // console.log(xValues.length,yValues.length,zValues);
        var data = [{
                x: xValues,
                y: yValues,
                z: zValues,
                type: 'heatmap'
            }];
        var layout = {
            title: Object.keys(z_ary)[i] + " Heatmap",
            xaxis: {
                title: "time",
                side: 'right'
            },
            yaxis: {
                title:"pressure"
            },
            height: 400,
            width: 400
        }
        Plotly.newPlot(child_div, data, layout);
        parent_div.appendChild(child_div);
    }
}

//helper for heatmap
function reorgZ_ary(array,column_length,row_length){
    // console.log("reorgZ_ary called",row_length + " " + column_length + " " + array.length);
    var z_res=[];
    for (var i=0; i<row_length; i++) {
        z_res[i] = array.slice(i*column_length,(i+1)*column_length);
        // console.log(i,z_res[i].length);
    }
    return z_res;
}

function create_scatter_line(x,y,chart_type){
    var parent_div= document.getElementById("chart_list");
    var child_div = document.createElement("div");
    var y_keys = Object.keys(y);
    var x_keys=Object.keys(x);
    var id;
    var y_list = y[y_keys[0]];
    var x_list = x[x_keys[0]];
    var y_tit = Object.keys(y)[0];
    var x_tit = Object.keys(x)[0];
    var hexColor;
    if(y_keys[0]=="color"){
        y_list = Object.values(y[y_keys[1]]);
        x_list = Object.values(x_list);
        y_tit = Object.keys(y)[1];
        id=chart_type+"_"+x_keys[0]+"_"+y_keys[1];
        hexColor = y.color;
    }else{
       hexColor = rgb2hex(y[y_keys[1]])
       id=chart_type+"_"+x_keys[0]+"_"+y_keys[0];
    }
    // console.log(x_list,y_list);
    if(chart_type=="scatter_plot"){
        var trace1 = {
            x: x_list,
            y: y_list,
            mode: 'markers',
            marker: {
                size: 10,
                color:hexColor,
            }
        };
        var data = [trace1];
        var layout = {
            title:""+x_tit + " " +y_tit + " " + chart_type,
            xaxis: {
                title: x_tit},
            yaxis: {
                title: y_tit},
            height: 400,
            width:400
        };
        child_div.setAttribute("class","scatter");
        child_div.setAttribute("id",id);
    }else{
        var trace1 = {
            x: x_list,
            y: y_list,
            mode: 'lines',
            line: {
                color:hexColor,
                width: 3
                }
        };
        var data = [trace1];
        var layout = {
            title:""+x_tit + " " +y_tit + " " + chart_type,
            xaxis: {
                title: x_tit},
            yaxis: {
                title: y_tit},
            height: 400,
            width:400
        };
        child_div.setAttribute("class","line");
        child_div.setAttribute("id",id);
    }
    var checkbox =document.createElement("div");
    checkbox.innerHTML = "<input type='checkbox' class='pin'>Pined to Profoile";
    child_div.appendChild(checkbox);
    parent_div.appendChild(child_div);
    Plotly.newPlot(id,data,layout);
    child_div.style.border = "2px solid black";
}

function create_box_hist(y,chart_type){
    // console.log(y,chart_type);
    var parent_div=document.getElementById("chart_list");
    var child_div = document.createElement("div");
    var id;
    var y_keys = Object.keys(y);
    var y_list = y[y_keys[0]];
    var y_tit = Object.keys(y)[0];
    var hexColor;
    if(y_keys[0]=="color"){
        y_list = Object.values(y[y_keys[1]]);
        y_tit = Object.keys(y)[1];
        hexColor = y.color;
        id=chart_type+"_"+y_keys[1];
    }else{
        hexColor = rgb2hex(y[y_keys[1]]);
        id=chart_type+"_"+y_keys[0];
    }
    if(chart_type=="box plot"){
        var data = [
                    {
                        y: y_list,
                        boxpoints: 'all',
                        jitter: 0.3,
                        pointpos: -1.8,
                        marker: {color: hexColor},
                        type: 'box'
                        
                    }
                    ];
        var layout = {
            title: y_tit + " "+chart_type,
            yaxis: {
                title: y_tit},
            height: 400,
            width:400
        };
        child_div.setAttribute("class","box");
        child_div.setAttribute("id",id);
    }else{
        var data = [
                    {
                        x: y_list,
                        type:"histogram",
                        opacity: 0.5,
                        marker: {
                            color: hexColor,
                        },
                    }
                    ];
        var layout = {
            title:y_tit + ""+chart_type,
            xaxis: {title: y_tit},
            yaxis: {title: "count"},
            height: 400,
            width:400
        };
        child_div.setAttribute("class","box");
        child_div.setAttribute("id",id);
    }
    var checkbox =document.createElement("div");
    checkbox.innerHTML = "<input type='checkbox' class='pin'>Pined to Profoile";
    child_div.appendChild(checkbox);
    parent_div.appendChild(child_div);
    Plotly.newPlot(id,data,layout);
    child_div.style.border = "2px solid black";
}



//* other code *//
//sct_lin_varSel
$('.sct_lin_axis_dp ul.dropdown-menu li a').click(function (e) {
    var $div = $(this).parent().parent().parent(); 
    var $pdiv = $(this).parent().parent().parent().parent(); 
    var $pbtn = $pdiv.find(".jscolor");
    var $btn = $div.find('button');
    $btn.html($(this).text() + ' <span class="caret"></span>');
    $div.removeClass('open');
    if($(this).text()=="X"){
        $pbtn.css("visibility","hidden");
        // console.log($pbtn.css("visibility"));
    }else{
         $pbtn.css("visibility","visible");
        //  console.log($pbtn.css("visibility"));
    }
    e.preventDefault();
    return false;
});


function rgb2hex(input){
    var input = "" + input;
    // console.log(input.toArrays());
    var rgb = input.match(/^rgb?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
    ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

//make the add new chart modal to default
//clear out all slected field
function model_default(){
    $("#chart_img_src").prop("src","");
    $('#chart_type_preview').css("display","inline-block");
    $('.chart_input').css("display","none");
    $('.list-group-item').removeClass("active");
    $(".var").prop("checked", false);
    $(".jscolor").css("visibility","visible");
    $(".jscolor").css("background-color","white");
    $(".jscolor").html("FFFFFF");
    $('#chart_list').css("display","none");
    $('#chart_sel_modal').css("display","block");
    $("#modal_next_next").css("display","none");
    $("#modal_next").css("display","inline-block");
}


