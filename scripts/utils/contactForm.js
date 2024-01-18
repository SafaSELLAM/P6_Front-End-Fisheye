function displayModal () {
  const main = document.getElementById('main')
  const modal = document.getElementById('contact_modal')
  main.setAttribute('aria-hidden', 'true')
  modal.setAttribute('aria-hidden', 'false')
  modal.style.display = 'block'
  document.getElementById('prenom').focus()

  // focus trap pour la modal, selectionne tout les element focusable
  const focusableElements = modal.querySelectorAll('input:not([disabled]), textarea, button, select,#close_btn')
  const firstFocusableElement = focusableElements[0]
  const lastFocusableElement = focusableElements[focusableElements.length - 1]

  // gère les mouvement de la touche tab, si on est sur le premier element focusable retourne sur le dernier
  modal.addEventListener('keydown', function (event) {
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          event.preventDefault()
          lastFocusableElement.focus()
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          event.preventDefault()
          firstFocusableElement.focus()
        }
      }
    }
  })
}
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal()
  }
})

function closeModal () {
  const main = document.getElementById('main')
  const modal = document.getElementById('contact_modal')
  main.setAttribute('aria-hidden', 'false')
  modal.setAttribute('aria-hidden', 'true')
  modal.style.display = 'none'
  const openBtn = document.getElementById('contact_btn')
  openBtn.focus()
}

function addModalListeners () {
  const openBtn = document.getElementById('contact_btn')
  openBtn.addEventListener('click', displayModal)

  const closeBtn = document.getElementById('close_btn')
  closeBtn.addEventListener('click', closeModal)
  closeBtn.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      setTimeout(closeModal, 0)
    }
  })
}

// gestion du formulaire
function validateForm (event) {
  event.preventDefault()

  const firstname = document.getElementById('prenom')
  const lastname = document.getElementById('nom')
  const email = document.getElementById('email')
  const message = document.getElementById('message')
  // Vérifier si les champs sont vides
  if (firstname.value === '' || lastname.value === '' || email.value === '' || message.value === '') {
    console.log('Merci de remplir tous les champs.')
    return
  }
  console.log('Prénom:', firstname.value)
  console.log('Nom:', lastname.value)
  console.log('Email:', email.value)
  console.log('Message:', message.value)

  validationMessage()
}

document.getElementById('submit_btn').addEventListener('click', validateForm)

function validationMessage () {
  console.log('formulaire envoyé')
  // reset form
  document.getElementById('Form_modal').reset()
}
export { displayModal, closeModal, addModalListeners }
