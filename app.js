////////// DATA CONTROLLER

const budgetController = (function() {
  //code
  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round(this.value / totalIncome * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
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
    // deleteItem: function(type, id) {
    //   let ids, index;
    //   ids = data.allItems[type].map(function(cur) {
    //     return cur.id;
    //   });

    //   index = ids.indexOf(id);
    //   if (index !== -1) {
    //     data.allItems[type].splice(index, 1);
    //   }
    // },
    deleteItem: function(type, id) {
      data.allItems[type] = data.allItems[type].filter(function(item) {
        return item.id !== id;
      });
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

    calculatePercentages: function() {
      data.allItems.exp.forEach(function(cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function() {
      let allPerc = data.allItems.exp.map(function(cur) {
        return cur.getPercentage();
      });
      return allPerc;
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
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPercLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
  };
  const formatNumber = function(num, type) {
    let numSplit, int, dec;
    /*
      > + / - before the number.
      > exactly 2 decimal points
      comma seperating thousands
      >
      */

    num = Math.abs(num);
    num = num.toFixed(2);
    numSplit = num.split(".");
    int = numSplit[0];
    dec = numSplit[1];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
    }
    return (type === "exp" ? "-" : "+") + "" + int + "." + dec;
  };
  const nodeListForEach = function(list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
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

        html = `<div class = "item clearfix" id = "inc-%id%" >
            <div class="item__description">%description%</div>
            <div class="right clearfix">
              <div class="item__value">%value%</div>
              <div class="item__delete">
                <button class="item__delete--btn">
                <i class="ion-ios-close-outline"></i>
                </button>
              </div>
            </div>
          </div>`;
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html = `<div class="item clearfix" id="exp-%id%">
            <div class="item__description">%description%</div>
            <div class="right clearfix">
              <div class="item__value">%value%</div>
              <div class="item__percentage">21%</div>
              <div class="item__delete">
                <button class="item__delete--btn">
                <i class="ion-ios-close-outline"></i>
                </button>
              </div>
            </div>
          </div>`;
      }

      // replace placeholder text with some actualdata
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

      //Insert html into the dom
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    deleteListItem: function(selecterID) {
      let el = document.querySelector("#" + selecterID);
      el.parentNode.removeChild(el);
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
      let type;
      obj.budget > 0 ? (type = "inc") : (type = "exp");
      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(
        obj.totalInc,
        "inc"
      );
      document.querySelector(
        DOMstrings.expensesLabel
      ).textContent = formatNumber(obj.totalExp, "exp");

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },
    displayMonth: function() {
      let now, date, month, year;

      //   now = new Date();
      //   months = [
      //     "January",
      //     "February",
      //     "March",
      //     "April",
      //     "May",
      //     "June",
      //     "July",
      //     "August",
      //     "September",
      //     "October",
      //     "November",
      //     "December"
      //   ];
      //   month = months[now.getMonth()];
      //   year = now.getFullYear();
      //   document.querySelector(DOMstrings.dateLabel).textContent =
      //     month + " " + year;
      now = new Date();
      date = new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "long"
      }).format(now);
      document.querySelector(DOMstrings.dateLabel).textContent = date;
    },
    changedType: function() {
      let fields;

      fields = document.querySelectorAll(
        DOMstrings.inputType +
          "," +
          DOMstrings.inputDescription +
          "," +
          DOMstrings.inputValue
      );

      nodeListForEach(fields, function(cur) {
        cur.classList.toggle("red-focus");
      });

      document.querySelector(DOMstrings.inputButton).classList.toggle("red");
    },

    displayPercentages: function(percentages) {
      let fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      nodeListForEach(fields, function(current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "--";
        }
      });
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
    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);

    document
      .querySelector(DOM.inputType)
      .addEventListener("change", UIctrl.changedType);
  };

  const DOM = UIctrl.getDOMstrings();
  let input, newItem;

  const updatePercentages = function() {
    //1 calculate percentages
    budgetController.calculatePercentages();
    //2 Read percentages from budgetcontroller
    let percentages = budgetController.getPercentages();
    //3 Update the UI with the new percentages
    UIctrl.displayPercentages(percentages);
  };

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

      //6 Update percentages
      updatePercentages();
    }
  };

  const ctrlDeleteItem = function(event) {
    let itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      // id-$
      splitID = itemID.split("-");
      type = splitID[0];
      ID = +splitID[1]; // changed to number from string;

      //1. delete the item from data structure
      budgetctrl.deleteItem(type, ID);

      //2 delete the item from UI
      UIctrl.deleteListItem(itemID);

      //3 Update  and show the new budget
      updateBudget();

      //4 Update percentages
      updatePercentages();
    }
  };

  //   ctrDeleteItem = function(event) {
  //     var itemID, splitID;
  //     event = event.target; // 'event.target' returns where the event fired
  //     while (!event.getAttribute("id")) {
  //       event = event.parentNode; // with 'parentNode' you traverse up the DOM
  //     }
  //     itemID = event.id;
  //   };

  return {
    init: function() {
      console.log("Application has started");
      UIctrl.displayMonth();
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
