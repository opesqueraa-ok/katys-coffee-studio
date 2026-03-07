// 1. BLOQUEO TOTAL DE ZOOM PARA SAFARI/IPAD
document.addEventListener('gesturestart', function (e) { e.preventDefault(); });
document.addEventListener('dblclick', function (e) { e.preventDefault(); });

let estado = {
    maestria: parseInt(localStorage.getItem('katy_maestria')) || 0,
    peso: 0, limpieza: 0, molienda: 0, wdt: 0, presion: 0, extraccion: 0
};

document.getElementById('maestria').innerText = estado.maestria;

// --- ESTACIÓN 1: PESADO ---
let intPeso;
const btnVerter = document.getElementById('btn-verter');
btnVerter.addEventListener('touchstart', (e) => {
    e.preventDefault();
    intPeso = setInterval(() => {
        if (estado.peso < 20) {
            estado.peso += 0.2;
            document.getElementById('peso-actual').innerText = estado.peso.toFixed(1);
            if (estado.peso.toFixed(1) === "18.0") {
                clearInterval(intPeso);
                desbloquear('station-grinder');
                btnVerter.style.background = "#4caf50";
            }
        }
    }, 40);
});
btnVerter.addEventListener('touchend', () => clearInterval(intPeso));

function reiniciarPeso() {
    estado.peso = 0;
    document.getElementById('peso-actual').innerText = "0.0";
    btnVerter.style.background = "#8b5a2b";
}

// --- ESTACIÓN 2: MOLIENDA ---
document.getElementById('area-molienda').addEventListener('touchmove', (e) => {
    if (estado.limpieza < 100) {
        estado.limpieza += 5;
        document.getElementById('suciedad').style.opacity = (0.8 - estado.limpieza/125);
        if (estado.limpieza >= 100) document.getElementById('btn-moler').classList.remove('hidden');
    }
});

let intMolienda;
document.getElementById('btn-moler').addEventListener('touchstart', (e) => {
    intMolienda = setInterval(() => {
        estado.molienda += 5;
        document.getElementById('cafe-molido').style.bottom = (estado.molienda - 100) + "%";
        if (estado.molienda >= 100) {
            clearInterval(intMolienda);
            desbloquear('station-tamp');
        }
    }, 50);
});

// --- ESTACIÓN 3: WDT & TAMP ---
document.getElementById('area-tamp').addEventListener('touchmove', (e) => {
    if (estado.wdt < 100) {
        estado.wdt += 3;
        document.getElementById('grumos').style.opacity = (0.8 - estado.wdt/125);
        if (estado.wdt >= 100) {
            document.getElementById('btn-tamp').classList.remove('hidden');
            document.getElementById('medidor-presion').classList.remove('hidden');
        }
    }
});

let intTamp;
document.getElementById('btn-tamp').addEventListener('touchstart', () => {
    intTamp = setInterval(() => {
        estado.presion += 4;
        document.getElementById('aguja-presion').style.left = estado.presion + "%";
    }, 30);
});
document.getElementById('btn-tamp').addEventListener('touchend', () => {
    clearInterval(intTamp);
    if (estado.presion >= 70 && estado.presion <= 90) {
        desbloquear('station-machine');
    } else {
        estado.presion = 0;
        document.getElementById('aguja-presion').style.left = "0%";
    }
});

// --- ESTACIÓN 4: EXTRACCIÓN ---
let intExt;
document.getElementById('btn-extraer').addEventListener('touchstart', () => {
    document.getElementById('chorro-cafe').style.top = "0px";
    intExt = setInterval(() => {
        estado.extraccion += 0.8;
        document.getElementById('peso-extraccion').innerText = estado.extraccion.toFixed(1);
        document.getElementById('liquido-taza').style.height = (estado.extraccion * 2.5) + "%";
        if (estado.extraccion >= 50) clearInterval(intExt);
    }, 50);
});
document.getElementById('btn-extraer').addEventListener('touchend', () => {
    clearInterval(intExt);
    document.getElementById('chorro-cafe').style.top = "-100px";
    if (estado.extraccion >= 35.8 && estado.extraccion <= 36.5) {
        desbloquear('station-art');
        iniciarCanvas();
    }
});

// --- ESTACIÓN 5: ARTE Y FINALIZAR ---
function iniciarCanvas() {
    const canvas = document.getElementById('canvas-diseno');
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 8; ctx.lineCap = "round";
    canvas.addEventListener('touchmove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        ctx.lineTo(x, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y);
    });
}

function desbloquear(id) {
    document.getElementById(id).classList.remove('locked');
}

function ganarMaestria(pts) {
    estado.maestria += pts;
    document.getElementById('maestria').innerText = estado.maestria;
    localStorage.setItem('katy_maestria', estado.maestria);
}

function finalizarTodo() {
    ganarMaestria(100);
    alert("¡Café de Especialidad Servido!");
    location.reload();
}
