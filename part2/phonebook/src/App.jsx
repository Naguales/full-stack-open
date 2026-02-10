import { useState } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import PersonFilter from './components/PersonFilter'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')

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
