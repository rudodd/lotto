// import custom functionality
import { empty } from './helpers';

export default class Numbers {

  // Class defaults
  constructor (history = []) {

    // Number generation variables
    this.limit = 69;
    this.break = Math.ceil(this.limit / 2);
    this.odd = [];
    this.even = [];
    this.high = [];
    this.low = [];
    for (let i = 1; i <= this.limit; i++) {
      if (i%2 > 0) {
        this.odd.push(i);
      } else {
        this.even.push(i);
      }

      if (i <= this.break) {
        this.low.push(i)
      } else {
        this.high.push(i);
      }
    }

    // Historical data
    this.history = history;
    this.lastDrawing = history[0];
    this.count = {}
    for (let i = 0; i < history.length; i++) {
      const numbers = [...history[i].numbers];
      numbers.pop();
      for (let j = 0; j < numbers.length; j++) {
        const existsInCount = !empty(this.count[numbers[j]]);
        if (existsInCount) {
          this.count[numbers[j]].count = this.count[numbers[j]].count + 1;
        } else {
          this.count[numbers[j]] = {count: 1};
        }
      }
    }
    this.hot = Object.entries(this.count).map((number) => { return {number: Number(number[0]), count: number[1].count}}).sort((a,b) => b.count - a.count).slice(0, 5);
    this.cold = Object.entries(this.count).map((number) => { return {number: Number(number[0]), count: number[1].count}}).sort((a,b) => a.count - b.count).slice(0, 5);
  }

  // Random number generators
  random() { return Math.floor(Math.random() * (this.limit - 1) + 1) };
  powerBall() { return Math.floor(Math.random() * (26 - 1) + 1)  };

  // Number checkers
  isOdd(x) { return this.odd.includes(x) };
  isEven(x) { return this.even.includes(x) };
  isHigh(x) { return this.high.includes(x) };
  isLow(x) { return this.low.includes(x) };

  // Number generator loop
  generateNumbers = (type) => {
    const numbers = [];
    if (type === null) {
      for (let i = 0; numbers.length < 5 && i < 100000; i++) {
        let num = this.random();
        if (!numbers.includes(num)) {
          numbers.push(num);
        }
      }
    } else {
      let dominant = 0;
      let others = 0;
      for (let i = 0; numbers.length < 5 && i < 100000; i++) {
        let num = this.random();
        if (!numbers.includes(num)) {
          if (dominant < 3 && (type === 'odd' ? this.isOdd(num) : type === 'even' ? this.isEven(num) : type === 'high' ? this.isHigh(num) : this.isLow(num))) {
            numbers.push(num);
            dominant++;
          } else if (others < 2) {
            numbers.push(num)
            others++;
          }
        }
      }
    }
    return numbers;
  }

  // Main play generator
  generatePlay(type = null) {
    let play = [];
    for (let i = 0; play.length === 0 && i < 1000; i++) {
      const playAttempt = this.generateNumbers(type);
      const sum = playAttempt.reduce((a, b) => a + b);
      if (playAttempt.length === 5 && (sum >= 130 && sum <= 221)) {
        play = playAttempt;
      }
      i++;
    }
    play.sort((a,b) => a - b);
    play.push(this.powerBall());
    return play;
  }

  // Statistical analysis
  getStats() {
    const data = [...this.history];
    for (let i = 0; i < data.length; i++) {
      const numbers = [...data[i].numbers];
      numbers.pop();
      const sum = numbers.reduce((a, b) => a + b);
      let oddCount = 0;
      let highCount = 0;
      for (let j = 0; j < (numbers.length) ; j++) {
        if (this.isOdd(numbers[j])) { oddCount++ }
        if (this.isHigh(numbers[j])) { highCount++ }
      }
      data[i].stats = {
        isOddDom: oddCount === 3,
        isEvenDom: oddCount === 2,
        isHighDom: highCount === 3,
        isLowDom: highCount === 2,
        sumRange: (sum >= 130 && sum <= 221),
      }
    }
    const oddTotal = data.filter((draw) => draw.stats.isOddDom).length;
    const evenTotal = data.filter((draw) => draw.stats.isEvenDom).length;
    const highTotal = data.filter((draw) => draw.stats.isHighDom).length;
    const lowTotal = data.filter((draw) => draw.stats.isLowDom).length;
    const sumRange = data.filter((draw) => draw.stats.sumRange).length;
    const total = data.filter((draw) => (draw.stats.isOddDom || draw.stats.isEvenDom || draw.stats.isHighDom || draw.stats.isLowDom)).length;

    return {
      all: {
        odd: oddTotal,
        even: evenTotal,
        high: highTotal,
        low: lowTotal,
        total: total,
        sumRange: sumRange,
        hot: this.hot,
        cold: this.cold
      },
      data: data
    };
  }
}