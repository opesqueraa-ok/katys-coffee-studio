// --- ESTADO INICIAL ---
let estado = {
    maestria: parseInt(localStorage.getItem('katy_maestria')) || 0,
    peso: 0.0,
    limpieza: 0,
    molienda: 0,
    wdt: 0,
    presion: 0
};

const displayMaestria = document.getElementById('maestria');
displayMaestria.innerText = estado.maestria;

function irA(id) {
    document.querySelectorAll('.station').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

// --- LOGICA ESTACIÓN 1: PESADO ---
let intPeso;
const btnVerter = document.getElementById('btn-verter');
btnVerter.addEventListener('touchstart', (e) => {
    e.preventDefault();
    intPeso = setInterval(() => {
        if (estado.peso < 19) {
            estado.peso += 0.1;
            document.getElementById('peso-actual').innerText = estado.peso.toFixed(1);
            if (estado.peso.toFixed(1) === "18.0") {
                clearInterval(intPeso);
                ganarMaestria(10);
                btnVerter.classList.add('hidden');
                document.getElementById('btn-ir-molienda').classList.remove('hidden');
            }
        }
    }, 60);
});
btnVerter.addEventListener('touchend', () => clearInterval(intPeso));

function reiniciarPeso() {
    estado.peso = 0;
    document.getElementById('peso-actual').innerText = "0.0";
    btnVerter.classList.remove('hidden');
}

// --- LOGICA ESTACIÓN 2: MOLIENDA ---
const areaMolienda = document.getElementById('portafiltro-area-molienda');
areaMolienda.addEventListener('touchmove', (e) => {
    if (estado.limpieza < 100) {
        estado.limpieza += 2;
        document.getElementById('suciedad').style.opacity = (0.5 - estado.limpieza/200);
        if (estado.limpieza >= 100) {
            document.getElementById('instruccion-molienda').innerText = "¡Limpio! Ahora muele.";
            document.getElementById('btn-moler').classList.remove('hidden');
        }
    }
});

let intMolienda;
document.getElementById('btn-moler').addEventListener('touchstart', (e) => {
    e.preventDefault();
    document.getElementById('cafe-molido').classList.remove('hidden');
    intMolienda = setInterval(() => {
        if (estado.molienda < 100) {
            estado.molienda += 1;
            document.getElementById('cafe-molido').style.bottom = (estado.molienda - 100) + "%";
            if (estado.molienda >= 100) {
                clearInterval(intMolienda);
                ganarMaestria(15);
                document.getElementById('btn-ir-tamp').classList.remove('hidden');
            }
        }
    }, 40);
});
document.getElementById('btn-moler').addEventListener('touchend', () => clearInterval(intMolienda));

// --- LOGICA ESTACIÓN 3: WDT Y TAMP ---
const areaTamp = document.getElementById('area-tamp');
areaTamp.addEventListener('touchmove', (e) => {
    if (estado.wdt < 100) {
        estado.wdt += 1;
        document.getElementById('grumos').style.opacity = (0.8 - estado.wdt/125);
        if (estado.wdt >= 100) {
            document.getElementById('instruccion-tamp').innerText = "Café nivelado. Presiona con el Tamper.";
            document.getElementById('medidor-presion').classList.remove('hidden');
            document.getElementById('btn-tamp').classList.remove('hidden');
        }
    }
});

let intTamp;
document.getElementById('btn-tamp').addEventListener('touchstart', (e) => {
    e.preventDefault();
    intTamp = setInterval(() => {
        if (estado.presion < 100) {
            estado.presion += 2;
            document.getElementById('aguja-presion').style.left = estado.presion + "%";
        }
    }, 30);
});

document.getElementById('btn-tamp').addEventListener('touchend', () => {
    clearInterval(intTamp);
    if (estado.presion >= 70 && estado.presion <= 90) {
        document.getElementById('instruccion-tamp').innerText = "¡Presión Perfecta!";
        document.getElementById('btn-finalizar').classList.remove('hidden');
        document.getElementById('btn-tamp').classList.add('hidden');
        ganarMaestria(20);
    } else {
        alert("Presión incorrecta. Intenta de nuevo.");
        estado.presion = 0;
        document.getElementById('aguja-presion').style.left = "0%";
    }
});

function ganarMaestria(pts) {
    estado.maestria += pts;
    displayMaestria.innerText = estado.maestria;
    localStorage.setItem('katy_maestria', estado.maestria);
}
