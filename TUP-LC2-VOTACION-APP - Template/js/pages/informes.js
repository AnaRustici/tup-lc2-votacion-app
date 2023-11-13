let textoAmarillo = document.getElementById('texto-amarillo');
let textoVerde = document.getElementById('texto-verde');
let textoRojo = document.getElementById('texto-rojo');
const mensajeCargando = document.getElementById('texto-cargando');
const informesContainer = document.getElementById('informe-container');

document.addEventListener('DOMContentLoaded', async () => {
    ocultarCarteles();
    if (localStorage.getItem('INFORMES')) {
        informes = JSON.parse(localStorage.getItem('INFORMES'));
        
        const promises = informes.map(datos => {
            const url = armarUrl(datos);
            return consultarResultados(url);
        });
    } else {
        mostrarTexto(textoAmarillo, "Debe agregar un INFORME desde Paso o Generales primero!");
    }
});
  
function mostrarTexto(tipoTexto, mensaje) {
    tipoTexto.textContent = mensaje;
    tipoTexto.style.display = 'block';
    
}
function armarUrl(data) {
    let datos = data.split('|');

    anioEleccion = datos[0];
    tipoRecuento = datos[1];
    tipoEleccion = datos[2];
    categoriaId = datos[3];
    distritoId = datos[4];
    seccionProvincialId = datos[5];
    seccionId = datos[6];
    circuitoId = datos[7];
    mesaId = datos[8];
    añoSeleccionado = datos[9];
    cargoSeleccionado = datos[10];
    distritoSeleccionado = datos[11];
    seccionSeleccionada = datos[12];

    if (tipoEleccion == 1) {
        eleccion = "Paso"
    } else {
        eleccion = "Generales"
    }

    let urlSinParametros = `https://resultados.mininterior.gob.ar/api/resultados/getResultados`;
    let parametros = `?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}`;

    let url = urlSinParametros + parametros;
    console.log(url);
    return url;
}
