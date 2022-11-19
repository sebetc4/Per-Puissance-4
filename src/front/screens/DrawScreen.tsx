import { Draw } from '../components'
import { useGame } from '../hooks/useGame'

export default function VictoryScreen() {
    const {send} = useGame()
    const restart =() => send({type: 'restart'})
  return (
    <Draw onRestart={restart}/>
  )
}