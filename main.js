import { Board } from './board.js';
import { BoardRender } from './visualisation.js';
import { HighScores } from './highscores.js'

const currentHighScores = new HighScores('highscores');
currentHighScores.showHighScores();

const fourbyfour = new Board();

const rendering = new BoardRender();
rendering.updateMatrix(fourbyfour.matrix, fourbyfour.currentScore());

const button = document.querySelector('button');
const winElement = document.querySelector('.won');


document.addEventListener('keydown', event => {
    if(!fourbyfour.checkGameEnd()){
        switch (event.key) {
            case 'ArrowUp':
                fourbyfour.updateUp();
                break;
            case 'ArrowDown':
                fourbyfour.updateDown();
                break;
            case 'ArrowLeft':
                fourbyfour.updateLeft();
                break;
            case 'ArrowRight':
                fourbyfour.updateRight();
                break;
            default:
                return; 
        }
    rendering.movementAnimations(fourbyfour.movements, rendering.cells);
    setTimeout(() => {
        rendering.updateMatrix(fourbyfour.matrix, fourbyfour.currentScore());
        if(fourbyfour.chekWinCondition(fourbyfour.currentScore())){ 
            winElement.textContent = `Congratulations! you reached ${fourbyfour.currentScore()}. Now try to reach more!`;
        }
    }, 100);
    }else{
        button.textContent = 'Play Again';
    }
});

button.addEventListener('click', () => {
    if (!fourbyfour.checkGameEnd()) {
        const confirmed = confirm('Are you sure you want to reset game?');
        if (!confirmed) return; 
    }

    currentHighScores.add(fourbyfour.currentScore());
    fourbyfour.resetBoard();
    rendering.updateMatrix(fourbyfour.matrix, fourbyfour.currentScore());
    winElement.textContent = `Reach 2048 to win a game`;
    currentHighScores.showHighScores();

    button.textContent = 'Reset';
});

const clearHS = document.querySelector('.clearHS');
clearHS.addEventListener('click', () => {
    const confirmed = confirm('This will clear all your HighScore. Are you sure?');
    if (!confirmed) return; 
    currentHighScores.clear();
});