
function addition(num1, num2) {
    return num1 + num2;
}

function subtraction(num1, num2) {
    return num1 - num2;
}

function multiplication(num1, num2) {
    return num1 * num2;
}

function division(num1, num2) {
    return num2==0? NaN: num1 / num2;
}

function plusMinus(num) {
    return -1 * num;
}

function operate(operator, ...nums) {
    switch(operator) {
       
        case '+':
            return addition(nums[0], nums[1]);
        case '-':
            return subtraction(nums[0], nums[1]);
        case '*':
            return multiplication(nums[0], nums[1]);
        case '/':
            return division(nums[0], nums[1]);
        case '+/-':
            return plusMinus(nums[0]);
    }
}