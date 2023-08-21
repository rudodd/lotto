// Fetch historical powerball data from NY's API
export default function handler(req, res) {
  return fetch('https://data.ny.gov/api/views/d6yy-54nr/rows.json')
    .then((response) => {
      if (response.ok) {
        return response.json()
          .then((json) => res.status(200).json(json))
      } else {
        return res.status(response.status).json(response)
      }
    })
}
