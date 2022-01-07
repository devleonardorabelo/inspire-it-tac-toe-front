import React from "react"
import io, { Socket } from "socket.io-client"

// ? STATES ? //
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import {
  resetGame,
  resetStatus,
  setGame,
  setIsConnected,
  setStatus,
} from "../../redux/save"
import { currentGame } from "../../redux/store"

import type { Game } from "../../types"

const useSocket = () => {
  const [socket, setSocket] = React.useState<Socket | null>(null)
  const { room, nickname } = useAppSelector(currentGame)
  const dispatch = useAppDispatch()

  const restart = React.useCallback(
    () => socket?.emit("restart", room),
    [socket, room]
  )

  const selectSquare = React.useCallback(
    (pos: number) => {
      socket?.emit("move", { pos, room, nickname })
    },
    [nickname, room, socket]
  )

  const startGame = React.useCallback(() => {
    socket?.emit("enterTheRoom", { room, nickname })
  }, [nickname, room, socket])

  const leaveGame = React.useCallback(() => {
    socket?.emit("leave", { room, nickname })
  }, [nickname, room, socket])

  const initSocket = React.useCallback(() => {
    const socketClient = io(process.env.REACT_APP_SOCKET_URL || "")
    socketClient.on("board", (e: Game) => {
      dispatch(setGame(e))
    })
    socketClient.on("connection", () => {
      dispatch(setIsConnected(true))
    })
    socketClient.on("disconnect", (e) => {
      dispatch(resetGame())
      dispatch(setIsConnected(false))
    })
    socketClient.on("leaveGame", (e) => {
      dispatch(resetGame())
      dispatch(setIsConnected(false))
    })
    socketClient.on("status", (e) => {
      dispatch(setStatus(e))
      setTimeout(() => {
        dispatch(resetStatus())
      }, 3000)
    })
    setSocket(socketClient)
  }, [dispatch])

  React.useEffect(() => {
    initSocket()
  }, [initSocket])

  return { socket, restart, selectSquare, startGame, leaveGame }
}

export default useSocket
