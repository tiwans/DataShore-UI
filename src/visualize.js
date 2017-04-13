"use strict";

drawPannel();

function drawPannel(){
    d3.csv('transactions.csv', function(error, data){
  	window.data = data;
    console.log(data);

    // This function should help you format your data: lifted from the Plotly bubble map example:
    function unpack(rows, key) {
      return rows.map(function(row) { return row[key]; });
    };

    //scatter plot
    var trace1 = {
    	y: unpack(data, 'Penicilin'),
    	x: unpack(data, 'Bacteria '),
    	mode: 'markers+lines',
    	type: 'scatter',
    	name: 'Penicilin',
    	text: unpack(data, 'Penicilin'),
    	marker: { size: 15,
    			color: 'rgb(93, 164, 214)'},
    };

    var trace2 = {
    	y: unpack(data, 'Streptomycin '),
    	x: unpack(data, 'Bacteria '),
    	mode: 'markers+lines',
    	type: 'scatter',
    	name: 'Streptomycin',
    	text: unpack(data, 'Streptomycin '),
    	marker: { 
    		size: 15,
    		color: 'rgb(255, 65, 54)',
    		sizeref: 2,
            symbol: 'square'},
    };

    var trace3 = {
    	y: unpack(data, 'Neomycin'),
    	x: unpack(data, 'Bacteria '),
    	mode: 'markers+lines',
    	type: 'scatter',
    	name: 'Neomycin',
    	text: unpack(data, 'Neomycin'),
    	marker: { 
    		size: 15,
    		color: 'rgb(44, 160, 101)',
            sizeref: 2,
            symbol: 'diamond'},
    };

    var dataset1 =[trace1,trace2,trace3];

    var layout1 = {
    	title:'Effecness of Different Antibotic',
    	height: 800,
    	width: 950
    };

    Plotly.newPlot('part1',dataset1,layout1);

    //scatter plot about antibotic related to Gram Staining
    var preload = {
    	pn: unpack(data, 'Gram Staining '),
    	bac: unpack(data, 'Bacteria '),
    	n: unpack(data, 'Neomycin'),
    	s: unpack(data, 'Streptomycin '),
    	p: unpack(data, 'Penicilin')
    };

    var pos = [];
    var neg = [];
    for (var i=0; i<4;i++){
    	neg[i] = [];
    };
    for (var i=0; i<4;i++){
    	pos[i] = [];
    };

    for(var i=0; i<preload["pn"].length; i++){
    	if(preload["pn"][i] == "negative"){
            neg[0].push(preload["bac"][i]);
            neg[1].push(preload["p"][i]);
    		neg[2].push(preload["n"][i]);
    		neg[3].push(preload["s"][i]);
    	}else{
    		pos[0].push(preload["bac"][i]);
    		pos[1].push(preload["p"][i]);
    		pos[2].push(preload["n"][i]);
    		pos[3].push(preload["s"][i]);
    	}
    };


    var negativeP ={
    	x: neg[0],
    	y: neg[1],
    	type: 'bar',
    	name: 'Penicilin',
    	text: neg[1],
    	textposition: 'bottom center'
    };

    var negativeN ={
    	x: neg[0],
    	y: neg[2],
    	type: 'bar',
    	name: 'Neomycin',
    	text: neg[2],
    	textposition: 'bottom center'
    };

    var negativeS ={
    	x: neg[0],
    	y: neg[3],
    	type: 'bar',
    	name: 'Streptomycin',
    	text: neg[3],
    	textposition: 'bottom center'
    };

    var dataset2 = [negativeP,negativeN,negativeS];

    var layout2 = {
        title:'Effecness of Different Antibotic to negative bacteria',
        height: 800,
        width: 950,
    };

    //document.getElementById('part2').innerHTML=neg[3];
    Plotly.newPlot('part2',dataset2,layout2);



    //penicillin related to positive and negative
    var lpositiveP ={
        x: pos[0],
        y: pos[1],
        type: 'scatter',
        mode: 'markers',
        name: 'positive',
        marker: { 
            size: 15,
            sizeref: 2,
            color: "purple"},
    };

    var lnegativeP ={
    	x: neg[0],
    	y: neg[1],
    	type: 'scatter',
    	mode: 'markers',
    	name: 'negative',
        marker: { 
            size: 15,
            sizeref: 2,
            color: "pink"},	
    };
    var layout3 = {
        title:'Effecness of Penicillin to Different Bacteria',
        height: 800,
        width: 950
    };


    var dataset3 =[lnegativeP,lpositiveP]
    Plotly.newPlot('part3',dataset3,layout3);

  });
}

// document.getElementById("download").addEventListener("click", download());

function download(){
    var data = [["name1", "city1", "some other info"], ["name2", "city2", "more info"]];
    var csvContent = "data:text/csv;charset=utf-8,";
    data.forEach(function(infoArray, index){
        alert(infoArray);
        var dataString = infoArray.join(",");
        
        csvContent += index < data.length ? dataString+ "\n" : dataString;

    }); 

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_data.csv");
    document.body.appendChild(link); // Required for FF

    link.click();
}