const grid = document.querySelector('.grid');
const scoreDOM = document.querySelector('#score');
const start_btn = document.getElementById('start_btn');
const blockWidth = 100; 
const blockHeight = 20; 
const ballDiameter = 15;
const userStart = [230, 330]; //center of the grid

let currentPosition = userStart; //current position is same as starting position initially 
let score = 0; 
const ballStart = [280, 315]; // ball starts same as the user
let ballCurrentPosition = ballStart; 

let xDirection = -2;
let yDirection = -2;

//Need to create Multiple blocks - So created a block class
class Block {
    constructor(xAxis, yAxis){
        this.topLeft = [xAxis, yAxis];
        this.topRight = [xAxis + blockWidth, yAxis];
        this.bottomLeft = [xAxis, yAxis + blockHeight];
        this.bottomRight = [xAxis + blockWidth, yAxis + blockHeight];

    }
}

const blocks = [
    new Block(10,10),
    new Block(120, 10),
    new Block(230, 10),
    new Block(340, 10),
    new Block(450, 10),

    new Block(10,40),
    new Block(120, 40),
    new Block(230, 40),
    new Block(340, 40),
    new Block(450, 40)
]

const noOfBlocks = blocks.length;

// Adding each block to the screen
function addBlock(){

    for(var i=0; i < noOfBlocks ; i++){
        const block = document.createElement('div');
        block.classList.add('block');
        block.style.left = blocks[i].topLeft[0] + 'px';
        block.style.top = blocks[i].topLeft[1] + 'px';
        
        grid.appendChild(block);
        // console.log(blocks[i]);

    }
}

addBlock();

//Add user
const user = document.createElement('div');
user.classList.add('user');

user.style.left = currentPosition[0] + 'px';
user.style.top = currentPosition[1] + 'px';
grid.appendChild(user);

//Move user
function moveUser(e){
    switch(e.key){
        case 'ArrowLeft':
            if(currentPosition[0] >= 20){   // left end of the grid 
                currentPosition[0] -= 10;
                user.style.left = currentPosition[0] + 'px';
                break;
            }
        case 'ArrowRight':
            if(currentPosition[0] <= 440){  // Right end of the grid
                currentPosition[0] += 10;
                user.style.left = currentPosition[0] + 'px';
                break;

            }
    }

}

document.addEventListener('keydown', moveUser);

// Add ball
const ball = document.createElement('div');
ball.classList.add('ball');
ball.style.left = ballCurrentPosition[0] + 'px';
ball.style.top = ballCurrentPosition[1] + 'px';
grid.appendChild(ball);

//Start Button
start_btn.addEventListener('click', () => {
    let timer = setInterval(() => {
        moveBall(timer)
    }, 30);  
})

//Move the ball
function moveBall(timer){
    console.log(timer, 'Timer in MoveBall');
    ballCurrentPosition[0] += xDirection;
    ballCurrentPosition[1] += yDirection;

    ball.style.left = ballCurrentPosition[0] + 'px';
    ball.style.top = ballCurrentPosition[1] + 'px';
    checkCollision(timer);
}


// 2px change in x/y direction every 30 ms


//Check collisions 
function checkCollision(timer){
    console.log(timer, 'Timer in checkCollision');
    //block & ball collisions 
    for(let i=0; i< blocks.length ; i++){// check if all 4 coordinates  are within a block
       
        if(ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]
            && ballCurrentPosition[1] < blocks[i].bottomLeft[1] && ballCurrentPosition[1] > blocks[i].topLeft[1] ){
            // console.log('BLock hit!!')
            const allBlocksFromDOM = document.querySelectorAll('.block');
            allBlocksFromDOM[i].classList.remove('block'); //removed from DOM
            blocks.splice(i,1);
            changeDirection();
            score ++; 
            scoreDOM.innerHTML = `Score: ${score}`;
        }

        //if no block is left, user wins
        if(blocks.length === 0){
            scoreDOM.innerHTML = 'You Win !!';
            clearInterval(timer);
            document.removeEventListener('keydown', moveUser); 
        }


    }

    //check for ball & user collision
    if(ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth 
        && ballCurrentPosition[1] >= currentPosition[1] - ballDiameter){
            changeDirection();
        }

    if(ballCurrentPosition[0] >= 545 ||  ballCurrentPosition[0] <= 8 || ballCurrentPosition[1] <= 8 ){ // collision on side & top wall 
        changeDirection();
    }

    if(ballCurrentPosition[1] >= 345){ // collision on bottom wall, game over 
        clearInterval(timer);
        scoreDOM.innerHTML = 'You Loose!';
        document.removeEventListener('keydown','null');
    }


}

// Change directions from boundaries
function changeDirection(){
    if( xDirection === 2 && yDirection === -2){
        yDirection = 2;
        return;
    }
    if( xDirection === 2 && yDirection === 2){
        xDirection = -2;
        return;
    }
    if( xDirection === -2 && yDirection === -2){
        xDirection = 2;
        return;
    }
    if( xDirection === -2 && yDirection === 2){
        yDirection = -2;
        return;
    }
}

