// ===== MÓDULO DE MESEROS THEO =====

const API_PRODUCTOS = 'https://theo-backend-1j17.onrender.com/api/productos';
const API_PEDIDOS = 'https://theo-backend-1j17.onrender.com/api/pedidos';

const API_AUTH = 'https://theo-backend-1j17.onrender.com/api/auth';

let tokenMesero = sessionStorage.getItem('theo_mesero_token');
let usuarioMesero = JSON.parse(
    sessionStorage.getItem('theo_mesero_usuario') || 'null'
);

async function iniciarSesionMesero() {
    const usuario = prompt('Usuario del mesero:');
    if (usuario === null) return false;

    const password = prompt('Contraseña del mesero:');
    if (password === null) return false;

    const respuesta = await fetch(`${API_AUTH}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'No se pudo iniciar sesión');
    }

    if (datos.usuario.rol !== 'mesero') {
        throw new Error('Esta cuenta no tiene permisos de mesero');
    }

    tokenMesero = datos.token;
    usuarioMesero = datos.usuario;

    sessionStorage.setItem('theo_mesero_token', tokenMesero);
    sessionStorage.setItem(
        'theo_mesero_usuario',
        JSON.stringify(usuarioMesero)
    );

    return true;
}

async function asegurarSesionMesero() {
    if (tokenMesero && usuarioMesero?.rol === 'mesero') {
        return true;
    }

    tokenMesero = null;
    usuarioMesero = null;

    sessionStorage.removeItem('theo_mesero_token');
    sessionStorage.removeItem('theo_mesero_usuario');

    return iniciarSesionMesero();
}

let productos = [];
let comanda = [];

const listaProductos = document.getElementById('lista-productos');
const listaComanda = document.getElementById('lista-comanda');
const totalComanda = document.getElementById('total-comanda');
const mensaje = document.getElementById('mensaje-mesero');
const botonRegistrar = document.getElementById('crear-pedido');

const formatoPrecio = valor =>
    new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(Number(valor) || 0);

function escaparHTML(valor) {
    return String(valor ?? '').replace(/[&<>"']/g, caracter => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[caracter]);
}

function mostrarMensaje(texto, tipo = '') {
    mensaje.textContent = texto;
    mensaje.className = tipo;
}

// Cargar productos disponibles desde PostgreSQL
async function cargarProductos() {
    listaProductos.innerHTML = '<p>Cargando productos...</p>';

    try {
        const respuesta = await fetch(API_PRODUCTOS);

        if (!respuesta.ok) {
            throw new Error('No se pudieron consultar los productos.');
        }

        const datos = await respuesta.json();
        const lista = Array.isArray(datos) ? datos : datos.productos;

        if (!Array.isArray(lista)) {
            throw new Error('La respuesta de productos no tiene el formato esperado.');
        }

        productos = lista
            .filter(p => p.disponible === true || p.disponible === 'true')
            .map(p => ({
                id: Number(p.id),
                nombre: p.nombre,
                precio: Number(p.precio),
                categoria: p.categoria || 'Otros',
                opciones: Array.isArray(p.opciones) ? p.opciones : []
            }));

        cargarCategorias();
        renderizarProductos();
    } catch (error) {
        console.error('Error al cargar productos:', error);
        listaProductos.innerHTML =
            '<p>No fue posible cargar el menú. Verifica que el backend esté activo.</p>';
    }
}

// Crear las categorías automáticamente
function cargarCategorias() {
    const selector = document.getElementById('filtro-categoria');
    const categoriaActual = selector.value;

    const categorias = [...new Set(
        productos.map(p => p.categoria).filter(Boolean)
    )].sort();

    selector.innerHTML = '<option value="">Todas las categorías</option>';

    categorias.forEach(categoria => {
        const opcion = document.createElement('option');
        opcion.value = categoria;
        opcion.textContent = categoria.replace(/-/g, ' ');
        selector.appendChild(opcion);
    });

    if (categorias.includes(categoriaActual)) {
        selector.value = categoriaActual;
    }
}

// Mostrar productos y sus opciones
function renderizarProductos() {
    const busqueda = document.getElementById('buscar-producto')
        .value.trim().toLowerCase();

    const categoria = document.getElementById('filtro-categoria').value;

    const filtrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(busqueda) &&
        (!categoria || producto.categoria === categoria)
    );

    if (!filtrados.length) {
        listaProductos.innerHTML =
            '<p class="productos-vacios">No hay productos para mostrar.</p>';
        return;
    }

    listaProductos.innerHTML = filtrados.map(producto => {
        const selectorOpciones = producto.opciones.length
            ? `
                <label class="producto-opcion-label"
                    for="opcion-${producto.id}">
                    Sabor / opción
                </label>
                <select id="opcion-${producto.id}" class="producto-opcion">
                    <option value="">Seleccionar opción</option>
                    ${producto.opciones.map(opcion => `
                        <option value="${escaparHTML(opcion)}">
                            ${escaparHTML(opcion)}
                        </option>
                    `).join('')}
                </select>
            `
            : '';

        return `
            <article class="producto-mesero">
                <div class="producto-cabecera">
                    <span class="producto-etiqueta">THEO MENU</span>
                    <span class="producto-categoria">
                        ${escaparHTML(producto.categoria.replace(/-/g, ' '))}
                    </span>
                </div>

                <h3>${escaparHTML(producto.nombre)}</h3>

                <div class="producto-pie">
                    <span class="producto-precio">
                        ${formatoPrecio(producto.precio)}
                    </span>
                </div>

                ${selectorOpciones}

                <button type="button"
                    class="producto-agregar"
                    data-agregar="${producto.id}">
                    <span>+</span> Agregar a comanda
                </button>
            </article>
        `;
    }).join('');
}

// Agregar un producto a la comanda
function agregarProducto(id) {
    const producto = productos.find(p => p.id === id);

    if (!producto) return;

    let opcion = '';

    if (producto.opciones && producto.opciones.length > 0) {
        const selector = document.getElementById(`opcion-${id}`);

        if (!selector) {
            mostrarMensaje(
                `No se encontró el selector de ${producto.nombre}.`,
                'mensaje-error'
            );
            return;
        }

        opcion = selector.value.trim();

        if (!opcion) {
            mostrarMensaje(
                `Selecciona una opción para ${producto.nombre}.`,
                'mensaje-error'
            );
            return;
        }
    }

    const existente = comanda.find(item =>
        item.id === id && item.opcion === opcion
    );

    if (existente) {
        existente.cantidad++;
    } else {
        comanda.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            opcion,
            cantidad: 1
        });
    }

    mostrarMensaje('');
    renderizarComanda();
}

// Mostrar la comanda y calcular el total
function renderizarComanda() {
    if (!comanda.length) {
        listaComanda.innerHTML = '<p>Aún no has agregado productos.</p>';
    } else {
        listaComanda.innerHTML = comanda.map((item, indice) => `
            <div class="item-comanda">
                <div class="item-comanda-info">
                    <strong>${escaparHTML(item.nombre)}</strong>

                    ${item.opcion
                ? `<small>Opción: ${escaparHTML(item.opcion)}</small>`
                : ''}

                    <small>${formatoPrecio(item.precio)} por unidad</small>

                    <div class="item-comanda-controles">
                        <button type="button"
                            data-accion="menos"
                            data-indice="${indice}"
                            aria-label="Disminuir cantidad">−</button>

                        <span>${item.cantidad}</span>

                        <button type="button"
                            data-accion="mas"
                            data-indice="${indice}"
                            aria-label="Aumentar cantidad">+</button>

                        <button type="button"
                            class="eliminar-item"
                            data-accion="eliminar"
                            data-indice="${indice}">
                            Eliminar
                        </button>
                    </div>
                </div>

                <span class="item-comanda-subtotal">
                    ${formatoPrecio(item.precio * item.cantidad)}
                </span>
            </div>
        `).join('');
    }

    const total = comanda.reduce(
        (suma, item) => suma + item.precio * item.cantidad,
        0
    );

    totalComanda.textContent = formatoPrecio(total);
    botonRegistrar.disabled = comanda.length === 0;
}

const total = comanda.reduce(
    (suma, item) => suma + item.precio * item.cantidad, 0
);

totalComanda.textContent = formatoPrecio(total);
botonRegistrar.disabled = comanda.length === 0;

// Controlar cantidades y eliminar productos
listaComanda.addEventListener('click', evento => {
    const boton = evento.target.closest('button[data-accion]');
    if (!boton) return;

    const indice = Number(boton.dataset.indice);
    const item = comanda[indice];

    if (!item) return;

    switch (boton.dataset.accion) {
        case 'mas':
            item.cantidad++;
            break;
        case 'menos':
            item.cantidad--;
            if (item.cantidad <= 0) comanda.splice(indice, 1);
            break;
        case 'eliminar':
            comanda.splice(indice, 1);
            break;
    }

    renderizarComanda();
});

// Agregar productos desde las tarjetas
listaProductos.addEventListener('click', evento => {
    const boton = evento.target.closest('button[data-agregar]');
    if (!boton) return;

    agregarProducto(Number(boton.dataset.agregar));
});

// Buscar y filtrar
document.getElementById('buscar-producto')
    .addEventListener('input', renderizarProductos);

document.getElementById('filtro-categoria')
    .addEventListener('change', renderizarProductos);

// Vaciar la comanda
document.getElementById('vaciar-comanda').addEventListener('click', () => {
    if (!comanda.length) return;

    if (confirm('¿Deseas vaciar toda la comanda?')) {
        comanda = [];
        renderizarComanda();
        mostrarMensaje('');
    }
});

// Registrar el pedido en el backend
botonRegistrar.addEventListener('click', async () => {
    const numeroMesa = Number(document.getElementById('numero-mesa').value);
    const nombreIngresado = document.getElementById('nombre-cliente')
        .value.trim();
    const metodoPago = document.getElementById('metodo-pago').value;

    if (!Number.isInteger(numeroMesa) || numeroMesa < 1) {
        mostrarMensaje('Ingresa un número de mesa válido.', 'mensaje-error');
        return;
    }

    if (!comanda.length) {
        mostrarMensaje('Agrega al menos un producto.', 'mensaje-error');
        return;
    }

    const pedido = {
        cliente_nombre: nombreIngresado || `Mesa ${numeroMesa} `,
        cliente_direccion: '',
        metodo_pago: metodoPago,
        tipo_pedido: 'Mesa',
        numero_mesa: numeroMesa,
        productos: comanda.map(item => ({
            producto_id: item.id,
            cantidad: item.cantidad,
            opcion: item.opcion
        }))
    };

    botonRegistrar.disabled = true;
    botonRegistrar.textContent = 'Registrando...';
    mostrarMensaje('Guardando pedido...');

    try {
        await asegurarSesionMesero();

        const respuesta = await fetch(API_PEDIDOS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tokenMesero}`
            },
            body: JSON.stringify(pedido)
        });

        const resultado = await respuesta.json().catch(() => ({}));

        if (!respuesta.ok) {
            throw new Error(
                resultado.error || resultado.mensaje ||
                'El servidor no pudo registrar el pedido.'
            );
        }

        const mesaRegistrada = numeroMesa;

        comanda = [];
        renderizarComanda();

        document.getElementById('numero-mesa').value = '';
        document.getElementById('nombre-cliente').value = '';

        mostrarMensaje(
            `¡Pedido de la mesa ${mesaRegistrada} registrado correctamente! Ya puedes consultarlo en Ver pedidos.`,
            'mensaje-exito'
        );
    } catch (error) {
        console.error('Error al registrar pedido:', error);
        mostrarMensaje(error.message, 'mensaje-error');
    } finally {
        botonRegistrar.textContent = 'Registrar pedido';
        botonRegistrar.disabled = comanda.length === 0;
    }
});

// Inicio
renderizarComanda();
cargarProductos();