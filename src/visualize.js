"use strict";

//############## Initialize ##############//
var project_name=sessionStorage.getItem("project_name")
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
var dataRef = database.ref('project/' + project_name);
var pro_content = document.getElementById("page_content_profile");
var chart_content = document.getElementById("page_content_chart");
var static_content = document.getElementById("page_content_static");
chart_content.setAttribute("style","display:none");
static_content.setAttribute("style","display:none");
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

////############## Start of  of Profolie ##############//
//################                       ##############//
//############## Start of  of Line Chart ##############//
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
////############## End of  of Line Chart ##############//
//################+++++++++++++++++++++################//
//############## End of the Porfolie ##############//

////############## Start of the Chart ##############//
//################                    ################//
//############## Start of the personalize chart ##############//
            $("#nav_pro").click(function(){
                pro_content.setAttribute("style","display:block");
                static_content.setAttribute("style","display:none");
                chart_content.setAttribute("style","display:none");
                $("#nav_pro").prop("class","active");
                $("#nav_chart").prop("class","abled");
                $("#nav_static").prop("class","abled");
            })
            $("#nav_chart").click(function(){
                chart_content.setAttribute("style","display:block");
                pro_content.setAttribute("style","display:none");
                static_content.setAttribute("style","display:none");
                $("#nav_chart").prop("class","active");
                $("#nav_pro").prop("class","abled");
                 $("#nav_static").prop("class","abled");
                display_chart();
            })
            $("#nav_static").click(function(){
                static_content.setAttribute("style","display:block");
                chart_content.setAttribute("style","display:none");
                pro_content.setAttribute("style","display:none");
                $("#nav_static").prop("class","active");
                $("#nav_pro").prop("class","abled");
                $("#nav_chart").prop("class","abled");
            })
            function display_chart(){
                // chart_content.innerHTML="<p>hello</p>";
                var chart_type;
                $('#add_chart_btn').on('click',function(){
                    $('#chart_sel_modal').prop("style","display:block");
                    $("#modal_next_next").prop("style","dispaly:none");
                });
                $('.list-group-item').click(function() {
                    $("#modal_next_next").prop("style","dispaly:none");
                    $("#modal_next").prop("style","display:block");
                    $('#chart_input').prop("style","display:none");
                    $('#chart_type_preview').prop("style","display:block");
                    $("#chart_img_src").prop("src","./img/" +$(this).prop("id")+".png");
                    chart_type = $(this).prop("id");
                });
                $("#modal_next").click(function(){
                    $("#modal_next").prop("style","display:none");
                    console.log("chart_type",chart_type);
                    $("#modal_next_next").prop("style","dispaly:block");
                    $('#chart_type_preview').prop("style","display:none");
                    if(chart_type=="scatter_plot"||chart_type=="line_chart"){
                        $('#scatter_line').prop("style","display:block");
                        $("#modal_next_next").click(function(){
                            var x = [];
                            var y =[];
                            $.each($(".var:checkbox:checked"), function(){   
                                console.log("clicked_create", $(this).val());     
                                // x_y["x"].push($(this).val());
                                var $div = $(this).parent().parent();
                                var $btn = $div.find(".jscolor");
                                console.log($div.prop("class"));
                                if($btn.css("visibility")=="hidden"){
                                    x=myObject[""+$(this).val()];
                                }
                                if($btn.css("visibility")!="hidden"){
                                    y=myObject[""+$(this).val()]
                                }
                            });
                            create_scatter_line(x,y,chart_type);
                        });
                    }
                });
                $(".modal_leave").click(function(){
                    $('#chart_sel_modal').prop("style","display:none");
                })
            }
        }
    });
});

//take in para: 
//@x:array || @y:array ||@z_ary: dict,object ||@color_ary: dict,object
function create_heatmap(x,y,z_ary,color_ary){
    console.log(x,y,z_ary,color_ary);
    var parent_div=document.getElementById("page_content_chart");
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
    var parent_div=document.getElementById("page_content_chart");
    var child_div = document.createElement("div");
    console.log(x);
    console.log(y);
    if(chart_type=="scatter_plot"){
        var trace1 = {
            x: x,
            y: y,
            mode: 'markers'
        };
        var layout = {
            title: ""+chart_type,
            height: 400,
            width: 400
        }
        Plotly.newPlot(child_div,[trace1]);
        child_div.setAttribute("class","scatter");
    }else{
        var trace1 = {
            x: x,
            y: y,
            type: 'markers+lines'
        };
        var layout = {
            title: ""+chart_type,
            height: 400,
            width: 400
        }
        Plotly.newPlot(child_div,[trace1]);
        child_div.setAttribute("class","line");
    }
    parent_div.appendChild(child_div);
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
