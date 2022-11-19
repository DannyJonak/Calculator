const operationMap = {
    '+': '+',
    '-': '-',
    '\u00F7': '/',
    'x': '*',
    '\u00B1': '+/-',
    '\u221A': 'sqrt',
    '%': '%',
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
            case '%':
                return this.modulo(nums[0], nums[1]);
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
    modulo: function(num1, num2) {
        return (parseInt(num1) == num1 && parseInt(num2) == num2 && num2 !== 0)?
            num1%num2: NaN;
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
    arguments: [],
    operation: null,
    clear: function() {
        this.arguments = [];
        this.operation = null;
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
            this.clear();
            this.arguments.push(ans);
            console.log(ans);
            return ans;
        }
        console.log(this.arguments.at(-1))
        return this.arguments.at(-1);
    },
    unaryOperate: function(operation) {
        this.getArg();
        if(this.arguments.length === 1 && this.operation !== null) return;
        if(this.arguments.length > 0) {
            const ans = operations.operate(operation, this.arguments.pop());
            console.log(ans);
            this.arguments.push(ans);
            return ans;
        }
    },
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
        console.log(binaryOpKey.textContent);
        const op = operationMap[binaryOpKey.textContent];
        calculator.setOperation(op);    
    });
});

const unaryOpKeys = document.querySelectorAll('.unary-op-key');
unaryOpKeys.forEach(unaryOpKey => {
    unaryOpKey.addEventListener('click', () => {
        const op = operationMap[unaryOpKey.textContent]
        console.log(unaryOpKey.textContent);
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
})
