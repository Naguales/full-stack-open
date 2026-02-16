const Person = ({ person: { name, number }, onDelete }) => (
  <li>
    {name} {number} <button type="button" onClick={onDelete}>Delete</button>
  </li>
)

export default Person
