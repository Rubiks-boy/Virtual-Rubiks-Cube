//By Adam Walker
/************
CHANGE LOG: 5/6/16
-Improved comments to hopefully help understanding of the code
-Fixes to the turning functions, namely turnFace functions
-Incorporation of 'wide' moves and rotations
-Incorporation of actual counterclockwise functions, not calling clockwise 3x
************/

//3x3 class
class ThreeByThree
{
	/*
	When storing colors, W/0-White Y/1-Yellow B/2-Blue G/3-Green R/4-Red O/5-Orange
	Faces: 0-U 1-D 2-B 3-F 4-R 5-L
	*/
	
	//CONSTRUCTOR
	//makes all variables
	//also establishes arrays that hold the state of the cube
	//and initializes with a solved state
	constructor(var1 = 5, var2 = 3)
	{
		//these sync the colors of the faces with the side of the puzzle
		var syncColorWNum = ['white', 'yellow', 'blue', 'green', 'red', 'orange']; //constructor only
		var syncFaceWNum = ['U', 'D', 'B', 'F', 'R', 'L']; //always can be used
	
		/**********************
		EXPLANATION OF HOW VALUES ARE STORED:
		
		EACH FACE:
		C0	E0	C1
		E3	CEN	E1
		C2	E2	C3
		
		C - CORNER, CORNER VALUE
		E - EDGE, EDGE VALUE
		CEN - CENTER OF THE PUZZLE
		
		FACES:
					(U)P/0
		(L)EFT/5	(F)RONT/3	(R)IGHT/4	(B)ACK/2
					(D)OWN/1
					
		FOR NOTATION ON TURNING THE PUZZLE, I HAVE USED STANDARD CUBE NOTATION
		http://ruwix.com/the-rubiks-cube/notation/advanced/
		**********************/
		
		//these hold the state of the cube
		this.cornerVal = new Array(6); //corners - stores values
		this.edgeVal = new Array(6); //edges - stores values
		this.centerVal = new Array(6); //centers - though they never 'move', allows for rotations
		
		//make both arrays 2-d - outside values stores the side of the cube,
		//inside value stores the specific piece on a certain side
		for(var i=0; i<6; i++)
		{
			this.cornerVal[i] = new Array(4);
			this.edgeVal[i] = new Array(4);
		}
		
		//centers can never be changed, except with rotations
		//set initial center values to solved state
		this.centerVal = syncColorWNum;
		
		for(var i=0; i<6; i++)//increments through each to set solved value
		{
			//set each face's corners and edges
			for(var j=0; j<4; j++)
			{
				this.cornerVal[i][j] = syncColorWNum[i];
				this.edgeVal[i][j] = syncColorWNum[i];
			}
		}
	}
	
	/***********
	This function moves all pieces of a side clockwise or counterclockwise.
	Pass in the number of the face to rotate (fn = faceNum)
	Returns nothing. Directly changes the values stored in the object.
	***********/
	
	//If the face is moving clockwise
	turnFaceClockwise(fn)
	{
		//temp values
		var tempE = this.edgeVal[fn][3];
		var tempC = this.cornerVal[fn][3];
		
		//rotate all the edge values clockwise
		this.edgeVal[fn][3] = this.edgeVal[fn][2];
		this.edgeVal[fn][2] = this.edgeVal[fn][1];
		this.edgeVal[fn][1] = this.edgeVal[fn][0];
		this.edgeVal[fn][0] = tempE;
		
		//rotate all the corner values clockwise
		this.cornerVal[fn][3] = this.cornerVal[fn][1];
		this.cornerVal[fn][1] = this.cornerVal[fn][0];
		this.cornerVal[fn][0] = this.cornerVal[fn][2];
		this.cornerVal[fn][2] = tempC;
	}
	
