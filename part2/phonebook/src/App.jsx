import { useState, useEffect, useRef } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import PersonFilter from './components/PersonFilter'
import Notification from './components/Notification'
import PersonService from './services/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const notificationTimeoutRef = useRef(null)

  const showNotification = (message, type = 'success') => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current)
    }

    setNotification({ message, type })
    notificationTimeoutRef.current = setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    PersonService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(() => {
        showNotification('Failed to fetch persons from server', 'error')
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
      showNotification('Please enter a name', 'info')
      return
    }

    const trimmedNumber = newNumber.trim()
    if (!trimmedNumber) {
      showNotification('Please enter a phone number', 'info')
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
            showNotification(`Updated ${returnedPerson.name}'s number`, 'success')
          })
          .catch(error => {
            if (error.response?.status === 404) {
              showNotification(`Information of ${existingPerson.name} has already been removed from server`, 'error')
              setPersons(prev =>
                prev.filter(p => p.id !== existingPerson.id)
              )
              return
            }

            showNotification(error.response?.data?.error || 'Failed to update person', 'error')
          })

        return
      }
      showNotification(`${trimmedName} is already added to the phonebook`, 'warning')
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
        showNotification(`Added ${returnedPerson.name}`, 'success')
      })
      .catch(error => {
        showNotification(error.response?.data?.error || 'Failed to save person to server', 'error')
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
        showNotification(`Deleted ${person.name}`, 'success')
      })
      .catch(error => {
        if (error.response?.status === 404) {
          showNotification(`Information of ${person.name} has already been removed from server`, 'error')
          setPersons(prev => prev.filter(p => p.id !== person.id))
          return
        }

        showNotification(`Failed to delete ${person.name}`, 'error')
      })
  }

  return (
    <div>
      <h1>Phonebook</h1>

      <Notification notification={notification} />
      
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
