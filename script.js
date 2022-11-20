const operationMap = {
    '+': '+',
    '-': '-',
    '\u00F7': '/',
    '\u00D7': '*',
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
        return (num1 === 0 && num2 === 0)? NaN: Math.pow(num1, num2);
    },
    squareRoot: function(num) {
        return num<0? NaN: Math.sqrt(num);
    },
    factorial: function(num) {
        try {
            return (num < 0)? NaN: (num === 0)? 1: num * this.factorial(num - 1);
        } catch(error) {
            return NaN;
        }
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
                return 'Error'
            }
            this.clear();
            this.arguments.push(ans);
            return this.formatOutput(ans);
        }
        return this.formatOutput(this.arguments.at(-1));
    },
    unaryOperate: function(operation) {
        this.getArg();
        if(this.arguments.length === 1 && this.operation !== null) {
            return this.formatOutput(this.arguments.at(-1));
        }
        if(this.arguments.length > 0) {
            const ans = operations.operate(operation, this.arguments.pop());
            if(isNaN(ans) || ans === Infinity){
                this.handleError();
                return 'Error'
            }
            this.arguments.push(ans);
            return this.formatOutput(ans);
        }
    },
    changeSign: function() {
        if(inputStream.bufferZone !== '') {
            inputStream.bufferZone = parseFloat(-1 * inputStream.bufferZone).toString();
            display.textContent = inputStream.bufferZone;
        } else if(calculator.operation === null && calculator.arguments.length === 1) {
            calculator.arguments[0] = -1 * calculator.arguments[0];
            display.textContent = calculator.formatOutput(calculator.arguments.at(-1));
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
        if(calculator.isActive){
            inputStream.addChar(numberKey.textContent);
            display.textContent = inputStream.bufferZone;
        }
    });
});

const binaryOpKeys = document.querySelectorAll('.binary-op-key');
binaryOpKeys.forEach(binaryOpKey => {
    binaryOpKey.addEventListener('click', () => {
        if(calculator.isActive) {
            display.textContent = calculator.binaryOperate();
            const op = operationMap[binaryOpKey.textContent];
            calculator.setOperation(op);
        }    
    });
});

const unaryOpKeys = document.querySelectorAll('.unary-op-key');
unaryOpKeys.forEach(unaryOpKey => {
    unaryOpKey.addEventListener('click', () => {
        if(calculator.isActive) {
            const op = operationMap[unaryOpKey.textContent]
            display.textContent = calculator.unaryOperate(op);
        }
    });
});

const equals = document.querySelector('#equals');
equals.addEventListener('click', () => {
    if(calculator.isActive) {
        display.textContent = calculator.binaryOperate();
    }
});

const clear = document.querySelector('#clear');
clear.addEventListener('click', () => {
    inputStream.clearBuffer();
    calculator.clear();
    inputStream.addChar('0');
    display.textContent = inputStream.bufferZone;
});

const backspace = document.querySelector('#backspace');
backspace.addEventListener('click', () => {
    if(calculator.isActive) {
        if(inputStream.bufferZone !== ''){
            inputStream.removeChar();
            display.textContent = inputStream.bufferZone;
        }
    }
});

const changeSign = document.querySelector('#change-sign');
changeSign.addEventListener('click', () => {
    if(calculator.isActive) {
        calculator.changeSign();
    }
});

const display = document.querySelector('.display');