	//If the face is moving counterclockwise
	turnFaceCounter(fn)
	{
		//temp values
		var tempE = this.edgeVal[fn][3];
		var tempC = this.cornerVal[fn][3];
		
		//rotate all the edge values clockwise
		this.edgeVal[fn][3] = this.edgeVal[fn][0];
		this.edgeVal[fn][0] = this.edgeVal[fn][1];
		this.edgeVal[fn][1] = this.edgeVal[fn][2];
		this.edgeVal[fn][2] = tempE;
		
		//rotate all the corner values clockwise
		this.cornerVal[fn][3] = this.cornerVal[fn][2];
		this.cornerVal[fn][2] = this.cornerVal[fn][0];
		this.cornerVal[fn][0] = this.cornerVal[fn][1];
		this.cornerVal[fn][1] = tempC;
	}
	
	/***********
	the following turn each face either clockwise or counterclockwise
	each function corresponds to a face on the puzzle
	(turnRightClockwise() turns the right face clockwise)
	
	none accept any arguments or return any values.
	
	They modify the data stored in each instance of a cube
	directly.
	***********/
	
	//Right face - clockwise
	turnRightClockwise()
	{
		//clockwise
			var tempFU = this.cornerVal[3][1];
			var tempFD = this.cornerVal[3][3];
			var tempFR = this.edgeVal[3][1];
			
			//set all F values to D values
			this.cornerVal[3][1] = this.cornerVal[1][1];
			this.cornerVal[3][3] = this.cornerVal[1][3];
			this.edgeVal[3][1] = this.edgeVal[1][1];
			
			//set all D values to B values
			this.cornerVal[1][1] = this.cornerVal[2][2];
			this.cornerVal[1][3] = this.cornerVal[2][0];
			this.edgeVal[1][1] = this.edgeVal[2][3];
			
			//set all B values to U values
			this.cornerVal[2][2] = this.cornerVal[0][1];
			this.cornerVal[2][0] = this.cornerVal[0][3];
			this.edgeVal[2][3] = this.edgeVal[0][1];
			
			//set all U values to temp values
			this.cornerVal[0][1] = tempFU;
			this.cornerVal[0][3] = tempFD;
			this.edgeVal[0][1] = tempFR;
			
			//take care of ramaining pieces to be moved on right face:
			this.turnFaceClockwise(4);
	}
	
	//Right face - counterclockwise
	turnRightCounter()
	{
		//counterclockwise
			var tempFU = this.cornerVal[3][1];
			var tempFD = this.cornerVal[3][3];
			var tempFR = this.edgeVal[3][1];
			
			//set all F values to U values
			this.cornerVal[3][1] = this.cornerVal[0][1];
			this.cornerVal[3][3] = this.cornerVal[0][3];
			this.edgeVal[3][1] = this.edgeVal[0][1];
			
			//set all U values to B values
			this.cornerVal[0][1] = this.cornerVal[2][2];
			this.cornerVal[0][3] = this.cornerVal[2][0];
			this.edgeVal[0][1] = this.edgeVal[2][3];
			
			//set all B values to D values
			this.cornerVal[2][2] = this.cornerVal[1][1];
			this.cornerVal[2][0] = this.cornerVal[1][3];
			this.edgeVal[2][3] = this.edgeVal[1][1];
			
			//set all D values to temp values
			this.cornerVal[1][1] = tempFU;
			this.cornerVal[1][3] = tempFD;
			this.edgeVal[1][1] = tempFR;
			
			//take care of ramaining pieces to be moved on right face:
			this.turnFaceCounter(4);
	}
		
