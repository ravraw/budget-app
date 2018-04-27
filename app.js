const budgetController = (function() {
  //code
})();

const UIcontroller = (function() {
  // code
})();

const controller = (function(budgetctrl, UIctrl) {
  var ctrlAddItem = function() {
    //code
    console.log("enetered");
  };
  document.querySelector(".add__btn").addEventListener("click", ctrlAddItem);

  document.addEventListener("keypress", function(event) {
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });
})(budgetController, UIcontroller);
