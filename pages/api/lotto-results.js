// import library functionality
import axios from 'axios'

// Fetch historical powerball data from NY's API
export default function handler(req, res) {
  return axios.get('https://data.ny.gov/api/views/d6yy-54nr/rows.json')
    .then((response) => {
      if (response.status === 200) {
        return res.status(200).json(response.data);
      } else {
        return res.status(response.status).json(response)
      }
    })
}
