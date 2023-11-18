let textoAmarillo = document.getElementById('texto-amarillo');
let textoVerde = document.getElementById('texto-verde');
let textoRojo = document.getElementById('texto-rojo');
let tabla = document.getElementById('tabla-body');
let eleccion = "";
let anioEleccion = "";
let tipoRecuento = "";
let tipoEleccion = "";
let categoriaId = "";
let distritoId = "";
let seccionProvincialId = "";
let seccionId = "";
let circuitoId = "";
let mesaId = "";
let añoSeleccionado = "";
let cargoSeleccionado = "";
let distritoSeleccionado = "";
let seccionSeleccionada = "";

const mensajeCargando = document.getElementById('texto-cargando');

function ocultarCarteles() {
    textoVerde.style.display = 'none';
    textoAmarillo.style.visibility = 'hidden';
    textoRojo.style.visibility = 'hidden';
}

document.addEventListener('DOMContentLoaded', async () => {
    ocultarCarteles();
    if (localStorage.getItem('INFORMES')) {
        informes = JSON.parse(localStorage.getItem('INFORMES'));

        for (const datos of informes) {
            const url = armarUrl(datos);
            try {
                const response = await fetch(url);
                if (response.ok) {
                    mensajeCargando.style.visibility = 'hidden';
                    const resultados = await response.json();
                    crearInforme(resultados);
                } else {
                    textoRojo.style.display = "block";
                }
            } catch (err) {
                textoRojo.style.display = "block";
            }
        }
    } else {
        mostrarTexto(textoAmarillo, "Debes crear minimo un informe en paso o generales!");
    }
});

function mostrarTexto(tipoTexto, mensaje) {
    tipoTexto.textContent = mensaje;
    tipoTexto.style.display = 'block';
}

function armarUrl(data) {
    console.log("ESTA ES LA DATA DE LA URL A USAR: " + data)
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
    return url;
}

async function consultarResultados(url) {
    console.log("URL UTILIZADA: " + url);
    try {
        console.log('entra en el try de consultar resultados')
        mensajeCargando.style.visibility = 'visible';
        let response = await fetch(url);
        console.log("TIENE Q ANDAR EL RESPONSE...")
        if (response.ok) {
            console.log('respuesta ok' + response)
            mensajeCargando.style.visibility = 'hidden';
            resultados = await response.json();
            crearInforme(resultados);
        } else {
            textoRojo.style.display = "block"
        }
    } catch (err) {
        textoRojo.style.display = "block"
    }

}

function crearInforme(resultados) {
    console.log('resultados dentro de crear informe: ', resultados);
    try {
        const nuevoTr = document.createElement('tr');
        let agrupaciones = resultados.valoresTotalizadosPositivos;

        // CREO TD PARA MAPA
        let tdMapa = document.createElement('td');
        tdMapa.classList.add('td-body');
        tdMapa.textContent = 'MAPA';

        // CREO TD PARA DATOS GENERALES 
        let tdDatosGenerales = document.createElement('td');
        tdDatosGenerales.classList.add('td-body');


        let cuadroEscrutadas = document.getElementById('mesas-escrutadas');
        let cuadroEscrutadasTexto = document.getElementById('mesas-escrutadas-texto')
        cuadroEscrutadasTexto.textContent =  resultados.estadoRecuento.mesasTotalizadas + " Mesas escrutadas";


        let cuadroElectores = document.getElementById('electores');
        let cuadroElectoresTexto = document.getElementById('mesas-electores-texto');
        cuadroElectoresTexto.textContent = resultados.estadoRecuento.cantidadElectores + " Electores";

        let cuadroParticipacion= document.getElementById('part-escrutado')
        let cuadroParticipacinTexto = document.getElementById('part-escrutado-texto')
        cuadroParticipacinTexto.textContent = resultados.estadoRecuento.participacionPorcentaje +"% Participacion escrutado";

    
        // CREO TD PARA AGRUPACIONES
        let tdAgrupaciones = document.createElement('td');
        tdAgrupaciones.classList.add('td-body-agrupacion');
        let tdEleccion = document.createElement('td');
        tdEleccion.classList.add('td-body');

        // Crear div grande que contiene todas las agrupaciones por fila
        let divAgrupacionesFila = document.createElement('div');
        divAgrupacionesFila.classList.add('fila-agrupacion-grande');

        // Itero sobre las agrupaciones y las agrego al div grande
        agrupaciones.forEach(agrupacion => {
            // Crear div contenedor por fila
            let divFila = document.createElement('div');
            divFila.classList.add('agrupacion');

            // Crear div para el nombre de la agrupación
            let divNombreAgrupacion = document.createElement('div');
            let nombreAgrupacion = document.createElement('b');
            divNombreAgrupacion.classList.add('nombre-agrupacion');
            nombreAgrupacion.textContent = agrupacion.nombreAgrupacion;
            divNombreAgrupacion.appendChild(nombreAgrupacion);

            // Crear div para los votos de la agrupación
            let divVotosAgrupacion = document.createElement('div');
            divVotosAgrupacion.classList.add('votos')
            divVotosAgrupacion.innerHTML = `${agrupacion.votosPorcentaje}% <br> ${agrupacion.votos}votos`;

            // Declarar variables dentro del bucle y actualizarlas
            let anioEleccion = agrupacion.anioEleccion;
            let eleccion = agrupacion.tipoEleccion; 
            let cargoSeleccionado = agrupacion.cargoSeleccionado;
            let distritoSeleccionado = agrupacion.distritoSeleccionado;

            // Agregar divs de nombre y votos al contenedor de fila 
            divFila.appendChild(divNombreAgrupacion);
            divFila.appendChild(divVotosAgrupacion); // Ahora ambos divs están en el mismo contenedor

            // Agregar fila al div grande de agrupaciones
            divAgrupacionesFila.appendChild(divFila);
        });
        tdEleccion.classList.add('td-body');
        tdEleccion.innerHTML = `<p class="texto-elecciones-chico">Elecciones ${anioEleccion} | ${eleccion}</p>
        <p class="texto-path-chico">${anioEleccion} > ${eleccion} > ${cargoSeleccionado} > ${distritoSeleccionado}</p>`;

        tdDatosGenerales.innerHTML = `
            <div class="datos">
                <div id="mesas-escrutadas">${cuadroEscrutadas.innerHTML}</div>
                <div id="electores"> ${cuadroElectores.innerHTML}</div>
                <div id="part-escrutado">${cuadroParticipacion.innerHTML} </div>
            </div>`;

        // Agregar div grande de agrupaciones a la celda
        tdAgrupaciones.appendChild(divAgrupacionesFila);
        // Agregar celdas a la fila
        nuevoTr.appendChild(tdMapa);
        nuevoTr.appendChild(tdEleccion);
        nuevoTr.appendChild(tdDatosGenerales);
        nuevoTr.appendChild(tdAgrupaciones);

        // Agregar fila a la tabla
        tabla.appendChild(nuevoTr);
        console.log('===========================================================================================================================')

    } catch (error) {
        console.log("ERROR: " + error);
        console.log(resultados);
        console.log("No se creó el informe porque el resultado está vacío");
    }
}