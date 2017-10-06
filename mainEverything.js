//By Adam Walker
/**************
CHANGE LOG 5/6/16
-Basically made this entire file
-Preliminary 2d folding out of a cube
	Inefficient, but good for debugging.
-Basic event functions for the window to get keyboard clicks

CHANGE LOG 5/13/16
-Redid updating the cube
-Added a 3d-ish rendering
-Added checkbox
-Added scrambling w/randomizing
-Minor bug fixes along the way
-Added instructions to main html file
-No changes to 3x3 class, only mainly to here
-Edited some canvas sizes/made things look a little nicer

CHANGE LOG 5/20/16
-Adding timer
-Added inspection
-Disallowed moves during inspection
-Allows switching in/out of freestyle/timed modes
-Best solve calculator
-Average calculator
-Stores times in an array
-Ability to reset times
-Bug fixes/formatting fixes
**************/

//variable to store the timer interval system (displays new time every few milliseconds)
var timerInterval;
//enables or disables auto-scrambling by pressing any key
var newSolve = false;
//for timer updating, whether to change the color to black text
var wasNegative = true;

//***********Timer class*******************
class Timer
{
	//constructor - establishes the starting time
	constructor()
	{
		this.start;
	}
	
	//setter - reset the timer (started time)
	reset()
	{
		this.start = new Date().getTime();
	}
	
	//getter - get elapsed time
	getElapsed()
	{
		//get milliseconds that have passed
		var temp = new Date().getTime() - this.start;
		
		//take care of if it's inspection or not
		/*if(temp <= 15000)
		{
			temp = -15000 + temp;
		}
		else temp -= 15000;*/
		temp -= 15000;
		
		//round the time, add zeros if needed
		//couple of lines for rounding from http://www.sitepoint.com/creating-accurate-timers-in-javascript/
		var elapsed = Math.floor(temp / 10) / 100;
    	if(Math.round(elapsed) == elapsed) { elapsed += '.0'; }
    	if(Math.round(elapsed * 10) == elapsed * 10) { elapsed += '0'; }
		
		//return the value
		return elapsed;
	}
};

//***************Times class
class Times
{
	//make array
	constructor()
	{
		this.times = new Array();
	}
	
	//allows a new time to be put in
	addTime(time)
	{
		this.times.push(time);
	}
	
	//calculates and returns the average time
	calcAverage()
	{
		var sum = 0;
		
		//add up all times
		for(var i=0; i < this.times.length; i++)
		{
			sum += this.times[i];
		}
		
		//return sum divided by the number of times
		return sum / this.times.length;
	}
	
	//calculates and returns the best time
	calcBest()
	{
		var best = this.times[0];
		
		//look for the best time
		for(var i=1; i < this.times.length; i++)
		{
			if(this.times[i] < best)
				best = this.times[i];
		}
		
		//return it
		return best;
	}
	
	//deletes all times
	reset()
	{
		this.times = new Array();
	}
}

//makes object
var three = new ThreeByThree();
var timer = new Timer;
var allTimes = new Times;

//global variables
var solvedBefore = false; //for eventKeyPressed, to see if it should scramble the cube
var currentlyScrambling = false; //keeps moves from happening while scrambling
var scrambledBefore = false;

//function gives all the values on one face of the puzzle
//pass in which face you want, it returns an array with
//pieces (9 in total)
function getFaceVal(face)
{
	//get all centers/edges/corners on the puzzle
	var center = three.getCenters();
	var edges = three.getEdges();
	var corners = three.getCorners();
	
	//make array
	var thisFace = new Array(9);
	
	//store center
	thisFace[4] = center[face];
	
	//store edges
	thisFace[1] = edges[face][0];
	thisFace[3] = edges[face][3];
	thisFace[5] = edges[face][1];
	thisFace[7] = edges[face][2];
	
	//store corners
	thisFace[0] = corners[face][0];
	thisFace[2] = corners[face][1];
	thisFace[6] = corners[face][2];
	thisFace[8] = corners[face][3];
	
	//return array
	return thisFace;
}

