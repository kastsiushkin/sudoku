# Sudoku

Board game sudoku. [Wiki Page](http://en.wikipedia.org/wiki/Sudoku)

[Demo](http://valex-tech.com/sudoku)

***

### Technologies Used

* HTML/SCSS
* JavaScript

### Libraries

* jQuery
* SASS

### About

The game is created by including game.js file on the page and calling Sudoku.init() function providing it an id of the element where the game will be appended to.

The game is prepoluated and player is allowed to select numbers for cells that were not part of the populated game. After each selection the entire game board is checked for mistakes and if they are found numbers change color to red indicating the error. 

In the footer of the game, the user can see the time passed since the first selection and can reset the current game.

### Implementation details

game.js file contains all implementation details of the game. 

The state of the game is stored in JavaScript in two-dimensional array 9x9. Each item of the array is an object of format:

    cell = {
    	id: <String uniqueId>,
    	row: <Integer rowIndex>,
    	col: <Integer colIndex>,
    	valid: <Boolean isValidChoice>,
    	locked: <Boolean isEditable>
	}

Cells that are not part of the prepopulated game and are not yet selected have id and value = -1 properties. 

UI representaion is HTML table generated dynamically in JavaScript. Each cell of the table has unique id and data attributes with row and column values that are used to map JavaScript representation to the UI and vice versa.

When user clicks on the cell of the table, keypad with numbers 0-9 appears next to the cell. Position is calculated in the way, such that the keypad will always appear on top of the game board, preventing overflow issues on mobile devices.

Check of the game board is done in 3 steps:

1. Check rows
2. Check columns
3. Check sectors (3x3 blocks)

Each step is narrowed down to getting an array of 9 elements for either a row, column or sector and checking this array for duplicate values. Check for duplicates is done by sorting the array and comparing each value to the next value in the array. If errors are found or the game board is incomplete, global booleans isValid and isFull are set to false. If after the check both bolleans are equal to true it means that the game is correctly solved and the user is greeted with an option to restart the game.

Reset function deletes existing HTML associated with the game, clears timer and calls init() function again generating a new game.

### To Do

* Create the generator for new random games
* Add solve option (algorithm can be found online)
* Revisit reset function
* Think about better abstraction of JavaScript and UI 