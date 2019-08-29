// BUDGET CONTROLLER
let budgetController = (function () {
	// controls budget calculation
	let Expense = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	let Income = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	let data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1
	};

	let calculateTotal = function (type) {
		let sum = 0;
		data.allItems[type].forEach(function (current, index, arr) {
			sum += current.value;
		});
		data.totals[type] = sum;
		//console.log(data.totals[type]);
	};

	return {
		addItem: function (type, desc, val) {
			let newItem, ID;
			// Create a new ID
			ID = data.allItems[type].length <= 0 ? 1 : data.allItems[type][data.allItems[type].length - 1].id + 1;

			// Create a new item based on type
			if (type === 'exp') {
				newItem = new Expense(ID, desc, val);
			} else if (type === 'inc') {
				newItem = new Income(ID, desc, val)
			} else {
				console.log("ERROR 404!")
			}
			// Push to array
			data.allItems[type].push(newItem);

			// Return new item
			return newItem;
		},
		deleteItem: function(type, id) {
			data.allItems[type].splice(id - 1, 1);
			console.log(data.allItems[type]);
		},
		calculateBudget: function () {
			// Calculate total expenses or incomes
			calculateTotal('exp');
			calculateTotal('inc');
			// Calculate budget
			data.budget = data.totals.inc - data.totals.exp;
			//console.log(data.budget);
			// Calculate percentage for income/expense
			if (data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}
		},
		getBudget: function () {
			return {
				budget: data.budget,
				percentage: data.percentage,
				totalIncome: data.totals.inc,
				totalExpenses: data.totals.exp
			}
		}
	};

})();


// UI Controller
let UIController = (function () {
	// user interface interaction
	let DOMStrings = {
		inputType: '.add__type',
		description: '.add__description',
		value: '.add__value',
		addValueButton: '.add__btn',
		incomeList: '.income__list',
		expenseList: '.expenses__list',
		incomeField: '.budget__income--value',
		expensesField: '.budget__expenses--value',
		budget: '.budget__value',
		percentage: '.budget__expenses--percentage',
		typeSelect: '.add__type',
		container: '.container'
	};


	let selectInputFields = function () {
		let fields, fieldsArray;
		fields = document.querySelectorAll(DOMStrings.value + ', ' + DOMStrings.description);
		fieldsArray = Array.prototype.slice.call(fields);
		return fieldsArray;
	};

	return {
		getInput: function () {
			return {
				type: document.querySelector(DOMStrings.inputType).value,
				description: document.querySelector(DOMStrings.description).value,
				value: parseFloat(document.querySelector(DOMStrings.value).value)
			}
		},
		emptyFieldWarning: function () {
			let fieldsArray = selectInputFields();
			fieldsArray.forEach(function (current, index, array) {
				current.style.border = '1px solid red';
			});
			fieldsArray[0].focus();
		},
		addListItem: function (obj, type, budget) {
			let html, newHtml, itemList;
			// Create HTML
			if (type === 'inc') {
				html = '<div class="item clearfix" id="inc-%id%">' +
					'<div class="item__description">%description%</div> ' +
					'<div class="right clearfix"> <div class="item__value">+%value%</div> ' +
					'<div class="item__delete"> <button class="item__delete--btn">' +
					'<i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
			} else if (type === 'exp') {
				html = '<div class="item clearfix" id="exp-%id%">' +
					'<div class="item__description">%description%</div>' +
					'<div class="right clearfix"> ' +
					'<div class="item__value">-%value%</div> ' +
					'<div class="item__percentage">%percentage%</div> ' +
					'<div class="item__delete"> <button class="item__delete--btn">' +
					'<i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
			}
			// Replace with actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%value%', obj.value + '$');
			newHtml = newHtml.replace('%description%', obj.description);
			if (type === 'exp') {
				newHtml = newHtml.replace('%percentage%', budget.percentage !== -1 ? budget.percentage + '%' : 0 + '%');
			}

			console.log(document.querySelector(DOMStrings.expenseList));
			// Insert HTML into DOM
			if (type === 'inc') {
				itemList = document.querySelector(DOMStrings.incomeList);
			} else if (type === 'exp') {
				itemList = document.querySelector(DOMStrings.expenseList);
			}
			itemList.insertAdjacentHTML('afterbegin', newHtml);
		},
		clearFields: function () {
			let fieldsArray = selectInputFields();
			fieldsArray.forEach(function (current, index, array) {
				current.value = "";
			});
			fieldsArray[0].focus();
		},
		updateFigures: function (budget, income, expense, percentage) {
			let figureArray = {
				0: budget,
				1: income > 0 ? '+' + income : 0,
				2: expense > 0 ? '-' + expense : 0,
				3: percentage !== -1 ? percentage + '%' : 0 + '%'
			}, fields, fieldsArray;
			fields = document.querySelectorAll(DOMStrings.budget + ', ' + DOMStrings.incomeField + ', ' + DOMStrings.expensesField + ', ' + DOMStrings.percentage);
			//console.log(figureArray[0]);
			fieldsArray = Array.prototype.slice.call(fields);
			fieldsArray.forEach(function (curr, index) {
				//console.log(curr);
				curr.innerHTML = figureArray[index];
			});
		},
		getDOMStrings: function () {
			return DOMStrings;
		},
		changeInputForExpense: function () {
			let selectBox = document.querySelector(DOMStrings.typeSelect);
			selectBox.addEventListener('change', function () {
				let fieldsArray = selectInputFields();
				if (selectBox.value === "exp") {
					fieldsArray.forEach(function (current, index, array) {
						current.style.border = '1px solid red';
					});
				} else if (selectBox.value === "inc") {
					fieldsArray.forEach(function (current, index, array) {
						current.style.border = '1px solid green';
					});
				}
				fieldsArray[0].focus();
			});
		},
		removeItemList: function (type, id) {
			document.getElementById(type + '-' + id).remove();
		}
	}
})();


// GLOBAL APP CONTROLLER
let appController = (function (budgetCtrl, UICtrl) {
	let updateBudget = function () {
		// 1. Calculate budget
		budgetController.calculateBudget();
		// 2. Return budget
		let budget = budgetController.getBudget();
		//console.log(budget);
		// 3. Update budget in UI
		UIController.updateFigures(budget.budget, budget.totalIncome, budget.totalExpenses, budget.percentage);
	};

	// Create a add item function
	let ctrlAddItem = function () {
		let newItem, input;
		// 1. Get input data
		input = UIController.getInput();
		//2. Add item to budget controller
		if (input.description === "" || input.value === "") {
			UIController.emptyFieldWarning();
		} else {
			newItem = budgetController.addItem(input.type, input.description, input.value);
		}
		//3. Add the item to the UIController
		updateBudget();
		UIController.addListItem(newItem, input.type, budgetController.getBudget());
		UIController.clearFields();
	};

	let ctrlDeleteItem = function (event) {
		let itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
		if (itemID) {
			let splitID = itemID.split('-')[1];
			let splitType = itemID.split('-')[0];
			budgetController.deleteItem(splitType, splitID);
			UIController.removeItemList(splitType, splitID);
			updateBudget();
		}
	};

	// set up event listeners
	let setupEventListeners = function () {
		// Initialize DOM
		let DOM = UIController.getDOMStrings();

		document.querySelector(DOM.addValueButton).addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function (event) {
			if (event.key === "Enter") {
				ctrlAddItem();
			}
		});

		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
	};

	return {
		init: function () {
			console.log('APP has started!');
			setupEventListeners();
			UIController.changeInputForExpense();
		}
	}

})(budgetController, UIController);

appController.init();

