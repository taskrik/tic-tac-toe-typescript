import { JsonController, Get, Param, Post, HttpCode, BodyParam, } from 'routing-controllers'
import Game from './entity'

// create consts for the colors and the board from the instructions

const selectedColors = ['red', 'blue', 'magenta', 'green', 'yellow']

const defaultBoard = [
    ['o', 'o', 'o'],
    ['o', 'o', 'o'],
    ['o', 'o', 'o']
]


@JsonController()
export default class GameController {



    @Get('/games/')
    async allGames() {
        const games = await Game.find()
        return { games }
    }

    @Post('/games')
    @HttpCode(201)
    createGame(
        @BodyParam("name") name : string
    ) {
        const newGame = new Game()

        newGame.name = name
        newGame.color = selectedColors[Math.floor(Math.random() * selectedColors.length)]
        newGame.board = defaultBoard

        return newGame.save()
    }

    @Get('/games/:id')
    getGame(
        @Param('id') id: number
    ) {
        return Game.findOne(id)
    }

    


}