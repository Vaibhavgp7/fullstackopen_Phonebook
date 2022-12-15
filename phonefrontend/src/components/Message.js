import React from "react"

const fulfilled = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
    }
  
const error = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
    }

const Message = ({ message,haserror}) => {
    if (message === null) {
      return null
    }
    if (haserror === true){
        return (
          <div style={error}>
            {message}
          </div>
        )
      } else {
        return (
          <div style={fulfilled}>
            {message}
          </div>
        )
      }
  }

export default Message