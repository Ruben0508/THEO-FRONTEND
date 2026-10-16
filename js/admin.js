
const API = 'http://localhost:3000/api/productos';
const API_AUTH = 'http://localhost:3000/api/auth';

const pantallaLogin = document.querySelector('#pantalla-login-admin');
const panelAdmin = document.querySelector('#panel-admin');
const formularioLogin = document.querySelector('#formulario-login-admin');
const usuarioLogin = document.querySelector('#usuario-admin');
const passwordLogin = document.querySelector('#password-admin');
const botonMostrarPassword = document.querySelector('#mostrar-password-admin');
const botonLogin = document.querySelector('#boton-login-admin');
const mensajeLogin = document.querySelector('#mensaje-login-admin');
const botonCerrarSesion = document.querySelector('#cerrar-sesion-admin');

const formulario = document.querySelector('#form-producto');
const lista = document.querySelector('#lista-productos');
const mensaje = document.querySelector('#mensaje');
const estadoLista = document.querySelector('#estado-lista');
const botonRecargar = document.querySelector('#recargar');

const moneda = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 2
});

let token = sessionStorage.getItem('theo_token');
let usuarioSesion = leerUsuarioSesion();

function leerUsuarioSesion() {
    try {
        return JSON.parse(sessionStorage.getItem('theo_usuario') || 'null');
    } catch {
        return null;
    }
}

function mostrarLogin(texto = '') {
    pantallaLogin.hidden = false;
    panelAdmin.hidden = true;
    mensajeLogin.textContent = texto;
    mensajeLogin.hidden = !texto;
}

function mostrarPanel() {
    pantallaLogin.hidden = true;
    panelAdmin.hidden = false;
}

function limpiarSesion() {
    token = null;
    usuarioSesion = null;
    sessionStorage.removeItem('theo_token');
    sessionStorage.removeItem('theo_usuario');
}

