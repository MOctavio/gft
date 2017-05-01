var cashRegisterApp = (function CashRegisterApp() {
    // Initial cash, available and sold.
    var initialCash;
    var transactions = {
        available: 0,
        sold: 0
    };

    // Money set on the register
    var cashRegister = [
        {
            quantity: 1,
            name: 'One Hundred',
            value: 100
        }, {
            quantity: 5,
            name: 'Twenty',
            value: 20
        }, {
            quantity: 5,
            name: 'Ten',
            value: 10
        }, {
            quantity: 5,
            name: 'Five',
            value: 5
        }, {
            quantity: 10,
            name: 'One',
            value: 1
        }, {
            quantity: 10,
            name: 'Quarter',
            value: 0.25
        }, {
            quantity: 10,
            name: 'Dime',
            value: 0.10
        }, {
            quantity: 10,
            name: 'Nickel',
            value: 0.05
        }, {
            quantity: 100,
            name: 'Penny',
            value: 0.01
        }
    ];

    // Intl number formating
    var currency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });

    // Recursive function that iterates throught the 'cash register'
    var selectChange = function(_changeDue, index) {
        // Index is used only internally
        if (index == null) index = 0;

        // If there are any bills/coins to give change
        if (cashRegister[index].quantity > 0) {
            // Modulus of change and current denomination
            var remain = getModulus(_changeDue, cashRegister[index].value);

            // Possible change with current denominbation
            var changeDue = parseFloat(_changeDue - remain).toFixed(2);

            // Amount of bills/coins need to give the change
            var quantity = changeDue / cashRegister[index].value;

            // If quantiy needed is available
            if (quantity <= cashRegister[index].quantity) {
                cashRegister[index].quantity = cashRegister[index].quantity - (quantity);
                changeDue = changeDue - (cashRegister[index].value * quantity);
            } else {
                // Since full quantity is not available let's try to
                // grab as many bills/coins as we can.
                for (var i = 0; i < cashRegister[index].quantity; i++) {
                    cashRegister[index].quantity--;
                    quantity--;
                    changeDue = changeDue - cashRegister[index].value;
                }
            }
            // if we still need to give any change
            if (remain > 0) {
                // Calls itself sending any change due and
                // remain along with the index
                selectChange(changeDue + remain, index + 1);
            }

        }
    };

    // Given 0.03 % 0.01 it's not 0 we neeed to handle that.
    var getModulus = function(_changeDue, value) {
        if (value > 0.01) {
            return parseFloat(_changeDue % value).toFixed(2);
        } else {
            return Math.trunc((_changeDue % value) * 100) / 100;
        }
    };

    var getChange = function(cash, price) {
        var changeDue = parseFloat(cash - price).toFixed(2);
        selectChange(changeDue);
        return changeDue;
    };

    var makeRegister = function() {
        var total = 0;
        cashRegister.forEach(function(item) {
            total = parseFloat(total + (item.value * item.quantity));
        });
        initialCash = parseFloat(total);
        return total;
    };

    var validPayment = function(price, cash) {
        var changeDue = parseFloat(cash - price).toFixed(2);
        if (changeDue < 0) {
            console.error("Not enough cash to pay!");
            return false;
        }
        if (changeDue > initialCash) {
            console.warn("Insufficient Funds!");
            return false;
        }
        return true;
    }

    function _init() {
        transactions.available = makeRegister();
    }

    function _makePayment(price, cash) {
        // Verifies if the cash is enough to pay
        if (!validPayment(price, cash)) return;

        //  Gets change and update transaction values
        var changeDue = getChange(cash, price);
        transactions.sold = parseFloat(price);
        transactions.available = parseFloat(transactions.available + cash - changeDue);

        // Transaction info
        console.log('\nPrice: \t\t\t' + currency.format(price));
        console.log('Payment: \t\t' + currency.format(cash));
        console.log('Change due: \t' + currency.format(changeDue) + '\n');
        console.log('Closed');
    }

    function _callSquare() {
        console.log('\nInitial cash: \t' + currency.format(initialCash));
        console.log('Sold amount: \t' + currency.format(transactions.sold));
        console.log('Total amount available: ' + currency.format(transactions.available));

        // Print out quantity and denominations
        console.log('\n\nAvailable on the Register.\n\n');
        cashRegister.forEach(function(item) {
            console.log(item.quantity + ' -> \t ' +item.name+'\'s');
        });
    }

    return {init: _init, callSquare: _callSquare, makePayment: _makePayment}
})();

cashRegisterApp.init();

// Generates a random number up to a hundred with two decimal points
var price = (Math.random() * 100).toFixed(2);
cashRegisterApp.makePayment(price, 100); // Price, Cash

// Funny examples used to Debug
// cashRegisterApp.makePayment(price, 10000); // Price, Cash
// cashRegisterApp.makePayment(price, 0); // Price, Cash
// cashRegisterApp.makePayment(67.07, 100); // Price, Cash
// cashRegisterApp.makePayment(97.03, 100); // Price, Cash

// Call square at the end
cashRegisterApp.callSquare();
