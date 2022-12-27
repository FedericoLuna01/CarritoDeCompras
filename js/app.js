const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const listaCursos = document.querySelector('#lista-cursos');
const vaciarCarrito = document.querySelector('#vaciar-carrito');
let articulosCarrito = [];


cargarEventListeners();
function cargarEventListeners() {
    // agregar curso al carrito
    listaCursos.addEventListener('click', agregarCurso);

    // elimina cursos
    carrito.addEventListener('click', eliminarCurso);

    // cuando el documento esta listo obtener items de local storage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

        carritoHTML();
    })

    // vaciar carrito
    vaciarCarrito.addEventListener('click', () => {
        articulosCarrito = [];
        limpiarHTML();
    })
}

// Funciones
function agregarCurso(e) {
    // prevenir q vaya para arriba
    e.preventDefault();
    // event bubbling
    if (e.target.classList.contains('agregar-carrito')) {
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
    }

};

// eliminar cursos
function eliminarCurso(e) {
    e.preventDefault()
    if (e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute("data-id");

        // eliminar curso del arreglo
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId)
        // volver a cargar al arreglo en el html
        carritoHTML();
    };
};

// Leer datos del curso
function leerDatosCurso(curso){
    // console.log(curso)

    // creo objeto con el contenido del curso
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }
    // console.log(infoCurso)

    // revisa si un objeto ya esta en el carrito
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);
    // console.log(existe)
    if (existe) {
        // sumo la cantidad
        const cursos = articulosCarrito.map(curso => {
            if (curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso; // return el curso repetido 
            } else {
                return curso; // return los cursos no repetidos
            }
        });
        articulosCarrito = [...cursos]
    } else {
        articulosCarrito = [...articulosCarrito, infoCurso];
    };

    // agrega elementos al carrito
    // articulosCarrito = [...articulosCarrito, infoCurso];

    // console.log(articulosCarrito)

    // funcion para agregar elementos al carrito
    carritoHTML();
};

// mostrar contenido del carrito
function carritoHTML() {

    // Limpiar html
    limpiarHTML();

    // crear html
    articulosCarrito.forEach( curso => {
        // tambien se puede usar destructurizacion
        // const { imagen, titulo, precio, cantidad, id } = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src='${curso.imagen}' width='100'>
            </td>
            <td>
                ${curso.titulo}
            </td>
            <td>
                ${curso.precio}
            </td>
            <td>
                ${curso.cantidad}
            </td>
            <td>
                <a href='#' class='borrar-curso' data-id='${curso.id}'> X </a>
            </td>
        `;
        contenedorCarrito.appendChild(row);
    });

    sincronizarStorage();

};

// funcion para limpiar html
function limpiarHTML() {
    // primer forma // mala
    // contenedorCarrito.innerHTML = '';

    // segunda forma mas rapida
    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    };
};


function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));


} 