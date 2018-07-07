import { JsonController, Get, Post, HttpCode, BodyParam, Put, Param, NotFoundError, Body, BadRequestError, } from 'routing-controllers'
import Game from './entity'

// create consts for the colors and the board from the instructions
const selectedColors = ['red', 'blue', 'magenta', 'green', 'yellow'],
    defaultBoard = [
        ['o', 'o', 'o'],
        ['o', 'o', 'o'],
        ['o', 'o', 'o']
    ],
    moves = (board1, board2) =>
        board1
            .map((row, y) => row.filter((cell, x) => board2[y][x] !== cell))
            .reduce((a, b) => a.concat(b))
            .length;

@JsonController()
export default class GameController {

    @Get('/games')
    async allGames() {
        const games = await Game.find()
        return { games }
    }

    @Post('/games')
    @HttpCode(201)
    createGame(
        @BodyParam("name") name: string
    ) {
        const newGame = new Game()

        newGame.name = name
        newGame.color = selectedColors[Math.floor(Math.random() * selectedColors.length)]
        newGame.board = defaultBoard

        return newGame.save()
    }

    @Put('/games/:id')
    async updateGame(
        @Param("id") id: number,
        @BodyParam("name") name: string,
        @BodyParam("color") color: string,
        @BodyParam("board") board: object,
        @Body() update: Partial<Game>
    ) {
        let game = await Game.findOne(id);
        // if the game does not exist throw error
        if (!game) throw new NotFoundError("Cannot find game");

        // checks if there is a color and if the color is one from our array
        if (color && !selectedColors.includes(color)) throw new Error('Provide one of the following colors: red, blue, magenta, green, yellow');

        //we are calling the function(that checks the moves at the board)
        // if there is more than one throws errors

        if (moves(board, game.board) > 1) throw new BadRequestError('One move at a time!');

        //if we dont have any errors then we change the data to our tables
        game.color = color;
        game.name = name;
        game.board = board;

        return Game.merge(game, update).save();
    }
}