	//Left face - clockwise
	turnLeftClockwise()
	{
	//clockwise
			var tempFU = this.cornerVal[3][0];
			var tempFD = this.cornerVal[3][2];
			var tempFL = this.edgeVal[3][3];
			
			//set all F values to U values
			this.cornerVal[3][0] = this.cornerVal[0][0];
			this.cornerVal[3][2] = this.cornerVal[0][2];
			this.edgeVal[3][3] = this.edgeVal[0][3];
			
			//set all U values to B values
			this.cornerVal[0][0] = this.cornerVal[2][3];
			this.cornerVal[0][2] = this.cornerVal[2][1];
			this.edgeVal[0][3] = this.edgeVal[2][1];
			
			//set all B values to D values
			this.cornerVal[2][3] = this.cornerVal[1][0];
			this.cornerVal[2][1] = this.cornerVal[1][2];
			this.edgeVal[2][1] = this.edgeVal[1][3];
			
			//set all D values to temp values
			this.cornerVal[1][0] = tempFU;
			this.cornerVal[1][2] = tempFD;
			this.edgeVal[1][3] = tempFL;
			
			//take care of ramaining pieces to be moved on left face:
			this.turnFaceClockwise(5);
	}
	
	//Left face - counterclockwise
	turnLeftCounter()
	{
		//counterclockwise
			var tempFU = this.cornerVal[3][0];
			var tempFD = this.cornerVal[3][2];
			var tempFL = this.edgeVal[3][3];
			
			//set all F values to D values
			this.cornerVal[3][0] = this.cornerVal[1][0];
			this.cornerVal[3][2] = this.cornerVal[1][2];
			this.edgeVal[3][3] = this.edgeVal[1][3];
			
			//set all D values to B values
			this.cornerVal[1][0] = this.cornerVal[2][3];
			this.cornerVal[1][2] = this.cornerVal[2][1];
			this.edgeVal[1][3] = this.edgeVal[2][1];
			
			//set all B values to U values
			this.cornerVal[2][3] = this.cornerVal[0][0];
			this.cornerVal[2][1] = this.cornerVal[0][2];
			this.edgeVal[2][1] = this.edgeVal[0][3];
			
			//set all U values to temp values
			this.cornerVal[0][0] = tempFU;
			this.cornerVal[0][2] = tempFD;
			this.edgeVal[0][3] = tempFL;
			
			//take care of ramaining pieces to be moved on left face:
			this.turnFaceClockwise(5);
			this.turnFaceClockwise(5);
			this.turnFaceClockwise(5);
	}
	
	//Up face - clockwise
	turnUpClockwise()
	{
		var tempFL = this.cornerVal[3][0];
		var tempFR = this.cornerVal[3][1];
		var tempFU = this.edgeVal[3][0];
		
		//set all U values to R values
		this.cornerVal[3][0] = this.cornerVal[4][0];
		this.cornerVal[3][1] = this.cornerVal[4][1];
		this.edgeVal[3][0] = this.edgeVal[4][0];
		
		//set all R values to B values
		this.cornerVal[4][0] = this.cornerVal[2][0];
		this.cornerVal[4][1] = this.cornerVal[2][1];
		this.edgeVal[4][0] = this.edgeVal[2][0];
		
		//set all B values to L values
		this.cornerVal[2][0] = this.cornerVal[5][0];
		this.cornerVal[2][1] = this.cornerVal[5][1];
		this.edgeVal[2][0] = this.edgeVal[5][0];
		
		//set all L values to temp values
		this.cornerVal[5][0] = tempFL;
		this.cornerVal[5][1] = tempFR;
		this.edgeVal[5][0] = tempFU;
		
		//take care of ramaining pieces to be moved on up face:
		this.turnFaceClockwise(0);
	}
	
	//Up face - counterclockwise
	turnUpCounter()
	{
		var tempFL = this.cornerVal[3][0];
		var tempFR = this.cornerVal[3][1];
		var tempFU = this.edgeVal[3][0];
		
		//set all U values to L values
		this.cornerVal[3][0] = this.cornerVal[5][0];
		this.cornerVal[3][1] = this.cornerVal[5][1];
		this.edgeVal[3][0] = this.edgeVal[5][0];
		
		//set all L values to B values
		this.cornerVal[5][0] = this.cornerVal[2][0];
		this.cornerVal[5][1] = this.cornerVal[2][1];
		this.edgeVal[5][0] = this.edgeVal[2][0];
		
		//set all B values to R values
		this.cornerVal[2][0] = this.cornerVal[4][0];
		this.cornerVal[2][1] = this.cornerVal[4][1];
		this.edgeVal[2][0] = this.edgeVal[4][0];
		
		//set all R values to temp values
		this.cornerVal[4][0] = tempFL;
		this.cornerVal[4][1] = tempFR;
		this.edgeVal[4][0] = tempFU;
		
		//take care of ramaining pieces to be moved on up face:
		this.turnFaceCounter(0);
	}
	
