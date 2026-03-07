// BLOQUEO DE ZOOM
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('dblclick', (e) => e.preventDefault());

let estado = {
    dinero: parseFloat(localStorage.getItem('katy_dinero')) || 0.00,
    peso: 0, limpieza: 0, molienda: 0, wdt: 0, presion: 0, extraccion: 0
};

const updateDinero = () => document.getElementById('dinero-total').innerText = "$" + estado.dinero.toFixed(2);
updateDinero();

// 1. PESAJE (Libre, sin bloqueo automático)
let intPeso;
const btnV = document.getElementById('btn-verter');
btnV.addEventListener('touchstart', (e) => {
    e.preventDefault();
    intPeso = setInterval(() => {
        estado.peso += 0.2;
        document.getElementById('peso-display').innerText = estado.peso.toFixed(1) + "g";
    }, 40);
});

btnV.addEventListener('touchend', () => {
    clearInterval(intPeso);
    btnV.classList.add('hidden');
    document.getElementById('btn-continuar-1').classList.remove('hidden');
});

function avanzarDePesaje() {
    desbloquear('st-2');
    document.getElementById('st-1').classList.add('locked'); // Oculta el foco del anterior
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
        if (estado.molienda >= 100) { clearInterval(intM); desbloquear('st-3'); document.getElementById('st-2').classList.add('locked'); }
    }, 50);
});

// 3. WDT & TAMP
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
        setTimeout(() => document.getElementById('st-3').classList.add('locked'), 500);
    } else {
        estado.presion = 0; document.getElementById('needle').style.left = "0%";
    }
});

// 4. EXTRACCIÓN (Libre, guiada por línea)
let intE;
const btnE = document.getElementById('btn-extraer');
btnE.addEventListener('touchstart', () => {
    document.getElementById('stream').style.top = "0";
    intE = setInterval(() => {
        estado.extraccion += 1; // Crece visualmente por porcentaje
        document.getElementById('liquid').style.height = estado.extraccion + "%";
    }, 40);
});

btnE.addEventListener('touchend', () => {
    clearInterval(intE);
    document.getElementById('stream').style.top = "-80px";
    btnE.classList.add('hidden');
    document.getElementById('btn-continuar-4').classList.remove('hidden');
});

function avanzarDeExtraccion() {
    desbloquear('st-5');
    document.getElementById('st-4').classList.add('locked');
}

// 5. ARTE & CALCULO DE VENTA
function seleccionarArte(arte) {
    // Cálculo de ganancias
    let gananciaBase = 2.50; // $2.50 base por el café
    
    // Penalización por pesaje (Ideal: 18.0)
    let errorPeso = Math.abs(18.0 - estado.peso);
    let bonoPeso = Math.max(0, 1.50 - (errorPeso * 0.5)); // Pierde dinero si se aleja de 18
    
    // Penalización por extracción (Ideal: 70% de la taza, donde está la línea)
    let errorExtraccion = Math.abs(70 - estado.extraccion);
    let bonoExtraccion = Math.max(0, 2.00 - (errorExtraccion * 0.1)); // Pierde dinero si se aleja de la línea
    
    let pagoFinal = gananciaBase + bonoPeso + bonoExtraccion;
    
    estado.dinero += pagoFinal;
    localStorage.setItem('katy_dinero', estado.dinero);
    
    let feedback = `¡Vendiste un latte con ${arte}!\n\nGanancia: $${pagoFinal.toFixed(2)}`;
    if (errorPeso < 0.2 && errorExtraccion < 5) feedback += "\n🌟 ¡Extracción Perfecta! El cliente dejó propina.";
    else if (errorPeso > 2 || errorExtraccion > 20) feedback += "\n⚠️ El café estaba un poco desbalanceado, menos propina.";
    
    alert(feedback);
    location.reload();
}

function desbloquear(id) { document.getElementById(id).classList.remove('locked'); }
