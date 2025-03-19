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

  // Random number generator helpers
  random() { return Math.floor(Math.random() * (this.limit - 1) + 1) };
  randomHigh() { return Math.floor(Math.random() * (69 - 36 + 1) + 36)};
  randomLow() { return Math.floor(Math.random() * (35 - 1 + 1) + 1)};
  powerBall() { return Math.floor(Math.random() * (26 - 1) + 1)  };
  makeOdd(x) {
    if (x % 2 === 0) {
      const addOne = Math.random() < 0.5 ? true : false;
      return addOne  ? x + 1 : x - 1;
    } else {
      return x;
    }
  };
  makeEven(x) {
    if (x % 2 !== 0) {
      const addOne = Math.random() < 0.5 ? true : false;
      return ((addOne && x < 70) || x < 3) ? x + 1 : x - 1;
    } else {
      return x;
    }
  };

  // Number checker helpers
  isOdd(x) { return x % 2 !== 0 };
  isEven(x) { return x % 2 === 0 };
  isHigh(x) { return x > 35};
  isLow(x) { return x <= 35 };

  // Helper to generate an array of exlcuded nunmbers
  getExcludedNumbers = (exclusions, numbers) => {
    const hotNumbers = this.hot.map((obj) => obj.number);
    const coldNumbers = this.cold.map((obj) => obj.number);
    return empty(exclusions) ? [...numbers] 
      : exclusions.includes('hot') && exclusions.includes('cold') ? [...numbers, ...hotNumbers, ...coldNumbers] 
      : exclusions.includes('hot') ? [...numbers, ...hotNumbers] 
      : exclusions.includes('cold') ? [...numbers, ...coldNumbers] 
      : [...numbers];
  }

  // Number generator loop
  generateNumbers = (type, exclusions) => {
    const numbers = [];
    let dominant = 0;
    while (numbers.length < 5) {
      const excludedNumbers = this.getExcludedNumbers(exclusions, numbers);
      const isDominant = dominant < 3;
      let num;
      switch(type) {
        case 'odd':
          num = isDominant ? this.makeOdd(this.random()) : this.makeEven(this.random());
          break;
        case 'even':
          num = isDominant ? this.makeEven(this.random()) : this.makeOdd(this.random());
          break;
        case 'high':
          num = isDominant ? this.randomHigh() : this.randomLow();
          break;
        case 'low':
          num = isDominant ? this.randomLow() : this.randomHigh();
          break;
        default:
          num = this.random();
      }
      if (!excludedNumbers.includes(num)) {
        numbers.push(num);
        dominant++;
      }
    }
    return numbers;
  }

  // Main play generator (ensures plays sum in the correct range and adds powerball)
  generatePlay(type = null, exclusions = []) {
    let play;
    let sumInRange = false;
    while (!sumInRange) {
      const playAttempt = this.generateNumbers(type, exclusions);
      const sum = playAttempt.reduce((a, b) => a + b);
      if (playAttempt.length === 5 && (sum >= 130 && sum <= 221)) {
        play = playAttempt;
        sumInRange = true;
      }
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