import axios from 'axios'
const baseUrl = '/api/persons'
//'http://localhost:3001/api/persons'
//'https://phonebook-backend-sljo.onrender.com/api/persons'
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}
const createperson = nameObject => {
  const request = axios.post(baseUrl, nameObject)
  return request.then(response => response.data)
}

const removeperson = id => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

const updateperson = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}
export default {getAll,createperson,removeperson,updateperson}