	//Down face - clockwise
	turnDownClockwise()
	{
		var tempFL = this.cornerVal[3][2];
		var tempFR = this.cornerVal[3][3];
		var tempFU = this.edgeVal[3][2];
		
		//set all F values to L values
		this.cornerVal[3][2] = this.cornerVal[5][2];
		this.cornerVal[3][3] = this.cornerVal[5][3];
		this.edgeVal[3][2] = this.edgeVal[5][2];
		
		//set all L values to B values
		this.cornerVal[5][2] = this.cornerVal[2][2];
		this.cornerVal[5][3] = this.cornerVal[2][3];
		this.edgeVal[5][2] = this.edgeVal[2][2];
		
		//set all B values to R values
		this.cornerVal[2][2] = this.cornerVal[4][2];
		this.cornerVal[2][3] = this.cornerVal[4][3];
		this.edgeVal[2][2] = this.edgeVal[4][2];
		
		//set all R values to temp values
		this.cornerVal[4][2] = tempFL;
		this.cornerVal[4][3] = tempFR;
		this.edgeVal[4][2] = tempFU;
		
		//take care of ramaining pieces to be moved on down face:
		this.turnFaceClockwise(1);
	}
	
	//Down face - counterclockwise
	turnDownCounter()
	{
		var tempFL = this.cornerVal[3][2];
		var tempFR = this.cornerVal[3][3];
		var tempFU = this.edgeVal[3][2];
		
		//set all F values to R values
		this.cornerVal[3][2] = this.cornerVal[4][2];
		this.cornerVal[3][3] = this.cornerVal[4][3];
		this.edgeVal[3][2] = this.edgeVal[4][2];
		
		//set all R values to B values
		this.cornerVal[4][2] = this.cornerVal[2][2];
		this.cornerVal[4][3] = this.cornerVal[2][3];
		this.edgeVal[4][2] = this.edgeVal[2][2];
		
		//set all B values to L values
		this.cornerVal[2][2] = this.cornerVal[5][2];
		this.cornerVal[2][3] = this.cornerVal[5][3];
		this.edgeVal[2][2] = this.edgeVal[5][2];
		
		//set all L values to temp values
		this.cornerVal[5][2] = tempFL;
		this.cornerVal[5][3] = tempFR;
		this.edgeVal[5][2] = tempFU;
		
		//take care of ramaining pieces to be moved on down face:
		this.turnFaceClockwise(1);
		this.turnFaceClockwise(1);
		this.turnFaceClockwise(1);
	}
	
	//Front face - clockwise
	turnFrontClockwise()
	{
		var tempUL = this.cornerVal[0][2];
		var tempUR = this.cornerVal[0][3];
		var tempUF = this.edgeVal[0][2];
		
		//set all U values to L values
		this.cornerVal[0][2] = this.cornerVal[5][3];
		this.cornerVal[0][3] = this.cornerVal[5][1];
		this.edgeVal[0][2] = this.edgeVal[5][1];
		
		//set all L values to D values
		this.cornerVal[5][3] = this.cornerVal[1][1];
		this.cornerVal[5][1] = this.cornerVal[1][0];
		this.edgeVal[5][1] = this.edgeVal[1][0];
		
		//set all D values to R values
		this.cornerVal[1][1] = this.cornerVal[4][0];
		this.cornerVal[1][0] = this.cornerVal[4][2];
		this.edgeVal[1][0] = this.edgeVal[4][3];
		
		//set all R values to temp values
		this.cornerVal[4][0] = tempUL;
		this.cornerVal[4][2] = tempUR;
		this.edgeVal[4][3] = tempUF;
		
		//take care of ramaining pieces to be moved on front face:
		this.turnFaceClockwise(3);
	}
	
