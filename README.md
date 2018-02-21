# Tetris

## Playfield

* Playfield is 12 cells wide and at least 20 cells tall.

## Tetris shapes

* Cyan I
* Yellow O
* Purple T
* Green S
* Red Z
* Blue J
* Orange L


## Gameplay

* A Random block is drawn
* It is placed in the top two lines of the arena
* It `ticks` downwards as gravity is applied
* The user may move the piece left and right with their arrow keys
* The player may left and right `rotate` the pieces if they fit
* The player may stop the game using `esc` key
* A block may not move into a space occupied by a previous block
* Blocks spawn until the player is defeated.
* When a `tick` occures, any completed horizontal lines are cleared
* If a line is cleared, all contents shift downwards and user gets a score
