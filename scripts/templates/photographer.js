function photographerTemplate(data) {
  const { name, portrait, id, city, country, tagline, price } = data;

  const picture = `assets/photographers/${portrait}`;

  const portraitPhotographer = `<img src="${picture}" alt ="${tagline}" >`;
  const namePhotographer = `<h2 aria-label=" ${name}">${name}</h2>`;
  const cityName = `<h3>${city}, ${country}</h3>`;
  const taglineText = `<p class ="taglineText">${tagline}</p>`;
  const priceTag = `<p class = "priceTag">${price}€/jours</p>`;
  return `
   <article id="photographer_article" data-photographeid="${id}">
    ${portraitPhotographer}
    ${namePhotographer}
    ${cityName}
    ${taglineText}
    ${priceTag}
    </article>`;
}

function photographerTemplateId(data) {
  const { name, portrait, city, country, tagline } = data;

  const picture = `assets/photographers/${portrait}`;

  const portraitPhotographer = `<img src="${picture}" aria-label="${name}" >`;
  const namePhotographer = `<h2>${name}</h2>`;
  const cityName = `<h3>${city}, ${country}</h3>`;
  const taglineText = `<p class ="taglineText">${tagline}</p>`;

  return `
   <div class="header-container">
<div class="header-text">
${namePhotographer}
${cityName}
${taglineText}

</div>
  <button class="contact_button" id="contact_btn" aria-label="Contact Me">Contactez-moi</button>
    ${portraitPhotographer}
    </div>`;
}

function createMediaElement(media, photographerName) {
  if (!media.image && !media.video) {
    console.error("Undefined media type");
    return;
  }

  const mediaPath = media.image
    ? `assets/images/${photographerName}/${media.image}`
    : `assets/images/${photographerName}/${media.video}`;

  const altContent = media.title || "";
  const mediaElement = media.image
    ? `<img class="media-element" data-mediaId=${media.id} src="${mediaPath}" alt ="${altContent}">`
    : `<div><video controls class ="media-element" data-mediaId=${media.id} src="${mediaPath}"></div>`;
  const likeButton = `<button class="like-button" id="like_btn" data-mediaId="${media.id}"> <i class="fa-solid fa-heart heart-icon"></i></button>`;
  const mediaInfo = `
    <div class="media-info">
      <p class="media-title">${media.title}</p>
      <div class="likes-container">
        <p class="media-likes" data-mediaId=${media.id} data-likes=${media.likes}>${media.likes}</p>
       ${likeButton}
      </div>
    </div>
  `;
  return `
  <div class="media-container">
  ${mediaElement}
  ${mediaInfo}
  </div>
  `;
}

//gestion des likes

function handleLikeClick(mediaId, media) {
  // Récupérer le bouton de like correspondant à l'ID du média
  const likeButton = document.querySelector(`.like-button[data-mediaId="${mediaId}"]`);

  // Récupérer le média auquel le bouton appartient
  let mediaToUpdate = media.find((mediaItem) => mediaItem.id === mediaId);

  // Si le bouton de like a déjà la classe "liked", retirer le like
  if (likeButton.classList.contains("liked")) {
    mediaToUpdate.likes -= 1;
    likeButton.classList.remove("liked");
  } else {
    // Ajouter la classe "liked" une fois le bouton cliqué
    likeButton.classList.add("liked");
    mediaToUpdate.likes += 1;
  }

  const likesContainer = document.querySelector(`.media-likes[data-mediaId="${mediaId}"]`);
  likesContainer.textContent = mediaToUpdate.likes;
  likesContainer.setAttribute("data-likes", mediaToUpdate.likes);

  // Mettre à jour la somme totale des likes
  getTotalLikes();
}

function getTotalLikes() {
  const allLikesElements = document.querySelectorAll(".media-likes");
  let totalLikes = 0;

  allLikesElements.forEach((likesElement) => {
    totalLikes += Number(likesElement.getAttribute("data-likes"));
  });

  document.getElementById("likes_sum").textContent = totalLikes;
}
export { photographerTemplateId, photographerTemplate, createMediaElement, handleLikeClick, getTotalLikes };