//function returns true if the cube is currently solved
//you have to pass in your object (three)
function isSolved(three)
{
	//get edges/corners/centers
	var edges = three.getEdges();
	var corners = three.getCorners();
	var centers = three.getCenters();
	
	//increment through each face
	for(var i=0; i<6; i++)
	{
		//on each face, check if there are any pieces not solved
		for(var j=0; j<4; j++)
		{
			//if anything's not solved, exit function with false
			if(corners[i][j] != centers[i])
				return false;
			if(edges[i][j] != centers[i])
				return false;
		}
	}
	
	//all pieces must be solved, return true
	return true;
}

//this function determines whether to update the 2d or 3d cube
//based on the checkbox
//pass in edges, centers, and corners. It calls the necessary update function
function updateCube(centerVal, edgeVal, cornerVal)
{
	if(document.getElementById("is3d").checked)
	{
		updateCube3d(centerVal, edgeVal, cornerVal);
	}
	else updateCube2d(centerVal, edgeVal, cornerVal);
}

//renders a flat/2d cube design; displays all pieces at all times
//good for debugging
function updateCube2d(centerVal, edgeVal, cornerVal)
{
	var cubieWidth = 30;
	var cubieSpace = 8;
	
	var faceWidth = (cubieWidth + cubieSpace) * 3 + cubieSpace;
	
	var syncColorWNum = ['white', 'yellow', 'blue', 'green', 'red', 'orange'];
	var syncFaceWNum = ['U', 'D', 'B', 'F', 'R', 'L'];
	
	//canvas
	var canvas = document.getElementById("cube");
	var ctx = canvas.getContext("2d");
	
	//draw the corners, edges, and centers for each face
	//Cycle through and do each face individually
	for(var i=0; i<6; i++)
	{
		//calculate where each face is on the cube
		var xShift;
		var yShift;

		//Figure out the location of each face
		//This was a really ugly way to do it.
		//I was trying to get something up and running fast.
		//The final display will not be flat like this, so I
		//put little effort into making this code efficient.
		//This layout is mainly for debugging purposes.
		if(i==0) //up
		{
			xShift = faceWidth + 10;
			yShift = 10;
		}
		else if(i==1) //down
		{
			xShift = faceWidth + 10;
			yShift = 2 * faceWidth + 10;
		}
		else if(i==2) //back
		{
			xShift = 3 * faceWidth + 10;
			yShift = faceWidth + 10;
		}
		else if(i==3) //front
		{
			xShift = faceWidth + 10;
			yShift = faceWidth + 10;
		}
		else if(i==4) //right
		{
			xShift = 2 * faceWidth + 10;
			yShift = faceWidth + 10;
		}
		else //left
		{
			xShift = 10;
			yShift = faceWidth + 10;
		}
		
		
		//the following functions actually draw a color on each face.
		//once again really inefficient code. I just copied and pasted a bunch.
		
		//center
		ctx.beginPath();
		ctx.fillStyle = centerVal[i];
		ctx.rect(xShift + cubieWidth + cubieSpace, yShift + cubieWidth + cubieSpace, cubieWidth, cubieWidth);
		ctx.fill();
		ctx.lineWidth = 2;
      	ctx.strokeStyle = 'black';
		ctx.stroke();
		
		//****************corners***************
		//corner 1
		ctx.beginPath();
		ctx.fillStyle = cornerVal[i][0];
		ctx.rect(xShift, yShift, cubieWidth, cubieWidth);
		ctx.fill();
		ctx.lineWidth = 2;
      	ctx.strokeStyle = 'black';
		ctx.stroke();
		
		//corner 2
		ctx.beginPath();
		ctx.fillStyle = cornerVal[i][1];
		ctx.rect(xShift + 2 * (cubieWidth + cubieSpace), yShift, cubieWidth, cubieWidth);
		ctx.fill();
		ctx.lineWidth = 2;
      	ctx.strokeStyle = 'black';
		ctx.stroke();
		
		//corner 3
		ctx.beginPath();
		ctx.fillStyle = cornerVal[i][2];
		ctx.rect(xShift, yShift + 2 * (cubieWidth + cubieSpace), cubieWidth, cubieWidth);
		ctx.fill();
		ctx.lineWidth = 2;
      	ctx.strokeStyle = 'black';
		ctx.stroke();
		
		//corner 4
		ctx.beginPath();
		ctx.fillStyle = cornerVal[i][3];
		ctx.rect(xShift + 2 * (cubieWidth + cubieSpace), yShift + 2 * (cubieWidth + cubieSpace), cubieWidth, cubieWidth);
		ctx.fill();
		ctx.lineWidth = 2;
      	ctx.strokeStyle = 'black';
		ctx.stroke();
		
		//**********************edges******************
		//edge 1
		ctx.beginPath();
		ctx.fillStyle = edgeVal[i][0];
		ctx.rect(xShift + cubieWidth + cubieSpace, yShift, cubieWidth, cubieWidth);
		ctx.fill();
		ctx.lineWidth = 2;
      	ctx.strokeStyle = 'black';
		ctx.stroke();
		
		//edge 2
		ctx.beginPath();
		ctx.fillStyle = edgeVal[i][1];
		ctx.rect(xShift + 2 * (cubieWidth + cubieSpace), yShift + cubieWidth + cubieSpace, cubieWidth, cubieWidth);
		ctx.fill();
		ctx.lineWidth = 2;
      	ctx.strokeStyle = 'black';
		ctx.stroke();
		
		//edge 3
		ctx.beginPath();
		ctx.fillStyle = edgeVal[i][2];
		ctx.rect(xShift + cubieWidth + cubieSpace, yShift + 2 * (cubieWidth + cubieSpace), cubieWidth, cubieWidth);
		ctx.fill();
		ctx.lineWidth = 2;
      	ctx.strokeStyle = 'black';
		ctx.stroke();
		
		//edge 4
		ctx.beginPath();
		ctx.fillStyle = edgeVal[i][3];
		ctx.rect(xShift, yShift + cubieWidth + cubieSpace, cubieWidth, cubieWidth);
		ctx.fill();
		ctx.lineWidth = 2;
      	ctx.strokeStyle = 'black';
		ctx.stroke();
	}
}

