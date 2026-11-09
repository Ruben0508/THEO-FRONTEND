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
// Elementos para seleccionar el tipo de pedido
const seleccionTipoPedido = document.querySelector('#seleccion-tipo-pedido');
const datosPedido = document.querySelector('#datos-pedido');
const camposDomicilio = document.querySelector('#campos-domicilio');
const camposExtraDomicilio = document.querySelector('#campos-extra-domicilio');
const botonesTipoPedido = document.querySelectorAll('[data-tipo-pedido]');
const volverTipoPedido = document.querySelector('#volver-tipo-pedido');
const direccionCliente = document.querySelector('#direccion-cliente');
const metodoPago = document.querySelector('#metodo-pago');
let tipoPedidoSeleccionado = '';
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
        <textarea
         class="carrito-item__observacion"
         data-observacion="${indice}"
         maxlength="300"
         rows="2"
         placeholder="¿Alguna indicación para este producto?"
        >${escaparHTML(item.observacion || '')}</textarea>      

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
      opcion: opcion,
      observacion: ''
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

// Guardar observaciones individuales de cada producto
contenidoCarrito.addEventListener('input', (evento) => {
  if (!evento.target.classList.contains('carrito-item__observacion')) {
    return;
  }

  const indice = Number(evento.target.dataset.observacion);

  if (carrito[indice]) {
    carrito[indice].observacion = evento.target.value;
  }
});

botonCarrito.addEventListener('click', () => {
  panelCarrito.classList.add('abierto');
  panelCarrito.setAttribute('aria-hidden', 'false');
});

cerrarCarrito.addEventListener('click', () => {
  panelCarrito.classList.remove('abierto');
  panelCarrito.setAttribute('aria-hidden', 'true');
});

// Abrir selección del tipo de pedido
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

  seleccionTipoPedido.hidden = false;
  datosPedido.hidden = true;

  formularioPedido.classList.add('abierto');
  formularioPedido.setAttribute('aria-hidden', 'false');
});


// Elegir domicilio o recoger
botonesTipoPedido.forEach(boton => {
  boton.addEventListener('click', () => {
    tipoPedidoSeleccionado = boton.dataset.tipoPedido;

    seleccionTipoPedido.hidden = true;
    datosPedido.hidden = false;

    const esDomicilio = tipoPedidoSeleccionado === 'Domicilio';

    camposDomicilio.hidden = !esDomicilio;
    camposExtraDomicilio.hidden = !esDomicilio;

    direccionCliente.required = esDomicilio;
    metodoPago.required = esDomicilio;

    if (!esDomicilio) {
      direccionCliente.value = '';
      metodoPago.value = '';
    }
  });
});


// Volver a seleccionar la modalidad
volverTipoPedido.addEventListener('click', () => {
  datosPedido.hidden = true;
  seleccionTipoPedido.hidden = false;
});

cerrarFormulario.addEventListener('click', () => {
  formularioPedido.classList.remove('abierto');
  formularioPedido.setAttribute('aria-hidden', 'true');

  seleccionTipoPedido.hidden = false;
  datosPedido.hidden = true;

  tipoPedidoSeleccionado = '';
}); cerrarFormulario.addEventListener('click', () => {
  formularioPedido.classList.remove('abierto');
  formularioPedido.setAttribute('aria-hidden', 'true');

  seleccionTipoPedido.hidden = false;
  datosPedido.hidden = true;

  tipoPedidoSeleccionado = '';
});


formPedido.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  if (!carrito.length) {
    aviso.textContent = 'Agrega al menos un producto al carrito.';
    aviso.classList.add('visible');
    return;
  }

  if (!tipoPedidoSeleccionado) {
    aviso.textContent = 'Selecciona cómo deseas recibir tu pedido.';
    aviso.classList.add('visible');
    return;
  }

  const nombre = document.querySelector('#nombre-cliente').value.trim();
  const direccion = direccionCliente.value.trim();
  const telefono = document.querySelector('#telefono-cliente').value.trim();

  const pagoSeleccionado = metodoPago.value;

  const esDomicilio = tipoPedidoSeleccionado === 'Domicilio';

  // Abrir una ventana inmediatamente para evitar bloqueos del navegador
  const ventanaWhatsApp = window.open('', '_blank');
  try {
    aviso.textContent = 'Registrando tu pedido...';
    aviso.classList.add('visible');

    const datosPedido = {
      cliente_nombre: nombre,
      cliente_direccion: esDomicilio ? direccion : '',
      cliente_telefono: telefono,
      metodo_pago: esDomicilio ? pagoSeleccionado : null,
      tipo_pedido: tipoPedidoSeleccionado,
      productos: carrito.map(item => ({
        producto_id: item.id,
        cantidad: item.cantidad,
        opcion: item.opcion || ''
      }))
    };

    console.log('DATOS ENVIADOS AL BACKEND:', datosPedido);

    const respuesta = await fetch(
      'https://theo-backend-1j17.onrender.com/api/pedidos',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosPedido)
      }
    );

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(
        resultado.mensaje || 'No se pudo registrar el pedido.'
      );
    }

    // Construir los productos del mensaje
    const productosPedido = carrito.map(item => {
      const opcion = item.opcion ? ` - ${item.opcion}` : '';
      const subtotal = item.precio * item.cantidad;

      const observacion = item.observacion
        ? `\n   📝 Observación: ${item.observacion}`
        : '';

      return `${item.cantidad}x ${item.nombre}${opcion} - ${formatoPrecio.format(subtotal)}${observacion}`;
    }).join('\n');

    const total = carrito.reduce(
      (suma, item) => suma + item.precio * item.cantidad,
      0
    );

    // Información según el tipo de pedido
    const informacionEntrega = esDomicilio
      ? `
📍 *Dirección:* ${direccion}
💳 *Método de pago:* ${pagoSeleccionado}
📝 *Nota:* ${nota || 'Sin nota'}`
      : `
🛍️ *Modalidad:* PARA RECOGER`;

    const mensaje = `
🍔 *NUEVO PEDIDO - THEO FOOD AND DRINKS*

🧾 *Pedido número:* ${resultado.pedido.id}
👤 *Cliente:* ${nombre}
📱 *Teléfono:* ${telefono}
${informacionEntrega}

🛒 *PEDIDO:*
${productosPedido}

💰 *TOTAL:* ${formatoPrecio.format(total)}
`;

    const urlWhatsApp =
      `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensaje)}`;

    console.log('URL WhatsApp:', urlWhatsApp);

    if (ventanaWhatsApp && !ventanaWhatsApp.closed) {
      ventanaWhatsApp.location.href = urlWhatsApp;
    } else {
      window.open(urlWhatsApp, '_blank');
    }

    aviso.textContent =
      `¡Pedido #${resultado.pedido.id} registrado correctamente!`;

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
