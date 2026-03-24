// =======================
// ITEM DATA
// =======================

const shopData = {
  featured: [
    {
      name: "Tactical Matthew",
      price: 1200,
      image: "images/skin1.jpg",
      rarity: "rare"
    },
    {
      name: "Formal Caleb",
      price: 1500,
      image: "images/formalcaleb.jpg",
      rarity: "epic"
    },
     {
      name: "Tactical Caleb",
      price: 1200,
      image: "images/tacticalcaleb.jpg",
      rarity: "rare"
    },
     {
      name: "Casual Ethan",
      price: 800,
      image: "images/casualethan.jpg",
      rarity: "uncommon"
    },
     {
      name: "Formal Caleb",
      price: 800,
      image: "images/formalcaleb.jpg",
      rarity: "rare"
    },
     {
      name: "Formal Caleb",
      price: 800,
      image: "images/formalcaleb.jpg",
      rarity: "rare"
    },
     {
      name: "Formal Caleb",
      price: 800,
      image: "images/formalcaleb.jpg",
      rarity: "rare"
    },
     {
      name: "Formal Caleb",
      price: 800,
      image: "images/formalcaleb.jpg",
      rarity: "rare"
    },
     {
      name: "Formal Caleb",
      price: 800,
      image: "images/formalcaleb.jpg",
      rarity: "rare"
    },
     {
      name: "Formal Caleb",
      price: 800,
      image: "images/formalcaleb.jpg",
      rarity: "rare"
    }
  ],

  daily: [
    {
      name: "Cool Emote",
      price: 500,
      image: "images/test.jpg",
      rarity: "uncommon"
    }
  ]
};

// Load Three.js and GLTFLoader scripts dynamically
function loadThreeJS(callback) {
  const threeScript = document.createElement('script');
  threeScript.src = "https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.min.js";
  threeScript.onload = () => {
    const loaderScript = document.createElement('script');
    loaderScript.src = "https://cdn.jsdelivr.net/npm/three@0.152.2/examples/js/loaders/GLTFLoader.js";
    loaderScript.onload = callback;
    document.head.appendChild(loaderScript);
  };
  document.head.appendChild(threeScript);
}

// =======================
// RARITY COLORS
// =======================

function getRarityColor(rarity) {
  switch (rarity) {
    case "legendary":
      return "#ff8000";
    case "epic":
      return "#a335ee";
    case "rare":
      return "#0070dd";
    case "uncommon":
      return "#1eff00";
    default:
      return "#ffffff";
  }
}

// =======================
// CREATE ITEM CARD
// =======================

function createItemCard(item) {
  const card = document.createElement("div");
  card.className = "item-card";

  const color = getRarityColor(item.rarity);

  card.innerHTML = `
    <div class="item-image" style="border-bottom: 4px solid ${color}">
      <img src="${item.image}">
    </div>

    <div class="item-info">
      <h3>${item.name}</h3>
      <p class="price">${item.price} V-Bucks</p>
    </div>
  `;

  // Hover glow effect
  card.addEventListener("mouseenter", () => {
    card.style.boxShadow = `0 0 20px ${color}`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.boxShadow = "none";
  });

  return card;
}

// =======================
// LOAD SECTION
// =======================

function loadSection(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  items.forEach(item => {
    const card = createItemCard(item);
    container.appendChild(card);
  });
}

// =======================
// INITIAL LOAD
// =======================

loadSection(shopData.featured, "featured-items");
loadSection(shopData.daily, "daily-items");

let scene, camera, renderer, model, controls;
const modal = document.getElementById('model-modal');
const modalContent = document.querySelector('.modal-content');
const closeModalBtn = document.getElementById('close-modal');
const viewerContainer = document.getElementById('model-viewer-container');

function init3DViewer(modelPath) {
  // Clear previous renderer if exists
  if (renderer) {
    renderer.dispose();
    viewerContainer.innerHTML = '';
  }

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);

  camera = new THREE.PerspectiveCamera(45, viewerContainer.clientWidth / viewerContainer.clientHeight, 0.1, 1000);
  camera.position.set(0, 1.5, 3);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(viewerContainer.clientWidth, viewerContainer.clientHeight);
  viewerContainer.appendChild(renderer.domElement);

  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
  scene.add(light);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(3, 10, 10);
  scene.add(directionalLight);

  // Load GLB model
  const loader = new THREE.GLTFLoader();
  loader.load(modelPath, function (gltf) {
    model = gltf.scene;
    model.rotation.y = Math.PI; // Rotate model for better view
    scene.add(model);
  }, undefined, function (error) {
    console.error(error);
  });

  // Handle resize
  window.addEventListener('resize', onWindowResize);

  // For rotating the model
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };

  viewerContainer.addEventListener('mousedown', function (e) {
    isDragging = true;
    previousMousePosition.x = e.clientX;
    previousMousePosition.y = e.clientY;
  });

  viewerContainer.addEventListener('mouseup', function () {
    isDragging = false;
  });

  viewerContainer.addEventListener('mousemove', function (e) {
    if (isDragging && model) {
      let deltaX = e.clientX - previousMousePosition.x;
      model.rotation.y += deltaX * 0.01;
      previousMousePosition.x = e.clientX;
    }
  });

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

closeModalBtn.onclick = function () {
  modal.style.display = 'none';
  // Dispose scene and renderer properly
  if (renderer) {
    renderer.dispose();
    viewerContainer.innerHTML = '';
  }
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = 'none';
    if (renderer) {
      renderer.dispose();
      viewerContainer.innerHTML = '';
    }
  }
};

// Modify createItemCard to open 3D viewer on click
function createItemCard(item) {
  const card = document.createElement("div");
  card.className = "item-card";

  const color = getRarityColor(item.rarity);

  card.innerHTML = `
    <div class="item-image" style="border-bottom: 4px solid ${color}">
      <img src="${item.image}">
    </div>

    <div class="item-info">
      <h3>${item.name}</h3>
      <p class="price">${item.price} V-Bucks</p>
    </div>
  `;

  card.addEventListener("mouseenter", () => {
    card.style.boxShadow = `0 0 20px ${color}`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.boxShadow = "none";
  });

  card.addEventListener("click", () => {
    // Open modal and load 3D model
    modal.style.display = "flex";

    // Model path logic: assuming your models folder uses the item's name in lowercase with dashes and .glb extension
    // For example: "Galaxy Skin" => "models/galaxy-skin.glb"
    const modelFileName = item.name.toLowerCase().replace(/\s+/g, '-') + ".glb";
    const modelPath = `models/${modelFileName}`;

    init3DViewer(modelPath);
  });

  return card;
}

// Wait until Three.js loads before loading items and initializing
loadThreeJS(() => {
  loadSection(shopData.featured, "featured-items");
  loadSection(shopData.daily, "daily-items");
});