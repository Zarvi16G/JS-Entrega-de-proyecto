const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect width="300" height="300" fill="#ddd"/>' +
      '<text x="150" y="160" font-size="20" text-anchor="middle" fill="#777">Imagen no disponible</text></svg>'
  );

// ---------- Tarjetas ----------

export function createCard(image, favorite) {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.id = image.id;

  const img = document.createElement('img');
  img.src = image.url;
  img.alt = image.breeds?.[0]?.name ? `Gato ${image.breeds[0].name}` : 'Foto de un gato';
  img.loading = 'lazy';
  img.addEventListener('error', () => (img.src = PLACEHOLDER), { once: true });

  const actions = document.createElement('div');
  actions.className = 'card__actions';

  const infoBtn = document.createElement('button');
  infoBtn.className = 'icon-btn';
  infoBtn.dataset.action = 'info';
  infoBtn.setAttribute('aria-label', 'Ver información de la raza');
  infoBtn.textContent = 'ℹ';

  const favBtn = document.createElement('button');
  favBtn.className = 'icon-btn fav-btn';
  favBtn.dataset.action = 'favorite';

  actions.append(infoBtn, favBtn);
  card.append(img, actions);
  setFavoriteButton(card, favorite);
  return card;
}

export function setFavoriteButton(card, favorite) {
  const button = card.querySelector('.fav-btn');
  button.textContent = favorite ? '♥' : '♡';
  button.setAttribute('aria-pressed', favorite);
  button.setAttribute('aria-label', favorite ? 'Quitar de favoritos' : 'Añadir a favoritos');
}

// ---------- Estados ----------

export function showLoading(container) {
  container.innerHTML = '<div class="spinner" aria-hidden="true"></div><p>Cargando gatos…</p>';
}

export function showMessage(container, text) {
  container.replaceChildren(Object.assign(document.createElement('p'), { textContent: text }));
}

export function showError(container, text, onRetry) {
  const message = Object.assign(document.createElement('p'), { className: 'status__error', textContent: text });
  const retry = Object.assign(document.createElement('button'), { className: 'btn', textContent: 'Reintentar' });
  retry.addEventListener('click', onRetry);
  container.replaceChildren(message, retry);
}

export function clearStatus(container) {
  container.replaceChildren();
}

// ---------- Modal ----------

export function openBreedModal(dialog, image) {
  const breed = image.breeds?.[0];
  const img = dialog.querySelector('.modal__img');
  img.src = image.url;
  img.alt = breed ? `Gato ${breed.name}` : 'Foto de un gato';

  const body = dialog.querySelector('.modal__body');
  body.replaceChildren();

  if (!breed) {
    body.append(Object.assign(document.createElement('p'), { textContent: 'Sin información de raza disponible para esta imagen.' }));
    dialog.showModal();
    return;
  }

  body.append(Object.assign(document.createElement('h2'), { textContent: breed.name }));

  const details = document.createElement('dl');
  const rows = [
    ['Origen', breed.origin],
    ['Temperamento', breed.temperament],
    ['Esperanza de vida', breed.life_span && `${breed.life_span} años`],
  ];
  for (const [label, value] of rows) {
    if (!value) continue;
    details.append(
      Object.assign(document.createElement('dt'), { textContent: label }),
      Object.assign(document.createElement('dd'), { textContent: value })
    );
  }
  body.append(details);

  if (breed.description) {
    body.append(Object.assign(document.createElement('p'), { textContent: breed.description }));
  }
  if (breed.wikipedia_url) {
    body.append(
      Object.assign(document.createElement('a'), {
        href: breed.wikipedia_url,
        target: '_blank',
        rel: 'noopener',
        textContent: 'Ver en Wikipedia →',
      })
    );
  }

  dialog.showModal();
}
