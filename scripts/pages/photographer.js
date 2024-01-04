//Mettre le code JavaScript lié à la page photographer.html
import { displayModal, closeModal, addModalListeners } from "../utils/contactForm.js";
import {
  photographerTemplateId,
  createMediaElement,
  handleLikeClick,
  getTotalLikes,
} from "../templates/photographer.js";

async function getPhotographerById(photographerId) {
  try {
    const response = await fetch("http://localhost:5500/data/photographers.json");
    if (!response.ok) {
      throw new Error("datas can not be fetched");
    }
    const dataJson = await response.json();
    const photographers = dataJson.photographers.map((photographer) => ({
      id: photographer.id,
      name: photographer.name,
      firstname: photographer.firstname,
      city: photographer.city,
      country: photographer.country,
      tagline: photographer.tagline,
      portrait: photographer.portrait,
      price: photographer.price,
    }));

    // Trouver le photographe spécifique par son ID
    const photographerFound = photographers.find(
      (photographerToFind) => photographerToFind.id === Number(photographerId)
    );
    return photographerFound;
  } catch (error) {
    console.error(error);
    return [];
  }
}
async function getMediaById(photographerId) {
  try {
    const response = await fetch("http://localhost:5500/data/photographers.json");

    if (!response.ok) {
      throw new Error("Media data could not be fetched");
    }

    const mediaJson = await response.json();
    const media = mediaJson.media.filter((mediaToFind) => mediaToFind.photographerId === Number(photographerId));

    return media;
  } catch (error) {
    console.error(error);
    return [];
  }
}
function updateMediaDisplay(media, sortCriteria, photographer) {
  // Crée une copie des éléments à trier
  const mediaCopy = Array.from(media);

  // Trie les médias en fonction du critère de tri
  let sortedMedia = [];
  if (sortCriteria === "popularity") {
    sortedMedia = mediaCopy.sort((a, b) => b.likes - a.likes);
  } else if (sortCriteria === "title") {
    sortedMedia = mediaCopy.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortCriteria === "date") {
    sortedMedia = mediaCopy.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // Affiche les médias triés
  const mediaContainer = document.getElementById("media-container");
  let mediaElements = "";
  sortedMedia.forEach((mediaItem) => {
    mediaElements += createMediaElement(mediaItem, photographer.firstname);
  });
  mediaContainer.innerHTML = mediaElements;

  //Gestion des likes au click
  const allLikes = Array.from(document.getElementsByClassName("like-button"));
  allLikes.forEach((likeButton) => {
    likeButton.addEventListener("click", () => {
      const mediaId = likeButton.getAttribute("data-mediaId");
      handleLikeClick(Number(mediaId), media);
    });
  });
  getTotalLikes();
}

async function displayPhotographerInfo() {
  // Récupérer l'ID du photographe à partir de l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const photographerId = urlParams.get("id");
  // Récupérer les données des photographes
  const photographer = await getPhotographerById(photographerId);

  if (photographer) {
    const photographerInfoContainer = document.getElementById("photograph_header");
    const infoPhoto = photographerTemplateId(photographer);
    photographerInfoContainer.innerHTML = infoPhoto;

    const dailyRate = document.getElementById("tarif_journalier");
    dailyRate.textContent = `${photographer.price}€/jour`;
    // const sumLikes = document.getElementById("likes_sum")
    // sumLikes.textContent =

    addModalListeners();

    //appel des media en fonction id photographe
    const media = await getMediaById(photographerId);
    const mediaContainer = document.getElementById("media-container");
    // Tri par défaut (peut être changé par l'utilisateur)
    let currentSort = "popularité";
    updateMediaDisplay(media, currentSort, photographer);

    // // Gérer le changement d'option de tri
    const options = document.querySelectorAll(".option");
    options.forEach((option) => {
      option.addEventListener("click", () => {
        currentSort = option.dataset.sort;
        updateMediaDisplay(media, currentSort, photographer);
      });
    });

    let mediaElements = "";

    media.forEach((mediaItem) => {
      mediaElements += createMediaElement(mediaItem, photographer.firstname);
    });

    mediaContainer.innerHTML = mediaElements;
    //rend cliquable les media
    const allMedia = Array.from(document.getElementsByClassName("media-element"));
    allMedia.forEach((mediaLightbox, index) => {
      mediaLightbox.addEventListener("click", () => {
        openLightbox(index, media);
      });
    });

    //Gestion des likes au click
    const allLikes = Array.from(document.getElementsByClassName("like-button"));
    allLikes.forEach((likeButton) => {
      likeButton.addEventListener("click", () => {
        const mediaId = likeButton.getAttribute("data-mediaId");
        handleLikeClick(Number(mediaId), media);
      });
    });
    getTotalLikes();
  } else {
    console.log("Photographer not found");
  }
}
displayPhotographerInfo();

function openLightbox(selectedMediaIndex, media) {
  // Mettez à jour le contenu de la lightbox avec le média sélectionné
  const lightboxMediaContainer = document.getElementById("media_lightbox");

  const selectedMedia = media[selectedMediaIndex];
  const selectedMediaId = selectedMedia.id;

  const selectedMediaElement = document.querySelector(`.media-element[data-mediaId="${selectedMediaId}"]`);

  //récupère HTML de l'élément média sélectionné  et l'injecte dans la div media_lightbox
  const mediaElementHTML = selectedMediaElement.outerHTML;
  lightboxMediaContainer.innerHTML = mediaElementHTML;

  // Affichez la lightbox
  document.getElementById("lightbox").style.display = "block";

  // Ajoutez des écouteurs d'événements pour la navigation dans la lightbox
  document.getElementById("left_arrow").addEventListener("click", () => navigateLightbox(-1));
  document.getElementById("right_arrow").addEventListener("click", () => navigateLightbox(1));

  function navigateLightbox(direction) {
    // Implémentez la logique pour naviguer vers l'image précédente ou suivante
    selectedMediaIndex = (selectedMediaIndex + direction + media.length) % media.length;
    const newMedia = media[selectedMediaIndex];
    const newMediaId = newMedia.id;
    const newMediaElement = document.querySelector(`.media-element[data-mediaId="${newMediaId}"]`);
    const newMediaElementHTML = newMediaElement.outerHTML;

    lightboxMediaContainer.innerHTML = newMediaElementHTML;
  }
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

document.getElementById("close_lightbox").addEventListener("click", () => {
  closeLightbox();
});

// const optionMenu = document.querySelector(".select-menu"),
//   selectBtn = optionMenu.querySelector(".select-btn"),
//   options = optionMenu.querySelectorAll(".option"),
//   sBtn_text = optionMenu.querySelector(".sBtn-text");

// selectBtn.addEventListener("click", () => optionMenu.classList.toggle("active"));

// options.forEach((option) => {
//   option.addEventListener("click", () => {
//     let selectedOption = option.querySelector(".option-text").innerText;
//     sBtn_text.innerText = selectedOption;

//     optionMenu.classList.remove("active");
//   });
// });

const optionMenu = document.querySelector(".select-menu");
const selectBtn = optionMenu.querySelector(".select-btn");
const options = optionMenu.querySelectorAll(".option");
const sBtn_text = optionMenu.querySelector(".sBtn-text");

selectBtn.addEventListener("click", () => {
  optionMenu.classList.toggle("active");
  const isExpanded = optionMenu.classList.contains("active");
  selectBtn.setAttribute("aria-expanded", isExpanded);

  if (isExpanded) {
    options[0].focus();
  }
});

selectBtn.addEventListener("keydown", (event) => {
  if (event.code === "Space" || event.code === "Enter") {
    optionMenu.classList.toggle("active");
    const isExpanded = optionMenu.classList.contains("active");
    selectBtn.setAttribute("aria-expanded", isExpanded);

    if (isExpanded) {
      options[0].focus();
    }
  }
});

options.forEach((option, index) => {
  option.setAttribute("tabindex", "0");

  option.addEventListener("click", () => {
    updateSelectedOption(index);
    optionMenu.classList.remove("active");
    selectBtn.focus();
  });

  option.addEventListener("keydown", (event) => {
    if (event.code === "Space" || event.code === "Enter") {
      updateSelectedOption(index);
      optionMenu.classList.remove("active");
      selectBtn.focus();
    } else if (event.code === "ArrowUp" && index > 0) {
      options[index - 1].focus();
    } else if (event.code === "ArrowDown" && index < options.length - 1) {
      options[index + 1].focus();
    }
  });
});

function updateSelectedOption(index) {
  options.forEach((option, i) => {
    const isSelected = i === index;
    option.setAttribute("aria-selected", isSelected);
  });

  const selectedOption = options[index].querySelector(".option-text").innerText;
  sBtn_text.innerText = selectedOption;
}
