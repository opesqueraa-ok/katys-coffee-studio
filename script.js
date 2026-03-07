let peso = 0.0;
let intervalo;
let maestria = parseInt(localStorage.getItem('katy_maestria')) || 0;

const displayPeso = document.getElementById('peso-actual');
const btnVerter = document.getElementById('btn-verter');
const btnSiguiente = document.getElementById('btn-siguiente');
const btnReiniciar = document.getElementById('btn-reiniciar');
const displayMaestria = document.getElementById('maestria');

displayMaestria.innerText = maestria;

// Función para verter granos
function empezarAVerter() {
    intervalo = setInterval(() => {
        if (peso < 25.0) { // Límite físico
            peso += 0.1;
            displayPeso.innerText = peso.toFixed(1);
            
            // Si llega al peso exacto
            validarPeso();
        }
    }, 50); // Velocidad de vertido
}

function detenerVertido() {
    clearInterval(intervalo);
    if (peso > 0) btnReiniciar.classList.remove('hidden');
}

function validarPeso() {
    if (peso === 18.0) {
        clearInterval(intervalo);
        btnVerter.classList.add('hidden');
        btnSiguiente.classList.remove('hidden');
        btnReiniciar.classList.add('hidden');
        
        // Guardar progreso
        maestria += 10;
        displayMaestria.innerText = maestria;
        localStorage.setItem('katy_maestria', maestria);
    }
}

// Eventos para iPad (Touch) y Mouse
btnVerter.addEventListener('mousedown', empezarAVerter);
btnVerter.addEventListener('mouseup', detenerVertido);
btnVerter.addEventListener('touchstart', (e) => { e.preventDefault(); empezarAVerter(); });
btnVerter.addEventListener('touchend', detenerVertido);

btnReiniciar.addEventListener('click', () => {
    peso = 0.0;
    displayPeso.innerText = "0.0";
    btnReiniciar.classList.add('hidden');
    btnVerter.classList.remove('hidden');
});
