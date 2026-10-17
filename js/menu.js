let productos = [];

const categorias = [
  { id: 'todo', nombre: 'Todo', icono: '●' }, { id: 'hamburguesas', nombre: 'Hamburguesas', icono: '🍔' }, { id: 'perros', nombre: 'Perros', icono: '🌭' }, { id: 'salchipapas', nombre: 'Salchipapas', icono: '🍟' }, { id: 'snacks', nombre: 'Snacks', icono: '🍿' }, { id: 'especiales', nombre: 'Especiales', icono: '⭐' }, { id: 'bebidas-frias', nombre: 'Bebidas frías', icono: '🥤' }, { id: 'cervezas', nombre: 'Cervezas', icono: '🍺' }, { id: 'bebidas-calientes', nombre: 'Bebidas calientes', icono: '☕' }, { id: 'adiciones', nombre: 'Adiciones', icono: '＋' }
];

const formatoPrecio = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
const listaCategorias = document.querySelector('#categorias-menu');
const listaProductos = document.querySelector('#lista-productos');
const resultadoMenu = document.querySelector('#resultado-menu');
const contadorProductos = document.querySelector('#contador-productos');
const aviso = document.querySelector('#aviso-menu');
const botonCarrito = document.querySelector('#boton-carrito');
const panelCarrito = document.querySelector('#panel-carrito');
const cerrarCarrito = document.querySelector('#cerrar-carrito');
const contenidoCarrito = document.querySelector('#contenido-carrito');
const contadorCarrito = document.querySelector('#contador-carrito');
const totalCarrito = document.querySelector('#total-carrito');
let categoriaActiva = 'todo';
const carrito = [];
const cantidadesSeleccionadas = {};
const continuarPedido = document.querySelector('#continuar-pedido');
const formularioPedido = document.querySelector('#formulario-pedido');
const cerrarFormulario = document.querySelector('#cerrar-formulario');
const formPedido = document.querySelector('#form-pedido');
const numeroWhatsApp = '573156164804';


const API_PRODUCTOS = 'https://theo-backend-1j17.onrender.com/api/productos';

async function cargarProductos() {
  try {
    const respuesta = await fetch(API_PRODUCTOS);

    if (!respuesta.ok) {
      throw new Error('No se pudieron consultar los productos');
    }

    const datos = await respuesta.json();

    productos = datos
      .filter(producto => producto.disponible)
      .map(producto => ({
        id: producto.id,
        nombre: producto.nombre,
        categoria: producto.categoria,
        precio: Number(producto.precio),
        descripcion: producto.descripcion || '',
        opciones: producto.opciones || [],
        imagen: producto.imagen_url || ''
      }));

    renderizarCategorias();
    renderizarProductos();
  } catch (error) {
    console.error('Error al cargar el menú:', error);
    aviso.textContent =
      'No se pudo cargar el menú. Verifica que el servidor esté funcionando.';
    aviso.classList.add('visible');
  }
}


