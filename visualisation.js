export class BoardRender{
    constructor() {
        this.cells = this.createMatrixElements();
    }

    createMatrixElements() {
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

    updateMatrix(matrix, score) {
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
                matrix[i][j]
                    ? this.cells[i][j].textContent = matrix[i][j]
                    : this.cells[i][j].textContent = '';
                this.cells[i][j].style.top = `${i * 77}px`;
                this.cells[i][j].style.left = `${j * 77}px`;
                this.cells[i][j].classList.remove('left', 'right', 'up', 'down', 'tile', 'merge');
                this.cells[i][j].style.removeProperty('--steps');
                this.cells[i][j].style.backgroundColor = '#2e2e2e';
                if(matrix[i][j]){
                    this.cells[i][j].style.backgroundColor = tileColors[Math.log2(matrix[i][j])];
                }
                
            }
        }
        document.querySelector('h3').textContent = `Current score: ${score} points`;
    }

    movementAnimations(visuals, cells){
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
}