//renders a more 3d-ish cube. Displays F and U faces, and parts of others
function updateCube3d(centerVal, edgeVal, cornerVal)
{	
	//vars from other functions, line up sides w/colors
	var syncColorWNum = ['white', 'yellow', 'blue', 'green', 'red', 'orange'];
	var syncFaceWNum = ['U', 'D', 'B', 'F', 'R', 'L'];
	
	//canvas
	var canvas = document.getElementById("cube");
	var ctx = canvas.getContext("2d");
	
	canvas.height = 500;
	canvas.width = 500;
	
	var size = 75;
	
	/*
	The following sections are divided by faces.
	From there, they are divided piece-by-piece
	Layout of corners/edges goes back to the 2d designs and 3x3 class
	Corners/edges:
	0	0	1
	3	C	1
	2	2	3
	Where C is the center piece
	
	All of the stroke-style 'black' is for a black outline
	*/
	
	//*****************L Face*************
	var lFace = getFaceVal(5);
	var beg = 145;
	//corner 0
	ctx.fillStyle = lFace[0];
	ctx.beginPath();
	ctx.lineTo(beg, 105);
	ctx.lineTo(beg+2, 65);
	ctx.lineTo(beg+16, 85);
	ctx.lineTo(beg+11, 125);
	ctx.closePath();
	ctx.fill();
	ctx.lineWidth = 2;
   	ctx.strokeStyle = 'black';
	ctx.stroke();
	//edge 0
	ctx.fillStyle = lFace[1];
	ctx.beginPath();
	ctx.lineTo(beg-3, 165);
	ctx.lineTo(beg, 120);
	ctx.lineTo(beg+13, 145);
	ctx.lineTo(beg+7, 185);
	ctx.closePath();
	ctx.fill();
	ctx.lineWidth = 2;
   	ctx.strokeStyle = 'black';
	ctx.stroke();
	//corner 3
	ctx.fillStyle = lFace[8];
	ctx.beginPath();
	ctx.lineTo(beg-1, 355);
	ctx.lineTo(beg+9, 330);
	ctx.lineTo(beg+16, 360);
	ctx.lineTo(beg+2, 395);
	ctx.closePath();
	ctx.fill();
	ctx.lineWidth = 2;
   	ctx.strokeStyle = 'black';
	ctx.stroke();
	//edge 1
	ctx.fillStyle = lFace[5];
	ctx.beginPath();
	ctx.lineTo(beg-4, 295);
	ctx.lineTo(beg+6, 270);
	ctx.lineTo(beg+13, 300);
	ctx.lineTo(beg-1, 335);
	ctx.closePath();
	ctx.fill();
	ctx.lineWidth = 2;
   	ctx.strokeStyle = 'black';
	ctx.stroke();
	//corner 1
	ctx.fillStyle = lFace[2];
	ctx.beginPath();
	ctx.lineTo(beg-8, 225);
	ctx.lineTo(beg-3, 185);
	ctx.lineTo(beg+10, 230);
	ctx.lineTo(beg-5, 275);
	ctx.closePath();
	ctx.fill();
	ctx.lineWidth = 2;
   	ctx.strokeStyle = 'black';
	ctx.stroke();
	
	//*****************R Face******************
	var rFace = getFaceVal(4);
	beg = 330;
	//corner 1
	ctx.fillStyle = rFace[2];
	ctx.beginPath();
	ctx.lineTo(beg, 105);
	ctx.lineTo(beg-2, 65);
	ctx.lineTo(beg-16, 85);
	ctx.lineTo(beg-11, 125);
	ctx.closePath();
	ctx.fill();
	ctx.lineWidth = 2;
   	ctx.strokeStyle = 'black';
	ctx.stroke();
	//edge 0
	ctx.fillStyle = rFace[1];
	ctx.beginPath();
	ctx.lineTo(beg+3, 165);
	ctx.lineTo(beg, 120);
	ctx.lineTo(beg-13, 145);
	ctx.lineTo(beg-7, 185);
	ctx.closePath();
	ctx.fill();
	ctx.lineWidth = 2;
   	ctx.strokeStyle = 'black';
	ctx.stroke();
	//corner 2
	ctx.fillStyle = rFace[6];
	ctx.beginPath();
	ctx.lineTo(beg+1, 355);
	ctx.lineTo(beg-9, 330);
	ctx.lineTo(beg-16, 360);
	ctx.lineTo(beg-2, 395);
	ctx.closePath();
	ctx.fill();
	ctx.lineWidth = 2;
   	ctx.strokeStyle = 'black';
	ctx.stroke();
	//edge 3
	ctx.fillStyle = rFace[3];
	ctx.beginPath();
	ctx.lineTo(beg+4, 295);
	ctx.lineTo(beg-6, 270);
	ctx.lineTo(beg-13, 300);
	ctx.lineTo(beg+1, 335);
	ctx.closePath();
	ctx.fill();
	ctx.lineWidth = 2;
   	ctx.strokeStyle = 'black';
	ctx.stroke();
	//corner 0
	ctx.fillStyle = rFace[0];
	ctx.beginPath();
	ctx.lineTo(beg+8, 225);
	ctx.lineTo(beg+3, 185);
	ctx.lineTo(beg-10, 230);
	ctx.lineTo(beg+5, 275);
	ctx.closePath();
	ctx.fill();
	ctx.lineWidth = 2;
   	ctx.strokeStyle = 'black';
	ctx.stroke();

	
	//******************F Face*****************
	var frontFace = getFaceVal(3);
	
	//various width adjusting variables to try and get a 3d-ish look
	//renders some quadrilaterals that attempt to look close to a slanted rectangle
	var startX = 150;
	var startY = 230;
	var width = 50;
	var height = 50;
	var gap = 12;
	var xgap = 15;
	var changeGap = .15;
	
	var widthCorrect = 2;
	
	//go by lines of 3
	for(var i=0; i<3; i++)
	{			
			ctx.fillStyle = frontFace[i*3];
			ctx.beginPath();
			//ctx.moveTo(startX + 1 * (width + gap), startY + i * (height + gap));
			ctx.lineTo(startX + 0 * (width + xgap) + width + (i-1) * widthCorrect, startY + i * (height + gap - i * changeGap * gap));
			ctx.lineTo(startX + 0 * (width + xgap) + width + (i) * widthCorrect, startY + i * (height + gap - i * changeGap * gap) + height);
			ctx.lineTo(startX + 0 * (width + xgap) + (i) * widthCorrect, startY + i * (height + gap - i * changeGap * gap) + height);
			ctx.lineTo(startX + 0 * (width + xgap) + (i-1) * widthCorrect, startY + i * (height + gap - i * changeGap * gap));
			ctx.closePath();
			ctx.fill();
			ctx.lineWidth = 2;
      		ctx.strokeStyle = 'black';
			ctx.stroke();
			
			ctx.fillStyle = frontFace[i*3 + 1];
			ctx.beginPath();
			//ctx.moveTo(startX + 1 * (width + gap), startY + i * (height + gap));
			ctx.lineTo(startX + 1 * (width + xgap) + width - (i-1) * widthCorrect, startY + i * (height + gap - i * changeGap * gap));
			ctx.lineTo(startX + 1 * (width + xgap) + width - (i) * widthCorrect, startY + i * (height + gap - i * changeGap * gap) + height);
			ctx.lineTo(startX + 1 * (width + xgap) - (3-i) * widthCorrect, startY + i * (height + gap - i * changeGap * gap) + height);
			ctx.lineTo(startX + 1 * (width + xgap) - (3-i+1) * widthCorrect, startY + i * (height + gap - i * changeGap * gap));
			ctx.closePath();
			ctx.fill();
			ctx.lineWidth = 2;
      		ctx.strokeStyle = 'black';
			ctx.stroke();
			
			ctx.fillStyle = frontFace[i*3 + 2];
			ctx.beginPath();
			//ctx.moveTo(startX + 2 * (width + gap), startY + i * (height + gap));
			ctx.lineTo(startX + 2 * (width + xgap) + width - (i-1) * widthCorrect - (3) * widthCorrect, startY + i * (height + gap - i * changeGap * gap)); //2
			ctx.lineTo(startX + 2 * (width + xgap) + width - (i) * widthCorrect - (3) * widthCorrect, startY + i * (height + gap - i * changeGap * gap) + height); //4
			ctx.lineTo(startX + 2 * (width + xgap) - (i) * widthCorrect - (3) * widthCorrect, startY + i * (height + gap - i * changeGap * gap) + height); //3
			ctx.lineTo(startX + 2 * (width + xgap) - (i-1) * widthCorrect - (3) * widthCorrect, startY + i * (height + gap - i * changeGap * gap)); //1
			ctx.closePath();
			ctx.fill();
			ctx.lineWidth = 2;
      		ctx.strokeStyle = 'black';
			ctx.stroke();
	}
	
	//U Face
	//various width adjusting variables to try and get a 3d-ish look
	//renders some quadrilaterals that attempt to look close to a slanted rectangle
	var upFace = getFaceVal(0);
	var startX = 150;
	var startY = 60;
	var width = 50;
	var height = 50;
	var gap = 7;
	var xgap = 15;
	var changeGap = .15;
	
	var widthCorrect = 2;
	
	//goes by lines of 3
	for(var i=0; i<3; i++)
	{			
			ctx.fillStyle = upFace[(2-i)*3];
			ctx.beginPath();
			//ctx.moveTo(startX + 1 * (width + gap), startY + i * (height + gap));
			ctx.lineTo(startX + 0 * (width + xgap) + width + (i) * widthCorrect, startY + (2-i) * (height + gap - i * changeGap * gap));
			ctx.lineTo(startX + 0 * (width + xgap) + width + (i-1) * widthCorrect, startY + (2-i) * (height + gap - i * changeGap * gap) + height);
			ctx.lineTo(startX + 0 * (width + xgap) + (i-1) * widthCorrect, startY + (2-i) * (height + gap - i * changeGap * gap) + height);
			ctx.lineTo(startX + 0 * (width + xgap) + (i) * widthCorrect, startY + (2-i) * (height + gap - i * changeGap * gap));
			ctx.closePath();
			ctx.fill();
			ctx.lineWidth = 2;
      		ctx.strokeStyle = 'black';
			ctx.stroke();
			
			ctx.fillStyle = upFace[(2-i)*3 + 1];
			ctx.beginPath();
			//ctx.moveTo(startX + 1 * (width + gap), startY + i * (height + gap));
			ctx.lineTo(startX + 1 * (width + xgap) + width - (i) * widthCorrect, startY + (2-i) * (height + gap - i * changeGap * gap));
			ctx.lineTo(startX + 1 * (width + xgap) + width - (i-1) * widthCorrect, startY + (2-i) * (height + gap - i * changeGap * gap) + height);
			ctx.lineTo(startX + 1 * (width + xgap) - (3-i+1) * widthCorrect, startY + (2-i) * (height + gap - i * changeGap * gap) + height);
			ctx.lineTo(startX + 1 * (width + xgap) - (3-i) * widthCorrect, startY + (2-i) * (height + gap - i * changeGap * gap));
			ctx.closePath();
			ctx.fill();
			ctx.lineWidth = 2;
      		ctx.strokeStyle = 'black';
			ctx.stroke();
			
			ctx.fillStyle = upFace[(2-i)*3 + 2];
			ctx.beginPath();
			//ctx.moveTo(startX + 2 * (width + gap), startY + i * (height + gap));
			ctx.lineTo(startX + 2 * (width + xgap) + width - (i) * widthCorrect - (3) * widthCorrect, startY + (2-i) * (height + gap - i * changeGap * gap)); //2
			ctx.lineTo(startX + 2 * (width + xgap) + width - (i-1) * widthCorrect - (3) * widthCorrect, startY + (2-i) * (height + gap - i * changeGap * gap) + height); //4
			ctx.lineTo(startX + 2 * (width + xgap) - (i-1) * widthCorrect - (3) * widthCorrect, startY + (2-i) * (height + gap - i * changeGap * gap) + height); //3
			ctx.lineTo(startX + 2 * (width + xgap) - (i) * widthCorrect - (3) * widthCorrect, startY + (2-i) * (height + gap - i * changeGap * gap)); //1
			ctx.closePath();
			ctx.fill();
			ctx.lineWidth = 2;
      		ctx.strokeStyle = 'black';
			ctx.stroke();
	}
}

