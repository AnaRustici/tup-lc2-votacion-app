const tipoEleccion = 1;
const tipoRecuento = 1;

let selectAnio = document.getElementById('select-anio');
let selectCargo = document.getElementById('select-cargo');
let selectDistrito = document.getElementById('select-distrito');
let selectSeccion = document.getElementById('select-seccion');
let seccionProvincial = document.getElementById('hdSeccionProvincial');
let cartelAmarillo = document.getElementById('texto-amarillo');
let cartelVerde = document.getElementById('texto-verde');
let cartelrojo = document.getElementById('texto-rojo');
let datosAPI = [];
let datosCargos = [];

var primeraOpcion = document.createElement('option');

document.addEventListener('DOMContentLoaded', function () {
    //Se llama a la función cuando se carga la página
    consultarComboAnio();
});

function ocultarCarteles(){
    cartelVerde.style.visibility = 'hidden';
    cartelAmarillo.style.visibility = 'hidden';
    cartelrojo.style.visibility = 'hidden';
}

ocultarCarteles();

async function consultarComboAnio(){
    try {
        const respuesta = await fetch("https://resultados.mininterior.gob.ar/api/menu/periodos");
        if (respuesta.ok) {
            //FUNCIONÓ
            const data = await respuesta.json();
            console.log(data);

            //Se recorre la respuesta del json para llenar el combo de años con los años
            data.forEach(anio => {
                const option = document.createElement('option');
                option.value = anio; // Se establece el valor del combo
                option.text = anio; // Convertir a cadena para que el texto se pueda ver en el combo
                selectAnio.appendChild(option); // Se agregan las opciones en el select
            });
        } else {
            console.log('Error 404');
        }
    }
    catch (err) {
        console.log(err);
    }
}

function comboCargo() {
    fetch("https://resultados.mininterior.gob.ar/api/menu?año=" + selectAnio.value)
        .then(response => response.json())
        .then(data => {
            datosAPI = data;
            console.log(datosAPI)

            selectCargo.innerHTML = '';

            datosAPI.forEach((eleccion) => {
                if (eleccion.IdEleccion === tipoEleccion) {
                    eleccion.Cargos.forEach(cargo => {
                        const option = document.createElement('option');
                        option.value = cargo.IdCargo;
                        option.text = cargo.Cargo;
                        selectCargo.appendChild(option);
                    });
                };
            });

        })
        .catch(error => {
            console.error('Error al cargar los datos: ', error);
        });
}

function comboDistrito() {
    selectDistrito.innerHTML = '';
    try {
        console.log(datosAPI);
        datosAPI.forEach((eleccion) => {
            if (eleccion.IdEleccion == tipoEleccion) {
                eleccion.Cargos.forEach(cargo => {  
                    if (cargo.IdCargo == selectCargo.value) {
                        console.log(cargo.Distritos);
                        primeraOpcion.value = '0';
                        primeraOpcion.text = 'Distrito';
                        primeraOpcion.disabled = true;
                        primeraOpcion.selected = true;
                        selectDistrito.appendChild(primeraOpcion);
                        cargo.Distritos.forEach(distrito => {
                            const option = document.createElement('option');
                            option.value = distrito.IdDistrito;
                            option.text = distrito.Distrito;
                            selectDistrito.appendChild(option);
                        });
                    }
                });
            }
        });
    }
    catch (err) {
        console.log(err);
    }
}

function comboSeccion() {
    selectSeccion.innerHTML = '';
    try {
        datosAPI.forEach((eleccion) => {
            if (eleccion.IdEleccion == tipoEleccion) {
                eleccion.Cargos.forEach(cargo => {
                    if (cargo.IdCargo == selectCargo.value) {
                        cargo.Distritos.forEach(distrito => {
                            if (distrito.IdDistrito == selectDistrito.value) {
                                distrito.SeccionesProvinciales.forEach(secProvincial => {
                                    seccionProvincial.value = secProvincial.IDSeccionProvincial;
                                    primeraOpcion.value = '0';
                                    primeraOpcion.text = 'Sección';
                                    primeraOpcion.disabled = true;
                                    primeraOpcion.selected = true;
                                    selectSeccion.appendChild(primeraOpcion);
                                    secProvincial.Secciones.forEach(seccion => {
                                        const option = document.createElement('option');
                                        option.value = seccion.IdSeccion;
                                        option.text = seccion.Seccion;
                                        selectSeccion.appendChild(option);
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    catch (err) {
        console.log(err);
    }
}

async function validarSelects() {
    return selectAnio.value !== '0' &&
           selectCargo.value !== '0' &&
           selectDistrito.value !== '0' &&
           selectSeccion.value !== '0';
}

async function consultarResultados() {
    if (await validarSelects()) {
        ocultarCarteles();
        cartelVerde.style.visibility = 'visible'
        const url = `https://resultados.mininterior.gob.ar/api/resultados/getResultados`
        let anioEleccion = selectAnio.value;
        let categoriaId = selectCargo.value;
        let distritoId = selectDistrito.value;
        let seccionProvincialId = seccionProvincial.value;
        let seccionId = selectSeccion.value;
        let parametros = `?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=&mesaId=`
        try {
            const response = await fetch(url + parametros);
            if (response.ok) {
                resultados = await response.json();
                console.log(resultados)
            } else {
                ocultarCarteles();
                cartelrojo.style.visibility = 'visible'
                alert("este es el else")
            }
        }
        catch (err) {
            ocultarCarteles();
            cartelrojo.style.visibility = 'visible'
            alert("Este es el catch")
        }
    } else {
        ocultarCarteles();
        cartelAmarillo.style.visibility = 'visible'
    }
}