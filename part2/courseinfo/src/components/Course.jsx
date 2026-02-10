const CourseHeader = ({ name }) => <h2>{name}</h2>

const Part = ({ part: { name, exercises } }) => (
  <p>{name} {exercises}</p>
)

const Content = ({ parts }) => (
  <div>
    {parts.map(part => (
      <Part key={part.id} part={part} />
    ))}
  </div>
)

const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)
  return <p><strong>Total exercises: {total}</strong></p>
}

const Course = ({ course }) => (
  <div>
    <CourseHeader name={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
)

export default Course
