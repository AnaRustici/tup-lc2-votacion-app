const tipoEleccion = 2;
const tipoRecuento = 1;

let selectAnio = document.getElementById('select-anio');

document.addEventListener('DOMContentLoaded', function () {
    //Se llama a la función cuando se carga la página
    consultarCombo();
});

async function consultarCombo() {

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


