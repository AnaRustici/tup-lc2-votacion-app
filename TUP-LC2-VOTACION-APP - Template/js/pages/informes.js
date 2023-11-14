let textoAmarillo = document.getElementById('texto-amarillo');
let textoVerde = document.getElementById('texto-verde');
let textoRojo = document.getElementById('texto-rojo');
const mensajeCargando = document.getElementById('texto-cargando');
const informesContainer = document.getElementById('tabla-informes');

function ocultarCarteles(){
    textoVerde.style.display = 'none';
    textoAmarillo.style.display = 'none';
    textoRojo.style.display = 'none';
}

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
    anioEleccion = datos[1];
    tipoRecuento = datos[2];
    tipoEleccion = datos[3];
    categoriaId = datos[4];
    distritoId = datos[5];
    seccionProvincialId = datos[6];
    seccionId = datos[7];
    circuitoId = datos[8];
    mesaId = datos[9];
    añoSeleccionado = datos[10];
    cargoSeleccionado = datos[11];
    distritoSeleccionado = datos[12];
    seccionSeleccionada = datos[13];

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

async function consultarResultados(url) {
    console.log("URL UTILIZADA: " + url);
    try {
        console.log('entra en el try de consultar resultados')
        mensajeCargando.style.visibility = 'visible';
        let response = await fetch(url);
        console.log('hizo el fetch');
        if (response.ok) {
            console.log('respuesta ok') 
            mensajeCargando.style.visibility = 'hidden';
            resultados = await response.json();
            console.log(resultados);
            crearInforme(resultados);
        } else {
           textojeRojo.style.display = "block"
        }
    }
    catch (err) {
        textoRojo.style.display = "block"
    }

}

function crearInforme(resultados) {
    console.log('resultados dentro de crear informe: ', resultados);
    console.log(resultados.valoresTotalizadosPositivos);
    try {
        let agrupaciones = resultados.valoresTotalizadosPositivos;
        console.log("AGRUPACIONES: "+ agrupaciones)
        /*
        CUERPO DEL CUADRO AGRUPACIONES

        */
        
        agrupaciones.forEach(agrupacion => {
            //ASI SE ACCEDE A LA INFORMACION DE CADA AGRUPACION
            console.log(`${agrupacion.nombreAgrupacion}, ${agrupacion.votosPorcentaje}, ${agrupacion.votos}`);
           
        });


    } catch (error) {
        console.log("ERROR: " + error)
        console.log(resultados)
        console.log("No se creo el informe porque el resultado esta vacio")
    }
}