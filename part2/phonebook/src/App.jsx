import { useState, useEffect } from 'react'
import axios from 'axios'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import PersonFilter from './components/PersonFilter'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')

  const baseUrl = 'http://localhost:3001/persons'

  useEffect(() => {
    console.log('Effect')
    axios
      .get(baseUrl)
      .then(response => {
        console.log('Promise fulfilled')
        setPersons(response.data)
      })
      .catch(error => {
        console.error('Error fetching persons:', error)
      })
  }, [])

  const normalizedFilter = nameFilter.toLowerCase().trim()

  const personsToShow =
    normalizedFilter === ''
      ? persons
      : persons.filter(person =>
        person.name.toLowerCase().includes(normalizedFilter)
      )

  const handleAddPerson = (event) => {
    event.preventDefault()

    const trimmedName = newName.trim()
    const normalizedName = trimmedName.toLowerCase()

    if (!trimmedName) {
      alert('Please enter a name')
      return
    }

    const trimmedNumber = newNumber.trim()
    if (!trimmedNumber) {
      alert('Please enter a phone number')
      return
    }

    if (persons.some(p => p.name.toLowerCase() === normalizedName)) {
      alert(`${trimmedName} is already added to the phonebook`)
      return
    }

    const nextId = persons.reduce((maxId, p) => Math.max(maxId, p.id), 0) + 1

    const personObject = {
      name: trimmedName,
      number: trimmedNumber,
      id: nextId
    }

    setPersons(prev => prev.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h1>Phonebook</h1>

      <PersonFilter value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} />

      <h2>Add a new</h2>
      <PersonForm
        name={newName}
        number={newNumber}
        onSubmit={handleAddPerson}
        onNameChange={(e) => setNewName(e.target.value)}
        onNumberChange={(e) => setNewNumber(e.target.value)}
      />

      <h2>Numbers</h2>
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App
