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

// 2. MOLIENDA
const limpiarMolienda = (e) => {
    if(e.cancelable) e.preventDefault(); 
    if (estado.limpieza < 100) {
        estado.limpieza += 5; 
        document.getElementById('suciedad').style.opacity = (0.8 - estado.limpieza/125);
        if (estado.limpieza >= 100) document.getElementById('btn-moler').classList.remove('hidden');
    }
};
document.getElementById('area-molienda').addEventListener('touchmove', limpiarMolienda, {passive: false});
document.getElementById('area-molienda').addEventListener('touchstart', limpiarMolienda, {passive: false}); 

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
    // Para pasar esta estación la presión SIEMPRE debe quedar en zona verde, 
    // así que garantizamos que el Tamp siempre sea calificado como perfecto al final.
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

// 5. EVALUACIÓN Y PANTALLA DE RESULTADOS
function seleccionarArte(tipoArte) {
    let gananciaBase = 25.00;
    let propina = 15.00; 
    
    // Evaluar Desempeño
    let titulo = "";
    let detalle = "";
    
    // Rango de perfección
    let errorPeso = Math.abs(18.0 - estado.peso);
    let errorExt = Math.abs(70 - estado.extraccion); // 70% es la línea visual
    
    // Lógica de calificación (Como lo pediste)
    if (estado.peso.toFixed(1) === "18.0" && errorExt <= 2.0) {
        titulo = "☕ ¡UN CAFÉ PERFECTO! 🏆";
        detalle = "18g exactos, Tamp en verde y extracción a la línea. El cliente está fascinado.";
        propina += 20.00; // Super bono
    } 
    else if (errorPeso <= 2.0 && errorExt <= 10.0) {
        titulo = "✨ ¡Muy Buen Café!";
        detalle = "Pesaje aceptable y extracción en buen nivel (Tamp verde perfecto).";
    }
    else {
        titulo = "⚠️ Café Regular";
        propina = 2.00; // Casi no dejan propina
        
        // Determinar el peor error para dar feedback
        if (estado.peso < 16.0) {
            detalle = "Te faltaron bastantes granos de café, el espresso quedó muy aguado.";
        } else if (estado.peso > 20.0) {
            detalle = "Te pasaste de granos, el espresso está demasiado fuerte y amargo.";
        } else if (estado.extraccion < 50) {
            detalle = "Muy poco líquido en la taza (Ristretto corto), faltó extracción.";
        } else if (estado.extraccion > 90) {
            detalle = "Te pasaste de extracción (Lungo), el sabor se quemó un poco.";
        } else {
            detalle = "Hubo un desbalance entre el café y el agua, pero es bebible.";
        }
    }
    
    let pagoFinal = gananciaBase + propina;
    estado.dinero += pagoFinal;
    localStorage.setItem('katy_dinero', estado.dinero);
    
    // DIBUJAR ARTE CSS SEGÚN SELECCIÓN
    const arteContainer = document.getElementById('latte-art-container');
    arteContainer.innerHTML = ''; // Limpiar
    if (tipoArte === 'corazon') {
        arteContainer.innerHTML = '<div class="latte-corazon"></div>';
    } else if (tipoArte === 'rayas') {
        arteContainer.innerHTML = '<div class="latte-rayas"><div class="r1"></div><div class="r2"></div><div class="r3"></div><div class="r4"></div><div class="r5"></div></div>';
    } else if (tipoArte === 'espiral') {
        arteContainer.innerHTML = '<div class="latte-espiral"></div>';
    }

    // LLENAR PANTALLA RESULTADOS
    document.getElementById('calificacion-titulo').innerText = titulo;
    document.getElementById('calificacion-titulo').style.color = (titulo.includes("PERFECTO")) ? "#d4af37" : (titulo.includes("Regular") ? "#e74c3c" : "#333");
    document.getElementById('feedback-detalle').innerText = detalle;
    document.getElementById('propina-monto').innerText = "Q" + propina.toFixed(2);
    document.getElementById('total-ganado').innerText = "Q" + pagoFinal.toFixed(2);
    
    // MOSTRAR PANTALLA
    document.getElementById('pantalla-resultados').classList.remove('hidden');
}

function siguienteCliente() {
    location.reload(); // Reinicia el juego manteniendo el dinero guardado
}

function desbloquearYCentrar(id) { 
    const estacion = document.getElementById(id);
    estacion.classList.remove('locked'); 
    estacion.scrollIntoView({ behavior: 'smooth', inline: 'center' });
}
