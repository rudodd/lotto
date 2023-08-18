// import custom functionality
import { empty } from './helpers';

export default class Numbers {

  // Class defaults
  constructor (history = []) {

    // Number generation variables
    this.limit = 69;
    this.break = Math.ceil(this.limit / 2);

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
  isOdd(x) { return x % 2 !== 0 };
  isEven(x) { return x % 2 === 0 };
  isHigh(x) { return x > 35};
  isLow(x) { return x <= 35 };

  // Number generator loop
  generateNumbers = (type, exclusions) => {
    const hotNumbers = this.hot.map((obj) => obj.number);
    const coldNumbers = this.cold.map((obj) => obj.number);
    const numbers = [];
    if (type === null) {
      for (let i = 0; numbers.length < 5 && i < 100000; i++) {
        const excludedNumbers = empty(exclusions) ? [...numbers] : exclusions.includes('hot') && exclusions.includes('cold') ? [...numbers, ...hotNumbers, ...coldNumbers] : exclusions.includes('hot') ? [...numbers, ...hotNumbers] : exclusions.includes('cold') ? [...numbers, ...coldNumbers] : [...numbers];
        let num = this.random();
        if (!excludedNumbers.includes(num)) {
          numbers.push(num);
        }
      }
    } else {
      let dominant = 0;
      let others = 0;
      for (let i = 0; numbers.length < 5 && i < 100000; i++) {
        let num = this.random();
        const excludedNumbers = empty(exclusions) ? [...numbers] : exclusions.includes('hot') && exclusions.includes('cold') ? [...numbers, ...hotNumbers, ...coldNumbers] : exclusions.includes('hot') ? [...numbers, ...hotNumbers] : exclusions.includes('cold') ? [...numbers, ...coldNumbers] : [...numbers];
        if (!excludedNumbers.includes(num)) {
          if (dominant < 3 && ((type === 'odd' && this.isOdd(num)) || (type === 'even' && this.isEven(num)) || (type === 'high' && this.isHigh(num)) || (type == 'low' && this.isLow(num)))) {
            numbers.push(num);
            dominant++;
          } else if (others < 2 && ((type === 'odd' && !this.isOdd(num)) || (type === 'even' && !this.isEven(num)) || (type === 'high' && !this.isHigh(num)) || (type == 'low' && !this.isLow(num)))) {
            numbers.push(num)
            others++;
          }
        }
      }
    }
    return numbers;
  }

  // Main play generator
  generatePlay(type = null, exclusions = []) {
    let play = [];
    for (let i = 0; play.length === 0 && i < 1000; i++) {
      const playAttempt = this.generateNumbers(type, exclusions);
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