const escaparHTML = (texto) => texto.replace(/[&<>'"]/g, (caracter) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[caracter]);

const renderizarCarrito = () => {
  contadorCarrito.textContent = carrito.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  if (!carrito.length) {
    contenidoCarrito.innerHTML =
      '<p class="carrito-vacio">Tu carrito está vacío.</p>';

    totalCarrito.textContent = formatoPrecio.format(0);
    return;
  }

  contenidoCarrito.innerHTML = carrito.map((item, indice) => `
    <div class="carrito-item">

      <div>
        <p class="carrito-item__nombre">
          ${escaparHTML(item.nombre)}
        </p>

        ${item.opcion
      ? `<p class="carrito-item__opcion">
                Opción: ${escaparHTML(item.opcion)}
              </p>`
      : ''
    }
      </div>

      <div class="carrito-item__acciones">

        <div class="carrito-item__cantidad-control">
          <button
            type="button"
            data-carrito-accion="restar"
            data-indice="${indice}"
          >
            −
          </button>

          <span>${item.cantidad}</span>

          <button
            type="button"
            data-carrito-accion="sumar"
            data-indice="${indice}"
          >
            +
          </button>
        </div>

        <strong class="carrito-item__precio">
          ${formatoPrecio.format(item.precio * item.cantidad)}
        </strong>

        <button
          type="button"
          class="carrito-item__eliminar"
          data-carrito-accion="eliminar"
          data-indice="${indice}"
          aria-label="Eliminar producto"
        >
          🗑️
        </button>

      </div>

    </div>
  `).join('');

  const total = carrito.reduce(
    (suma, item) => suma + item.precio * item.cantidad,
    0
  );

  totalCarrito.textContent = formatoPrecio.format(total);
};

const renderizarCategorias = () => {
  listaCategorias.innerHTML = categorias.map((categoria) => `
    <button class="filtro ${categoria.id === categoriaActiva ? 'activo' : ''}" type="button" data-categoria="${categoria.id}">
      <span class="filtro__icono" aria-hidden="true">${categoria.icono}</span>${categoria.nombre}
    </button>`).join('');
};

const renderizarProductos = () => {
  const productosFiltrados = categoriaActiva === 'todo' ? productos : productos.filter((producto) => producto.categoria === categoriaActiva);
  const categoria = categorias.find((item) => item.id === categoriaActiva);
  resultadoMenu.textContent = categoriaActiva === 'todo' ? 'Todos los productos' : categoria.nombre;
  contadorProductos.textContent = `${productosFiltrados.length} productos`;
  listaProductos.innerHTML = productosFiltrados.length ? productosFiltrados.map((producto) => `
    <article class="producto">
      <div class="producto__imagen">${producto.imagen ? `<img src="${escaparHTML(producto.imagen)}" alt="${escaparHTML(producto.nombre)}" />` : ''}</div>
      <div class="producto__cuerpo">
        <p class="producto__categoria">${escaparHTML(categorias.find((item) => item.id === producto.categoria)?.nombre || producto.categoria)}</p>
        <h2>${escaparHTML(producto.nombre)}</h2>
        <p class="producto__descripcion">${escaparHTML(producto.descripcion)}</p>
        <div class="producto__configuracion">
          ${Array.isArray(producto.opciones) && producto.opciones.length > 0 ? `
  <label class="producto__opciones" for="opcion-${producto.id}">
    Elige tu sabor
    <select id="opcion-${producto.id}" data-opcion="${producto.id}">
      ${producto.opciones.map(opcion => `
        <option value="${escaparHTML(opcion)}">${escaparHTML(opcion)}</option>
      `).join('')}
    </select>
  </label>
` : ''}
          <div class="producto__cantidad"><span>Cantidad</span><div class="cantidad-control"><button type="button" data-accion-cantidad="restar" aria-label="Disminuir cantidad">−</button><input type="number" min="1" value="${cantidadesSeleccionadas[producto.id] || 1}" data-cantidad="${producto.id}" aria-label="Cantidad de ${escaparHTML(producto.nombre)}" /><button type="button" data-accion-cantidad="sumar" aria-label="Aumentar cantidad">+</button></div></div>
        </div>
        <div class="producto__pie"><span class="producto__precio">${formatoPrecio.format(producto.precio)}</span><button class="producto__agregar" type="button" data-producto="${producto.id}">Agregar</button></div>
      </div>
    </article>`).join('') : '<p class="sin-productos">No hay productos para esta categoría.</p>';
};

listaCategorias.addEventListener('click', (evento) => {
  const boton = evento.target.closest('[data-categoria]');
  if (!boton) return;
  categoriaActiva = boton.dataset.categoria;
  renderizarCategorias();
  renderizarProductos();
});

listaProductos.addEventListener('click', (evento) => {

  // Botones + y -
  const controlCantidad = evento.target.closest('[data-accion-cantidad]');

  if (controlCantidad) {
    const tarjeta = controlCantidad.closest('.producto');
    const campoCantidad = tarjeta.querySelector('[data-cantidad]');

    const cantidadActual = Math.max(
      1,
      Number(campoCantidad.value) || 1
    );

    const nuevaCantidad =
      controlCantidad.dataset.accionCantidad === 'sumar'
        ? cantidadActual + 1
        : Math.max(1, cantidadActual - 1);

    campoCantidad.value = nuevaCantidad;

    cantidadesSeleccionadas[campoCantidad.dataset.cantidad] = nuevaCantidad;

    return;
  }


  // Botón Agregar
  const boton = evento.target.closest('[data-producto]');

  if (!boton) return;

  const producto = productos.find(
    (item) => item.id === Number(boton.dataset.producto)
  );

  if (!producto) return;

  const tarjeta = boton.closest('.producto');

  const campoCantidad = tarjeta.querySelector('[data-cantidad]');

  const cantidad = Math.max(
    1,
    Number(campoCantidad.value) || 1
  );

  const campoOpcion = tarjeta.querySelector('[data-opcion]');

  const opcion = campoOpcion ? campoOpcion.value : '';


  // Buscar si ya existe el mismo producto
  // con la misma opción
  const itemExistente = carrito.find(
    (item) =>
      item.id === producto.id &&
      item.opcion === opcion
  );


  // Si ya existe, aumentar cantidad
  if (itemExistente) {

    itemExistente.cantidad += cantidad;

  } else {

    // Si no existe, agregarlo
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: cantidad,
      opcion: opcion
    });

  }


  // Actualizar carrito
  renderizarCarrito();


  // Mostrar aviso
  aviso.textContent =
    `${cantidad} x ${producto.nombre} agregado al carrito.`;

  aviso.classList.add('visible');


  window.setTimeout(() => {
    aviso.classList.remove('visible');
  }, 2000);

});

listaProductos.addEventListener('change', (evento) => {
  const campoCantidad = evento.target.closest('[data-cantidad]');
  if (!campoCantidad) return;
  const cantidadValida = Math.max(1, Number(campoCantidad.value) || 1);
  campoCantidad.value = cantidadValida;
  cantidadesSeleccionadas[campoCantidad.dataset.cantidad] = cantidadValida;
});