	//Front face - counterclockwise
	turnFrontCounter()
	{
		var tempUL = this.cornerVal[0][2];
		var tempUR = this.cornerVal[0][3];
		var tempUF = this.edgeVal[0][2];
		
		//set all U values to R values
		this.cornerVal[0][2] = this.cornerVal[4][0];
		this.cornerVal[0][3] = this.cornerVal[4][2];
		this.edgeVal[0][2] = this.edgeVal[4][3];
		
		//set all R values to D values
		this.cornerVal[4][0] = this.cornerVal[1][1];
		this.cornerVal[4][2] = this.cornerVal[1][0];
		this.edgeVal[4][3] = this.edgeVal[1][0];
		
		//set all D values to L values
		this.cornerVal[1][1] = this.cornerVal[5][3];
		this.cornerVal[1][0] = this.cornerVal[5][1];
		this.edgeVal[1][0] = this.edgeVal[5][1];
		
		//set all L values to temp values
		this.cornerVal[5][3] = tempUL;
		this.cornerVal[5][1] = tempUR;
		this.edgeVal[5][1] = tempUF;
		
		//take care of ramaining pieces to be moved on front face:
		this.turnFaceClockwise(3);
		this.turnFaceClockwise(3);
		this.turnFaceClockwise(3);
	}
	
	//Back face - clockwise
	turnBackClockwise()
	{
		var tempUL = this.cornerVal[0][0];
		var tempUR = this.cornerVal[0][1];
		var tempUF = this.edgeVal[0][0];
		
		//set all U values to R values
		this.cornerVal[0][0] = this.cornerVal[4][1];
		this.cornerVal[0][1] = this.cornerVal[4][3];
		this.edgeVal[0][0] = this.edgeVal[4][1];
		
		//set all R values to D values
		this.cornerVal[4][1] = this.cornerVal[1][3];
		this.cornerVal[4][3] = this.cornerVal[1][2];
		this.edgeVal[4][1] = this.edgeVal[1][2];
		
		//set all D values to L values
		this.cornerVal[1][3] = this.cornerVal[5][2];
		this.cornerVal[1][2] = this.cornerVal[5][0];
		this.edgeVal[1][2] = this.edgeVal[5][3];
		
		//set all L values to temp values
		this.cornerVal[5][2] = tempUL;
		this.cornerVal[5][0] = tempUR;
		this.edgeVal[5][3] = tempUF;
		
		//take care of ramaining pieces to be moved on back face:
		this.turnFaceClockwise(2);
	}
	
	//Back face - counterclockwise
	turnBackCounter()
	{
		var tempUL = this.cornerVal[0][0];
		var tempUR = this.cornerVal[0][1];
		var tempUF = this.edgeVal[0][0];
		
		//set all U values to L values
		this.cornerVal[0][0] = this.cornerVal[5][2];
		this.cornerVal[0][1] = this.cornerVal[5][0];
		this.edgeVal[0][0] = this.edgeVal[5][3];
		
		//set all L values to D values
		this.cornerVal[5][2] = this.cornerVal[1][3];
		this.cornerVal[5][0] = this.cornerVal[1][2];
		this.edgeVal[5][3] = this.edgeVal[1][2];
		
		//set all D values to R values
		this.cornerVal[1][3] = this.cornerVal[4][1];
		this.cornerVal[1][2] = this.cornerVal[4][3];
		this.edgeVal[1][2] = this.edgeVal[4][1];
		
		//set all R values to temp values
		this.cornerVal[4][1] = tempUL;
		this.cornerVal[4][3] = tempUR;
		this.edgeVal[4][1] = tempUF;
		
		//take care of ramaining pieces to be moved on back face:
		this.turnFaceCounter(2);
	}
	
