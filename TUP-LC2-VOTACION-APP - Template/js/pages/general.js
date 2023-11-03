const tipoEleccion = 2;
const tipoRecuento = 1;

let selectAnio = document.getElementById('select-anio');
let selectCargo = document.getElementById('select-cargo');
let selectDistrito = document.getElementById('select-distrito');
let datosAPI = [];
let datosCargos = [];

document.addEventListener('DOMContentLoaded', function () {
    //Se llama a la función cuando se carga la página
    consultarComboAnio();
});

async function consultarComboAnio() {

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
                option.textContent = anio.toString(); // Convertir a cadena para que el texto se pueda ver en el combo
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
    console.log(datosAPI);
    datosAPI.forEach((eleccion) => {
        if (eleccion.IdEleccion === tipoEleccion) {
            console.log(datosCargos);
            datosCargos.forEach(cargo => {
                if (cargo.Cargo == selectCargo.value) {
                    console.log(cargo.Distritos);
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