contenidoCarrito.addEventListener('click', (evento) => {
  const boton = evento.target.closest('[data-carrito-accion]');

  if (!boton) return;

  const indice = Number(boton.dataset.indice);
  const accion = boton.dataset.carritoAccion;

  if (!carrito[indice]) return;

  if (accion === 'sumar') {
    carrito[indice].cantidad += 1;
  }

  if (accion === 'restar') {
    carrito[indice].cantidad -= 1;

    if (carrito[indice].cantidad <= 0) {
      carrito.splice(indice, 1);
    }
  }

  if (accion === 'eliminar') {
    carrito.splice(indice, 1);
  }

  renderizarCarrito();
});

botonCarrito.addEventListener('click', () => {
  panelCarrito.classList.add('abierto');
  panelCarrito.setAttribute('aria-hidden', 'false');
});

cerrarCarrito.addEventListener('click', () => {
  panelCarrito.classList.remove('abierto');
  panelCarrito.setAttribute('aria-hidden', 'true');
});

continuarPedido.addEventListener('click', () => {
  if (!carrito.length) {
    aviso.textContent = 'Agrega al menos un producto al carrito.';
    aviso.classList.add('visible');

    window.setTimeout(() => {
      aviso.classList.remove('visible');
    }, 2000);

    return;
  }

  panelCarrito.classList.remove('abierto');
  panelCarrito.setAttribute('aria-hidden', 'true');

  formularioPedido.classList.add('abierto');
  formularioPedido.setAttribute('aria-hidden', 'false');
});

cerrarFormulario.addEventListener('click', () => {
  formularioPedido.classList.remove('abierto');
  formularioPedido.setAttribute('aria-hidden', 'true');
});


formPedido.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  if (!carrito.length) {
    aviso.textContent = 'Agrega al menos un producto al carrito.';
    aviso.classList.add('visible');
    return;
  }

  const nombre = document.querySelector('#nombre-cliente').value.trim();
  const direccion = document.querySelector('#direccion-cliente').value.trim();
  const telefono = document.querySelector('#telefono-cliente').value.trim();
  const metodoPago = document.querySelector('#metodo-pago').value;
  const nota = document.querySelector('#nota-pedido').value.trim();

  // Abrir una pestaña para WhatsApp antes de esperar la respuesta
  const ventanaWhatsApp = window.open('about:blank', '_blank');

  try {
    aviso.textContent = 'Registrando tu pedido...';
    aviso.classList.add('visible');

    // Guardar el pedido en PostgreSQL a través del backend
    const respuesta = await fetch('https://theo-backend-1j17.onrender.com/api/pedidos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cliente_nombre: nombre,
        cliente_direccion: direccion,
        cliente_telefono: telefono,
        metodo_pago: metodoPago,
        nota: nota,
        tipo_pedido: 'Domicilio',
        productos: carrito.map(item => ({
          producto_id: item.id,
          cantidad: item.cantidad,
          opcion: item.opcion || ''
        }))
      })
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(resultado.mensaje || 'No se pudo registrar el pedido');
    }

    const productosPedido = carrito.map(item => {
      const opcion = item.opcion ? ` - ${item.opcion}` : '';
      const subtotal = item.precio * item.cantidad;

      return `${item.cantidad}x ${item.nombre}${opcion} - ${formatoPrecio.format(subtotal)}`;
    }).join('\n');

    const total = carrito.reduce(
      (suma, item) => suma + item.precio * item.cantidad,
      0
    );

    console.log('Prueba de emojis:', '🍔 🧾 👤 📱 📍 🛒 💰 💳 📝');

    const mensaje = `
\u{1F354} *NUEVO PEDIDO - THEO FOOD AND DRINKS*

\u{1F9FE} *Pedido número:* ${resultado.pedido.id}
\u{1F464} *Cliente:* ${nombre}
\u{1F4F1} *Teléfono:* ${telefono}
\u{1F4CD} *Dirección:* ${direccion}

\u{1F6D2} *PEDIDO:*
${productosPedido}

\u{1F4B0} *TOTAL:* ${formatoPrecio.format(total)}
\u{1F4B3} *Método de pago:* ${metodoPago}
\u{1F4DD} *Nota:*
${nota || 'Sin nota'}
`;

    const urlWhatsApp =
      `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    if (ventanaWhatsApp) {
      ventanaWhatsApp.location.href = urlWhatsApp;
    } else {
      window.location.href = urlWhatsApp;
    }

    aviso.textContent = `¡Pedido #${resultado.pedido.id} registrado correctamente!`;
    aviso.classList.add('visible');

  } catch (error) {
    console.error('Error al registrar el pedido:', error);

    if (ventanaWhatsApp) {
      ventanaWhatsApp.close();
    }

    aviso.textContent =
      error.message || 'No se pudo registrar el pedido. Inténtalo nuevamente.';
    aviso.classList.add('visible');
  }
});



renderizarCarrito();
renderizarCategorias();
cargarProductos();

const parametrosURL = new URLSearchParams(window.location.search);
const modoLectura = parametrosURL.get('modo') === 'ver';

if (modoLectura) {
  document.body.classList.add('modo-lectura');

  const tituloMenu = document.querySelector('#titulo-menu');

  if (tituloMenu) {
    tituloMenu.textContent = 'NUESTRO MENÚ';
  }
}
