let listaProductos = [
    { nombre: 'Pan', cantidad: 2, precio: 2.4 },
    { nombre: 'Leche', cantidad: 5, precio: 11.4 },
    { nombre: 'Fideos', cantidad: 4, precio: 5.4 },
]
let ul;
let listaCreada = false;

function borrarProducto(index) {
    listaProductos.splice(index, 1);
    renderLista();
}

function cambiarCantidad(index, e) {
    let cantidad = Number(e.value);
    listaProductos[index].cantidad = cantidad;
}
function cambiarPrecio(index, e) {
    let precio = Number(e.value);
    listaProductos[index].precio = precio;
}

function configurarListeners() {
    document.getElementById('btn_entrada_producto').addEventListener('click', () => {
        let prod = document.getElementById('ingreso_producto').value;
        if (prod !== '') {
            listaProductos.push({
                nombre: prod,
                cantidad: 0,
                precio: 0
            });
            document.getElementById('ingreso_producto').value = '';
            document.getElementById('ingreso_producto').focus();
            renderLista();
        }
    });
    document.getElementById('btn_borrar_todos_productos').addEventListener('click', () => {
        listaProductos = [];
        renderLista();
    })
}


function renderLista() {

    if (!listaCreada) {
        ul = document.createElement('ul');
        ul.classList.add('demo-list-icon', 'mdl-list', 'w-100');
    }

    ul.innerHTML = '';

    listaProductos.forEach((producto, index) => {
        ul.innerHTML +=
            `
        <ul class="demo-list-icon mdl-list">
            <li class="mdl-list__item">
                <span class="mdl-list__item-primary-content w-10">
                    <i class="material-icons">shopping_cart</i>
                </span>
                <span class="mdl-list__item-primary-content w-30">
                    ${producto.nombre}
                </span>
                <span class="mdl-list__item-primary-content w-20">
                    <div class="mdl-textfield mdl-js-textfield">
                        <input onchange="cambiarCantidad(${index}, this)" class="mdl-textfield__input" type="text" id="cantidad-${index}" value="${producto.cantidad}">
                        <label class="mdl-textfield__label" for="cantidad-${index}">Cantidad</label>
                    </div>
                </span>
                <span class="mdl-list__item-primary-content w-20 ml-20">
                    <div class="mdl-textfield mdl-js-textfield">
                        <input onchange="cambiarPrecio(${index}, this)"  class="mdl-textfield__input" type="text" id="precio-${index}"  value="${producto.precio}">
                        <label class="mdl-textfield__label" for="precio-${index}">Precio</label>
                    </div>
                </span>
                <span class="mdl-list__item-primary-content w-20">
                                <button onclick="borrarProducto(${index})"
                                    class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored ml-20">
                                    <i class="material-icons">remove_shopping_cart</i>
                                </button>
                            </span>
                        </li>
                    </ul>
        `
    })

    if (!listaCreada) {
        document.getElementById('lista').appendChild(ul);
    } else {
        componentHandler.upgradeElements(ul);
    }

    listaCreada = true;
}

function registrarServiceWorker() { 
    if('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            this.navigator.serviceWorker.register('./sw.js').then(function(reg) {
                console.log('El service worker se registró correctamente', reg)
            })
            .catch(function(err) {
                console.warn('Error al registrar el service worker', err)
            })
        })
    }
}

function start() {
    registrarServiceWorker();
    renderLista();
    configurarListeners();
}

window.addEventListener('DOMContentLoaded', start)