var Sudoku = (function($) {
	var gameBoard
		,game
		,timer
		,secondsElapsed = 0
		,keypad
		,currentCell
		,toolbar
		,time
		,timeInput
		,reset
		,gameArray;

	return {
		init: function (args) {
			var args = args || {};
			gameBoard = $('#' + args.gameBoard);

			createGameBoard();
			createKeypad();
			createToolbar();

			delegateEvents();

			generateEmptyArray();
			generateInitialGame();
			renderGame(gameArray);
		}
	}

	/* ****************************
		Helper functions
	* ****************************/

	function createGameBoard() {
		game = createElement('table');
		addIdAttribute(game, 'game');
		for (var i = 0; i < 9; i++) {
			var row = createElement('tr');
			game.append(row);
			for (var j = 0; j < 9; j++) {
				var cell = createElement('td');
				cell.attr('id', 'cell-' + i + '-' + j);
				cell.attr('data-row', i);
				cell.attr('data-col', j);
				row.append(cell);
			}
		}
		appendElement(gameBoard, game);
	};

	function createKeypad() {
		var number = 1;
		keypad = createElement('table');
		addIdAttribute(keypad, 'keypad');
		for (var i = 0; i < 3; i++) {
			var row = createElement('tr');
			keypad.append(row);
			for (var j = 0; j < 3; j++) {
				var cell = createElement('td').append(document.createTextNode(number));
				row.append(cell);
				number++;
			}
		}
	
		appendElement(gameBoard, keypad);
	};

	function createToolbar() {
		//Create toolbar container
		toolbar = createElement('div');
		addIdAttribute(toolbar, 'toolbar');
		//Create timer label and time input
		time = createElement('label').append(document.createTextNode('Time: '));
		toolbar.append(time);
		timeInput = createElement('span').append(document.createTextNode('00:00'));
		addIdAttribute(timeInput, 'time-input');
		toolbar.append(timeInput);
		//Create reset button
		reset = createElement('span').append(document.createTextNode('⟳'));
		addIdAttribute(reset, 'reset');
		toolbar.append(reset);

		//Add toolbar to the gameboard
		appendElement(gameBoard, toolbar);
	};

	function delegateEvents () {
		game.bind('click', cellClick);
		keypad.bind('click', keyClick);
		reset.bind('click', resetClick);
	};

	function createElement (element) {
		return $(document.createElement(element));
	};

	function appendElement(parent, element) {
		parent.append(element);
	}

	function addIdAttribute (container, id) {
		container.attr('id', id);
	}

	//Update dom of current cell
	function updateCurrentCell (value) {
		$(currentCell).text(value);
	};

	//Update js array after user selection
	function updateGameArray (value) {
		var position = getRowAndColOfCurrentCell();
		gameArray[position.row][position.col] = (cell(position.row, position.col, value));
	};

	//Returns row and col of currently selected cell
	function getRowAndColOfCurrentCell () {
		return {
			row: +currentCell.dataset.row,
			col: +currentCell.dataset.col
		}
	};

	//Check current selection
	function checkSelection (choice) {
		var row = +currentCell.dataset.row,
			col = +currentCell.dataset.col;
		if ( !checkRow(row, choice) || !checkCol(col, choice) || !checkSector(row, col, choice) ) {
			markError();
		} else {
			markOk();
		}
	}

	/* ****************************
		Event handlers
	* ****************************/
	function cellClick (event) {
		if ( !timer ) {
			startTime();
		}
		//TO-DO refactor this code
		$(currentCell).removeClass('active');
		currentCell = event.target;
		$(currentCell).addClass('active');
		if ( currentCell.className.indexOf('locked') !== -1 ) {
			return false;
		}
		var bottomLimit = event.currentTarget.clientHeight;
		var currentBottom = currentCell.offsetTop + currentCell.clientHeight * 4;
		var leftLimit = event.currentTarget.clientWidth;
		var currentleft = currentCell.offsetLeft + currentCell.clientWidth * 4;
		var top, left;
		if ( currentBottom < bottomLimit ) {
			top = currentCell.offsetTop + currentCell.clientHeight;
		} else {
			top = currentCell.offsetTop - currentCell.clientHeight * 3;
		}
		if ( currentleft < leftLimit ) {
			left = currentCell.offsetLeft + currentCell.clientWidth;
		} else {
			left = currentCell.offsetLeft - currentCell.clientWidth * 3;
		}

		console.log(event.currentTarget.clientHeight, currentCell.offsetTop + currentCell.clientHeight * 4);	

		keypad.css('opacity', 0);
		keypad.css('display', 'none');
		keypad.css('top', top);
		keypad.css('left', left);
		keypad.css('display', 'block');
		keypad.animate({
			opacity: 1
		}, 200);
	};

	function keyClick (event) {
		$(currentCell).removeClass('active');
		event.stopPropagation();
		var choice = event.target.innerHTML;
		keypad.css('display', 'none');
		updateCurrentCell(+choice);
		updateGameArray(+choice);
		checkSelection(+choice);
	};

	function resetClick (event) {
		checkGame();
	};

	/* ****************************
		Create js representation of the board
	* ****************************/
	function addValue (cell) {
		gameArray[cell.row][cell.col] = cell;
	};

	function generateEmptyArray () {
		gameArray = [];
		for (var i = 0; i < 9; i++) {
			gameArray[i] = [];
			for (var j = 0; j < 9; j++) {
				gameArray[i][j] = undefined;
			}
		}
	};

	function generateInitialGame () {
		//Row 1
		addValue(cell(0, 0, 5, true, true));
		addValue(cell(0, 1, 3, true, true));
		addValue(cell(0, 4, 7, true, true));
		//Row 2
		addValue(cell(1, 0, 6, true, true));
		addValue(cell(1, 3, 1, true, true));
		addValue(cell(1, 4, 9, true, true));
		addValue(cell(1, 5, 5, true, true));
		//Row 3
		addValue(cell(2, 1, 9, true, true));
		addValue(cell(2, 2, 8, true, true));
		addValue(cell(2, 7, 6, true, true));
		//Row 4
		addValue(cell(3, 0, 8, true, true));
		addValue(cell(3, 4, 6, true, true));
		addValue(cell(3, 8, 3, true, true));
		//Row 5
		addValue(cell(4, 0, 4, true, true));
		addValue(cell(4, 3, 8, true, true));
		addValue(cell(4, 5, 3, true, true));
		addValue(cell(4, 8, 1, true, true));
		//Row 6
		addValue(cell(5, 0, 7, true, true));
		addValue(cell(5, 4, 2, true, true));
		addValue(cell(5, 8, 6, true, true));
		//Row 7
		addValue(cell(6, 1, 6, true, true));
		addValue(cell(6, 6, 2, true, true));
		addValue(cell(6, 7, 8, true, true));
		//Row 8
		addValue(cell(7, 3, 4, true, true));
		addValue(cell(7, 4, 1, true, true));
		addValue(cell(7, 5, 9, true, true));
		addValue(cell(7, 8, 5, true, true));
		//Row 9
		addValue(cell(8, 4, 8, true, true));
		addValue(cell(8, 7, 7, true, true));
		addValue(cell(8, 8, 9, true, true));
	}

	function cell (row, col, number, valid, locked) {
		return {
			row: row,
			col: col,
			value: number,
			valid: valid || true,
			locked: locked || false
		}
	}

	/* ****************************
		Rendering 
	* ****************************/

	//Render the initial game and lock cells
	function renderGame (array) {
		for (var i = 0; i < 9; i++) {
			for (var j = 0; j < 9; j++) {
				var cell = array[i][j];
				if ( cell !== undefined ) {
					var domCell = getCellById(cell.row, cell.col);
					domCell.text(cell.value);
					domCell.addClass('locked');
					domCell.attr('data-value', cell.value);
				}
			}
		}
	};

	function markError (rowIndex, colIndex) {
		$(currentCell).css('color', 'red');
	};

	function markOk (rowIndex, colIndex) {
		$(currentCell).css('color', 'black');
	}

	function getCellById (row, col) {
		return $('#cell-' + row + '-' + col);
	}

	function getIds (row, value) {
		
	}

	function renderNewTime (timeString) {
		$('#time-input').text(timeString);
	}

	/* ****************************
		Check the game 
	* ****************************/

	//Check full board
	function checkGame (argument) {
		console.log(gameArray[0]);
		//Copy array
		var arrayToCheck = gameArray[0].sort();
		for (var i = 0; i < 8; i++) {
			if ( gameArray[0][i] === gameArray[0][i+1] && gameArray[0][i] !== -1 ) {
				getIds();
			}
		}
	}

	// whether there are more than 1 number on the same row
	function checkRow (rowIndex, valueToCheck) {
		var number = 0; 
		for (var i = 0; i < 9; i++) {
			if ( gameArray[rowIndex][i] === valueToCheck) {
				number++;
			}
		}
		return number < 2;
	}

	// whether there are more than 1 number on the same column
	function checkCol (colIndex, valueToCheck) {
		var number = 0; 
		for (var i = 0; i < 9; i++) {
			if ( gameArray[colIndex][i] === valueToCheck) {
				number++;
			}
		}
		return number < 2;
	}

	// whether there are more than 1 number in the same sector
	function checkSector (rowIndex, colIndex, valueToCheck) {
		var rowStart = getSectorStartIndex(rowIndex),
			rowEnd = rowStart + 2,
			colStart = getSectorStartIndex(colIndex),
			colEnd = colStart + 2,
			number = 0; 

		for (var i = rowStart; i <= rowEnd; i++) {
			for (var j = colStart; j <= colEnd; j++) {
				if ( gameArray[i][j] === valueToCheck) {
					number++;
				}
			}
		}
		return number < 2;
	}

	//Returns start index of the sector
	function getSectorStartIndex (index) {
		var startIndex;
		if ( index >= 0 && index < 3 ) {
			startIndex = 0;
		} else if ( index >= 3 && index < 6 ) {
			startIndex = 3;
		} else if ( index >= 6 && index < 9 ) {
			startIndex = 6;
		}

		return startIndex;
	}

	/* ****************************
		Time and scoring
	* ****************************/
	function startTime () {
		timer = setInterval(function () {
			updateTimer();
		}, 1000)
	}

	function updateTimer () {
		secondsElapsed++;
		var timeString = getFormattedTimeString(secondsElapsed);
		renderNewTime(timeString);
	}

	function getFormattedTimeString (secondsElapsed) {
		var seconds = secondsElapsed % 60,
			minutes = Math.floor(secondsElapsed / 60),

			secondsString = seconds < 10 ? '0' + seconds : seconds,
			minutesString = minutes < 10 ? '0' + minutes : minutes;

		return minutesString + ':' + secondsString;
	}

})(jQuery);