//default moves (for testing purposes at least)
//put in the moves you want to show up on startup

/*
//CHECKERBOARD
three.turnRightClockwise();
three.turnLeftClockwise();
three.turnRightClockwise();
three.turnLeftClockwise();
three.turnUpClockwise();
three.turnDownClockwise();
three.turnUpClockwise();
three.turnDownClockwise();
three.turnFrontClockwise();
three.turnBackClockwise();
three.turnFrontClockwise();
three.turnBackClockwise();
*/

//run update cube for the first time
//displays the solved cube, plus any default moves
updateCube(three.getCenters(), three.getEdges(), three.getCorners());

//Controls: (parallel arrays)
//KEYS MOVES
//I/K R/R'
//E/D L/L'
//J/F U/U'
//H/G F/F'
//S/L D/D'
//O/W B/B'
//U/R u/u'
//Y/N r/r'
//T/B l/l'
//M/V f/f'
//;/A y/y'
//P/Q z/z'
////Z x/x'
//ascii values corresponding with the above chart
var asciiVals = ["105","107","101","100","106","102","104","103","115","108","111","119",
				 "117","114","121","110","116","98","109","118","59","97","112","113","47","122"];
//move corresponding with the above chart (mainly for console logs, for now at least)
var move    =   ["R",  "R'", "L",  "L'", "U",  "U'", "F",  "F'", "D",  "D'", "B'",  "B",
				 "u",  "u'", "r",  "r'", "l'", "l", "f",  "f'", "y", "y'", "z", "z'", "x", "x'"];