async function iniciarSesion(usuario, password) {
    const respuesta = await fetch(`${API_AUTH}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password })
    });

    const datos = await respuesta.json().catch(() => ({}));

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'No se pudo iniciar sesión.');
    }

    if (!datos.token || datos.usuario?.rol !== 'admin') {
        throw new Error('Esta cuenta no tiene permisos de administrador.');
    }

    token = datos.token;
    usuarioSesion = datos.usuario;

    sessionStorage.setItem('theo_token', token);
    sessionStorage.setItem('theo_usuario', JSON.stringify(usuarioSesion));
}

function cerrarSesion(mensajeError = '') {
    limpiarSesion();
    mostrarLogin(mensajeError);
}

function crearElemento(etiqueta, clase = '', texto = '') {
    const elemento = document.createElement(etiqueta);

    if (clase) elemento.className = clase;
    elemento.textContent = texto;

    return elemento;
}

async function solicitar(url, opciones = {}) {
    const metodo = (opciones.method || 'GET').toUpperCase();
    const requiereToken = metodo !== 'GET';

    const headers = {
        ...(opciones.headers || {})
    };

    if (requiereToken) {
        if (!token || usuarioSesion?.rol !== 'admin') {
            throw new Error('Inicia sesión como administrador para continuar.');
        }

        headers.Authorization = `Bearer ${token}`;
    }

    const respuesta = await fetch(url, {
        ...opciones,
        headers
    });

    const datos = await respuesta.json().catch(() => ({}));

    if (respuesta.status === 401 || respuesta.status === 403) {
        cerrarSesion('Tu sesión venció o no tienes permisos. Inicia sesión nuevamente.');
        throw new Error(datos.mensaje || 'Sesión vencida o sin permisos.');
    }

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'No se pudo completar la operación.');
    }

    return datos;
}

// INICIO DE SESIÓN

formularioLogin.addEventListener('submit', async evento => {
    evento.preventDefault();

    botonLogin.disabled = true;
    botonLogin.textContent = 'Verificando...';
    mensajeLogin.hidden = true;

    try {
        await iniciarSesion(
            usuarioLogin.value.trim(),
            passwordLogin.value
        );

        passwordLogin.value = '';
        mostrarPanel();
        await cargarProductos();
    } catch (error) {
        mensajeLogin.textContent = error.message;
        mensajeLogin.hidden = false;
    } finally {
        botonLogin.disabled = false;
        botonLogin.innerHTML = '<span>Iniciar sesión</span><span aria-hidden="true">→</span>';
    }
});

botonMostrarPassword.addEventListener('click', () => {
    const mostrar = passwordLogin.type === 'password';

    passwordLogin.type = mostrar ? 'text' : 'password';
    botonMostrarPassword.textContent = mostrar ? 'Ocultar' : 'Ver';
    botonMostrarPassword.setAttribute(
        'aria-label',
        mostrar ? 'Ocultar contraseña' : 'Mostrar contraseña'
    );
});

botonCerrarSesion.addEventListener('click', () => {
    cerrarSesion();
    formularioLogin.reset();
    usuarioLogin.focus();
});

// CARGAR PRODUCTOS

async function cargarProductos() {
    estadoLista.textContent = 'Cargando productos...';
    lista.replaceChildren();

    try {
        const productos = await solicitar(API);

        if (!Array.isArray(productos)) {
            throw new Error('El servidor devolvió una lista no válida.');
        }

        if (productos.length === 0) {
            estadoLista.textContent = 'Todavía no hay productos registrados.';
            return;
        }

        estadoLista.textContent = `Productos registrados: ${productos.length}`;

        productos.forEach(producto => {
            const tarjeta = crearElemento('article', 'admin-producto');
            const titulo = crearElemento('h3', '', producto.nombre);
            const categoria = crearElemento(
                'p',
                '',
                `Categoría: ${producto.categoria}`
            );

            const precio = crearElemento(
                'p',
                'admin-precio',
                moneda.format(Number(producto.precio))
            );

            const disponible = producto.disponible === true;

            const estado = crearElemento(
                'p',
                disponible ? 'admin-producto-estado disponible' : 'admin-producto-estado retirado',
                disponible ? 'Disponible en el menú' : 'Retirado del menú'
            );

            const acciones = crearElemento('div', 'admin-acciones');

            const botonEditar = crearElemento('button', '', 'Editar');
            botonEditar.type = 'button';
            botonEditar.addEventListener('click', () => {
                mostrarEditor(tarjeta, producto);
            });

            const botonEstado = crearElemento(
                'button',
                '',
                disponible ? 'Retirar del menú' : 'Habilitar'
            );

            botonEstado.type = 'button';
            botonEstado.addEventListener('click', () => {
                cambiarDisponibilidad(producto, botonEstado);
            });

            acciones.append(botonEditar, botonEstado);
            tarjeta.append(titulo, categoria, precio, estado, acciones);
            lista.append(tarjeta);
        });
    } catch (error) {
        estadoLista.textContent = `No se pudieron cargar los productos: ${error.message}`;
    }
}

// REGISTRAR PRODUCTO

formulario.addEventListener('submit', async evento => {
    evento.preventDefault();

    const datos = new FormData(formulario);

    const producto = {
        nombre: String(datos.get('nombre') || '').trim(),
        descripcion: String(datos.get('descripcion') || '').trim(),
        precio: Number(datos.get('precio')),
        categoria: String(datos.get('categoria') || '').trim(),
        imagen_url: String(datos.get('imagen_url') || '').trim()
    };

    if (
        !producto.nombre ||
        !producto.categoria ||
        !Number.isFinite(producto.precio) ||
        producto.precio < 0
    ) {
        mensaje.textContent = 'Revisa el nombre, la categoría y el precio.';
        return;
    }

    const boton = formulario.querySelector('[type="submit"]');
    boton.disabled = true;
    mensaje.textContent = 'Guardando producto...';

    try {
        const resultado = await solicitar(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto)
        });

        mensaje.textContent = resultado.mensaje || 'Producto registrado correctamente.';
        formulario.reset();
        await cargarProductos();
    } catch (error) {
        mensaje.textContent = `Error: ${error.message}`;
    } finally {
        boton.disabled = false;
    }
});

// EDITAR PRODUCTO SIN VENTANAS EMERGENTES

function mostrarEditor(tarjeta, producto) {
    const editorAnterior = lista.querySelector('.admin-editor');

    if (editorAnterior) editorAnterior.remove();

    const editor = crearElemento('form', 'admin-editor');
    editor.innerHTML = `
        <h4>Editar producto</h4>

        <label>Nombre
            <input name="nombre" maxlength="150" required>
        </label>

        <label>Precio (COP)
            <input name="precio" type="number" min="0" step="0.01" required>
        </label>

        <label>Categoría
            <input name="categoria" maxlength="100" required>
        </label>

        <div class="admin-editor-acciones">
            <button type="submit">Guardar cambios</button>
            <button type="button" class="admin-cancelar-edicion">Cancelar</button>
        </div>
    `;

    editor.elements.nombre.value = producto.nombre;
    editor.elements.precio.value = Number(producto.precio);
    editor.elements.categoria.value = producto.categoria;

    tarjeta.after(editor);

    editor.querySelector('.admin-cancelar-edicion').addEventListener('click', () => {
        editor.remove();
    });

    editor.addEventListener('submit', async evento => {
        evento.preventDefault();

        const botonGuardar = editor.querySelector('[type="submit"]');
        botonGuardar.disabled = true;

        const actualizado = {
            nombre: editor.elements.nombre.value.trim(),
            precio: Number(editor.elements.precio.value),
            categoria: editor.elements.categoria.value.trim()
        };

        if (
            !actualizado.nombre ||
            !actualizado.categoria ||
            !Number.isFinite(actualizado.precio) ||
            actualizado.precio < 0
        ) {
            mensaje.textContent = 'Revisa el nombre, la categoría y el precio.';
            botonGuardar.disabled = false;
            return;
        }

        try {
            const resultado = await solicitar(`${API}/${producto.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(actualizado)
            });

            mensaje.textContent = resultado.mensaje || 'Producto actualizado correctamente.';
            editor.remove();
            await cargarProductos();
        } catch (error) {
            mensaje.textContent = `Error: ${error.message}`;
            botonGuardar.disabled = false;
        }
    });
}

// CAMBIAR DISPONIBILIDAD

async function cambiarDisponibilidad(producto, boton) {
    const textoOriginal = boton.textContent;
    boton.disabled = true;
    boton.textContent = 'Actualizando...';

    try {
        const resultado = await solicitar(
            `${API}/${producto.id}/disponibilidad`,
            {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    disponible: producto.disponible !== true
                })
            }
        );

        mensaje.textContent = resultado.mensaje || 'Disponibilidad actualizada.';
        await cargarProductos();
    } catch (error) {
        mensaje.textContent = `Error: ${error.message}`;
        boton.disabled = false;
        boton.textContent = textoOriginal;
    }
}

botonRecargar.addEventListener('click', cargarProductos);

// COMPROBAR SESIÓN AL ABRIR EL PANEL

if (token && usuarioSesion?.rol === 'admin') {
    mostrarPanel();
    cargarProductos();
} else {
    limpiarSesion();
    mostrarLogin();
}
