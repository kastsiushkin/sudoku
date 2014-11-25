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
				$.data( cell, "row", i );
				$.data( cell, "col", j );
				row.append(cell);
				colArray.push(-1);
			}
			gameArray.push(colArray);
		}
		console.log($.data(cell, 'row'));
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

	function updateCurrentCell (value) {
		$(currentCell).text(value);
	}

	function addIdAttribute (container, id) {
		container.attr('id', id);
	}

	function checkSelection (rowIndex, colIndex) {
		
	}

	// Event handlers
	function cellClick (event) {
		currentCell = event.target;
		if ( currentCell.className.indexOf('locked') !== -1 ) {
			return false;
		}
		keypad.css('opacity', 0);
		keypad.css('display', 'none');
		keypad.css('top', event.pageY);
		keypad.css('left', event.pageX);
		keypad.css('display', 'block');
		keypad.animate({
			opacity: 1
		}, 200);
	};

	function keyClick (event) {
		event.stopPropagation();
		var choice = event.target.innerHTML;
		keypad.css('display', 'none');
		updateCurrentCell(choice);
	};

	//Game Creation
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

	//Rendering
	function renderGame (array) {
		console.log(array);
		for (var i = 0; i < 9; i++) {
			for (var j = 0; j < 9; j++) {
				if ( array[i][j] !== -1 ) {
					var cell = getCellById(i, j);
					cell.addClass('locked');
					cell.text(array[i][j]);
				}
			}
		}
	}

	function getCellById (row, col) {
		return $('#cell-' + row + '-' + col);
	}

})(jQuery);