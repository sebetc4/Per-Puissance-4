import React from 'react'
import { currentPlayer } from '../../utils/game'
import Victory from '../components/Victory'
import { useGame } from '../hooks/useGame'

export default function VictoryScreen() {
    const {context, send} = useGame()
    const player = currentPlayer(context!)
    const restart =() => send({type: 'restart'})
  return (
    <Victory color={player.color!} name={player.name!} onRestart={restart}/>
  )
}
