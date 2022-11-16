
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
    }
}

const inputStream = {
    bufferZone: '',
    maxSize: 9,
    clearBuffer: function() {
        this.bufferZone = '';
    },
    addChar: function(char) {
        if(this.bufferZone.length < this.maxSize) {
            if(char === '.') {
                if(!this.bufferZone.includes('.')) {
                    this.bufferZone += char;
                }
            } else {
                this.bufferZone += char;
            }
        }
    },
    removeChar: function() {
        if (this.bufferZone.length > 0) {
            this.bufferZone = this.bufferZone.slice(0, this.bufferZone.length - 1);
        }
    },
    getInput: function() {
        return parseFloat(this.bufferZone);
    },
};

const calculator = {
    prevAns: null,
    operation: null,
    compute: function() {
        if(this.prevAns != null && inputStream.bufferZone.length > 0 && this.operation != null) {
            nextArg = inputStream.getInput();
            this.prevAns = operate(this.operation, this.prevAns, nextArg);
            return this.prevAns;
        }
    },
};


