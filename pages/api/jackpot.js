// ES6 or TypeScript:
import * as cheerio from 'cheerio';

export default function handler(req, res) {
  fetch('https://www.powerball.com')
    .then((response) => {
      if (response.ok) {
        response.text()
          .then((text) => {
            const $ = cheerio.load(text);
            $.html();
            const jackpot = $('.game-jackpot-number.text-xxxl').text();
            const cash = $('.game-jackpot-number.text-lg').text();
            res.status(200).json({jackpot: jackpot, cash: cash});
          })
      } else {
        res.status(response.status).json(response)
      }
    })
}