import React from "react"
import * as M from "@mui/material"
import { PlayerCard, SquareButton } from "../../components"
import { useAppSelector } from "../../redux/hooks"
import { currentGame } from "../../redux/store"
import useSocket from "../../hooks/socket"
import "./styles.css"

const Started = () => {
  const { game } = useAppSelector(currentGame)
  const { selectSquare, leaveGame } = useSocket()

  // ? RENDER ? //
  const renderSquare = React.useCallback(
    (pos: number) => {
      return (
        <SquareButton
          key={pos}
          value={game.board[pos]}
          onClick={() => selectSquare(pos)}
        />
      )
    },
    [game.board, selectSquare]
  )

  const renderBoard = React.useMemo(
    () => [...Array(9)].map((_, index) => renderSquare(index)),
    [renderSquare]
  )

  return (
    <>
      <M.Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        p={2}
        sx={{
          minHeight: "100vh",
          margin: "0 auto",
          alignSelf: "center",
          justifySelf: "center",
          boxSizing: "border-box",
        }}
      >
        <M.Box
          gridTemplateAreas={{
            xs: `"board board" "playerX playerO"`,
            md: `"playerX board playerO"`,
          }}
          gridTemplateColumns={{
            xs: "1fr 1fr",
            md: "200px 1fr 200px",
          }}
          gridTemplateRows={{
            xs: "auto auto",
            md: "1fr",
          }}
          rowGap={{
            xs: 12,
            md: 4,
          }}
          columnGap={{
            xs: 4,
            md: 8,
          }}
          sx={{
            display: "grid",
            width: "100%",
            alignItems: "center",
            height: "100%",
          }}
        >
          <M.Box sx={{ gridArea: "playerX" }}>
            <PlayerCard player="X" />
          </M.Box>
          <M.Box
            sx={{
              gridArea: "board",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              display: "flex",
            }}
          >
            <M.Box
              className="board"
              sx={{
                background: "rgba(28, 28, 28, 0.5)",
                backdropFilter: "blur(43px)",
                borderRadius: 4,
                p: 3,
                minWidth: "300px",
                minHeight: "300px",
              }}
              maxWidth={{
                sm: 400,
                md: "100%",
              }}
            >
              <M.Stack
                sx={{
                  background: "url(/assets/svg/board.svg) no-repeat center",
                  backgroundSize: "cover",
                  display: "grid",
                  gridTemplateAreas: `". . ." ". . ." ". . ."`,
                }}
              >
                {renderBoard}
              </M.Stack>
            </M.Box>
            <M.Button sx={{ mt: 2 }} variant="outlined" onClick={leaveGame}>
              LEAVE
            </M.Button>
          </M.Box>
          <M.Grid sx={{ gridArea: "playerO" }}>
            <PlayerCard player="O" />
          </M.Grid>
        </M.Box>
      </M.Stack>
    </>
  )
}

export default Started
