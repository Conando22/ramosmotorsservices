const header = document.querySelector("[data-header]");
const form = document.querySelector("[data-contact-form]");
const note = document.querySelector("[data-form-note]");
const revealItems = document.querySelectorAll("[data-reveal]");
const issueButtons = document.querySelectorAll("[data-issue]");

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
