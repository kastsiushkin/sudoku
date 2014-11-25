var Sudoku =(function($) {
	var gameBoard
		,game
		,keypad
		,currentCell
		,gameArray = [];

	return {
		init: function (args) {
			var args = args || {};
			gameBoard = $('#' + args.gameBoard);

			createGameBoard();
			createKeypad();

			delegateEvents();

			generateInitialGame();
			renderGame(gameArray);
		}
	}

	//// Helper functions //////

	function createGameBoard() {
		game = createElement('table');
		addIdAttribute(game, 'game');
		for (var i = 0; i < 9; i++) {
			var row = createElement('tr');
			game.append(row);
			var colArray = [];
			for (var j = 0; j < 9; j++) {
				var cell = createElement('td');
				cell.attr('id', 'cell-' + i + '-' + j);
				cell.attr('data-row', i);
				cell.attr('data-col', j);
				colArray.push(-1);
				row.append(cell);
			}
			gameArray.push(colArray);
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

	function delegateEvents () {
		game.bind('click', cellClick);
		keypad.bind('click', keyClick);
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

	function updateCurrentCell (value) {
		var row = +currentCell.dataset.row,
			col = +currentCell.dataset.col;
		gameArray[row][col] = value;
		$(currentCell).text(value);
	}

	function checkSelection (choice) {
		var row = +currentCell.dataset.row,
			col = +currentCell.dataset.col;
		if ( !checkRow(row, choice) || !checkCol(col, choice) || !checkSector(row, col, choice) ) {
			markError();
		} else {
			markOk();
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

	/* Event handlers  */
	function cellClick (event) {
		//TO-DO refactor this code
		currentCell = event.target;
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
		event.stopPropagation();
		var choice = event.target.innerHTML;
		keypad.css('display', 'none');
		updateCurrentCell(+choice);
		checkSelection(+choice);
	};

	/* Game Creation */
	function addValue (row, col, value) {
		gameArray[row][col] = value;
	}

	function generateInitialGame () {
		//Row 1
		addValue(0, 0, 5);
		addValue(0, 1, 3);
		addValue(0, 4, 7);
		//Row 2
		addValue(1, 0, 6);
		addValue(1, 3, 1);
		addValue(1, 4, 9);
		addValue(1, 5, 5);
		//Row 3
		addValue(2, 1, 9);
		addValue(2, 2, 8);
		addValue(2, 7, 6);
		//Row 4
		addValue(3, 0, 8);
		addValue(3, 4, 6);
		addValue(3, 8, 3);
		//Row 5
		addValue(4, 0, 4);
		addValue(4, 3, 8);
		addValue(4, 5, 3);
		addValue(4, 8, 1);
		//Row 6
		addValue(5, 0, 7);
		addValue(5, 4, 2);
		addValue(5, 8, 6);
		//Row 7
		addValue(6, 1, 6);
		addValue(6, 6, 2);
		addValue(6, 7, 8);
		//Row 8
		addValue(7, 3, 4);
		addValue(7, 4, 1);
		addValue(7, 5, 9);
		addValue(7, 8, 5);
		//Row 9
		addValue(8, 4, 8);
		addValue(8, 7, 7);
		addValue(8, 8, 9);
	}

	/* Rendering */
	function renderGame (array) {
		for (var i = 0; i < 9; i++) {
			for (var j = 0; j < 9; j++) {
				var value = array[i][j];
				if ( value !== -1 ) {
					var cell = getCellById(i, j);
					cell.addClass('locked');
					cell.text(value);
					cell.attr('data-value', value);
				}
			}
		}
	}

	function markError (rowIndex, colIndex) {
		$(currentCell).css('color', 'red');
	}

	function markOk (rowIndex, colIndex) {
		$(currentCell).css('color', 'black');
	}

	function getCellById (row, col) {
		return $('#cell-' + row + '-' + col);
	}

})(jQuery);