//corresponding move function to call, using the object three
var alg = [ function () {three.turnRightClockwise();}, function () {three.turnRightCounter();}, 
		function () {three.turnLeftCounter();}, function () {three.turnLeftClockwise();}, 
		function () {three.turnUpClockwise();}, function () {three.turnUpCounter();}, 
		function () {three.turnFrontClockwise();}, function () {three.turnFrontCounter();}, 
		function () {three.turnDownClockwise();}, function () {three.turnDownCounter();}, 
		function () {three.turnBackCounter();}, function () {three.turnBackClockwise();}, 
		function () {three.turnWideUClockwise();}, function () {three.turnWideUCounter();}, 
		function () {three.turnWideRClockwise();}, function () {three.turnWideRCounter();},
		function () {three.turnWideLCounter();}, function () {three.turnWideLClockwise();},
		function () {three.turnWideFClockwise();}, function () {three.turnWideFCounter();},
		function () {three.turnYClockwise();}, function () {three.turnYCounter();}, 
		function () {three.turnZClockwise();}, function () {three.turnZCounter();}, 
		function () {three.turnXClockwise();}, function () {three.turnXCounter();} ];
/******
Basically, the three arrays correspond with each other. For example, take the first element of each array:
ASCII value 105 is the key 'i'
That corresponds to the move 'R'
That corresponds to turning the Right face (R face) clockwise, 
aka the function three.turnRightClockwise()
******/

