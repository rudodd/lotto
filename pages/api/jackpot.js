// Import library functionality
import * as cheerio from 'cheerio';

// Scrape the latest powerball data from powerball.com
export default function handler(req, res) {
  return fetch('https://www.powerball.com')
    .then((response) => {
      if (response.ok) {
        return response.text()
          .then((text) => {
            const $ = cheerio.load(text);
            $.html();
            const jackpot = $('.game-jackpot-number.text-xxxl').text();
            const cash = $('.game-jackpot-number.text-lg').text();
            return res.status(200).json({jackpot: jackpot, cash: cash});
          })
      } else {
        return res.status(response.status).json(response)
      }
    })
}