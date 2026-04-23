import { useFeedbackStore } from '../store'

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>
}

const Buttons = () => {
  const increaseGood = useFeedbackStore((state) => state.increaseGood)
  const increaseNeutral = useFeedbackStore((state) => state.increaseNeutral)
  const increaseBad = useFeedbackStore((state) => state.increaseBad)

  return (
    <div>
      <Button onClick={increaseGood} text="good" />
      <Button onClick={increaseNeutral} text="neutral" />
      <Button onClick={increaseBad} text="bad" />
    </div>
  )
}

export default Buttons