//keyboard events
function eventKeyPressed(e)
{	
	//decide to start scrambling the puzzle again
	if(solvedBefore && scrambledBefore)
	{
		if(!currentlyScrambling && newSolve)
			startScramble();
		solvedBefore = false;
		return;
	}
	
	//make sure you aren't applying a move while scrambling the puzzle
	if(!currentlyScrambling)
	{
		//Go through the above parallel arrays: 
		for(var i=0; i<26; i++)
		{
			//See if the ASCII array number corresponds with the key the user pressed:
			if(asciiVals[i] == e.charCode)
			{
				//if it does:
				//Log what move that corresponds to (the second array)
				console.log(move[i]);
				
				if(i < 20 && timer.getElapsed() <= 0 && newSolve)
				{
					console.log("ERROR: Cannot complete move during inspection.");
					return;
				}
				//Perform the corresponding move
				alg[i]();
				//Update the cube's display
				updateCube(three.getCenters(), three.getEdges(), three.getCorners());
				
				//At some point I will add breaking to here.
				//For purposes of debugging, I purposely chose NOT to break, in case
				//I duplicated moves and got unexpected results (so both moves would show up in the logs)
			}
		}
	}
	
	//Check to see if the cube is solved after doing the move
	if(isSolved(three) && newSolve)
	{
		//store the final time
		var finalTime = timer.getElapsed();
		
		//stop the timer updating
		window.clearTimeout(timerInterval);
		
		//log that it's solved
		console.log("Cube Solved");
		
		//add the time to the stored times
		allTimes.addTime(finalTime);
		var best = allTimes.calcBest();
		var ave = allTimes.calcAverage();
		ave = Math.round(ave * 100) / 100;
		console.log("Average: " + ave);
		console.log("Best Solve: " + best);
		
		document.getElementById("BestAve").innerHTML = "Best Solve: " + best + "<br>Average: " + ave;
		
		//update the display, alert the time to the user
		timerLoc.innerHTML = finalTime;
		//alert("Cube solved in: " + finalTime);
		
		//add text saying that the cube is solved
		var canvas = document.getElementById("cube");
		var ctx = canvas.getContext("2d");
		ctx.font = "45px Courier New Bold";
		ctx.fontWeight = "900";
		ctx.fillStyle = "black";
		ctx.fillText("Solved!", 170, 270);
		
		//next keypress will start scrambling the puzzle
		solvedBefore = true;
	}
	else solvedBefore = false;
}

