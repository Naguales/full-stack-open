import Course from './components/Course'

const PageHeader = ({ title }) => <h1>{title}</h1>

const Courses = ({ courses }) => (
  <div>
    {courses.map(course => (
      <Course key={course.id} course={course}/>
    ))}
  </div>
)

const App = () => {
  const courses = [
    {
      id: 1,
      name: 'Half Stack application development',
      parts: [
        { id: 1, name: 'Fundamentals of React', exercises: 10 },
        { id: 2, name: 'Using props to pass data', exercises: 7 },
        { id: 3, name: 'State of a component', exercises: 14 }
      ]
    },
    {
      id: 2,
      name: 'Node.js',
      parts: [
        { id: 1, name: 'Routing', exercises: 3 },
        { id: 2, name: 'Middlewares', exercises: 7 }
      ]
    }
  ]

  const header = 'Web development curriculum'

  return (
    <div>
      <PageHeader title={ header } />
      <Courses courses={ courses } />
    </div>
  ) 
}

export default App
