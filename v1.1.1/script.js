// BLOQUEO DE ZOOM GLOBAL
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('dblclick', (e) => e.preventDefault());

let estado = {
    dinero: parseFloat(localStorage.getItem('katy_dinero')) || 0.00,
    peso: 0, limpieza: 0, molienda: 0, wdt: 0, presion: 0, extraccion: 0
};

const updateDinero = () => document.getElementById('dinero-total').innerText = "Q" + estado.dinero.toFixed(2);
updateDinero();

// 1. PESAJE
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
    document.getElementById('st-1').classList.add('locked');
    desbloquearYCentrar('st-2');
}

// 2. MOLIENDA (Optimizado para iPad)
const limpiarMolienda = (e) => {
    if(e.cancelable) e.preventDefault(); // Evita que la pantalla haga scroll al limpiar
    if (estado.limpieza < 100) {
        estado.limpieza += 5; // Aumenté la velocidad para que sea más satisfactorio
        document.getElementById('suciedad').style.opacity = (0.8 - estado.limpieza/125);
        if (estado.limpieza >= 100) document.getElementById('btn-moler').classList.remove('hidden');
    }
};
document.getElementById('area-molienda').addEventListener('touchmove', limpiarMolienda, {passive: false});
document.getElementById('area-molienda').addEventListener('touchstart', limpiarMolienda, {passive: false}); // También funciona con toques simples

document.getElementById('btn-moler').addEventListener('touchstart', (e) => {
    e.preventDefault();
    let intM = setInterval(() => {
        estado.molienda += 5;
        document.getElementById('cafe-molido').style.bottom = (estado.molienda - 100) + "%";
        if (estado.molienda >= 100) { 
            clearInterval(intM); 
            document.getElementById('st-2').classList.add('locked');
            desbloquearYCentrar('st-3'); 
        }
    }, 50);
});

// 3. WDT & TAMP
const hacerWDT = (e) => {
    if(e.cancelable) e.preventDefault();
    if (estado.wdt < 100) {
        estado.wdt += 4;
        document.getElementById('wdt-progress').style.width = estado.wdt + "%";
        document.getElementById('grumos').style.opacity = (0.8 - estado.wdt/125);
        if (estado.wdt >= 100) {
            document.getElementById('label-tamp').innerText = "3. Presión de Tamp";
            document.getElementById('tamp-ui').classList.remove('hidden');
        }
    }
};
document.getElementById('area-tamp').addEventListener('touchmove', hacerWDT, {passive: false});
document.getElementById('area-tamp').addEventListener('touchstart', hacerWDT, {passive: false});

let intT;
document.getElementById('btn-tamp').addEventListener('touchstart', (e) => {
    e.preventDefault();
    intT = setInterval(() => {
        estado.presion += 4;
        document.getElementById('needle').style.left = estado.presion + "%";
    }, 40);
});

document.getElementById('btn-tamp').addEventListener('touchend', () => {
    clearInterval(intT);
    if (estado.presion >= 70 && estado.presion <= 90) {
        document.getElementById('btn-tamp').classList.add('success');
        setTimeout(() => {
            document.getElementById('st-3').classList.add('locked');
            desbloquearYCentrar('st-4');
        }, 500);
    } else {
        estado.presion = 0; document.getElementById('needle').style.left = "0%";
    }
});

// 4. EXTRACCIÓN
let intE;
const btnE = document.getElementById('btn-extraer');
btnE.addEventListener('touchstart', (e) => {
    e.preventDefault();
    document.getElementById('stream').style.top = "0";
    intE = setInterval(() => {
        estado.extraccion += 1.5; 
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
    document.getElementById('st-4').classList.add('locked');
    desbloquearYCentrar('st-5');
}

// 5. ARTE & CÁLCULO DE VENTA EN QUETZALES
function seleccionarArte(arte) {
    let gananciaBase = 25.00; // Q25.00 base por el café
    
    // Penalización por pesaje (Ideal: 18.0)
    let errorPeso = Math.abs(18.0 - estado.peso);
    let bonoPeso = Math.max(0, 10.00 - (errorPeso * 4.00)); // Pierde dinero si se aleja
    
    // Penalización por extracción (Ideal: 70% de la taza)
    let errorExtraccion = Math.abs(70 - estado.extraccion);
    let bonoExtraccion = Math.max(0, 15.00 - (errorExtraccion * 0.5)); 
    
    let pagoFinal = gananciaBase + bonoPeso + bonoExtraccion;
    
    estado.dinero += pagoFinal;
    localStorage.setItem('katy_dinero', estado.dinero);
    
    let feedback = `¡Vendiste un latte con ${arte}!\n\nGanancia: Q${pagoFinal.toFixed(2)}`;
    if (errorPeso < 0.2 && errorExtraccion < 5) feedback += "\n🌟 ¡Taza Perfecta! El cliente dejó buena propina.";
    else if (errorPeso > 2 || errorExtraccion > 20) feedback += "\n⚠️ Sabía un poco extraño, menos propina.";
    
    alert(feedback);
    location.reload();
}

// Auto-Scroll suave
function desbloquearYCentrar(id) { 
    const estacion = document.getElementById(id);
    estacion.classList.remove('locked'); 
    estacion.scrollIntoView({ behavior: 'smooth', inline: 'center' });
}
