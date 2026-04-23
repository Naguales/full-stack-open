import { useFeedbackStore } from '../store'

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = () => {
  const good = useFeedbackStore((state) => state.good)
  const neutral = useFeedbackStore((state) => state.neutral)
  const bad = useFeedbackStore((state) => state.bad)

  const all = good + neutral + bad

  if (all === 0) {
    return (
      <div>
        <h2>statistics</h2>
        <p>No feedback given</p>
      </div>
    )
  }

  const average = ((good - bad) / all).toFixed(1)
  const positive = `${((good / all) * 100).toFixed(1)} %`

  return (
    <div>
      <h2>statistics</h2>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={all} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={positive} />
        </tbody>
      </table>
    </div>
  )
}

export default Statistics