	/***********
	functions to turn each face counterclockwise
	they call the clocwise functions three times each
	(-270 == 90 degrees)
	NO LONGER USING THESE: MADE ACTUAL COUNTERCLOCKWISE FUNCTIONS
	***********/
	/*turnRightCounter() 
	{
		this.turnRightClockwise();
		this.turnRightClockwise();
		this.turnRightClockwise();
	}
	
	turnLeftClockwise() 
	{
		this.turnLeftCounter();
		this.turnLeftCounter();
		this.turnLeftCounter();
	}
	
	turnUpCounter() 
	{
		this.turnUpClockwise();
		this.turnUpClockwise();
		this.turnUpClockwise();
	}
	
	turnDownClockwise() 
	{
		this.turnDownCounter();
		this.turnDownCounter();
		this.turnDownCounter();
	}
	
	turnFrontClockwise() 
	{
		this.turnFrontCounter();
		this.turnFrontCounter();
		this.turnFrontCounter();
	}
	
	turnBackCounter() 
	{
		this.turnBackClockwise();
		this.turnBackClockwise();
		this.turnBackClockwise();
	}*/
	
	/***********
	middle slice turns M, S, E
	Please refer to notation for more information.
	Please note that these do not call the turnFaceClockwise
	or turnFaceCounter functions as they are not needed.
	Pass in nothing, returns nothing, directly changes values in the object.
	
	These moves do not have a key bound directly to them (at least yet).
	These functions are meant to be used in combination with the above
	basic 12 moves to do rotations (move all three layers) or to form
	wide moves (lowercase letters, two layers move in one move).
	
	These moves modify the center positions.
	***********/
	
	//M - Middle moves - Clockwise
	turnMClockwise()
	{
		//set temp values
		var tempF = this.centerVal[3];
		var tempU = this.edgeVal[3][0];
		var tempD = this.edgeVal[3][2];
		
		//store U values in F
		this.centerVal[3] = this.centerVal[0];
		this.edgeVal[3][0] = this.edgeVal[0][0];
		this.edgeVal[3][2] = this.edgeVal[0][2];
		
		//store B values in U
		this.centerVal[0] = this.centerVal[2];
		this.edgeVal[0][0]= this.edgeVal[2][2];
		this.edgeVal[0][2] = this.edgeVal[2][0];
		
		//store D vales in B
		this.centerVal[2] = this.centerVal[1];
		this.edgeVal[2][2] = this.edgeVal[1][0];
		this.edgeVal[2][0] = this.edgeVal[1][2];
		
		//store temp vals in D
		this.centerVal[1] = tempF;
		this.edgeVal[1][0] = tempU;
		this.edgeVal[1][2] = tempD;
	}
	
	//M - Middle moves - Counterclockwise
	turnMCounter()
	{
		//set temp values
		var tempF = this.centerVal[3];
		var tempU = this.edgeVal[3][0];
		var tempD = this.edgeVal[3][2];
		
		//store D values in F
		this.centerVal[3] = this.centerVal[1];
		this.edgeVal[3][0] = this.edgeVal[1][0];
		this.edgeVal[3][2] = this.edgeVal[1][2];
		
		//store B values in D
		this.centerVal[1] = this.centerVal[2];
		this.edgeVal[1][0]= this.edgeVal[2][2];
		this.edgeVal[1][2] = this.edgeVal[2][0];
		
		//store U vales in B
		this.centerVal[2] = this.centerVal[0];
		this.edgeVal[2][2] = this.edgeVal[0][0];
		this.edgeVal[2][0] = this.edgeVal[0][2];
		
		//store temp vals in U
		this.centerVal[0] = tempF;
		this.edgeVal[0][0] = tempU;
		this.edgeVal[0][2] = tempD;
	}
	
