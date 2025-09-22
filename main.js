class Board {
    constructor() {
        this.matrix = Array.from({ length: 4 }, () => Array(4).fill(0));
        for(let i = 0; i < 2; i++){
            const pos = this.getRandomPosition();
            this.matrix[pos.x][pos.y] = this.newNumber();
        }
    }

    newNumber() {
        return Math.floor(Math.random()*10) < 9 ? 2 : 4;
    }

    getRandomPosition() {
        const indexes = [];
        this.matrix.forEach((row, i) => {
            row.forEach((value, j) => {
                if(!this.matrix[i][j]) indexes.push(({x: i, y: j}));
            });
        }); 
        return indexes[Math.floor(Math.random() * indexes.length)];
    }

    updateMatrix(cells) {
        const tileColors = [
            '#2f4f4f', 
            '#2e8b57', 
            '#228b22', 
            '#006400', 
            '#004d40', 
            '#003f3f', 
            '#002f2f', 
            '#003366', 
            '#002855', 
            '#001f3f', 
            '#001a33', 
            '#001427', 
            '#000f1a', 
            '#000a0f', 
            '#000509', 
            '#000204', 
            '#000000'  
        ];

        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                this.matrix[i][j]
                    ? cells[i][j].textContent = this.matrix[i][j]
                    : cells[i][j].textContent = '';
                cells[i][j].style.top = `${i * 77}px`;
                cells[i][j].style.left = `${j * 77}px`;
                cells[i][j].classList.remove('left', 'right', 'up', 'down', 'tile', 'merge');
                cells[i][j].style.removeProperty('--steps');
                cells[i][j].style.backgroundColor = '#2e2e2e';
                if(this.matrix[i][j]){
                    cells[i][j].style.backgroundColor = tileColors[Math.log2(this.matrix[i][j])];
                }
                
            }
        }
        document.querySelector('h3').textContent = `Current score: ${this.currentScore()} points`;
    }

    addAjacent(rotations){
        const original = JSON.stringify(this.matrix);
        const directions = ['left', 'up', 'right', 'down'];

        let movementMatrix = Array.from({ length: 4 }, () =>
            Array.from({ length: 4 }, () => ({
                merge: false,
                direction: directions[rotations], 
                moved: 0
            }))
        );

        this.matrix = this.rotateMatrix(rotations, this.matrix);
        this.matrix = this.matrix.map((row, rowIndex) => {
            const line = row.filter((val, columnIndex) => {
                if(!val){
                    movementMatrix[rowIndex][columnIndex].moved = 0;
                    for(let i = columnIndex + 1; i < row.length; i++){
                        movementMatrix[rowIndex][i].moved++;
                    }
                }else{
                    for(let i = columnIndex + 1; i < row.length; i++){
                        const isAllZero = row.slice(columnIndex + 1, i).every(val => val === 0);
                        if(isAllZero && row[columnIndex] === row[i]) {
                            movementMatrix[rowIndex][i].moved++;
                            movementMatrix[rowIndex][i].merge = true;
                        }
                    }            
                }
                return val;
            });
            for(let i = 0; i < line.length - 1; i++){
                if(line[i] === line[i+1]){
                    line.splice(i, 2, line[i]*2);                
                } 
            }
            return [...line, ...Array(4 - line.length).fill(0)];
        });
        this.matrix = this.rotateMatrix(4 - rotations, this.matrix);
        movementMatrix = this.rotateMatrix(4 - rotations, movementMatrix);
        return {
            moved: JSON.stringify(this.matrix) !== original,
            movement: movementMatrix
        };        
    }

    checkPossibleMove(){
        const original = JSON.stringify(this.matrix);
        let matrixCopy = structuredClone(this.matrix)

        matrixCopy = matrixCopy.map(row => {
            const line = row.filter(val => val);
            for(let i = 0; i < line.length - 1; i++){
                if(line[i] === line[i+1]){
                    line.splice(i, 2, line[i]*2);                
                } 
            }
            return [...line, ...Array(4 - line.length).fill(0)];
        });

        return JSON.stringify(matrixCopy) !== original ? false : true;        
    }

    rotateMatrix(times, matrix){
        for(let m = 0; m < times; m++){
            const rotated = Array.from({ length: 4 }, () => Array(4).fill(0));
            for(let i = 0; i < 4; i++){
                for(let j = 0; j < 4; j++){
                    rotated[i][j] = matrix[j][3 - i];
                }
            }
            matrix = rotated;
        }      
        return matrix;
    }

    updateLeft(){
        const visuals = this.addAjacent(0);
        if(visuals.moved){
            const pos = this.getRandomPosition();
            this.matrix[pos.x][pos.y] = this.newNumber();
            this.movementAnimations(visuals);
        }
    }

    updateDown(){
        const visuals = this.addAjacent(3);
        if(visuals.moved){
            const pos = this.getRandomPosition();
            this.matrix[pos.x][pos.y] = this.newNumber();
            this.movementAnimations(visuals);
        }
    }

    updateRight(){
        const visuals = this.addAjacent(2);
        if(visuals.moved){
            const pos = this.getRandomPosition();
            this.matrix[pos.x][pos.y] = this.newNumber();
            this.movementAnimations(visuals);
        }
    }
    
    updateUp(){
        const visuals = this.addAjacent(1);
        if(visuals.moved){
            const pos = this.getRandomPosition();
            this.matrix[pos.x][pos.y] = this.newNumber();
            this.movementAnimations(visuals);
        }
    }

    movementAnimations(visuals){
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                if(visuals.movement[i][j].moved){
                    cells[i][j].classList.add("tile");
                    cells[i][j].classList.add(visuals.movement[i][j].direction); 
                    cells[i][j].style.setProperty('--steps', visuals.movement[i][j].moved); 
                    if(visuals.movement[i][j].merge){
                        cells[i][j].classList.add('merge');
                    }
                }                   
            }
        }
    }

    currentScore(){
        return Math.max(... this.matrix.flat());    
    }

    checkGameEnd(){
        let nomoves = false;
        if(!this.matrix.flat().includes(0)){
            const left = this.checkPossibleMove();
            this.matrix = this.rotateMatrix(1, this.matrix);
            const top = this.checkPossibleMove();
            this.matrix = this.rotateMatrix(1, this.matrix);
            const right = this.checkPossibleMove();
            this.matrix = this.rotateMatrix(1, this.matrix);
            const down = this.checkPossibleMove();
            this.matrix = this.rotateMatrix(1, this.matrix);
            if(left && top && right && down) nomoves = true;
        }
        return nomoves;
    }

    resetBoard(){
        this.matrix = Array.from({ length: 4 }, () => Array(4).fill(0));
        for(let i = 0; i < 2; i++){
            const pos = this.getRandomPosition();
            this.matrix[pos.x][pos.y] = this.newNumber();
        }
    }

    chekWinCondition(score) {
        return score > 2047;
    }
}

