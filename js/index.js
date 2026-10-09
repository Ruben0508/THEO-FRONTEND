const botonMenu = document.querySelector('.boton-menu');
const navegacion = document.querySelector('.navegacion');

botonMenu?.addEventListener('click', () => {
  const estaAbierto = navegacion.classList.toggle('abierta');
  botonMenu.setAttribute('aria-expanded', estaAbierto);
  botonMenu.setAttribute('aria-label', estaAbierto ? 'Cerrar menú' : 'Abrir menú');
});

navegacion?.querySelectorAll('a').forEach((enlace) => {
  enlace.addEventListener('click', () => {
    navegacion.classList.remove('abierta');
    botonMenu?.setAttribute('aria-expanded', 'false');
  });
});

const anioActual = document.querySelector('#anio-actual');

if (anioActual) {
  anioActual.textContent = new Date().getFullYear();
}
