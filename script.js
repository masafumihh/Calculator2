class Calculator {

    constructor($previousOperandElm, $currentOperandElm) {
        this.$previousOperandElm = $previousOperandElm;
        this.$currentOperandElm = $currentOperandElm;
        this.clear();
    }

    
    clear() {
        this.previousOperand = '';
        this.currentOperand = '';
        this.operation = undefined;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        //イコールで計算結果を表示後、そのままピリオドを入力しても動作しない問題を解消
        if (number === '.' && this.currentOperand.toString().includes('.')) return;
        // if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        //一度入力した演算子の変更を可能にする
        if (this.currentOperand === '' && this.previousOperand === '') return;
        if (this.currentOperand === '' && this.previousOperand !== '') {
            this.operation = operation;
            return;
        }
        if (this.currentOperand !== '' && this.previousOperand !== '') {
            this.compute();
        }
        // if (this.currentOperand === '') return;
        // if (this.previousOperand !== '') {
        //     this.compute();
        // }

        this.operation = operation;
        //数値の最後が小数点の状態で演算子を入力した時、小数点を消去してから「this.previousOperand」へ代入
        const lastDigit = this.currentOperand.toString().slice(-1);
        if (lastDigit === '.') {
            this.previousOperand = this.currentOperand.toString().slice(0, -1);
        } else {
        this.previousOperand = this.currentOperand;
        }

        // this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        let computation;
        //丸め誤差の解消。「Big.js」を使用
        switch (this.operation) {
            case '÷':
                computation = Big(prev).div(current);
                break;
            case '\u00d7':
                computation = Big(prev).times(current);
                break;
            case '+':
                computation = Big(prev).plus(current);
                break;
            case '-':
                computation = Big(prev).minus(current);
                break;
            default:
                return;
        }
        // switch (this.operation) {
        //     case '÷':
        //         computation = prev / current;
        //         break;
        //     case '\u00d7':
        //         computation = prev * current;
        //         break;
        //     case '+':
        //         computation = prev + current;
        //         break;
        //     case '-':
        //         computation = prev - current;
        //         break;
        //     default:
        //         return;
        // }
        this.currentOperand = parseFloat(computation);
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerPart = parseFloat(stringNumber.split('.')[0]);
        const decimalPart = stringNumber.split('.')[1];
        let integerDisplay;
        //小数点で入力を始めた時、先頭に「0」を追加する
        if (isNaN(integerPart) && number.includes('.')) {
            integerDisplay = 0;
            this.currentOperand = 0 + this.currentOperand.toString();
        } else if (isNaN(integerPart) && !number.includes('.')) {
            integerDisplay = '';
        } else {
            integerDisplay = integerPart.toLocaleString('ja');
        }
        // if (isNaN(integerPart)) {
        //     integerDisplay = '';
        // } else {
        //     integerDisplay = integerPart.toLocaleString('ja');
        // }

        if (decimalPart != null) {
            return `${integerDisplay}.${decimalPart}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        $currentOperandElm.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            $previousOperandElm.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            $previousOperandElm.innerText = '';
        }
    }
}


const $numberBtns = document.querySelectorAll('[data-number]');
const $operationBtns= document.querySelectorAll('[data-operation]');
const $allClearBtn = document.querySelector('[data-all-clear]');
const $deleteBtn = document.querySelector('[data-delete]');
const $equalsBtn = document.querySelector('[data-equals]');
const $previousOperandElm = document.querySelector('[data-previous-operand]');
const $currentOperandElm = document.querySelector('[data-current-operand]');

const calculator = new Calculator($previousOperandElm, $currentOperandElm);

$numberBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        calculator.appendNumber(btn.innerText);
        calculator.updateDisplay();
    });
});

$operationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        calculator.chooseOperation(btn.innerText);
        calculator.updateDisplay();
    });
});

$allClearBtn.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
})

$deleteBtn.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
})

$equalsBtn.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
})

//イコールで計算結果を表示後、そのまま小数点を入力しても動作しない問題を解消：21

//一度入力した演算子の変更を可能にする：28

//数値の最後が小数点の状態で演算子を入力した時、小数点を消去してから「this.previousOperand」へ代入：43

//丸め誤差の解消。「Big.js」を使用：60

//小数点で入力を始めた時、先頭に「0」を追加する：103