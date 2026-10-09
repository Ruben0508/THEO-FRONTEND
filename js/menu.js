const productos = [
  { id: 1, nombre: 'Churrasco', categoria: 'especiales', precio: 28000, descripcion: '260gr de solomo acompañado de vegetales frescos y porción de papas a la francesa.', imagen: '' },
  { id: 2, nombre: 'Pollo', categoria: 'especiales', precio: 21000, descripcion: '220gr de filete acompañado de vegetales frescos y porción de papas a la francesa.', imagen: '' },
  { id: 3, nombre: 'Empanadas cocteleras x8', categoria: 'snacks', precio: 8000, descripcion: 'Ocho empanadas cocteleras para compartir.', imagen: '' },
  { id: 4, nombre: 'Dedos mozzarella x6', categoria: 'snacks', precio: 10000, descripcion: 'Seis dedos de mozzarella crujientes.', imagen: '' },
  { id: 5, nombre: 'Papas a la francesa', categoria: 'snacks', precio: 7000, descripcion: 'Papas a la francesa, doradas y crujientes.', imagen: '' },
  { id: 6, nombre: 'Chihuahua', categoria: 'salchipapas', precio: 18000, descripcion: 'Papas a la francesa, salchicha ranchera premium y salsas clásicas callejeras.', imagen: '' },
  { id: 7, nombre: 'Pitbull', categoria: 'salchipapas', precio: 27500, descripcion: 'Papas, salchicha ranchera premium, carne molida, tomate verde, salsas, ripio, queso mozzarella y tocineta.', imagen: '' },
  { id: 8, nombre: 'Callejera', categoria: 'hamburguesas', precio: 23000, descripcion: 'Vegetales frescos, carne de res, ripio crujiente, salsas callejeras, tocineta y queso mozzarella fundido.', imagen: '' },
  { id: 9, nombre: 'Pug', categoria: 'hamburguesas', precio: 27000, descripcion: 'Vegetales frescos, doble carne de res smash, queso americano, tocineta, BBQ sweet y salsa de pepinillos.', imagen: '' },
  { id: 10, nombre: 'Frenchie', categoria: 'hamburguesas', precio: 25000, descripcion: 'Vegetales frescos, carne de res, piña asada, queso Philadelphia, mayonesa de ajo y BBQ sweet.', imagen: '' },
  { id: 11, nombre: 'Samoyedo', categoria: 'hamburguesas', precio: 25000, descripcion: 'Vegetales frescos, pollo apanado, mayonesa de ajo, tocineta, cebolla crispy y queso mozzarella.', imagen: '' },
  { id: 12, nombre: 'San Bernardo', categoria: 'hamburguesas', precio: 28000, descripcion: 'Vegetales frescos, carne de res, queso americano fundido, mermelada de tocineta, salsa big mac y queso Philadelphia.', imagen: '' },
  { id: 13, nombre: 'Beagle', categoria: 'hamburguesas', precio: 26000, descripcion: 'Vegetales frescos, carne de res 200gr o filete de pollo, tocineta, cebolla caramelizada y queso mozzarella.', imagen: '' },
  { id: 14, nombre: 'Golden', categoria: 'hamburguesas', precio: 29000, descripcion: 'Vegetales frescos, carne de res, queso Philadelphia, tocineta, chorizo a la parrilla, pico de gallo y queso mozzarella.', imagen: '' },
  { id: 15, nombre: 'Callejero', categoria: 'perros', precio: 22000, descripcion: 'Salchicha ranchera premium, ripio crujiente, tocineta, salsas clásicas callejeras y queso mozzarella fundido.', imagen: '' },
  { id: 16, nombre: 'Dogo Argentino', categoria: 'perros', precio: 25000, descripcion: 'Jugosos trozos de churrasco al grill, chimichurri fresco, tomate y salsa ahumada.', imagen: '' },
  { id: 17, nombre: 'Theo Fest', categoria: 'perros', precio: 27000, descripcion: 'Salchicha ranchera premium, carne molida jugosa, tomate verde, salsa agridulce, tocineta y queso mozzarella.', imagen: '' },
  { id: 18, nombre: 'Malteada', categoria: 'bebidas-frias', precio: 15000, descripcion: 'Elige tu sabor: café, Oreo o Milo.', opciones: ['Café', 'Oreo', 'Milo'], imagen: '' },
  { id: 19, nombre: 'Granizado de café', categoria: 'bebidas-frias', precio: 13000, descripcion: 'Granizado cremoso con sabor a café.', imagen: '' },
  { id: 20, nombre: 'Milo', categoria: 'bebidas-frias', precio: 8000, descripcion: 'Bebida fría de Milo.', imagen: '' },
  { id: 21, nombre: 'Limonada natural', categoria: 'bebidas-frias', precio: 6000, descripcion: 'Limonada natural refrescante.', imagen: '' },
  { id: 22, nombre: 'Limonada cerezada', categoria: 'bebidas-frias', precio: 9000, descripcion: 'Limonada con sabor a cereza.', imagen: '' },
  { id: 23, nombre: 'Limonada de coco', categoria: 'bebidas-frias', precio: 10000, descripcion: 'Limonada cremosa de coco.', imagen: '' },
  { id: 24, nombre: 'Jugo natural en agua', categoria: 'bebidas-frias', precio: 8000, descripcion: 'Elige: mora, mango, lulo o maracuyá.', opciones: ['Mora', 'Mango', 'Lulo', 'Maracuyá'], imagen: '' },
  { id: 25, nombre: 'Jugo natural en leche', categoria: 'bebidas-frias', precio: 9000, descripcion: 'Elige: mora, mango, lulo o maracuyá.', opciones: ['Mora', 'Mango', 'Lulo', 'Maracuyá'], imagen: '' },
  { id: 26, nombre: 'Gaseosa personal', categoria: 'bebidas-frias', precio: 5000, descripcion: 'Coca-Cola, Ginger, Soda o Té.', imagen: '' },
  { id: 27, nombre: 'Postobón personal', categoria: 'bebidas-frias', precio: 4000, descripcion: 'Bebida personal Postobón.', imagen: '' },
  { id: 28, nombre: 'Agua', categoria: 'bebidas-frias', precio: 3000, descripcion: 'Agua embotellada.', imagen: '' },
  { id: 29, nombre: 'Expreso', categoria: 'bebidas-calientes', precio: 4000, descripcion: 'Café expreso.', imagen: '' },
  { id: 30, nombre: 'Expreso doble', categoria: 'bebidas-calientes', precio: 5000, descripcion: 'Café expreso doble.', imagen: '' },
  { id: 31, nombre: 'Americano', categoria: 'bebidas-calientes', precio: 5000, descripcion: 'Café americano.', imagen: '' },
  { id: 32, nombre: 'Capuccino', categoria: 'bebidas-calientes', precio: 8000, descripcion: 'Capuccino clásico.', imagen: '' },
  { id: 33, nombre: 'Capuccino chantilly', categoria: 'bebidas-calientes', precio: 9000, descripcion: 'Capuccino con chantilly.', imagen: '' },
  { id: 34, nombre: 'Latte', categoria: 'bebidas-calientes', precio: 8000, descripcion: 'Latte cremoso.', imagen: '' },
  { id: 35, nombre: 'Aromática', categoria: 'bebidas-calientes', precio: 3000, descripcion: 'Aromática caliente.', imagen: '' },
  { id: 36, nombre: 'Cervezas nacionales', categoria: 'cervezas', precio: 6000, descripcion: 'Club Colombia, Águila Light o Poker.', imagen: '' },
  { id: 37, nombre: 'Cerveza importada', categoria: 'cervezas', precio: 9000, descripcion: 'Corona o Stella Artois.', imagen: '' },
  { id: 38, nombre: 'Michelada', categoria: 'cervezas', precio: 2000, descripcion: 'Adición de michelada.', imagen: '' },
  { id: 39, nombre: 'Queso mozzarella', categoria: 'adiciones', precio: 3000, descripcion: 'Adición de queso mozzarella.', imagen: '' },
  { id: 40, nombre: 'Queso Philadelphia', categoria: 'adiciones', precio: 4000, descripcion: 'Adición de queso Philadelphia.', imagen: '' },
  { id: 41, nombre: 'Tocineta crocante', categoria: 'adiciones', precio: 3000, descripcion: 'Adición de tocineta crocante.', imagen: '' },
  { id: 42, nombre: 'Carne 100gr Smash', categoria: 'adiciones', precio: 6000, descripcion: 'Adición de carne smash de 100gr.', imagen: '' },
  { id: 43, nombre: 'Carne 130gr', categoria: 'adiciones', precio: 7000, descripcion: 'Adición de carne de res de 130gr.', imagen: '' },
  { id: 44, nombre: 'Carne 200gr', categoria: 'adiciones', precio: 10000, descripcion: 'Adición de carne de res de 200gr.', imagen: '' },
  { id: 45, nombre: 'Pollo apanado', categoria: 'adiciones', precio: 10000, descripcion: 'Adición de pollo apanado.', imagen: '' },
  { id: 46, nombre: 'Filete de pollo', categoria: 'adiciones', precio: 10000, descripcion: 'Adición de filete de pollo.', imagen: '' }
];

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
        <p class="producto__categoria">${escaparHTML(categorias.find((item) => item.id === producto.categoria).nombre)}</p>
        <h2>${escaparHTML(producto.nombre)}</h2>
        <p class="producto__descripcion">${escaparHTML(producto.descripcion)}</p>
        <div class="producto__configuracion">
          ${producto.opciones ? `<label class="producto__opciones" for="opcion-${producto.id}">Elige tu sabor<select id="opcion-${producto.id}" data-opcion="${producto.id}">${producto.opciones.map((opcion) => `<option value="${escaparHTML(opcion)}">${escaparHTML(opcion)}</option>`).join('')}</select></label>` : ''}
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

