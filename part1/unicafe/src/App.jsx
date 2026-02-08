import { useState } from 'react'

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>
}

const FeedbackButtons = ({ options }) => {
  return (
    <div>
      {options.map(({ text, handler }) => (
        <Button key={text} onClick={handler} text={text} />
      ))}
    </div>
  )
}

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const total = good + neutral + bad

  if (total === 0) {
    return (
      <div>
        <h1>Statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }

  const average = (good - bad) / total
  const positivePercentage = (good / total) * 100

  return (
    <div>
      <h2>Statistics</h2>
      <table>
        <tbody>
          <StatisticLine text="Good" value={good} />
          <StatisticLine text="Neutral" value={neutral} />
          <StatisticLine text="Bad" value={bad} />
          <StatisticLine text="All" value={total} />
          <StatisticLine text="Average" value={average.toFixed(1)} />
          <StatisticLine text="Positive" value={`${positivePercentage.toFixed(1)} %`} />
        </tbody>
      </table>
    </div>
  )
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Give feedback</h1>

      <FeedbackButtons
        options={[
          { text: 'Good', handler: () => setGood(g => g + 1) },
          { text: 'Neutral', handler: () => setNeutral(n => n + 1) },
          { text: 'Bad', handler: () => setBad(b => b + 1) }
        ]}
      />
      
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
