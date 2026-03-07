// --- ESTADO DEL JUEGO ---
let estado = {
    maestria: parseInt(localStorage.getItem('katy_maestria')) || 0,
    peso: 0.0,
    limpieza: 0, // 0 a 100
    molienda: 0
};

// --- ELEMENTOS ---
const displayMaestria = document.getElementById('maestria');
displayMaestria.innerText = estado.maestria;

// --- LÓGICA DE NAVEGACIÓN ---
function irA(estacionId) {
    document.querySelectorAll('.station').forEach(s => s.classList.add('hidden'));
    document.getElementById(estacionId).classList.remove('hidden');
}

// --- ESTACIÓN 1: PESADO ---
let intervaloPeso;
const btnVerter = document.getElementById('btn-verter');
const displayPeso = document.getElementById('peso-actual');

btnVerter.addEventListener('touchstart', (e) => {
    e.preventDefault();
    intervaloPeso = setInterval(() => {
        if (estado.peso < 20) {
            estado.peso += 0.1;
            displayPeso.innerText = estado.peso.toFixed(1);
            if (estado.peso.toFixed(1) === "18.0") {
                clearInterval(intervaloPeso);
                document.getElementById('btn-ir-molienda').classList.remove('hidden');
                btnVerter.classList.add('hidden');
                ganarMaestria(10);
            }
        }
    }, 50);
});

btnVerter.addEventListener('touchend', () => clearInterval(intervaloPeso));

document.getElementById('btn-reiniciar-peso').addEventListener('click', () => {
    estado.peso = 0;
    displayPeso.innerText = "0.0";
});

// --- ESTACIÓN 2: MOLIENDA (LIMPIEZA) ---
const suciedad = document.getElementById('suciedad');
const areaPortafiltro = document.getElementById('portafiltro-area');

areaPortafiltro.addEventListener('touchmove', (e) => {
    if (estado.limpieza < 100) {
        estado.limpieza += 2;
        suciedad.style.opacity = (1 - estado.limpieza / 100);
        if (estado.limpieza >= 100) {
            document.getElementById('instruccion-molienda').innerText = "¡Limpio! Ahora muele el café.";
            document.getElementById('btn-moler').classList.remove('hidden');
        }
    }
});

// Lógica de Molienda
const cafeMolido = document.getElementById('cafe-molido');
let intervaloMolienda;

document.getElementById('btn-moler').addEventListener('touchstart', (e) => {
    e.preventDefault();
    cafeMolido.classList.remove('hidden');
    intervaloMolienda = setInterval(() => {
        if (estado.molienda < 100) {
            estado.molienda += 1;
            cafeMolido.style.bottom = (estado.molienda - 100) + "%";
            if (estado.molienda >= 100) {
                clearInterval(intervaloMolienda);
                document.getElementById('btn-ir-wdt').classList.remove('hidden');
                ganarMaestria(15);
            }
        }
    }, 30);
});

document.getElementById('btn-moler').addEventListener('touchend', () => clearInterval(intervaloMolienda));

// --- UTILIDADES ---
function ganarMaestria(puntos) {
    estado.maestria += puntos;
    displayMaestria.innerText = estado.maestria;
    localStorage.setItem('katy_maestria', estado.maestria);
}
