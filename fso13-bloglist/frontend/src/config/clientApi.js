import axios from 'axios'

const clientApi = axios.create({
  // eslint-disable-next-line no-undef
  baseURL: process.env.BACKEND_URL
})

export default clientApi