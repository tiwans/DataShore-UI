"use strict";

//############## Initialize ##############//
var project_name=sessionStorage.getItem("project_name")
var USER=sessionStorage.getItem("USER");
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
console.log(project_name);
var output_res=[];
var dataRef = database.ref('project/' + USER + "/" + project_name);
var pro_content = document.getElementById("page_content_profile");
var chart_content = document.getElementById("page_content_chart");
var static_content = document.getElementById("page_content_static");
chart_content.setAttribute("style","display:none");
static_content.setAttribute("style","display:none");
$("#nav_bead_pn").html(project_name);
$("#signout").click(function(){
    console.log("click");
    firebase.auth().signOut().then(function() {
        window.location.href = "../html/signin.html";
    }, function(error) {
        console.error('Sign Out Error', error);
    });
});
//############## End of Initialize ##############//

dataRef.on('value', function(snapshot) {
    snapshot.forEach(function(child) {
        //find the file and parse it into map//
        if(child.key == 'Uploaded_File'){
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
            var headers = d3.keys(data[0]);
            var myObject = {};
            headers.forEach(function(d) {
                myObject[d] = [];
            });
            data.forEach(function(d) {
                for (var key in d) {
                    myObject[key].push(d[key]);
                }
            });
            window.data=myObject;
            console.log(window.data);
        //end of parsing//

////############## Start of  of Profolie  and Chart from firebase##############//

            creat_profolie(myObject,headers);
            

//################+++++++++++++++++++++################//
//############## End of the Porfolie ##############//

////############## Start of the Chart ##############//
//################                    ################//
//############## Start of the personalize chart ##############//
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
                display_chart();
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
            function display_chart(){
                // chart_content.innerHTML="<p>hello</p>";
                var chart_type;
                var dataRef = database.ref('project/' + sessionStorage.USER +  "/" + project_name +"/chart/");
                var pined_chart =document.getElementById("pined_chart");
                dataRef.once('value', function(snapshot) {
                    snapshot.forEach(function(chart) {
                        var chart = chart.toJSON();
                        console.log(chart.var[0],chart.var[1]);
                        if(chart.chart_type =="line_chart" || chart.chart_type=="scatter_plot"){
                            create_scatter_line(chart.var[0],chart.var[1],chart.chart_type);
                        }else if(chart.chart_type=="box plot" || chart.chart_type=="histogram"){
                            create_box_hist(chart.var[0],chart.chart_type);
                        }
                    });
                });
                $('#add_chart_btn').on('click',function(){
                    $('#chart_list').css("display","none");
                    $('#chart_sel_modal').css("display","block");
                    $("#modal_next_next").css("display","none");
                });
                $('.list-group-item').click(function() {
                    $("#modal_next_next").css("display","none");
                    $("#modal_next").css("display","inline-block");
                    $('#chart_input').css("display","none");
                    $('#chart_type_preview').css("display","inline-block");
                    $("#chart_img_src").prop("src","./img/" +$(this).prop("id")+".png");
                    $('#scatter_line').css("display","none");
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
                                console.log("clicked_create", $(this).val());     
                                var $div = $(this).parent().parent();
                                var $btn = $div.find(".jscolor");
                                console.log($div.prop("class"));
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
                            // console.log(sessionStorage.variable,sessionStorage.chart_id);
                            database.ref('project/' + sessionStorage.USER + "/" + sessionStorage.project_name +"/chart/"+chart_id).set({
                                chart_type:chart_type,
                                var:variable,
                                pin:false,
                            });
                             $('#chart_list').css("display","block");
                            create_scatter_line(x,y,chart_type);
                        });
                    }else if(chart_type=="box plot" || chart_type=="histogram"){
                        $("#modal_next_next").click(function(){
                            var y ={};
                            $.each($(".var:checkbox:checked"), function(){   
                                console.log("clicked_create", $(this).val());     
                                var $div = $(this).parent().parent();
                                var $btn = $div.find(".jscolor");
                                console.log($btn.prop("class"));
                                // if($btn.css("visibility")=="hidden"){
                                //     x[""+$(this).val()]=myObject[""+$(this).val()]
                                // }
                                if($btn.css("visibility")!="hidden"){
                                    console.log("btn finded");
                                    y[""+$(this).val()]=myObject[""+$(this).val()]
                                    y["color"]=$btn.css("background-color");
                                }
                            });
                            variable.push(y);
                            chart_id=Object.keys(y)[0]+"_"+chart_type;
                            // console.log(sessionStorage.variable,sessionStorage.chart_id);
                            database.ref('project/' + sessionStorage.USER + "/" + sessionStorage.project_name +"/chart/"+chart_id).set({
                                chart_type:chart_type,
                                var:variable,
                                pin:false,
                            });
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
        }
    });
});

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
//take in para: 
//@x:array || @y:array ||@z_ary: dict,object ||@color_ary: dict,object
function create_heatmap(x,y,z_ary,color_ary){
    console.log(x,y,z_ary,color_ary);
    var parent_div=document.getElementById("chart_list");
    var map_var_count=Object.keys(z_ary).length;
    var column_length=4; //x.length;
    var row_length=9; //y.length;
    console.log(column_length);
    for(var i=0; i <map_var_count; i++){
        var child_div = document.createElement("div");
        child_div.setAttribute("class","heatmap");
        var z = reorgZ_ary(z_ary[Object.keys(z_ary)[i]],column_length,row_length);
        //x: time
        var xValues = [1,2,3,4];
        //y: pressure
        var yValues = [1,2,3,4,5,6,7,8,9];

        var zValues = z
        console.log(xValues.length,yValues.length,zValues);
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
    console.log("reorgZ_ary called",row_length + " " + column_length + " " + array.length);
    var z_res=[];
    for (var i=0; i<row_length; i++) {
        z_res[i] = array.slice(i*column_length,(i+1)*column_length);
        console.log(i,z_res[i].length);
    }
    return z_res;
}

function create_scatter_line(x,y,chart_type){
    var parent_div=document.getElementById("chart_list");
    var child_div = document.createElement("div");
    var y_keys = Object.keys(y);
    var x_keys=Object.keys(x);
    var id=chart_type+"_"+x_keys[0]+"_"+y_keys[0];
    var y_list = y[y_keys[0]];
    var x_list = x[x_keys[0]];
    var y_tit = Object.keys(y)[0];
    var x_tit = Object.keys(x)[0];
    var hexColor;
    if(y_keys[0]=="color"){
        y_list = Object.values(y[y_keys[1]]);
        x_list = Object.values(x_list);
        y_tit = Object.keys(y)[1];
        hexColor = y.color;
    }else{
       hexColor = rgb2hex(y[y_keys[1]])
    }
    console.log(x_list,y_list);
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
            height: 500,
            width:500
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
            height: 500,
            width:500
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
    console.log(y,chart_type);
    var parent_div=document.getElementById("chart_list");
    var child_div = document.createElement("div");
    var y_keys = Object.keys(y);
    // var x_keys=Object.keys(x);
    var id=chart_type+"_"+y_keys[0];
    if(chart_type=="box plot"){
        var hexColor = rgb2hex(y[y_keys[1]]);
        var data = [
                    {
                        y: y[y_keys[0]],
                        boxpoints: 'all',
                        jitter: 0.3,
                        pointpos: -1.8,
                        marker: {color: hexColor},
                        type: 'box'
                        
                    }
                    ];
        var layout = {
            title:""+chart_type,
            yaxis: {
                title: Object.keys(y)[0]},
            height: 500,
            width:500
        };
        child_div.setAttribute("class","box");
        child_div.setAttribute("id",id);
    }else{
        var hexColor = rgb2hex(y[y_keys[1]]);
        var data = [
                    {
                        x: y[y_keys[0]],
                        type:"histogram",
                        opacity: 0.5,
                        marker: {
                            color: hexColor,
                        },
                    }
                    ];
        var layout = {
            title:""+chart_type,
            xaxis: {title: Object.keys(y)[0]},
            yaxis: {title: "count"},
            height: 500,
            width:500
        };
        child_div.setAttribute("class","box");
        child_div.setAttribute("id",id);
    }
    var checkbox =document.createElement("div");
    checkbox.innerHTML = "<input type='checkbox' class='pin'>Pined to Profoile";
    child_div.appendChild(checkbox);
    parent_div.appendChild(child_div);
    Plotly.newPlot(id,data,layout);
    $(".js-plotly-plot").style.border = "2px solid black";
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
        console.log($pbtn.css("visibility"));
    }else{
         $pbtn.css("visibility","visible");
         console.log($pbtn.css("visibility"));
    }
    e.preventDefault();
    return false;
});


function rgb2hex(rgb){
    rgb = rgb.match(/^rgb?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
    ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}
