// Cargar progreso desde el iPad (localStorage)
let progreso = JSON.parse(localStorage.getItem('katy_game_data')) || {
    maestria: 0,
    herramientas: ['Molino Básico']
};

const maestriaElemento = document.getElementById('maestria');
const botonAccion = document.getElementById('main-action');

// Actualizar pantalla inicial
maestriaElemento.innerText = progreso.maestria;

// Función para guardar progreso
function guardarProgreso() {
    localStorage.setItem('katy_game_data', JSON.stringify(progreso));
}

// Lógica simple de prueba
botonAccion.addEventListener('click', () => {
    progreso.maestria += 1;
    maestriaElemento.innerText = progreso.maestria;
    
    // Feedback visual simple
    document.getElementById('instruccion').innerText = "¡Excelente peso! +1 Maestría";
    
    guardarProgreso();
});
