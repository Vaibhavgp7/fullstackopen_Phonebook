import { useState,useEffect} from 'react'
import React from 'react'
import Person from './components/Person'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import personService from './services/persons'
import Message from './components/Message'

const App = () => {
  const [persons, setPersons] = useState([])
  const [filteredPersons,setFilteredPersons] = useState([])
  const [newFilter,setNewFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [message,setMessage] = useState(null)
  const [haserror,setHaserror] = useState(false)
  useEffect(() => {
    //console.log('effect')
    personService
      .getAll()
      .then(initialpersons => {
        setPersons(initialpersons)
      })
  }, [])
  //console.log('render', persons.length, 'notes')

  const addName = (event) => {
    if((persons.filter(person => person.name === newName)).length !== 0)
    {
      event.preventDefault()
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`))
      {
        const person = persons.filter(person => person.name === newName)
        const updatedperson = {...person[0], number: newNumber}
        personService
          .updateperson(updatedperson.id, updatedperson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.name !== newName ? person : returnedPerson))
            // console.log(`${newName}'s number has been successfully updated`)
            setNewName('')
            setNewNumber('')
            setMessage(`${newName}'s number has been successfully updated`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch((error) => {
            console.log(error)
            setPersons(persons.filter(person => person.name === newName))
            setNewName('')
            setNewNumber('')
            setMessage(
              `Information of ${newName} has already been removed from server`
            )
            setHaserror(true)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
      }
    }
    else{
    event.preventDefault()

    const nameObject = {
      name: newName,
      number: newNumber,
      id: persons.length+1
    }
    personService
      .createperson(nameObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setMessage(
          `Added ${nameObject.name}`
        )
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch(error => {
        setMessage(
          `[ERROR] ${error.response.data.message}`
        )
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setHaserror(true)
        console.log(error.response.data)
      })
    
  }}
  const handleAddedName = (event) => {
    setNewName(event.target.value)
  }
  const handleAddedNumber = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    //setCursor(event.target.selectionStart)
    setNewFilter(event.target.value)
    const nf=event.target.value
    if (event.target.value === '' || event.target.value === ' ') {
      return}
    setFilteredPersons(persons.filter(person => person.name.match(new RegExp(nf,'i'))))
    
  }
  
 const personsToShow = (newFilter !== '') ?
    filteredPersons:
    persons 
 const deletePerson = (id) => {
  const persontodelete = persons.filter(person => person.id === id)
  if (window.confirm(`Delete ${persontodelete[0].name} ?`)) {
    personService
      .removeperson(persontodelete[0].id)
    console.log(`${persontodelete[0].name} successfully deleted`)
    setPersons(persons.filter(person => person.id !== persontodelete[0].id))

  }
}
 


  return (
    <div>
      <h2>Phonebook</h2>
      <Message message={message} haserror={haserror}/>
      <div>
        <Filter value={newFilter} onChange={handleFilterChange} />
      </div>
      <h2>add a new</h2>
      <PersonForm onSubmit={addName} newName={newName} newNumber={newNumber} handleAddedName={handleAddedName} handleAddedNumber={handleAddedNumber}/>
      <h2>Numbers</h2>
      <div>
        <Person deletePerson={deletePerson} personsToShow={personsToShow}/>
      </div>
    </div>
  )
}

export default App