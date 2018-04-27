////////// DATA CONTROLLER

const budgetController = (function() {
  //code
  const Expense = function(id, description, value) {
    this.id = id;
    this.description;
    this.value;
  };

  const Income = function(id, description, value) {
    this.id = id;
    this.description;
    this.value;
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
})();

////////// UI CONTROLLER

const UIcontroller = (function() {
  // code

  const DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn"
  };
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
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
        ctrlAddItem();
      }
    });
  };

  const DOM = UIctrl.getDOMstrings();

  const ctrlAddItem = function() {
    //code
    // get inputfields values
    const input = UIctrl.getInput();
    console.log(input);
  };

  return {
    init: function() {
      console.log("Application has started");
      setUpEvenetListeners();
    }
  };
})(budgetController, UIcontroller);

controller.init();
