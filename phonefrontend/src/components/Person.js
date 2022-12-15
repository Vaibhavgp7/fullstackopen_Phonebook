import React from "react"
const Person = ({deletePerson,personsToShow}) => {
  return (

    <div>
      {personsToShow.map((person) => 
      <div key={person.id}>  {person.name} {person.number} <button onClick={() => deletePerson(person.id)}>delete</button></div>
      
)}
    </div>
  )
}
  
export default Person