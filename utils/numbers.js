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
    this.lastDrawing = history[0];
    this.hot = [];
    this.cold = [];
    
  }

  // Random number generators
  random() { return Math.floor(Math.random() * (this.limit - 1) + 1) };
  powerBall() { return Math.floor(Math.random() * (26 - 1) + 1)  };

  // Number checkers
  isOdd(x) { return this.odd.includes(x) };
  isEven(x) { return this.even.includes(x) };
  isHigh(x) { return this.high.includes(x) };
  isLow(x) { return this.low.includes(x) };

  generateNumbers = (o,e,h,l) => {
    const numbers = [];
    let totalOdd = 0;
    let totalEven = 0;
    let totalHigh = 0;
    let totalLow = 0;
    for (let i = 0; numbers.length < 5 && i < 100000; i++) {
      let num = this.random();
      if (!numbers.includes(num)) {
        if (totalOdd < o && this.isOdd(num)) {
          if (totalHigh < h && this.isHigh(num)) {
            numbers.push(num);
            totalHigh++;
          } else if (totalLow < l && this.isLow(num)) {
            numbers.push(num);
            totalLow++;
          }
          totalOdd++;
        } else if (totalEven < e && this.isEven(num)) {
          if (totalHigh < h && this.isHigh(num)) {
            numbers.push(num);
            totalHigh++;
          } else if (totalLow < l && this.isLow(num)) {
            numbers.push(num);
            totalLow++;
          }
          totalEven++;
        }
      }
    }
    return numbers;
  }

  // Main play generator
  generatePlay(numOdd, numEven, numHigh, numLow) {
    if ((numOdd + numEven) === 5 && (numHigh + numLow) === 5) {
      let play = [];
      for (let i = 0; play.length === 0 && i < 1000; i++) {
        const playAttempt = this.generateNumbers(numOdd, numEven, numHigh, numLow);
        if (playAttempt.length === 5) {
          play = playAttempt;
        }
        i++;
      }
      play.sort((a,b) => a - b);
      play.push(this.powerBall());
      return play;
    } else {
      throw 'The generate play method accepts only a combination 5 odd/even and 5 high/low';
    }
  }
}