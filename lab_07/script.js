const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');
const forceInput = document.getElementById('force');
const modeSelect = document.getElementById('mode');

const balls = [];
const numBalls = 50;
const maxDistance = 50;

let animationId;
let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
let isMouseDown = false;

class Ball {
    constructor(x, y, vx, vy, radius) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#333';
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.vx = -this.vx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.vy = -this.vy;
        }
    }

    applyForce(forceX, forceY) {
        this.vx += forceX;
        this.vy += forceY;
    }

    isClicked(mx, my) {
        return Math.sqrt((this.x - mx) ** 2 + (this.y - my) ** 2) < this.radius;
    }

    static distance(ball1, ball2) {
        return Math.sqrt((ball1.x - ball2.x) ** 2 + (ball1.y - ball2.y) ** 2);
    }
}

function initBalls() {
    balls.length = 0;
    for (let i = 0; i < numBalls; i++) {
        createBall();
    }
}

function createBall() {
    const radius = 10;
    const x = Math.random() * (canvas.width - 2 * radius) + radius;
    const y = Math.random() * (canvas.height - 2 * radius) + radius;
    const vx = (Math.random() - 0.5) * 4;
    const vy = (Math.random() - 0.5) * 4;
    balls.push(new Ball(x, y, vx, vy, radius));
}

function drawLines() {
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            const dist = Ball.distance(balls[i], balls[j]);
            if (dist < maxDistance) {
                ctx.beginPath();
                ctx.moveTo(balls[i].x, balls[i].y);
                ctx.lineTo(balls[j].x, balls[j].y);
                ctx.strokeStyle = 'rgba(219, 110, 35, 0.3)';
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

function handleMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
}

function handleMouseDown(event) {
    isMouseDown = true;
    handleBallClick(event);
}

function handleMouseUp() {
    isMouseDown = false;
}

function handleBallClick(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    for (let i = 0; i < balls.length; i++) {
        if (balls[i].isClicked(mouseX, mouseY)) {
            balls.splice(i, 1);
            createBall();
            createBall();
            break;
        }
    }
}

function applyMouseForce() {
    if (!isMouseDown) return;
    const force = parseFloat(forceInput.value);
    const mode = modeSelect.value;
    for (const ball of balls) {
        const dx = ball.x - mouse.x;
        const dy = ball.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < maxDistance) {
            const effect = (mode === 'push') ? 1 : -1;
            const forceX = (dx / distance) * force * effect;
            const forceY = (dy / distance) * force * effect;
            ball.applyForce(forceX, forceY);
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const ball of balls) {
        ball.update();
        ball.draw();
    }
    drawLines();
    applyMouseForce();
    animationId = requestAnimationFrame(animate);
}

startButton.addEventListener('click', () => {
    if (!animationId) animate();
});

stopButton.addEventListener('click', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
});

resetButton.addEventListener('click', () => {
    cancelAnimationFrame(animationId);
    animationId = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initBalls();
    animate();
});

canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mouseup', handleMouseUp);

initBalls();