//sets the inerval to start the timer
function keepUpdate()
{			
	//updates the display every 17 milliseconds
	timerInterval = setInterval(updateTimer, 17);
}

//this function updates the appearance of the display
function updateTimer()
{
	//gets the element that displays the time
	var timeLoc = document.getElementById("timerLoc");
	
	//display the new time
	timerLoc.innerHTML = timer.getElapsed();
	
	if(wasNegative && timer.getElapsed() >= 0)
	{
		wasNegative = false;
		timerLoc.style.color = "black";
	}
}

//this function randomly generates a scramble sequence and applies it to the puzzle
var i = 0;//keeps track of the number of moves done
var max = 100;//how many moves in a scramble

//function is called by scramblePuzzle()
//updates the display, then calls scramblePuzzle() again if more moves need to be generated
function doUpdate()
{
	//update the display
	updateCube(three.getCenters(), three.getEdges(), three.getCorners());
	
	//do another scramble move if it hasn't done 100 moves yet
	if(i <= max - 1)
		scramblePuzzle();
	else 
	{
		i=0;
		currentlyScrambling = false;
		if(newSolve)
		{
			timer.reset();
			keepUpdate();
		}
	}
}

//function applies to move to the scramble and adds one to the tally.
//it then delays and then calls doUpdate()
//no return/arguments
function scramblePuzzle()
{
	currentlyScrambling = true;
	scrambledBefore = true;
	
	//logs move done in scramble
	console.log("SCRAMBLE" + (i+1));
	
	//randomly generates move (but not a rotation)
	var randomMove = Math.floor((Math.random() * 20));
	
	//apply move
	alg[randomMove]();
	
	//increment counter
	i++;
	
	//call doUpdate
	setTimeout(doUpdate, 20);
}

