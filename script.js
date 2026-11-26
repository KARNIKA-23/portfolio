const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Reveal sections as they enter the viewport.
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// Project category filters.
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    projectCards.forEach(card => {
      const show = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !show);
    });
  });
});

// Accessible project detail modal.
const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalStack = document.getElementById("modalStack");
const modalClose = document.getElementById("modalClose");
let previousFocus = null;

function openModal(button) {
  previousFocus = document.activeElement;
  modalTitle.textContent = button.dataset.title;
  modalDescription.textContent = button.dataset.description;
  modalStack.textContent = button.dataset.stack;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  modalClose.focus();
}
function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (previousFocus) previousFocus.focus();
}
document.querySelectorAll(".details-btn").forEach(button => {
  button.addEventListener("click", () => openModal(button));
});
modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", event => {
  if (event.target === modal) closeModal();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
});

document.getElementById("year").textContent = new Date().getFullYear();

// Certificate / award lightbox.
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
let lightboxFocus = null;
function openLightbox(el) {
  lightboxFocus = document.activeElement;
  lightboxImg.src = el.dataset.full;
  lightboxImg.alt = el.dataset.caption;
  lightboxCaption.textContent = el.dataset.caption;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
}
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lightboxFocus) lightboxFocus.focus();
}
document.querySelectorAll("[data-full]").forEach(el => el.addEventListener("click", () => openLightbox(el)));
lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox(); });

// Email button: phones use the default mail app; computers open Gmail compose (a mailto: link does nothing without a mail app).
const emailBtn = document.getElementById("emailBtn");
const copyEmail = document.getElementById("copyEmail");
if (emailBtn) {
  const address = emailBtn.dataset.email;
  emailBtn.addEventListener("click", event => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (!isMobile) {
      event.preventDefault();
      window.open("https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(address) + "&su=" + encodeURIComponent("Portfolio enquiry"), "_blank", "noopener");
    }
  });
}
if (copyEmail) {
  copyEmail.addEventListener("click", async () => {
    const address = document.getElementById("emailText").textContent;
    try { await navigator.clipboard.writeText(address); copyEmail.textContent = "Copied ✓"; }
    catch (e) { copyEmail.textContent = "Press Ctrl+C"; }
    setTimeout(() => { copyEmail.textContent = "Copy"; }, 2000);
  });
}
