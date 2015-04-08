"use strict"

//library from: http://www.JSON.org/js.html
#include "lib/json2.js"  

var G = {};

// Loading JSON Data
G.data = (function() {
	//get current path 
	var script_file = File($.fileName); 
    var script_file_path = script_file.path; 

    //path of JSON file to read
    var file_to_read = File(script_file_path + "/json/program.json");

    //creat empty variable for json object
    var JSON_object = null;		

    //reading and parsing json file
    if(file_to_read !== false) {
    	file_to_read.open('r');
        var content = file_to_read.read();
        JSON_object =  JSON.parse(content);   	
        file_to_read.close();   				
    } else {
        alert("No JSON File Found");
    }

    // uncomment to see structure of JSON
    //alert(content);

    return JSON_object
}());


// Initialize InDesign document
G.myDocument = (function() {
	var myDocument = app.documents.add();
	var appMarginValues = {}

	var setAppMarginPreferences = function() {
		var p = app.marginPreferences;
		var appMarginValues = {top: p.top, left: p.left,
						 bottom: p.bottom, right: p.right};
		p.top = "36px";
		p.right = "36px";
		p.bottom = "54px";
		p.left = "36px";
		columnCount = 2;
		columnGutter = "10px";
	}

	var setDocumentPreferences = function () {
		var p = myDocument.documentPreferences;

		p.pageWidth = "306px";     	
		p.pageHeight = "396px";
		p.documentBleedUniformSize = true;				
		p.documentBleedTopOffset = "9px";					
		p.pageOrientation = PageOrientation.portrait;
		p.pagesPerDocument = 1;		
		p.startPageNumber = 1;
	}

	var setDocumentViewPreferences = function () {
		var p = myDocument.viewPreferences;
		p.rulerOrigin =RulerOrigin.pageOrigin; 
		p.horizontalMeasurementUnits = MeasurementUnits.pixels;
		p.verticalMeasurementUnits = MeasurementUnits.pixels;
	}

	// Setup Document
	setAppMarginPreferences();
	setDocumentPreferences();
	setDocumentViewPreferences();

	return myDocument;
}());


// Define Document Colors
G.colors = (function () {
	var primary = G.myDocument.colors.add({name: "PrimaryColor", model:ColorModel.process,
											colorValue: G.data.primaryColor});    

	var secondary = G.myDocument.colors.add({name: "SecondaryColor", model:ColorModel.process,
											colorValue: G.data.secondaryColor});  

	var text = G.myDocument.colors.add({name: "BodyColorDark", model:ColorModel.process,
											colorValue: [0, 0, 0, 87]});

	return {"primary": primary,
			"secondary": secondary,
			"text": text};
}());


// Define Font Styles
G.styles = (function () {

	var headerStyle = 
		G.myDocument.paragraphStyles.add({name: "headerStyle",
										  fillColor: G.colors.primary,   
										  appliedFont: "Arial",
										  fontStyle: "Bold",
										  pointSize: 18,
										  justification: Justification.CENTER_ALIGN});

	var subheaderStyle = 
		G.myDocument.paragraphStyles.add({name: "subheaderStyle",
										  fillColor: G.colors.secondary,   
										  appliedFont: "Arial",
										  fontStyle: "Bold",
										  pointSize: 9,
										  capitalization: Capitalization.ALL_CAPS,
										  justification: Justification.CENTER_ALIGN});

	var text1Style = 
		G.myDocument.paragraphStyles.add({name: "text1Style",
										  fillColor: G.colors.primary,   
										  appliedFont: "Arial",
										  fontStyle: "Bold",
										  pointSize: 12,
										  justification: Justification.LEFT_ALIGN});

	var text2Style = 
		G.myDocument.paragraphStyles.add({name: "text2Style",
										  fillColor: G.colors.primary,   
										  appliedFont: "Arial",
										  fontStyle: "Bold",
										  pointSize: 8,
										  justification: Justification.RIGHT_ALIGN});

	var text3Style = 
		G.myDocument.paragraphStyles.add({name: "text3Style",
										  fillColor: G.colors.text,   
										  appliedFont: "Arial",
										  pointSize: 9,
										  justification: Justification.LEFT_ALIGN});

	return{"headerStyle": headerStyle,
		   "subheaderStyle": subheaderStyle,
		   "text1Style": text1Style,
		   "text2Style": text2Style,
		   "text3Style": text3Style}; 
}());



// Define location of elements on page
G.grid = (function () {

	// origin location for each grouping
	var progPos = [{x:36, y:38}, {x:36, y:86}, {x:36, y:134}, {x:36, y:182}, {x:36, y:230}, {x:36, y:278}];

	// positions are relative to progPos
	var elementPos = {textOne: [0, 0, 16, 130],		//[y1, x1, y2, x2]
		textTwo: [0, 130, 16, 234],
		textThree: [16, 0, 35, 232]
	};

	// header position absolue location
	var headerPos = {header: [30, 36, 54, 270],						
		subheader: [54, 36, 70, 270],
		line: [72, 125, 75, 181]
	};

	return{"progPos": progPos,
		"headerPos": headerPos,
		"elementPos": elementPos};
}());


// Draw Page
(function () {

	//define short reference to page
	var p = G.myDocument.pages.item(0);

	//draw header
	var header = p.textFrames.add();
	header.geometricBounds = G.grid.headerPos.header;
	header.contents = G.data.header;
	header.texts.everyItem().applyParagraphStyle(G.styles.headerStyle);

	//draw subheader
	var subheader = p.textFrames.add();
	subheader.geometricBounds = G.grid.headerPos.subheader;
	subheader.contents = G.data.subheader;
	subheader.texts.everyItem().applyParagraphStyle(G.styles.subheaderStyle);

	//draw heading line
	var headerline = p.rectangles.add({geometricBounds: G.grid.headerPos.line,
										strokeWeight: 0,
										strokeColor: G.colors.secondary,
										fillColor: G.colors.secondary,
	});

	//define temporary element position variable
	var elementPos = {textOne: [],
		textTwo: [], 
		textThree: []};

	//looping through each element
	for (var item in G.data.elements) {

		//element position determined by order on page
		var pos = G.data.elements[item].order +  1;

		//generating x y coordinates for current element and sub attributes 
		for (each in G.grid.elementPos){
			elementPos[each][0] = G.grid.elementPos[each][0] + G.grid.progPos[pos].y; 
			elementPos[each][1] = G.grid.elementPos[each][1] + G.grid.progPos[pos].x; 
			elementPos[each][2] = G.grid.elementPos[each][2] + G.grid.progPos[pos].y;
			elementPos[each][3] = G.grid.elementPos[each][3] + G.grid.progPos[pos].x;
		 }
		
		//draw text 1
		var textOne = p.textFrames.add();
		textOne.geometricBounds = elementPos.textOne;
		textOne.contents = G.data.elements[item].what;
		textOne.texts.everyItem().applyParagraphStyle(G.styles.text1Style);

		//draw text 2
		var textTwo = p.textFrames.add();
		textTwo.geometricBounds = elementPos.textTwo;
		textTwo.contents = G.data.elements[item].who;
		textTwo.texts.everyItem().applyParagraphStyle(G.styles.text2Style);

		//draw text 3
		var textThree = p.textFrames.add();
		textThree.geometricBounds = elementPos.textThree;
		textThree.contents = G.data.elements[item].description;
		textThree.texts.everyItem().applyParagraphStyle(G.styles.text3Style);
	}

}());




