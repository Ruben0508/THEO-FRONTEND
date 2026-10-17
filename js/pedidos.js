
const API_PEDIDOS = 'https://theo-backend-1j17.onrender.com/api/pedidos';
const API_AUTH = 'https://theo-backend-1j17.onrender.com/api/auth';

const pantallaLogin = document.querySelector('#pantalla-login');
const panelPedidos = document.querySelector('#panel-pedidos');
const formularioLogin = document.querySelector('#formulario-login-pedidos');
const campoUsuario = document.querySelector('#usuario-login');
const campoPassword = document.querySelector('#password-login');
const botonLogin = document.querySelector('#boton-login');
const mensajeLogin = document.querySelector('#mensaje-login');
const botonMostrarPassword = document.querySelector('#mostrar-password');
const botonCerrarSesion = document.querySelector('#cerrar-sesion-pedidos');

const listaPedidos = document.querySelector('#lista-pedidos');
const mensajePedidos = document.querySelector('#mensaje-pedidos');
const buscarPedido = document.querySelector('#buscar-pedido');
const filtroEstado = document.querySelector('#filtro-estado');

const formatoPrecio = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
});

let tokenPedidos = sessionStorage.getItem('theo_token');
let usuarioPedidos = null;
let pedidos = [];

try {
    usuarioPedidos = JSON.parse(
        sessionStorage.getItem('theo_usuario') || 'null'
    );
} catch {
    sessionStorage.removeItem('theo_usuario');
}

const escaparHTML = valor => String(valor ?? '').replace(
    /[&<>'"]/g,
    caracter => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#039;',
        '"': '&quot;'
    })[caracter]
);

function mostrarLogin() {
    pantallaLogin.hidden = false;
    panelPedidos.hidden = true;
}

function mostrarPanel() {
    pantallaLogin.hidden = true;
    panelPedidos.hidden = false;
}

function mostrarMensajeLogin(mensaje) {
    mensajeLogin.textContent = mensaje;
    mensajeLogin.hidden = !mensaje;
}

function guardarSesion(datos) {
    tokenPedidos = datos.token;
    usuarioPedidos = datos.usuario;

    sessionStorage.setItem('theo_token', tokenPedidos);
    sessionStorage.setItem(
        'theo_usuario',
        JSON.stringify(usuarioPedidos)
    );
}

function cerrarSesionPedidos() {
    tokenPedidos = null;
    usuarioPedidos = null;
    pedidos = [];

    sessionStorage.removeItem('theo_token');
    sessionStorage.removeItem('theo_usuario');

    formularioLogin.reset();
    mensajeLogin.hidden = true;
    listaPedidos.innerHTML = '';
    mostrarLogin();
}

