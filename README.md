# Power Patterns

Power Patterns is a Powerball number generator focused primarily on generating numbers matching higher likelihood combinatorial patterns, specifically 3:2 ratio patterns among the 50/50 probability plays (odd/even and high/low).  Additionally it ensures that all plays fall in the “balanced” range as defined by the sum of the numbers falling between 130-221.

## Features
- Displays the current jackpot, estimated cash value, and draw date for the nexting drawing (scraped from powerball.com)
- Analyzes previous 100 draws to determine hot and cold numbers (data pulled from the state of NY's publishing of powerball historical data)
- Randomly generates plays matching either one of four pre-defined combinatorial patterns or a purely randomly generated play
- Ensures all plays fall in the "balanced" range with a sum totaling 130-221
- Allows for the optional exclusion of both or either hot or cold numbers as determined by the last 100 draws
- Highlights hot and cold numbers that have been generated
- Saves generated plays in localStorage and checks for winners within generated plays after the draws has taken place for a given play

## Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

It uses minimal additional npm packages, but those used are as follows:
- [MUI (Material UI)](https://mui.com/material-ui/getting-started/) - Used for UI components / general styling
- [SASS](https://www.npmjs.com/package/sass) - Used for SCSS integration
- [Cheerio](https://www.npmjs.com/package/cheerio) - Used to parse the HTML from powerball.com to get next drawing data

To run the development server:

```bash
npm ci
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
