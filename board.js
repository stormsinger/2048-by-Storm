export class Board {
    constructor() {
        this.resetBoard();
        this.movements = {
            moved: false,
            movement: Array.from({ length: 4 }, () =>
            Array.from({ length: 4 }, () => ({
                merge: false,
                direction: 0, 
                moved: 0
            }))
            )
        };
    }

    newNumber() {
        return Math.floor(Math.random()*10) < 9 ? 2 : 4;
    }

    getRandomPosition() {
        const indexes = [];
        this.matrix.forEach((row, i) => {
            row.forEach((value, j) => {
                if(!value) indexes.push(({x: i, y: j}));
            });
        }); 

        if (indexes.length === 0){
            return null;
        } 
        return indexes[Math.floor(Math.random() * indexes.length)];
    }

    addAjacent(rotations){
        const original = JSON.stringify(this.matrix);
        const directions = ['left', 'up', 'right', 'down'];

        const movementMatrix = Array.from({ length: 4 }, () =>
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
        const rotatedMovement = this.rotateMatrix(4 - rotations, movementMatrix);

        return {
            moved: JSON.stringify(this.matrix) !== original,
            movement: rotatedMovement
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
        this.movements = this.addAjacent(0);
        if(this.movements.moved){
            const pos = this.getRandomPosition();
            this.matrix[pos.x][pos.y] = this.newNumber();
        }
    }

    updateDown(){
        this.movements = this.addAjacent(3);
        if(this.movements.moved){
            const pos = this.getRandomPosition();
            this.matrix[pos.x][pos.y] = this.newNumber();
        }
    }

    updateRight(){
        this.movements = this.addAjacent(2);
        if(this.movements.moved){
            const pos = this.getRandomPosition();
            this.matrix[pos.x][pos.y] = this.newNumber();
        }
    }
    
    updateUp(){
        this.movements = this.addAjacent(1);
        if(this.movements.moved){
            const pos = this.getRandomPosition();
            this.matrix[pos.x][pos.y] = this.newNumber();
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