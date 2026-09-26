const header = document.querySelector("[data-header]");
const revealItems = document.querySelectorAll("[data-reveal]");
const carousel = document.querySelector("[data-carousel]");
const carouselViewport = carousel?.querySelector("[data-carousel-viewport]");
const carouselTrack = carousel?.querySelector("[data-carousel-track]");
const previousCarouselButton = carousel?.querySelector("[data-carousel-previous]");
const nextCarouselButton = carousel?.querySelector("[data-carousel-next]");

const updatePageState = () => {
  header?.classList.toggle("is-solid", window.scrollY > 24);

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  document.documentElement.style.setProperty("--scroll-progress", Math.min(progress, 1).toString());
};

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

updatePageState();
window.addEventListener("scroll", updatePageState, { passive: true });
window.addEventListener("resize", updatePageState);

if (carouselViewport && carouselTrack && previousCarouselButton && nextCarouselButton) {
  const firstCard = carouselTrack.querySelector(".service-card");
  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;

  const updateCarouselControls = () => {
    const maxScrollLeft = carouselViewport.scrollWidth - carouselViewport.clientWidth;
    previousCarouselButton.disabled = carouselViewport.scrollLeft <= 1;
    nextCarouselButton.disabled = carouselViewport.scrollLeft >= maxScrollLeft - 1;
  };

  const moveCarousel = (direction) => {
    const step = (firstCard?.getBoundingClientRect().width || 320) + 16;
    carouselViewport.scrollBy({ left: direction * step, behavior: "smooth" });
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
    if (!isDragging) return;
    carouselViewport.scrollLeft = startScrollLeft - (event.clientX - startX);
  });

  const finishDragging = (event) => {
    if (!isDragging) return;
    isDragging = false;
    carouselViewport.classList.remove("is-dragging");
    if (carouselViewport.hasPointerCapture(event.pointerId)) {
      carouselViewport.releasePointerCapture(event.pointerId);
    }
  };

  carouselViewport.addEventListener("pointerup", finishDragging);
  carouselViewport.addEventListener("pointercancel", finishDragging);
  updateCarouselControls();
}