	//S - Standing moves - Clockwise
	turnSClockwise()
	{
		//store temp values
		var tempU = this.centerVal[0];
		var tempR = this.edgeVal[0][1];
		var tempL = this.edgeVal[0][3];
		
		//store R values in U
		this.centerVal[0] = this.centerVal[4];
		this.edgeVal[0][1] = this.edgeVal[4][2];
		this.edgeVal[0][3] = this.edgeVal[4][0];
		
		//store D values in R
		this.centerVal[4] = this.centerVal[1];
		this.edgeVal[4][2] = this.edgeVal[1][3];
		this.edgeVal[4][0] = this.edgeVal[1][1];
		
		//store L values in D
		this.centerVal[1] = this.centerVal[5];
		this.edgeVal[1][3] = this.edgeVal[5][0];
		this.edgeVal[1][1] = this.edgeVal[5][2];
		
		//store temp values in L
		this.centerVal[5] = tempU;
		this.edgeVal[5][0] = tempR;
		this.edgeVal[5][2] = tempL;
	}
	
	//S - Standing moves - Counterclockwise
	turnSCounter()
	{
		//store temp values
		var tempU = this.centerVal[0];
		var tempR = this.edgeVal[0][1];
		var tempL = this.edgeVal[0][3];
		
		//store L values in U
		this.centerVal[0] = this.centerVal[5];
		this.edgeVal[0][1] = this.edgeVal[5][0];
		this.edgeVal[0][3] = this.edgeVal[5][2];
		
		//store D values in L
		this.centerVal[5] = this.centerVal[1];
		this.edgeVal[5][0] = this.edgeVal[1][3];
		this.edgeVal[5][2] = this.edgeVal[1][1];
		
		//store R values in D
		this.centerVal[1] = this.centerVal[4];
		this.edgeVal[1][3] = this.edgeVal[4][2];
		this.edgeVal[1][1] = this.edgeVal[4][0];
		
		//store temp values in R
		this.centerVal[4] = tempU;
		this.edgeVal[4][2] = tempR;
		this.edgeVal[4][0] = tempL;
	}
	
	//E - Equatorial moves - Clockwise
	turnEClockwise()
	{
		//store temp values
		var tempF = this.centerVal[3];
		var tempR = this.edgeVal[3][1];
		var tempL = this.edgeVal[3][3];
		
		//store L values in F
		this.centerVal[3] = this.centerVal[5];
		this.edgeVal[3][1] = this.edgeVal[5][1];
		this.edgeVal[3][3] = this.edgeVal[5][3];
		
		//store B values in L
		this.centerVal[5] = this.centerVal[2];
		this.edgeVal[5][1] = this.edgeVal[2][1];
		this.edgeVal[5][3] = this.edgeVal[2][3];
		
		//store R values in B
		this.centerVal[2] = this.centerVal[4];
		this.edgeVal[2][1] = this.edgeVal[4][1];
		this.edgeVal[2][3] = this.edgeVal[4][3];
		
		//store temp values in R
		this.centerVal[4] = tempF;
		this.edgeVal[4][1] = tempR;
		this.edgeVal[4][3] = tempL;
	}
	
	//E - Equatorial moves - Clockwise
	turnECounter()
	{
		//store temp values
		var tempF = this.centerVal[3];
		var tempR = this.edgeVal[3][1];
		var tempL = this.edgeVal[3][3];
		
		//store R values in F
		this.centerVal[3] = this.centerVal[4];
		this.edgeVal[3][1] = this.edgeVal[4][1];
		this.edgeVal[3][3] = this.edgeVal[4][3];
		
		//store B values in R
		this.centerVal[4] = this.centerVal[2];
		this.edgeVal[4][1] = this.edgeVal[2][1];
		this.edgeVal[4][3] = this.edgeVal[2][3];
		
		//store L values in B
		this.centerVal[2] = this.centerVal[5];
		this.edgeVal[2][1] = this.edgeVal[5][1];
		this.edgeVal[2][3] = this.edgeVal[5][3];
		
		//store temp values in L
		this.centerVal[5] = tempF;
		this.edgeVal[5][1] = tempR;
		this.edgeVal[5][3] = tempL;
	}
	
