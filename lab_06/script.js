const board = document.getElementById('gameBoard');
const ball = document.getElementById('ball');
const finish = document.getElementById('finish');
const enemyHole1 = document.getElementById('enemyHole1');
const enemyHole2 = document.getElementById('enemyHole2');
const startButton = document.getElementById('startButton');

// GAME RULES:
const boardSize = 400;
const ballSize = 20;
const finishSize = 30;
const enemyHoleSize = 30;
const gameTime = 60 * 1000; 
const enemyHoleChangeInterval = 2000;

// PLAYER DATA:
let score = 0;
let startTime = null;
let xSpeed = 0;
let ySpeed = 0;
let lastEnemyHoleMoveTime = 0;

let enemyHole1Direction = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
let enemyHole2Direction = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };

function resetBall() {
    ball.style.left = `${Math.random() * (boardSize - ballSize)}px`;
    ball.style.top = `${Math.random() * (boardSize - ballSize)}px`;
}

function startFinishHole() {
    finish.style.left = `${Math.random() * (boardSize - finishSize)}px`;
    finish.style.top = `${Math.random() * (boardSize - finishSize)}px`;
}

function resetEnemyHoles() {
    enemyHole1.style.left = `${Math.random() * (boardSize - enemyHoleSize)}px`;
    enemyHole1.style.top = `${Math.random() * (boardSize - enemyHoleSize)}px`;
    enemyHole2.style.left = `${Math.random() * (boardSize - enemyHoleSize)}px`;
    enemyHole2.style.top = `${Math.random() * (boardSize - enemyHoleSize)}px`;
}

function startGame() {
    score = 0;
    startTime = new Date().getTime();
    lastEnemyHoleMoveTime = startTime;
    resetBall();
    startFinishHole();
    resetEnemyHoles();
    window.requestAnimationFrame(updateGame);
}

function endGame() {
    alert(`Game over! Your score is: ${score}`);
}

function handleOrientation(event) {
    const { beta, gamma } = event;
    const maxTilt = 45;

    const xTilt = Math.min(Math.max(gamma, -maxTilt), maxTilt);
    const yTilt = Math.min(Math.max(beta, -maxTilt), maxTilt);

    document.getElementById('x').textContent = xTilt;
    document.getElementById('y').textContent = yTilt;

    xSpeed = (xTilt / maxTilt) * 5;
    ySpeed = (yTilt / maxTilt) * 5;
}

function updateGame(timestamp) {
    if (new Date().getTime() - startTime >= gameTime) {
        endGame();
        return;
    }

    let ballX = parseFloat(ball.style.left) || 0;
    let ballY = parseFloat(ball.style.top) || 0;

    ballX += xSpeed;
    ballY += ySpeed;

    ballX = Math.max(0, Math.min(boardSize - ballSize, ballX));
    ballY = Math.max(0, Math.min(boardSize - ballSize, ballY));

    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    const finishX = parseFloat(finish.style.left);
    const finishY = parseFloat(finish.style.top);

    if (
        ballX < finishX + finishSize &&
        ballX + ballSize > finishX &&
        ballY < finishY + finishSize &&
        ballY + ballSize > finishY
    ) {
        score++;
        resetBall();
        startFinishHole();
    }

    const enemyHoles = [enemyHole1, enemyHole2];
    for (let i = 0; i < enemyHoles.length; i++) {
        const enemyHolePosX = parseFloat(enemyHoles[i].style.left);
        const enemyHolePosY = parseFloat(enemyHoles[i].style.top);

        if (
            ballX < enemyHolePosX + enemyHoleSize &&
            ballX + ballSize > enemyHolePosX &&
            ballY < enemyHolePosY + enemyHoleSize &&
            ballY + ballSize > enemyHolePosY
        ) {
            resetBall();
            resetEnemyHoles();
        }
    }

    if (timestamp - lastEnemyHoleMoveTime >= enemyHoleChangeInterval) {
        enemyHole1Direction = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
        enemyHole2Direction = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
        lastEnemyHoleMoveTime = timestamp;
    }
    moveEnemyHoles();

    window.requestAnimationFrame(updateGame);
}

function moveEnemyHoles() {
    moveEnemyHole(enemyHole1, enemyHole1Direction);
    moveEnemyHole(enemyHole2, enemyHole2Direction);
}

function moveEnemyHole(enemyHole, direction) {
    let enemyHolePosX = parseFloat(enemyHole.style.left) || 0;
    let enemyHolePosY = parseFloat(enemyHole.style.top) || 0;

    const moveAmount = 2;

    enemyHolePosX += direction.x * moveAmount;
    enemyHolePosY += direction.y * moveAmount;

    if (enemyHolePosX <= 0 || enemyHolePosX >= boardSize - enemyHoleSize) {
        direction.x *= -1;
    }
    if (enemyHolePosY <= 0 || enemyHolePosY >= boardSize - enemyHoleSize) {
        direction.y *= -1;
    }

    enemyHolePosX = Math.max(0, Math.min(boardSize - enemyHoleSize, enemyHolePosX));
    enemyHolePosY = Math.max(0, Math.min(boardSize - enemyHoleSize, enemyHolePosY));

    enemyHole.style.left = `${enemyHolePosX}px`;
    enemyHole.style.top = `${enemyHolePosY}px`;
}

// REQUEST DEVICE ORIENTATION PERMISSION (MOBILE):
startButton.addEventListener('click', () => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation);
                    startGame();
                    startButton.style.display = 'none';
                } else {
                    alert('Permission to access device orientation was denied.');
                }
            })
            .catch(console.error);
    } else {
        window.addEventListener('deviceorientation', handleOrientation);
        startGame();
        startButton.style.display = 'none';
    }
});