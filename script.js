const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const countdown = document.getElementById("countdown");
const message = document.getElementById("message");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let width = canvas.width;
let height = canvas.height;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    width = canvas.width;
    height = canvas.height;
});


// ===============================
// MATRIX / HUJAN KARAKTER
// ===============================

const chars =
    "01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz<>[]{}#$%&*@LoveYou";

const fontSize = 12;

let columns = Math.floor(width / fontSize);

let drops = [];

for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -100;
}


// ===============================
// PARTIKEL
// ===============================

let particles = [];

class Particle {

    constructor(x, y, color = "#ff4da6") {

        this.x = x;
        this.y = y;

        this.originX = x;
        this.originY = y;

        this.size = Math.random() * 2 + 1;

        this.color = color;

        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;

        this.life = 100 + Math.random() * 100;

        this.friction = 0.96;
    }

    update() {

        this.vx *= this.friction;
        this.vy *= this.friction;

        this.x += this.vx;
        this.y += this.vy;

        this.life--;
    }

    draw() {

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = this.color;

        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;

        ctx.fill();

        ctx.shadowBlur = 0;
    }
}


// ===============================
// HUJAN MATRIX
// ===============================

function matrixRain() {

    ctx.fillStyle = "rgba(5, 5, 9, 0.08)";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );

    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {

        const char =
            chars[Math.floor(Math.random() * chars.length)];

        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle =
            Math.random() > 0.3
                ? "#ff4da6"
                : "#ffffff";

        ctx.shadowBlur = 8;
        ctx.shadowColor = "#ff1493";

        ctx.fillText(
            char,
            x,
            y
        );

        ctx.shadowBlur = 0;

        if (
            y > height &&
            Math.random() > 0.975
        ) {
            drops[i] = 0;
        }

        drops[i] += 0.7;
    }
}


// ===============================
// BENTUK HATI
// ===============================

function heartPoint(t, scale) {

    const x =
        16 * Math.pow(Math.sin(t), 3);

    const y =
        13 * Math.cos(t)
        - 5 * Math.cos(2 * t)
        - 2 * Math.cos(3 * t)
        - Math.cos(4 * t);

    return {
        x: width / 2 + x * scale,
        y: height / 2 - y * scale
    };
}


function createHeart() {

    particles = [];

    const scale =
        Math.min(width, height) / 35;

    for (
        let t = 0;
        t < Math.PI * 2;
        t += 0.025
    ) {

        const point =
            heartPoint(t, scale);

        for (
            let j = 0;
            j < 3;
            j++
        ) {

            particles.push(
                new Particle(
                    point.x + (Math.random() - 0.5) * 5,
                    point.y + (Math.random() - 0.5) * 5
                )
            );
        }
    }

    // Isi hati
    for (
        let i = 0;
        i < 500;
        i++
    ) {

        const t =
            Math.random() * Math.PI * 2;

        const r =
            Math.random();

        const point =
            heartPoint(t, scale * r);

        particles.push(
            new Particle(
                point.x,
                point.y,
                "#ff4da6"
            )
        );
    }
}


// ===============================
// ANIMASI PARTIKEL
// ===============================

function drawParticles() {

    particles.forEach(
        particle => {

            particle.update();

            particle.draw();

        }
    );

    particles =
        particles.filter(
            p => p.life > 0
        );
}


// ===============================
// EFEK HATI
// ===============================

let heartMode = false;

function animate() {

    if (!heartMode) {

        matrixRain();

    } else {

        ctx.fillStyle =
            "rgba(5, 5, 9, 0.12)";

        ctx.fillRect(
            0,
            0,
            width,
            height
        );

        drawParticles();
    }

    requestAnimationFrame(animate);
}

animate();


// ===============================
// COUNTDOWN
// ===============================

let number = 3;

countdown.innerText = number;

const timer = setInterval(() => {

    number--;

    if (number > 0) {

        countdown.innerText = number;

    } else {

        countdown.style.display = "none";

        clearInterval(timer);

        startHeart();
    }

}, 1500);


// ===============================
// MULAI HATI
// ===============================

function startHeart() {

    heartMode = true;

    createHeart();

    // Efek ledakan awal
    setTimeout(() => {

        particles.forEach(p => {

            p.vx =
                (Math.random() - 0.5) * 2;

            p.vy =
                (Math.random() - 0.5) * 2;
        });

    }, 100);


    // Tampilkan tulisan
    setTimeout(() => {

        message.classList.add("show");

    }, 1800);
}