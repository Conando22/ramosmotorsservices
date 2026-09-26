const header = document.querySelector("[data-header]");
const form = document.querySelector("[data-contact-form]");
const note = document.querySelector("[data-form-note]");
const revealItems = document.querySelectorAll("[data-reveal]");
const issueButtons = document.querySelectorAll("[data-issue]");
const carousel = document.querySelector("[data-carousel]");
const carouselViewport = carousel?.querySelector("[data-carousel-viewport]");
const carouselTrack = carousel?.querySelector("[data-carousel-track]");
const previousCarouselButton = carousel?.querySelector("[data-carousel-previous]");
const nextCarouselButton = carousel?.querySelector("[data-carousel-next]");

const phone = "351917329181";
const email = "ramosmotorsservice@gmail.com";

const setHeader = () => {
  header?.classList.toggle("is-solid", window.scrollY > 24);

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  document.documentElement.style.setProperty("--scroll-progress", Math.min(progress, 1).toString());
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
  observer.observe(item);
});

setHeader();
window.addEventListener("scroll", setHeader, { passive: true });
window.addEventListener("resize", setHeader);

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const submitter = event.submitter;
  const mode = submitter?.dataset.submitMode || "email";
  const data = new FormData(form);
  const message = [
    "Pedido para Ramos Motors Service",
    "",
    `Nome: ${data.get("name") || ""}`,
    `Contacto: ${data.get("contact") || ""}`,
    `Viatura: ${data.get("vehicle") || ""}`,
    "",
    `Mensagem: ${data.get("message") || ""}`,
  ].join("\n");

  if (mode === "whatsapp") {
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    note.textContent = "Mensagem preparada no WhatsApp.";
    return;
  }

  window.location.href = `mailto:${email}?subject=${encodeURIComponent("Pedido de orçamento")}&body=${encodeURIComponent(message)}`;
  note.textContent = "Mensagem preparada no email.";
});

issueButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const textarea = form?.querySelector('textarea[name="message"]');
    if (!textarea) return;

    textarea.value = button.dataset.issue || "";
    form.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => textarea.focus(), 420);
    note.textContent = "Sintoma adicionado. Complete os dados e envie por WhatsApp ou email.";
  });
});

if (carouselViewport && carouselTrack && previousCarouselButton && nextCarouselButton) {
  const cards = [...carouselTrack.querySelectorAll(".service-card")];
  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;

  const updateCarouselControls = () => {
    const maxScrollLeft = carouselViewport.scrollWidth - carouselViewport.clientWidth;
    previousCarouselButton.disabled = carouselViewport.scrollLeft <= 1;
    nextCarouselButton.disabled = carouselViewport.scrollLeft >= maxScrollLeft - 1;
  };

  const getScrollStep = () => cards[0].getBoundingClientRect().width + 16;

  const moveCarousel = (direction) => {
    carouselViewport.scrollBy({ left: direction * getScrollStep(), behavior: "smooth" });
  };

  previousCarouselButton.addEventListener("click", () => moveCarousel(-1));
  nextCarouselButton.addEventListener("click", () => moveCarousel(1));
  carouselViewport.addEventListener("scroll", updateCarouselControls, { passive: true });
  window.addEventListener("resize", updateCarouselControls);

  carouselViewport.addEventListener("pointerdown", (event) => {
    isDragging = true;
    startX = event.clientX;
    startScrollLeft = carouselViewport.scrollLeft;
    carouselViewport.classList.add("is-dragging");
    carouselViewport.setPointerCapture(event.pointerId);
  });

  carouselViewport.addEventListener("pointermove", (event) => {
    if (isDragging) {
      carouselViewport.scrollLeft = startScrollLeft - (event.clientX - startX);
    }
  });

  const finishDragging = (event) => {
    if (!isDragging) return;
    isDragging = false;
    carouselViewport.classList.remove("is-dragging");
    carouselViewport.releasePointerCapture(event.pointerId);
  };

  carouselViewport.addEventListener("pointerup", finishDragging);
  carouselViewport.addEventListener("pointercancel", finishDragging);
  updateCarouselControls();
}
