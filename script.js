// BLOQUEO DE ZOOM
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('dblclick', (e) => e.preventDefault());

let estado = {
    maestria: parseInt(localStorage.getItem('katy_maestria')) || 0,
    peso: 0, limpieza: 0, molienda: 0, wdt: 0, presion: 0, extraccion: 0
};

const updateM = () => document.getElementById('maestria').innerText = estado.maestria;
updateM();

// 1. PESAJE (Manual)
let intPeso;
const btnV = document.getElementById('btn-verter');
btnV.addEventListener('touchstart', (e) => {
    e.preventDefault();
    intPeso = setInterval(() => {
        estado.peso += 0.1;
        document.getElementById('peso-display').innerText = estado.peso.toFixed(1) + "g";
    }, 40);
});

btnV.addEventListener('touchend', () => {
    clearInterval(intPeso);
    if (estado.peso.toFixed(1) === "18.0") {
        desbloquear('st-2');
        btnV.classList.add('success');
        btnV.innerText = "¡PERFECTO!";
    } else {
        btnV.style.background = "#ff4444";
        setTimeout(() => btnV.style.background = "#6f4e37", 500);
    }
});

function reiniciarPeso() {
    estado.peso = 0;
    document.getElementById('peso-display').innerText = "0.0g";
    btnV.classList.remove('success');
    btnV.innerText = "VERTER";
}

// 2. MOLIENDA
document.getElementById('area-molienda').addEventListener('touchmove', () => {
    if (estado.limpieza < 100) {
        estado.limpieza += 4;
        document.getElementById('suciedad').style.opacity = (0.8 - estado.limpieza/125);
        if (estado.limpieza >= 100) document.getElementById('btn-moler').classList.remove('hidden');
    }
});

document.getElementById('btn-moler').addEventListener('touchstart', () => {
    let intM = setInterval(() => {
        estado.molienda += 5;
        document.getElementById('cafe-molido').style.bottom = (estado.molienda - 100) + "%";
        if (estado.molienda >= 100) { clearInterval(intM); desbloquear('st-3'); }
    }, 50);
});

// 3. WDT & TAMP (Corregido)
document.getElementById('area-tamp').addEventListener('touchmove', () => {
    if (estado.wdt < 100) {
        estado.wdt += 2;
        document.getElementById('wdt-progress').style.width = estado.wdt + "%";
        document.getElementById('grumos').style.opacity = (0.8 - estado.wdt/125);
        if (estado.wdt >= 100) {
            document.getElementById('label-tamp').innerText = "3. Presión de Tamp";
            document.getElementById('tamp-ui').classList.remove('hidden');
        }
    }
});

let intT;
document.getElementById('btn-tamp').addEventListener('touchstart', () => {
    intT = setInterval(() => {
        estado.presion += 4;
        document.getElementById('needle').style.left = estado.presion + "%";
    }, 40);
});

document.getElementById('btn-tamp').addEventListener('touchend', () => {
    clearInterval(intT);
    if (estado.presion >= 70 && estado.presion <= 90) {
        desbloquear('st-4');
        document.getElementById('btn-tamp').classList.add('success');
    } else {
        estado.presion = 0;
        document.getElementById('needle').style.left = "0%";
    }
});

// 4. EXTRACCIÓN
let intE;
document.getElementById('btn-extraer').addEventListener('touchstart', () => {
    document.getElementById('stream').style.top = "0";
    intE = setInterval(() => {
        estado.extraccion += 0.5;
        document.getElementById('ext-display').innerText = estado.extraccion.toFixed(1) + "g";
        document.getElementById('liquid').style.height = (estado.extraccion * 2.5) + "%";
    }, 40);
});

document.getElementById('btn-extraer').addEventListener('touchend', () => {
    clearInterval(intE);
    document.getElementById('stream').style.top = "-60px";
    if (estado.extraccion >= 35.8 && estado.extraccion <= 36.2) {
        desbloquear('st-5');
        iniciarCanvas();
    }
});

// 5. CANVAS & FINAL
function iniciarCanvas() {
    const cvs = document.getElementById('canvas-art');
    const ctx = cvs.getContext('2d');
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 5;
    cvs.addEventListener('touchmove', (e) => {
        const r = cvs.getBoundingClientRect();
        const x = e.touches[0].clientX - r.left;
        const y = e.touches[0].clientY - r.top;
        ctx.lineTo(x, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y);
    });
}

function desbloquear(id) { document.getElementById(id).classList.remove('locked'); }
function finalizar() {
    estado.maestria += 50;
    localStorage.setItem('katy_maestria', estado.maestria);
    alert("¡Café Perfecto!");
    location.reload();
}
