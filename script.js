// ---------- 1. YOUR SKETCHES ----------
// How to add a sketch:
//   1. Copy the image file into the images/ folder.
//   2. Add one line below with the file name and a title.
// Sketches appear on the page in the same order as this list.
const sketches = [
  { file: "sketch1.svg", title: "Little flower" },
  { file: "sketch2.svg", title: "Mountains" },
  { file: "sketch3.svg", title: "Leaf study" },
  { file: "sketch4.svg", title: "Happy face" },
];

// ---------- 2. Build the gallery: one sketch per row ----------
const gallery = document.getElementById("gallery");

sketches.forEach((sketch, i) => {
  const figure = document.createElement("figure");
  // reveal = starts hidden, animates in when scrolled into view
  // from-left / from-right = alternate the direction it slides in from
  figure.className = "sketch reveal " + (i % 2 === 0 ? "from-left" : "from-right");

  const button = document.createElement("button");
  button.className = "sketch-open";
  button.setAttribute("aria-label", "View " + sketch.title + " larger");

  const img = document.createElement("img");
  img.src = "images/" + sketch.file;
  img.alt = sketch.title;
  img.loading = "lazy";
  button.appendChild(img);
  button.addEventListener("click", () => openLightbox(sketch));

  const caption = document.createElement("figcaption");
  caption.textContent = sketch.title;

  figure.append(button, caption);
  gallery.appendChild(figure);
});

// ---------- 3. Scroll animation ----------
// IntersectionObserver tells us when an element enters the screen.
// We then add the class "visible", and CSS does the animation.
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);   // animate only once
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// ---------- 4. Larger view ----------
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbCaption = document.getElementById("lb-caption");

function openLightbox(sketch) {
  lbImg.src = "images/" + sketch.file;
  lbImg.alt = sketch.title;
  lbCaption.textContent = sketch.title;
  lightbox.hidden = false;
  document.getElementById("lb-close").focus();
}
function closeLightbox() { lightbox.hidden = true; }

document.getElementById("lb-close").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !lightbox.hidden) closeLightbox(); });
// ---------- 1. AUTOMATICALLY LOAD IMAGES ----------
const sketches = [];

// Load all images from the GitHub images folder
async function loadSketches() {
  const host = window.location.hostname;
  const pathParts = window.location.pathname.split("/").filter(Boolean);

  let owner, repo;

  // Detect GitHub Pages repository
  if (host.endsWith(".github.io")) {
    owner = host.replace(".github.io", "");
    repo = pathParts[0] || "";
  }

  if (!owner || !repo) {
    console.warn("Could not detect the GitHub repository.");
    return;
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/images`
    );

    if (!response.ok) {
      throw new Error("Could not load images folder.");
    }

    const files = await response.json();

    files
      .filter(
        file =>
          file.type === "file" &&
          /\.(png|jpe?g|gif|webp|svg)$/i.test(file.name)
      )
      .forEach(file => {
        sketches.push({
          file
