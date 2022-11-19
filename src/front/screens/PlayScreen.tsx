import React from 'react'
import { currentPlayer } from '../../utils/game'
import { GameInfos } from '../components'
import { useGame } from '../hooks/useGame'

type PlayScreenProps = {}

export default function PlayScreen() {

    const { context } = useGame()
    const player = currentPlayer(context!)!

  return (
    <div>
        <GameInfos color={player.color!} name={player.name}/>
    </div>
  )
}
