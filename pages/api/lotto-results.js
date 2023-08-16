// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  fetch('https://data.ny.gov/api/views/d6yy-54nr/rows.json')
    .then((response) => {
      if (response.ok) {
        response.json()
          .then((json) => res.status(200).json(json))
      } else {
        res.status(response.status).json(response)
      }
    })
}
