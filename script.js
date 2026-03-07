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

// ESTACIÓN 1: PESADO (DINÁMICO)
let intPeso;
const btnVerter = document.getElementById('btn-verter');
btnVerter.addEventListener('touchstart', (e) => {
    e.preventDefault();
    intPeso = setInterval(() => {
        if (estado.peso < 19.5) {
            estado.peso += 0.2; // Más rápido
            document.getElementById('peso-actual').innerText = estado.peso.toFixed(1);
            if (estado.peso.toFixed(1) === "18.0") {
                clearInterval(intPeso);
                ganarMaestria(10);
                btnVerter.classList.add('hidden');
                document.getElementById('btn-ir-molienda').classList.remove('hidden');
            }
        }
    }, 40); // Intervalo más corto
});
btnVerter.addEventListener('touchend', () => clearInterval(intPeso));

function reiniciarPeso() {
    estado.peso = 0;
    document.getElementById('peso-actual').innerText = "0.0";
    btnVerter.classList.remove('hidden');
}

// ESTACIÓN 2: MOLIENDA
const areaMolienda = document.getElementById('portafiltro-area-molienda');
areaMolienda.addEventListener('touchmove', () => {
    if (estado.limpieza < 100) {
        estado.limpieza += 4;
        document.getElementById('suciedad').style.opacity = (0.5 - estado.limpieza/200);
        if (estado.limpieza >= 100) document.getElementById('btn-moler').classList.remove('hidden');
    }
});

let intMolienda;
document.getElementById('btn-moler').addEventListener('touchstart', () => {
    document.getElementById('cafe-molido').classList.remove('hidden');
    intMolienda = setInterval(() => {
        estado.molienda += 2;
        document.getElementById('cafe-molido').style.bottom = (estado.molienda - 100) + "%";
        if (estado.molienda >= 100) {
            clearInterval(intMolienda);
            document.getElementById('btn-ir-tamp').classList.remove('hidden');
        }
    }, 40);
});
document.getElementById('btn-moler').addEventListener('touchend', () => clearInterval(intMolienda));

// ESTACIÓN 3: WDT Y TAMP
document.getElementById('area-tamp').addEventListener('touchmove', () => {
    estado.wdt += 2;
    document.getElementById('grumos').style.opacity = (0.8 - estado.wdt/125);
    if (estado.wdt >= 100) {
        document.getElementById('medidor-presion').classList.remove('hidden');
        document.getElementById('btn-tamp').classList.remove('hidden');
    }
});

let intTamp;
document.getElementById('btn-tamp').addEventListener('touchstart', () => {
    intTamp = setInterval(() => { estado.presion += 3; document.getElementById('aguja-presion').style.left = estado.presion + "%"; }, 30);
});
document.getElementById('btn-tamp').addEventListener('touchend', () => {
    clearInterval(intTamp);
    if (estado.presion >= 70 && estado.presion <= 90) {
        document.getElementById('btn-ir-extraccion').classList.remove('hidden');
        document.getElementById('btn-tamp').classList.add('hidden');
        ganarMaestria(20);
    } else {
        estado.presion = 0; document.getElementById('aguja-presion').style.left = "0%";
    }
});

// ESTACIÓN 4: EXTRACCIÓN (RATIO 1:2)
let intExt;
document.getElementById('btn-extraer').addEventListener('touchstart', () => {
    document.getElementById('chorro-cafe').style.top = "0px";
    document.getElementById('chorro-cafe').classList.remove('hidden');
    intExt = setInterval(() => {
        estado.extraccion += 0.4;
        document.getElementById('peso-extraccion').innerText = estado.extraccion.toFixed(1);
        document.getElementById('liquido-taza').style.height = (estado.extraccion * 2) + "%";
        if (estado.extraccion.toFixed(1) === "36.0") {
            clearInterval(intExt);
            document.getElementById('chorro-cafe').classList.add('hidden');
            document.getElementById('btn-ir-diseno').classList.remove('hidden');
            ganarMaestria(30);
        }
    }, 50);
});
document.getElementById('btn-extraer').addEventListener('touchend', () => {
    clearInterval(intExt);
    document.getElementById('chorro-cafe').classList.add('hidden');
});

// ESTACIÓN 5: DISEÑO
function iniciarCanvas() {
    const canvas = document.getElementById('canvas-diseno');
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = "white"; ctx.lineWidth = 8; ctx.lineCap = "round";
    let drawing = false;

    canvas.addEventListener('touchstart', (e) => { drawing = true; ctx.beginPath(); });
    canvas.addEventListener('touchmove', (e) => {
        if(!drawing) return;
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
        ctx.stroke();
    });
    canvas.addEventListener('touchend', () => drawing = false);
}

function ganarMaestria(pts) {
    estado.maestria += pts;
    displayMaestria.innerText = estado.maestria;
    localStorage.setItem('katy_maestria', estado.maestria);
}

function finalizarJuego() {
    alert(`¡Café servido! Puntuación de Maestría Total: ${estado.maestria}`);
    location.reload();
}