	/*
	When storing colors, W/0-White Y/1-Yellow B/2-Blue G/3-Green R/4-Red O/5-Orange (at least initially)
	Faces: 0-U 1-D 2-B 3-F 4-R 5-L
	direction variables: 0-clockwise, 1-counterclockwise, 2-twice
	*/
	
	/***********
	functions to wide turn each face (single turn plus slice turn)
	r, l, u, d, f, b both clockwise and counter
	
	Accept no arguments. Return nothing.
	Call two functions each.
	***********/
	
	//r Moves - Clockwise
	turnWideRClockwise()
	{
		this.turnRightClockwise();
		this.turnMCounter();
	}
	
	//r' Moves - Counterclockwise
	turnWideRCounter()
	{
		this.turnRightCounter();
		this.turnMClockwise();
	}
	
	//l Moves - Clockwise
	turnWideLClockwise()
	{
		this.turnLeftClockwise();
		this.turnMClockwise();
	}
	
	//l' Moves - Counterclockwise
	turnWideLCounter()
	{	
		this.turnLeftCounter();
		this.turnMCounter();
	}
	
	//u Moves - Clockwise
	turnWideUClockwise()
	{
		this.turnUpClockwise();
		this.turnECounter();
	}
	
	//u' Moves - Counterclockwise
	turnWideUCounter()
	{
		this.turnUpCounter();
		this.turnEClockwise();
	}
	
	//d Moves - Clockwise
	turnWideDClockwise()
	{
		this.turnDownClockwise();
		this.turnEClockwise();
	}
	
	//d' Moves - Counterclockwise
	turnWideDCounter()
	{	
		this.turnDownCounter();
		this.turnECounter();
	}
	
	//f Moves - Clockwise
	turnWideFClockwise()
	{
		this.turnFrontClockwise();
		this.turnSCounter();
	}
	
	//f' Moves - Counterclockwise
	turnWideFCounter()
	{
		this.turnFrontCounter();
		this.turnSClockwise();
	}
	
	//b Moves - Clockwise
	turnWideBClockwise()
	{
		this.turnBackClockwise();
		this.turnSClockwise();
	}
	
	//b' Moves - Counterclockwise
	turnWideBCounter()
	{	
		this.turnBackCounter();
		this.turnSCounter();
	}
	
	/***********
	functions to rotate each face
	x, y, z clockwise and counter
	
	These turn all three faces in order to rotate:
	They turn two of the basic 12 functions (opposites)
	And turn one slice move
	***********/
	
	//x Moves - Clockwise
	turnXClockwise()
	{
		this.turnRightClockwise();
		this.turnMCounter();
		this.turnLeftCounter();
	}
	
	//x Moves - Counterclockwise
	turnXCounter()
	{
		this.turnLeftClockwise();
		this.turnMClockwise();
		this.turnRightCounter();
	}
	
	//y Moves - Clockwise
	turnYClockwise()
	{
		this.turnUpClockwise();
		this.turnECounter();
		this.turnDownCounter();
	}
	
	//y' Moves - Counterclockwise
	turnYCounter()
	{
		this.turnDownClockwise();
		this.turnEClockwise();
		this.turnUpCounter();
	}
	
	//z Moves - Clockwise
	turnZClockwise()
	{
		this.turnFrontClockwise();
		this.turnSCounter();
		this.turnBackCounter();
	}
	
	//z' Moves - Counterclockwise
	turnZCounter()
	{
		this.turnBackClockwise();
		this.turnSClockwise();
		this.turnFrontCounter();
	}
	
	/***********
	getters for corners edges and centers
	
	return the "2-d" array with the requested values
	***********/
	getEdges() {return this.edgeVal;}
	getCorners() {return this.cornerVal;}
	getCenters() {return this.centerVal;}
};