//function checks to see if it's already scrambling the puzzle so it doens't scramble again
function startScramble()
{
	if(!currentlyScrambling)
	{
		//allows text to change to black font again
		wasNegative = true;
		
		//location of the text for the timer
		var timerLoc = document.getElementById("timerLoc");
		
		//reset it to blank red text
		timerLoc.innerHTML = ".";
		timerLoc.style.color = "red";
		
		//scramble the puzzle
		i = 0;
		scramblePuzzle();
	}
}

//when user checks/uncheck text box, set up the cube
//change between freestyle mode and timed mode
//returns nothing/pass in nothing
function scrambleChkChange()
{
	var checkBox = document.getElementById("scrambleChk");
	
	//start the scrambling sequence for timed solves
	if(!currentlyScrambling && checkBox.checked)
	{
		
		newSolve = true;
		startScramble();
		solvedBefore = false;
		
		document.getElementById("timerLoc").style.display = "";
	}
	
	else if(!checkBox.checked)
	{
		//stop scrambler, timer, and solving
		window.clearTimeout(timerInterval);
		i = 99;
		newSolve = false;
		
		//make timer disappear
		document.getElementById("timerLoc").style.display = "none";
	}
}

//function returns nothing, no arguments
//renders a grey background if going back to 2d
//also, updates the puzzle to 3d or 2d
function chkChanged()
{
	var chkBox = document.getElementById("is3d");
	if(!chkBox.checked)
	{
		var canvas = document.getElementById("cube");
		var ctx = canvas.getContext("2d");
	
		ctx.beginPath();
		ctx.fillStyle="grey";
		ctx.fillRect(5,5,canvas.width, 400);
	}
	
	updateCube(three.getCenters(), three.getEdges(), three.getCorners());
}

function resetTimesBtn()
{
	allTimes.reset();
	document.getElementById("BestAve").innerHTML = "Best Solve: N/A<br>Average: N/A";
}

//************Binds the event with the functions above***********
//user presses key to make a move
window.addEventListener("keypress", eventKeyPressed);
//user presses button to scramble puzzle
document.getElementById("scrambleChk").addEventListener("change", scrambleChkChange);
//user checks/unchecked the 3d checkbox
document.getElementById("is3d").addEventListener("change", chkChanged);
//resets the times stored in the array
document.getElementById("resetTimes").addEventListener("click", resetTimesBtn);