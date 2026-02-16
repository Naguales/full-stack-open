import Person from './Person'

const Persons = ({ persons, onDeletePerson }) => (
  <ul>
    {persons.map(person => (
      <Person
        key={person.id}
        person={person}
        onDelete={() => onDeletePerson(person)}
      />
    ))}
  </ul>
)

export default Persons
