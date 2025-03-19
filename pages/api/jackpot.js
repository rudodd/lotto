// Import library functionality
import axios from 'axios';
import * as cheerio from 'cheerio';

// Scrape the latest powerball data from powerball.com
export default function handler(req, res) {
  return axios.get('https://www.powerball.com')
    .then((response) => {
      if (response.status === 200) {
        const $ = cheerio.load(response.data);
        $.html();
        const jackpot = $('.game-jackpot-number.text-xxxl').text();
        const cash = $('.game-jackpot-number.text-lg').text();
        return res.status(200).json({jackpot: jackpot, cash: cash});
      } else {
        return res.status(response.status).json(response)
      }
    })
}