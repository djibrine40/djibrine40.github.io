const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

const canvas = document.getElementById('parchmentCanvas');
const ctx = canvas.getContext('2d');
let motes = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Mote {
    constructor() {
        this.reset(true);
    }

    reset(initial) {
        this.x = Math.random() * canvas.width;
        this.y = initial ? Math.random() * canvas.height : canvas.height + 20;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.35;
        this.speedY = -(Math.random() * 0.7 + 0.2);
        this.opacity = Math.random() * 0.4 + 0.1;
        this.wobble = Math.random() * 0.25;

        const hues = ['184,134,11', '106,76,147', '58,124,165'];
        this.hue = hues[Math.floor(Math.random() * hues.length)];
        this.life = Math.random() * 200 + 100;
        this.age = 0;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedX += (Math.random() - 0.5) * 0.02;
        this.age++;

        if (this.y < -40 || this.age > this.life || this.x < -40 || this.x > canvas.width + 40) {
            this.reset(false);
        }
    }

    draw() {
        const lifeRatio = 1 - this.age / this.life;
        const currentOpacity = this.opacity * lifeRatio * (0.7 + Math.sin(this.age * 0.2) * this.wobble);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * lifeRatio, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.hue},${currentOpacity})`;
        ctx.fill();

        ctx.shadowColor = `rgba(${this.hue},${currentOpacity * 0.6})`;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

for (let i = 0; i < 75; i++) {
    motes.push(new Mote());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    motes.forEach(mote => {
        mote.update();
        mote.draw();
    });

    for (let i = 0; i < motes.length; i++) {
        for (let j = i + 1; j < motes.length; j++) {
            const dx = motes[i].x - motes[j].x;
            const dy = motes[i].y - motes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 110) {
                ctx.beginPath();
                ctx.moveTo(motes[i].x, motes[i].y);
                ctx.lineTo(motes[j].x, motes[j].y);
                ctx.strokeStyle = `rgba(184,134,11,${0.05 * (1 - distance / 110)})`;
                ctx.lineWidth = 0.4;
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
}

animate();