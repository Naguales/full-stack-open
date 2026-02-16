import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import PersonFilter from './components/PersonFilter'
import PersonService from './services/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')

  useEffect(() => {
    PersonService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
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

    const existingPerson = persons.find(
      p => p.name.toLowerCase() === normalizedName
    )

    if (existingPerson) {
      if (existingPerson.number !== trimmedNumber) {
        const confirmUpdate = window.confirm(`${existingPerson.name} is already added to the phonebook. Replace the old number with the new one?`)
        if (!confirmUpdate) {
          return
        }

        const updatedPerson = {
          ...existingPerson,
          number: trimmedNumber
        }

        PersonService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(prev =>
              prev.map(person => person.id === existingPerson.id ? returnedPerson : person)
            )
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            alert(`${existingPerson.name} was already removed from server`)
            setPersons(prev =>
              prev.filter(p => p.id !== existingPerson.id)
            )
          })

        return
      }
      alert(`${trimmedName} is already added to the phonebook`)
      return
    }

    const personObject = {
      name: trimmedName,
      number: trimmedNumber
    }

    PersonService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(prev => prev.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        console.error('Error creating person:', error)
        alert('Failed to save person to server')
      })
  }

  const handleDeletePerson = (person) => {
    const confirmDelete = window.confirm(`Delete ${person.name}?`)
    if (!confirmDelete) {
      return
    }

    PersonService
      .remove(person.id)
      .then(() => {
        setPersons(prev => prev.filter(p => p.id !== person.id))
      })
      .catch(error => {
        console.error('Error deleting person:', error)
        alert(`Failed to delete ${person.name} from server`)
      })
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
      <Persons persons={personsToShow} onDeletePerson={handleDeletePerson} />
    </div>
  )
}

export default App
