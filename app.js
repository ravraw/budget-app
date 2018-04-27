const budgetController = (function() {
  const x = 28;
  const add = function(a) {
    return x + a;
  };
  return {
    publicTest: function(b) {
      return add(b);
    }
  };
})();

const UIcontroller = (function() {
  // code
})();

const controller = (function(budgetctrl, UIctrl) {
  const z = budgetController.publicTest(5);

  return {
    anotherPublic: function() {
      console.log(z);
    }
  };
})(budgetController, UIcontroller);
