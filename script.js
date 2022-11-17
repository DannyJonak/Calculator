
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

function changeSign(num) {
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
            return changeSign(nums[0]);
    }
}

const operationMap = {
    '+': '+',
    '-': '-',
    '\u00F7': '/',
    'x': '*',
    '\u000B1': '+/-'
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
            if(this.arguments.length > 0 && this.operation === null) this.clear;
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
            const ans = operate(this.operation, ...this.arguments);
            this.clear();
            this.arguments.push(ans);
            console.log(ans);
            return ans;
        }
        return this.arguments.at(-1);
    },
    unaryOperate: function() {
        this.getArg();
        if(this.arguments.length > 0) {
            const ans = operate(this.operation, this.arguments.at(-1));
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

const equals = document.querySelector('#equals');
equals.addEventListener('click', () => {
    calculator.getArg();
    calculator.binaryOperate();
});

const clear = document.querySelector('#clear');
clear.addEventListener('click', () => {
    inputStream.clearBuffer();
    calculator.clear();
})
