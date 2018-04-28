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

  const data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  return {
    addItem: function(type, des, val) {
      let ID, newItem;
      console.log(des, val);

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
        console.log(des, val);
        newItem = new Income(ID, des, val);
      }
      console.log(newItem);
      //addes the new item to the data according to the type ---- 'exp' or 'inc'
      data.allItems[type].push(newItem);
      console.log(data);
      // return new item
      return newItem;
    },
    testing: function() {
      console.log(data);
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
    expensesContainer: ".expenses__list"
  };
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
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
    // clearFields: function() {
    //   let fields;
    //   fields = document.querySelectorAll("input");

    //   fields.forEach(element => {
    //     element.value = "";
    //   });
    // },
    clearFields: function() {
      let fields, fieldsArr;
      fields = document.querySelectorAll(
        DOMstrings.inputDescription + "," + DOMstrings.inputValue
      );
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function(current, index, array) {
        current.value = "";
      });
    },
    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

//////////// GLOBAL APP CONTROLLER

const controller = (function(budgetctrl, UIctrl) {
  // eevent-listeners
  const setUpEvenetListeners = function() {
    console.log("setupEventListe");
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
  const ctrlAddItem = function() {
    //code
    // 1. get inputfields values
    input = UIctrl.getInput();
    console.log(input);
    // 2 Add the item to the budget controller.
    newItem = budgetctrl.addItem(input.type, input.description, input.value);
    console.log(newItem);

    //3 Add all items to the  UI
    UIctrl.addListItem(newItem, input.type);

    //4 Clear the fields
    UIctrl.clearFields();

    //5 calculate the budget

    //6 Display the budget on the UI
  };

  return {
    init: function() {
      console.log("Application has started");
      setUpEvenetListeners();
    }
  };
})(budgetController, UIcontroller);

controller.init();