class HighScores {
  constructor(key = 'highscores') {
    this.key = key;
    this.scores = this.load();
  }

  load() {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  save() {
    localStorage.setItem(this.key, JSON.stringify(this.scores));
  }

  add(score) {
    this.scores.push({
            date: this.getFormattedDate(),
            value: score
        });
    this.scores.sort((a, b) => b.value - a.value); 
    this.scores = this.scores.slice(0, 10); 
    this.save();
  }

  getFormattedDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const day = String(now.getDate()).padStart(2, '0');

    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }


  getTopScores() {
    return this.scores;
  }

  showHighScores() {
    const rows = document.querySelectorAll('.scores tr');
    const scores = this.getTopScores();
    for (let i = 1; i < rows.length; i++) {
        const tableCells = rows[i].querySelectorAll('td');
        if (scores[i - 1]) {
            tableCells[0].textContent = scores[i - 1].date;
            tableCells[1].textContent = scores[i - 1].value;
        } else {
            tableCells[0].textContent = '';
            tableCells[1].textContent = '';
        }
    }
  }

  clear() {
    this.scores = [];
    this.save();
    this.showHighScores();
  }
}


const createMatrixElements = () => {
    const main = document.querySelector('section');
    const cells = [];
    const board = document.querySelector('.grid');

    for(let i = 0; i < 4; i++){
        cells[i] = [];
        for(let j = 0; j < 4; j++){
            cells[i][j] = document.createElement('p');
            cells[i][j].style.top = `${i * 77}px`;
            cells[i][j].style.left = `${j * 77}px`;
            board.append(cells[i][j]);
        }
    }
    return cells;
}

const currentHighScores = new HighScores('highscores');
currentHighScores.showHighScores();

const fourbyfour = new Board();
cells = createMatrixElements();
fourbyfour.updateMatrix(cells);
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
    setTimeout(() => {
        fourbyfour.updateMatrix(cells);
        if(fourbyfour.chekWinCondition(fourbyfour.currentScore())){ 
            winElement.textContent = `Congratulations! you reached ${fourbyfour.currentScore()}. Now try to reach more!`;
        }
    }, 100);
    }else{
        button.style.display = 'block';
    }
});

button.addEventListener('click', () => {
    currentHighScores.add(fourbyfour.currentScore());
    fourbyfour.resetBoard();
    fourbyfour.updateMatrix(cells);
    winElement.textContent = `Reach 2048 to win a game`;
    currentHighScores.showHighScores();
});

const clearHS = document.querySelector('.clearHS');
clearHS.addEventListener('click', () => {
    currentHighScores.clear();
});