formPedido.addEventListener('submit', (evento) => {
  evento.preventDefault();

  if (!carrito.length) {
    return;
  }

  const nombre = document.querySelector('#nombre-cliente').value.trim();
  const direccion = document.querySelector('#direccion-cliente').value.trim();
  const telefono = document.querySelector('#telefono-cliente').value.trim();
  const metodoPago = document.querySelector('#metodo-pago').value;
  const nota = document.querySelector('#nota-pedido').value.trim();

  const productosPedido = carrito.map((item) => {
    const opcion = item.opcion
      ? ` - ${item.opcion}`
      : '';

    const subtotal = item.precio * item.cantidad;

    return `${item.cantidad}x ${item.nombre}${opcion} - ${formatoPrecio.format(subtotal)}`;
  }).join('\n');

  const total = carrito.reduce(
    (suma, item) => suma + item.precio * item.cantidad,
    0
  );

  const mensaje = `
🍔 *NUEVO PEDIDO - THEO FOOD AND DRINKS*

👤 *Cliente:* ${nombre}
📱 *Teléfono:* ${telefono}
📍 *Dirección:* ${direccion}

🛒 *PEDIDO:*
${productosPedido}

💰 *TOTAL:* ${formatoPrecio.format(total)}

💳 *Método de pago:* ${metodoPago}

📝 *Nota:*
${nota || 'Sin nota'}
`;

  const mensajeCodificado = encodeURIComponent(mensaje);

  const urlWhatsApp =
    `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;

  window.open(urlWhatsApp, '_blank');
});


renderizarCarrito();
renderizarCategorias();
renderizarProductos();

const parametrosURL = new URLSearchParams(window.location.search);
const modoLectura = parametrosURL.get('modo') === 'ver';

if (modoLectura) {
  document.body.classList.add('modo-lectura');

  const tituloMenu = document.querySelector('#titulo-menu');

  if (tituloMenu) {
    tituloMenu.textContent = 'NUESTRO MENÚ';
  }
}
