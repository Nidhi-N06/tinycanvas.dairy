// ---------- 1. AUTOMATICALLY LOAD IMAGES ----------
const sketches = [];

// Load all images from the GitHub "images" folder
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
          /\.(png|jpe?g|gif|webp|svg)$/i.test(file.name) &&
          file.name.toLowerCase() !== "sketch4.svg"
      )
      .forEach(file => {
        sketches.push({
          file: file.name,
          title: file.name
            .replace(/\.[^/.]+$/, "")
            .replace(/[-_]/g, " ")
        });
      });

    buildGallery();

  } catch (error) {
    console.error("Error loading sketches:", error);
  }
}


// ---------- 2. BUILD THE GALLERY ----------
function buildGallery() {
  const gallery = document.getElementById("gallery");

  gallery.innerHTML = "";

  sketches.forEach((sketch, i) => {

    const figure = document.createElement("figure");

    figure.className =
      "sketch reveal " +
      (i % 2 === 0 ? "from-left" : "from-right");


    const button = document.createElement("button");

    button.className = "sketch-open";

    button.setAttribute(
      "aria-label",
      "View " + sketch.title + " larger"
    );


    const img = document.createElement("img");

    img.src = "images/" + sketch.file;
    img.alt = sketch.title;
    img.loading = "lazy";

    button.appendChild(img);


    button.addEventListener("click", () => {
      openLightbox(sketch);
    });


    const caption = document.createElement("figcaption");

    caption.textContent = sketch.title;


    figure.append(button, caption);

    gallery.appendChild(figure);
  });


  // Start scroll animation
  document.querySelectorAll(".reveal").forEach(el => {
    observer.observe(el);
  });
}


// ---------- 3. SCROLL ANIMATION ----------
const observer = new IntersectionObserver(
  entries => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add("visible");

        // Animate only once
        observer.unobserve(entry.target);
      }

    });

  },
  {
    threshold: 0.2
  }
);


// ---------- 4. LIGHTBOX ----------
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


function closeLightbox() {
  lightbox.hidden = true;
}


// Close button
document
  .getElementById("lb-close")
  .addEventListener("click", closeLightbox);


// Click outside image to close
lightbox.addEventListener("click", e => {

  if (e.target === lightbox) {
    closeLightbox();
  }

});


// Press Escape to close
document.addEventListener("keydown", e => {

  if (e.key === "Escape" && !lightbox.hidden) {
    closeLightbox();
  }

});


// ---------- 5. START ----------
loadSketches();
