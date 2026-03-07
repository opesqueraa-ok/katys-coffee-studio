// BLOQUEO DE ZOOM EN SAFARI
document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

let estado = {
    maestria: parseInt(localStorage.getItem('katy_maestria')) || 0,
    peso: 0, limpieza: 0, molienda: 0, wdt: 0, presion: 0, extraccion: 0
};

const displayMaestria = document.getElementById('maestria');
displayMaestria.innerText = estado.maestria;

function irA(id) {
    document.querySelectorAll('.station').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    if(id === 'estacion-diseno') iniciarCanvas();
}

// 1. PESADO
let intPeso;
const btnVerter = document.getElementById('btn-verter');
btnVerter.addEventListener('touchstart', (e) => {
    e.preventDefault();
    intPeso = setInterval(() => {
        if (estado.peso < 22) {
            estado.peso += 0.2;
            document.getElementById('peso-actual').innerText = estado.peso.toFixed(1);
            if (estado.peso.toFixed(1) === "18.0") {
                clearInterval(intPeso);
                document.getElementById('btn-ir-molienda').classList.remove('hidden');
                btnVerter.classList.add('hidden');
            }
        }
    }, 30);
});
btnVerter.addEventListener('touchend', () => clearInterval(intPeso));

function reiniciarPeso() {
    estado.peso = 0;
    document.getElementById('peso-actual').innerText = "0.0";
    btnVerter.classList.remove('hidden');
    document.getElementById('btn-ir-molienda').classList.add('hidden');
}

// 2. MOLIENDA
const areaMolienda = document.getElementById('portafiltro-area-molienda');
areaMolienda.addEventListener('touchmove', (e) => {
    if (estado.limpieza < 100) {
        estado.limpieza += 5;
        document.getElementById('suciedad').style.opacity = (0.8 - estado.limpieza/125);
        if (estado.limpieza >= 100) {
            document.getElementById('instruccion-molienda').innerText = "¡Limpio! Muele ahora.";
            document.getElementById('btn-moler').classList.remove('hidden');
        }
    }
});

let intMolienda;
document.getElementById('btn-moler').addEventListener('touchstart', (e) => {
    e.preventDefault();
    document.getElementById('cafe-molido').classList.remove('hidden');
    intMolienda = setInterval(() => {
        estado.molienda += 3;
        document.getElementById('cafe-molido').style.bottom = (estado.molienda - 100) + "%";
        if (estado.molienda >= 100) {
            clearInterval(intMolienda);
            document.getElementById('btn-ir-tamp').classList.remove('hidden');
        }
    }, 40);
});

// 4. EXTRACCIÓN (Dinámica y rápida)
let intExt;
const btnExtraer = document.getElementById('btn-extraer');
btnExtraer.addEventListener('touchstart', (e) => {
    e.preventDefault();
    document.getElementById('chorro-cafe').classList.remove('hidden');
    intExt = setInterval(() => {
        estado.extraccion += 0.6; // MÁS RÁPIDO
        document.getElementById('peso-extraccion').innerText = estado.extraccion.toFixed(1);
        document.getElementById('liquido-taza').style.height = (estado.extraccion * 2.5) + "%";
        
        if (estado.extraccion >= 45) { // Límite de desborde
            clearInterval(intExt);
            detenerExtraccion();
        }
    }, 40);
});

btnExtraer.addEventListener('touchend', detenerExtraccion);

function detenerExtraccion() {
    clearInterval(intExt);
    document.getElementById('chorro-cafe').classList.add('hidden');
    btnExtraer.classList.add('hidden');
    
    if (estado.extraccion >= 35.8 && estado.extraccion <= 36.2) {
        document.getElementById('label-extraccion').innerText = "¡EXTRACCIÓN PERFECTA! 🏆";
        document.getElementById('btn-ir-diseno').classList.remove('hidden');
        ganarMaestria(50);
    } else {
        document.getElementById('label-extraccion').innerText = "Peso incorrecto...";
        document.getElementById('btn-reintentar-ext').classList.remove('hidden');
    }
}

function reiniciarExtraccion() {
    estado.extraccion = 0;
    document.getElementById('peso-extraccion').innerText = "0.0";
    document.getElementById('liquido-taza').style.height = "0%";
    btnExtraer.classList.remove('hidden');
    document.getElementById('btn-reintentar-ext').classList.add('hidden');
}

// 5. DISEÑO
function iniciarCanvas() {
    const canvas = document.getElementById('canvas-diseno');
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 10; ctx.lineCap = "round";
    canvas.addEventListener('touchmove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        ctx.lineTo(x, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y);
    });
}

function ganarMaestria(pts) {
    estado.maestria += pts;
    displayMaestria.innerText = estado.maestria;
    localStorage.setItem('katy_maestria', estado.maestria);
}

function finalizarJuego() {
    alert("¡Café entregado con éxito!");
    location.reload();
}
