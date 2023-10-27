const tipoEleccion = 2;
const tipoRecuento = 1;

let anio = document.getElementById('select-anio');


async function consultarCombo() {
    if (anio.value == 0) {
        alert('Seleccione un año');
        return false;
    }
    else {
        try {
            const respuesta = await fetch("https://resultados.mininterior.gob.ar/api/menu/periodos");

            if (respuesta.ok) {
                //FUNCIONÓ

                const data = await respuesta.json();

                console.log(data);

            } else {
                console.log('Error 404');
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}