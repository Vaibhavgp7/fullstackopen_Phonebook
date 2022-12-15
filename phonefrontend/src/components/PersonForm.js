import React from "react"
const PersonForm =({onSubmit,newName,newNumber,handleAddedName,handleAddedNumber}) =>
    <form onSubmit={onSubmit}>
        <div>
          name: <input value={newName}
          onChange={handleAddedName}/>
        </div>
        <div>
          number: <input value={newNumber}
          onChange={handleAddedNumber}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

export default PersonForm