async function iniciarSesion(usuario, password) {
    const respuesta = await fetch(`${API_AUTH}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario, password })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            datos.mensaje || 'No se pudo iniciar sesión. Revisa tus datos.'
        );
    }

    if (!datos.usuario || datos.usuario.rol !== 'admin') {
        throw new Error(
            'Esta sección es exclusiva del administrador.'
        );
    }

    if (!datos.token) {
        throw new Error('El servidor no entregó un token de acceso.');
    }

    guardarSesion(datos);
}

formularioLogin.addEventListener('submit', async evento => {
    evento.preventDefault();

    const usuario = campoUsuario.value.trim();
    const password = campoPassword.value;

    if (!usuario || !password) {
        mostrarMensajeLogin('Ingresa tu usuario y contraseña.');
        return;
    }

    botonLogin.disabled = true;
    botonLogin.querySelector('span').textContent = 'Verificando...';
    mostrarMensajeLogin('');

    try {
        await iniciarSesion(usuario, password);

        campoPassword.value = '';
        mostrarPanel();

        const respuesta = await cargarPedidos();

        if (!respuesta) {
            mostrarLogin();
            campoUsuario.focus();
        }
    } catch (error) {
        cerrarSesionPedidos();
        mostrarMensajeLogin(
            error.message || 'No se pudo conectar con el servidor.'
        );
        campoUsuario.focus();
    } finally {
        botonLogin.disabled = false;
        botonLogin.querySelector('span').textContent = 'Iniciar sesión';
    }
});

botonMostrarPassword.addEventListener('click', () => {
    const mostrar = campoPassword.type === 'password';

    campoPassword.type = mostrar ? 'text' : 'password';
    botonMostrarPassword.textContent = mostrar ? 'Ocultar' : 'Ver';
    botonMostrarPassword.setAttribute(
        'aria-label',
        mostrar ? 'Ocultar contraseña' : 'Mostrar contraseña'
    );
});

botonCerrarSesion.addEventListener('click', () => {
    cerrarSesionPedidos();
    mostrarMensajeLogin('Has cerrado tu sesión correctamente.');
    campoUsuario.focus();
});

async function cargarPedidos() {
    mensajePedidos.textContent = 'Cargando pedidos...';

    try {
        const respuesta = await fetch(API_PEDIDOS, {
            headers: {
                Authorization: `Bearer ${tokenPedidos}`
            }
        });

        const datos = await respuesta.json();

        if (respuesta.status === 401 || respuesta.status === 403) {
            cerrarSesionPedidos();
            mostrarMensajeLogin(
                'Tu sesión venció o no tienes permisos. Inicia sesión nuevamente.'
            );
            return false;
        }

        if (!respuesta.ok) {
            throw new Error(
                datos.mensaje || 'No se pudieron consultar los pedidos.'
            );
        }

        pedidos = datos;

        document.querySelector('#total-pedidos').textContent =
            pedidos.length;

        document.querySelector('#pedidos-pendientes').textContent =
            pedidos.filter(p => p.estado === 'Pendiente').length;

        document.querySelector('#pedidos-preparacion').textContent =
            pedidos.filter(p => p.estado === 'En preparación').length;

        document.querySelector('#pedidos-entregados').textContent =
            pedidos.filter(p => p.estado === 'Entregado').length;

        renderizarPedidos();
        mensajePedidos.textContent = '';

        return true;
    } catch (error) {
        console.error('Error al cargar pedidos:', error);
        mensajePedidos.textContent =
            'No pudimos cargar los pedidos. Comprueba que el servidor esté activo.';
        listaPedidos.innerHTML = '';
        return false;
    }
}

function renderizarPedidos() {
    const busqueda = buscarPedido.value.trim().toLowerCase();
    const estadoSeleccionado = filtroEstado.value;

    const filtrados = pedidos.filter(pedido => {
        const coincideBusqueda =
            String(pedido.id).includes(busqueda) ||
            (pedido.cliente_nombre || '').toLowerCase().includes(busqueda) ||
            (pedido.cliente_telefono || '').toLowerCase().includes(busqueda);

        const coincideEstado =
            !estadoSeleccionado || pedido.estado === estadoSeleccionado;

        return coincideBusqueda && coincideEstado;
    });

    if (!filtrados.length) {
        listaPedidos.innerHTML =
            '<p class="estado-vacio">No hay pedidos que coincidan con la búsqueda.</p>';
        return;
    }

    listaPedidos.innerHTML = filtrados.map(pedido => `
        <article class="pedido-card">
            <div class="pedido-card__cabecera">
                <h3>Pedido #${escaparHTML(pedido.id)}</h3>
                <span>${escaparHTML(pedido.estado)}</span>
            </div>

            <div class="pedido-card__cliente">
                <div><strong>Cliente:</strong> ${escaparHTML(pedido.cliente_nombre)}</div>
                <div><strong>Teléfono:</strong> ${escaparHTML(pedido.cliente_telefono || 'No indicado')}</div>
                <div><strong>Dirección:</strong> ${escaparHTML(pedido.cliente_direccion || 'No indicada')}</div>
                <div><strong>Pago:</strong> ${escaparHTML(pedido.metodo_pago)}</div>
                <div><strong>Fecha:</strong> ${escaparHTML(
        pedido.creado_en
            ? new Date(pedido.creado_en).toLocaleString('es-CO')
            : 'No disponible'
    )}</div>
                <div><strong>Nota:</strong> ${escaparHTML(pedido.nota || 'Sin nota')}</div>
            </div>

            <div class="pedido-card__productos">
                ${(pedido.productos || []).map(producto => `
                    <div class="pedido-producto">
                        <span>
                            ${escaparHTML(producto.cantidad)} x
                            ${escaparHTML(producto.nombre)}
                            ${producto.opcion
            ? ` — ${escaparHTML(producto.opcion)}`
            : ''}
                        </span>
                        <strong>${formatoPrecio.format(Number(producto.subtotal) || 0)}</strong>
                    </div>
                `).join('')}
            </div>

            <p class="pedido-total">
                Total: <strong>${formatoPrecio.format(Number(pedido.total) || 0)}</strong>
            </p>

            <label>
                Estado del pedido
                <select
                    class="pedido-estado"
                    data-pedido-id="${escaparHTML(pedido.id)}"
                    ${pedido.estado === 'Cancelado' ? 'disabled' : ''}
                >
                    ${[
            'Pendiente',
            'En preparación',
            'Listo',
            'En camino',
            'Entregado',
            'Cancelado'
        ].map(estado => `
                        <option
                            value="${estado}"
                            ${pedido.estado === estado ? 'selected' : ''}
                        >${estado}</option>
                    `).join('')}
                </select>
            </label>
        </article>
    `).join('');
}

listaPedidos.addEventListener('change', async evento => {
    const selector = evento.target.closest('[data-pedido-id]');

    if (!selector) return;

    const id = selector.dataset.pedidoId;
    const estadoAnterior = pedidos.find(
        p => String(p.id) === id
    )?.estado;
    const estadoNuevo = selector.value;

    selector.disabled = true;
    mensajePedidos.textContent = `Actualizando pedido #${id}...`;

    try {
        const respuesta = await fetch(
            `${API_PEDIDOS}/${encodeURIComponent(id)}/estado`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${tokenPedidos}`
                },
                body: JSON.stringify({ estado: estadoNuevo })
            }
        );

        const resultado = await respuesta.json();

        if (respuesta.status === 401 || respuesta.status === 403) {
            cerrarSesionPedidos();
            mostrarMensajeLogin(
                'Tu sesión venció o no tienes permisos. Inicia sesión nuevamente.'
            );
            return;
        }

        if (!respuesta.ok) {
            throw new Error(
                resultado.mensaje || 'No se pudo actualizar el estado.'
            );
        }

        mensajePedidos.textContent = 'Estado actualizado correctamente.';
        await cargarPedidos();
    } catch (error) {
        console.error('Error al actualizar pedido:', error);
        mensajePedidos.textContent = error.message;
        selector.value = estadoAnterior || 'Pendiente';
        selector.disabled = false;
    }
});

buscarPedido.addEventListener('input', renderizarPedidos);
filtroEstado.addEventListener('change', renderizarPedidos);

document.querySelector('#actualizar-pedidos').addEventListener(
    'click',
    cargarPedidos
);

(async () => {
    mostrarLogin();

    if (tokenPedidos && usuarioPedidos?.rol === 'admin') {
        mostrarPanel();

        const sesionValida = await cargarPedidos();

        if (!sesionValida) {
            mostrarLogin();
        }
    } else {
        cerrarSesionPedidos();
        campoUsuario.focus();
    }
})();
