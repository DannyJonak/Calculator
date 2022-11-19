const operationMap = {
    '+': '+',
    '-': '-',
    '\u00F7': '/',
    'x': '*',
    '\u00B1': '+/-',
    '\u221A': 'sqrt',
    'yx': 'pow',
    'n!': 'n!'
};

const operations = {
    operate: function(operator, ...nums) {
        switch(operator) {
           
            case '+':
                return this.addition(nums[0], nums[1]);
            case '-':
                return this.subtraction(nums[0], nums[1]);
            case '*':
                return this.multiplication(nums[0], nums[1]);
            case '/':
                return this.division(nums[0], nums[1]);
            case '+/-':
                return this.changeSign(nums[0]);
            case 'sqrt':
                return this.squareRoot(nums[0]);
            case 'pow':
                return this.power(nums[0], nums[1]);
            case 'n!':
                return this.factorial(nums[0]);
        }
    },
    addition: function(num1, num2) {
        return num1 + num2;
    },
    subtraction: function(num1, num2) {
        return num1 - num2;
    },
    multiplication: function(num1, num2) {
        return num1 * num2;
    },
    division: function(num1, num2) {
        return num2==0? NaN: num1 / num2;
    },
    power: function(num1, num2) {
        return Math.pow(num1, num2);
    },
    changeSign: function(num) {
        return -1 * num;
    },
    squareRoot: function(num) {
        return num<0? NaN: Math.sqrt(num);
    },
    factorial: function(num) {
        return (num < 0)? NaN: (num === 0)? 1: (num >= 171)? NaN: num * this.factorial(num - 1);
    }
};

const inputStream = {
    bufferZone: '',
    maxSize: 10,
    clearBuffer: function() {
        this.bufferZone = '';
    },
    addChar: function(char) {
        if(this.bufferZone.length < this.maxSize) {
            if(char === '.') {
                if(!this.bufferZone.includes('.')) {
                    this.bufferZone += char;
                }
            } else if(this.bufferZone === '0') {
                this.bufferZone = (char === 0)? '0': `${char}`; 
            } else {
                this.bufferZone += char;
            }
        }
        console.log(this.bufferZone);
    },
    removeChar: function() {
        if (this.bufferZone.length > 0) {
            this.bufferZone = this.bufferZone.slice(0, this.bufferZone.length - 1);
        }
    },
    extractInput: function() {
        if(this.bufferZone !== ''){
            const input = parseFloat(this.bufferZone);
            this.clearBuffer();
            return input;
        }
    },
};

const calculator = {
    isActive: false,
    arguments: [],
    operation: null,
    clear: function() {
        this.arguments = [];
        this.operation = null;
        this.isActive = true;
    },
    getArg: function() {
        const nextArg = inputStream.extractInput();
        if(nextArg !== undefined) {
            if(this.arguments.length > 0 && this.operation === null) this.clear();
            if(this.arguments.length === 2) this.arguments.shift();
            this.arguments.push(nextArg);
        }
    },
    setOperation: function(op) {
        this.operation = op;
    },
    binaryOperate: function() {
        this.getArg();
        if(this.arguments.length === 2 && this.operation !== null) {
            const ans = operations.operate(this.operation, ...this.arguments);
            if(isNaN(ans) || ans === Infinity){
                this.handleError();
                console.log('Error!');
                return 'Error!'
            }
            this.clear();
            this.arguments.push(ans);
            console.log(this.formatOutput(ans));
            return this.formatOutput(ans);
        }
        console.log(this.arguments.at(-1))
        return this.arguments.at(-1);
    },
    unaryOperate: function(operation) {
        this.getArg();
        if(this.arguments.length === 1 && this.operation !== null) return;
        if(this.arguments.length > 0) {
            const ans = operations.operate(operation, this.arguments.pop());
            if(isNaN(ans) || ans === Infinity){
                this.handleError();
                console.log('Error!');
                return 'Error!'
            }
            this.arguments.push(ans);
            console.log(this.formatOutput(ans));
            return this.formatOutput(ans);
        }
    },
    formatOutput: function(output) {
        outputString = output.toString();
        if(Math.abs(output) > 9999999999 || (Math.abs(output) < 0.00000001 && output !== 0)) {
            tempOutput = output.toExponential(3);
            return output.toExponential(13 - tempOutput.length);
        } else if(outputString.length > 10) {
            const outputLengthFactor = 10 ** (9 - outputString.indexOf('.'));
            return (Math.round(output * outputLengthFactor) / outputLengthFactor).toString();
        } else {
            return outputString;
        }
    },
    handleError: function() {
        this.clear();
        inputStream.clearBuffer();
        this.isActive = false;
    }
};

const numberKeys = document.querySelectorAll('.numberKey');
numberKeys.forEach(numberKey => {
    numberKey.addEventListener('click', () => {
        inputStream.addChar(numberKey.textContent);
    });
});

const binaryOpKeys = document.querySelectorAll('.binary-op-key');
binaryOpKeys.forEach(binaryOpKey => {
    binaryOpKey.addEventListener('click', () => {
        calculator.binaryOperate();
        const op = operationMap[binaryOpKey.textContent];
        calculator.setOperation(op);    
    });
});

const unaryOpKeys = document.querySelectorAll('.unary-op-key');
unaryOpKeys.forEach(unaryOpKey => {
    unaryOpKey.addEventListener('click', () => {
        const op = operationMap[unaryOpKey.textContent]
        calculator.unaryOperate(op);
    });
});

const equals = document.querySelector('#equals');
equals.addEventListener('click', () => {
    calculator.binaryOperate();
});

const clear = document.querySelector('#clear');
clear.addEventListener('click', () => {
    inputStream.clearBuffer();
    calculator.clear();
});

const backspace = document.querySelector('#backspace');
backspace.addEventListener('click', () => {
    inputStream.removeChar();
});
