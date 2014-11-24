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

})(jQuery);