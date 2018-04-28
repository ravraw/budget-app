////////// DATA CONTROLLER

const budgetController = (function() {
  //code
  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  const calculateTotal = function(type) {
    let sum = 0;
    data.allItems[type].forEach(function(cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  const data = {
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

  return {
    addItem: function(type, des, val) {
      let ID, newItem;

      // create new ID --- checks if the exp / inc array length is 0

      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // create new item based on type ---- 'exp' or 'inc'

      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      //addes the new item to the data according to the type ---- 'exp' or 'inc'
      data.allItems[type].push(newItem);

      // return new item
      return newItem;
    },
    testing: function() {
      console.log(data);
    },
    calculateBudget: function() {
      //1 calculate total income and expense
      calculateTotal("inc");
      calculateTotal("exp");
      //2 calculate budget : income - expense
      data.budget = data.totals.inc - data.totals.exp;
      //3 calculate % of expenses to budget.
      if (data.totals.inc > 0) {
        data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
      } else {
        data.percentage = -1;
      }
    },
    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    }
  };
})();

////////// UI CONTROLLER

const UIcontroller = (function() {
  // code

  const DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage"
  };
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },
    addListItem: function(obj, type) {
      let html, newHtml, element;

      // createhtml string with placeholder text

      if (type === "inc") {
        element = DOMstrings.incomeContainer;

        html = `<div class = "item clearfix" id = "income-%id%" >
            <div class="item__description">%description%</div>
            <div class="right clearfix">
              <div class="item__value">%value%</div>
              <div class="item__delete">
                <button class="item__delete--btn">
                 x
                </button>
              </div>
            </div>
          </div>`;
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html = `<div class="item clearfix" id="expense-%id%">
            <div class="item__description">%description%</div>
            <div class="right clearfix">
              <div class="item__value">%value%</div>
              <div class="item__percentage">21%</div>
              <div class="item__delete">
                <button class="item__delete--btn">
                  x
                </button>
              </div>
            </div>
          </div>`;
      }

      // replace placeholder text with some actualdata
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);

      //Insert html into the dom
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },
    // clearFields : function(){
    //      let fields = document.querySelectorAll("input");
    //     ​ fields.forEach(el => el.value = "");
    //      fields[0].focus();
    //     },
    clearFields: function() {
      let fields = document.querySelectorAll("input");
      fields.forEach(el => (el.value = ""));
      fields[0].focus();
    },
    // clearFields: function() {
    //   let fields, fieldsArr;
    //   fields = document.querySelectorAll(
    //     DOMstrings.inputDescription + "," + DOMstrings.inputValue
    //   );
    //   fieldsArr = Array.prototype.slice.call(fields);
    //   fieldsArr.forEach(function(current, index, array) {
    //     current.value = "";
    //   });
    //   fieldsArr[0].focus();
    // },
    getDOMstrings: function() {
      return DOMstrings;
    },

    displayBudget: function(obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expensesLabel).textContent =
        obj.totalExp;

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    }
  };
})();

//////////// GLOBAL APP CONTROLLER

const controller = (function(budgetctrl, UIctrl) {
  // eevent-listeners
  const setUpEvenetListeners = function() {
    document
      .querySelector(DOM.inputButton)
      .addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        event.preventDefault();
        event.stopPropagation();
        ctrlAddItem();
      }
    });
  };

  const DOM = UIctrl.getDOMstrings();
  let input, newItem;

  const updateBudget = function() {
    //1. calculate the budget
    budgetctrl.calculateBudget();
    //2. Return the budget
    let budget = budgetctrl.getBudget();
    //3. Display the budget on the UI
    console.log(budget);
    UIctrl.displayBudget(budget);
  };

  const ctrlAddItem = function() {
    //code
    // 1. get inputfields values
    input = UIctrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2 Add the item to the budget controller.
      newItem = budgetctrl.addItem(input.type, input.description, input.value);

      //3 Add all items to the  UI
      UIctrl.addListItem(newItem, input.type);

      //4 Clear the fields
      UIctrl.clearFields();

      //5 calculate and update budget
      updateBudget();
    }
  };

  return {
    init: function() {
      console.log("Application has started");
      UIctrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: 0
      });
      setUpEvenetListeners();
    }
  };
})(budgetController, UIcontroller);

controller.init();
