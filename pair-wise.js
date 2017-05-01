var pairWise = (function PairWise() {
    function _findPairs(elements, value) {
        var array = [];

        // Itereate throught our given elements
        elements.forEach(function(element, index) {
            // Start iterating from next element position
            for (var i = index + 1; i < elements.length; i++) {
                // Checks that the values sum up and that
                // the element index haven't been used
                if ((element + elements[i]) === value &&
                    array.indexOf(index) === -1) {
                    // Push into array and break
                    array.push(index, i);
                    break;
                }
            }
        });

        if (array.length >= 1) {
            // Reduce the array to get the total sum
            return array.reduce(function(accumulator, currentValue) {
                return accumulator + currentValue;
            });
        }
        return 0;
    }

    return {findPairs: _findPairs};
})();

var array = [7, 9, 11, 13, 15];
var value = 20;
var indexSum = pairWise.findPairs(array, value);

console.log('\nPair Wise');
console.log('Value', value);
console.log('Array', array.toString());
console.log('Index sum: ',  indexSum);
