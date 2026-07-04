// =========================
// 📖 ЭЛЕМЕНТЫ
// =========================

const openBtn = document.getElementById("openBook");
const cover = document.getElementById("cover");
const book = document.getElementById("book");

const spreads = document.querySelectorAll(".spread");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

const music = document.getElementById("music");
const musicToggle = document.getElementById("musicToggle");

const hearts = document.getElementById("hearts");
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

const cake = document.getElementById("cake");
const finalMessage = document.getElementById("finalMessage");

// =========================
// 📏 CANVAS CONFETTI
// =========================

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let confetti = [];
let confettiActive = false;
let confettiAnimationId = null;

function createConfetti() {
    confetti = [];

    for (let i = 0; i < 120; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 2,
            d: Math.random() * 3 + 1,
            color: `hsl(${Math.random() * 360},100%,60%)`
        });
    }
}

function drawConfetti() {
    if (!confettiActive) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confetti.forEach(c => {
        ctx.fillStyle = c.color;
        ctx.fillRect(c.x, c.y, c.r, c.r);
    });

    updateConfetti();
    confettiAnimationId = requestAnimationFrame(drawConfetti);
}

function updateConfetti() {
    confetti.forEach(c => {
        c.y += c.d;

        if (c.y > canvas.height) {
            c.y = -10;
            c.x = Math.random() * canvas.width;
        }
    });
}

function stopConfetti() {
    confettiActive = false;
    if (confettiAnimationId) {
        cancelAnimationFrame(confettiAnimationId);
        confettiAnimationId = null;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function startConfetti() {
    confettiActive = true;
    createConfetti();
    drawConfetti();
}

// =========================
// 💞 СЕРДЕЧКИ — ЛЕТЯТ СВЕРХУ ВНИЗ И НЕ ОСТАНАВЛИВАЮТСЯ
// =========================

let heartsInterval = null;
let heartsActive = false;

function startHearts() {
    heartsActive = true;

    if (heartsInterval) {
        return;
    }

    heartsInterval = setInterval(() => {
        if (!heartsActive) return;

        const heart = document.createElement("div");
        heart.classList.add("heart");
        heart.innerHTML = ["❤️", "💖", "💗", "💕", "💝"][Math.floor(Math.random() * 5)];

        heart.style.left = Math.random() * 100 + "vw";
        heart.style.top = "-50px";
        heart.style.fontSize = (Math.random() * 25 + 20) + "px";

        heart.style.animationDuration = (Math.random() * 4 + 4) + "s";

        hearts.appendChild(heart);

        setTimeout(() => {
            if (heart.parentNode) {
                heart.remove();
            }
        }, 8000);
    }, 200);
}

function stopHearts() {
    heartsActive = false;

    if (heartsInterval) {
        clearInterval(heartsInterval);
        heartsInterval = null;
    }
}

function clearAllHearts() {
    document.querySelectorAll('#hearts .heart').forEach(h => h.remove());
}

// =========================
// 📖 КНИГА (ПЕРЕЛИСТЫВАНИЕ)
// =========================

let current = 0;

function showSpread(index) {
    spreads.forEach((s, i) => {
        s.classList.remove("active");
        if (i === index) {
            s.classList.add("active");
        }
    });

    const totalSpreads = spreads.length;
    const isFirstPage = (index === 0);
    const isLastPage = (index === totalSpreads - 1);

    if (isFirstPage || isLastPage) {
        heartsActive = false;
        stopConfetti();
        startConfetti();
    } else {
        stopConfetti();
        startHearts();
    }
}

// =========================
// 🎉 ОТКРЫТИЕ КНИГИ
// =========================

openBtn.onclick = () => {
    cover.style.display = "none";
    book.classList.remove("hidden");

    music.play().catch(() => {});

    current = 0;
    showSpread(0);
};

// =========================
// ⬅️➡️ НАВИГАЦИЯ
// =========================

nextBtn.onclick = () => {
    if (current < spreads.length - 1) {
        current++;
        showSpread(current);
    }
};

prevBtn.onclick = () => {
    if (current > 0) {
        current--;
        showSpread(current);
    }
};

// =========================
// 🎵 МУЗЫКА ВКЛ/ВЫКЛ
// =========================

let musicOn = true;

musicToggle.onclick = () => {
    if (musicOn) {
        music.pause();
        musicToggle.innerHTML = "🔇";
    } else {
        music.play();
        musicToggle.innerHTML = "🔊";
    }
    musicOn = !musicOn;
};

// =========================
// 🎂 ТОРТ — 3 СВЕЧИ ГАСНУТ
// =========================

let cakeClicked = false;

cake.onclick = () => {
    if (cakeClicked) return;
    cakeClicked = true;

    const candles = document.querySelectorAll(".candle");

    candles.forEach((c, i) => {
        setTimeout(() => {
            c.classList.add("out");

            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        }, i * 500);
    });

    setTimeout(() => {
        heartsActive = false;
        stopHearts();
        clearAllHearts();
        stopConfetti();
        startConfetti();

        setTimeout(() => {
            createConfetti();
        }, 1000);
    }, 1500);

    setTimeout(() => {
        finalMessage.classList.add("show");
    }, 2000);

    setTimeout(() => {
        const cakeText = document.querySelector('.cake-text');
        if (cakeText) {
            cakeText.textContent = '✨Cartea se închie aici, dar povestea noastră merge mai departe✨';
            cakeText.style.color = '#d6336c';
            cakeText.style.fontWeight = 'bold';
            cakeText.style.animation = 'none';
        }
    }, 2500);
};

// =========================
// 💡 ФУНКЦИЯ ДЛЯ ОТДЕЛЬНОГО ТУШЕНИЯ СВЕЧИ
// =========================

function blowCandle(element) {
    if (cakeClicked) return;

    element.classList.toggle('out');

    const candles = document.querySelectorAll('.candle');
    const allOut = Array.from(candles).every(c => c.classList.contains('out'));

    if (allOut) {
        setTimeout(() => {
            finalMessage.classList.add("show");
            startConfetti();
        }, 500);
    }
}

// =========================
// 📱 RESIZE
// =========================

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// =========================
// 🔄 СТАРТОВАЯ КОНФИГУРАЦИЯ
// =========================

startConfetti();