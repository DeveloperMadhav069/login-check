// 3D Logo rendering on canvas (glossy colorful letter K + text)
(() => {
  const canvas = document.getElementById('logo-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  // Clear
  ctx.clearRect(0, 0, w, h);

  // Draw glossy 3D "K" letter - simple stylized shape
  const gradient = ctx.createLinearGradient(0, 0, w, 0);
  gradient.addColorStop(0, '#7a00ff');
  gradient.addColorStop(0.5, '#ff33bb');
  gradient.addColorStop(1, '#ff00cc');

  ctx.fillStyle = gradient;

  // Draw main K shape with depth
  ctx.shadowColor = '#ff33bb';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.beginPath();
  ctx.moveTo(w * 0.15, h * 0.15);
  ctx.lineTo(w * 0.35, h * 0.15);
  ctx.lineTo(w * 0.35, h * 0.45);
  ctx.lineTo(w * 0.55, h * 0.15);
  ctx.lineTo(w * 0.7, h * 0.15);
  ctx.lineTo(w * 0.45, h * 0.45);
  ctx.lineTo(w * 0.7, h * 0.85);
  ctx.lineTo(w * 0.55, h * 0.85);
  ctx.lineTo(w * 0.35, h * 0.55);
  ctx.lineTo(w * 0.35, h * 0.85);
  ctx.lineTo(w * 0.15, h * 0.85);
  ctx.closePath();
  ctx.fill();

  // Gloss highlight shape
  const glossGradient = ctx.createLinearGradient(0, 0, w * 0.7, h);
  glossGradient.addColorStop(0, 'rgba(255,255,255,0.5)');
  glossGradient.addColorStop(1, 'rgba(255,255,255,0)');

  ctx.fillStyle = glossGradient;
  ctx.beginPath();
  ctx.moveTo(w * 0.15, h * 0.15);
  ctx.lineTo(w * 0.35, h * 0.15);
  ctx.lineTo(w * 0.35, h * 0.35);
  ctx.lineTo(w * 0.15, h * 0.35);
  ctx.closePath();
  ctx.fill();
})();

// Hero 3D Animated Scene with Three.js
(() => {
  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas) return;

  // Scene setup
  const scene = new THREE.Scene();

  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    45,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 8);

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x000000, 0);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0xff33bb, 1.2);
  pointLight1.position.set(5, 5, 5);
  scene.add(pointLight1);
  const pointLight2 = new THREE.PointLight(0x7a00ff, 0.8);
  pointLight2.position.set(-5, -5, 5);
  scene.add(pointLight2);

  // Materials
  const neonPink = new THREE.MeshStandardMaterial({
    color: 0xff33bb,
    emissive: 0xff2a9e,
    emissiveIntensity: 0.9,
    roughness: 0.1,
    metalness: 0.8,
  });
  const neonBlue = new THREE.MeshStandardMaterial({
    color: 0x7a00ff,
    emissive: 0x5c00d6,
    emissiveIntensity: 0.85,
    roughness: 0.15,
    metalness: 0.7,
  });
  const neonPurple = new THREE.MeshStandardMaterial({
    color: 0xc900ff,
    emissive: 0xb400e0,
    emissiveIntensity: 0.8,
    roughness: 0.2,
    metalness: 0.6,
  });
  const neonTeal = new THREE.MeshStandardMaterial({
    color: 0x00d9ff,
    emissive: 0x00c9ff,
    emissiveIntensity: 0.75,
    roughness: 0.2,
    metalness: 0.6,
  });

  // Create floating objects (simple geometry approximations)

  // Floating Lightbulb (Sphere + base)
  function createLightbulb() {
    const group = new THREE.Group();

    const bulbGeom = new THREE.SphereGeometry(0.5, 32, 32);
    const bulb = new THREE.Mesh(bulbGeom, neonPink);
    group.add(bulb);

    const baseGeom = new THREE.CylinderGeometry(0.25, 0.25, 0.5, 32);
    const base = new THREE.Mesh(baseGeom, neonPurple);
    base.position.y = -0.55;
    group.add(base);

    return group;
  }

  // Floating Gear (Torus + spokes)
  function createGear() {
    const group = new THREE.Group();

    const torusGeom = new THREE.TorusGeometry(0.7, 0.15, 16, 100);
    const torus = new THREE.Mesh(torusGeom, neonBlue);
    group.add(torus);

    const spokeGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.9, 12);
    for (let i = 0; i < 8; i++) {
      const spoke = new THREE.Mesh(spokeGeom, neonBlue);
      spoke.rotation.z = (Math.PI / 4) * i;
      group.add(spoke);
    }

    return group;
  }

  // Floating Holographic Laptop (simple box + screen)
  function createLaptop() {
    const group = new THREE.Group();

    const baseGeom = new THREE.BoxGeometry(1.6, 0.15, 1);
    const base = new THREE.Mesh(baseGeom, neonTeal);
    base.position.y = -0.6;
    group.add(base);

    const screenGeom = new THREE.BoxGeometry(1.6, 1, 0.1);
    const screen = new THREE.Mesh(screenGeom, neonPink);
    screen.position.y = 0.2;
    screen.position.z = 0.45;
    group.add(screen);

    return group;
  }

  // Floating Rocket (Cylinder + cone + sphere base)
  function createRocket() {
    const group = new THREE.Group();

    const bodyGeom = new THREE.CylinderGeometry(0.2, 0.3, 1.5, 32);
    const body = new THREE.Mesh(bodyGeom, neonPurple);
    group.add(body);

    const noseGeom = new THREE.ConeGeometry(0.3, 0.6, 32);
    const nose = new THREE.Mesh(noseGeom, neonPink);
    nose.position.y = 1.05;
    group.add(nose);

    const baseGeom = new THREE.SphereGeometry(0.25, 16, 16);
    const base = new THREE.Mesh(baseGeom, neonPurple);
    base.position.y = -0.85;
    group.add(base);

    return group;
  }

  // Add objects to scene with initial positions
  const lightbulb = createLightbulb();
  lightbulb.position.set(-3, 1.5, 0);
  scene.add(lightbulb);

  const gear = createGear();
  gear.position.set(2.5, 1.2, 0);
  scene.add(gear);

  const laptop = createLaptop();
  laptop.position.set(-1.5, -1.5, 0);
  scene.add(laptop);

  const rocket = createRocket();
  rocket.position.set(2, -1.5, 0);
  scene.add(rocket);

  // Clock for animations
  const clock = new THREE.Clock();

  // Animate floating and rotation
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    const floatAmp = 0.25;
    const floatFreq = 0.8;

    // Floating effect with sine wave
    lightbulb.position.y = 1.5 + floatAmp * Math.sin(t * floatFreq);
    gear.position.y = 1.2 + floatAmp * Math.sin(t * floatFreq + 1.5);
    laptop.position.y = -1.5 + floatAmp * Math.sin(t * floatFreq + 3);
    rocket.position.y = -1.5 + floatAmp * Math.sin(t * floatFreq + 4.5);

    // Slow rotations
    lightbulb.rotation.y += 0.007;
    gear.rotation.z += 0.008;
    laptop.rotation.y -= 0.006;
    rocket.rotation.y += 0.005;

    renderer.render(scene, camera);
  }

  animate();

  // Resize handling
  window.addEventListener('resize', () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });
})();

// Feature icons drawn on canvases - simple neon style geometric shapes
(() => {
  function drawRocket(ctx, size) {
    ctx.clearRect(0, 0, size, size);
    ctx.strokeStyle = '#ff33bb';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#ff33bb';
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.moveTo(size * 0.5, size * 0.1);
    ctx.lineTo(size * 0.7, size * 0.5);
    ctx.lineTo(size * 0.5, size * 0.9);
    ctx.lineTo(size * 0.3, size * 0.5);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(size * 0.5, size * 0.1);
    ctx.lineTo(size * 0.5, size * 0.9);
    ctx.stroke();
  }
  function drawPuzzle(ctx, size) {
    ctx.clearRect(0, 0, size, size);
    ctx.strokeStyle = '#7a00ff';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#7a00ff';
    ctx.shadowBlur = 10;

    // Draw 4 puzzle pieces shapes simplified
    const s = size * 0.25;

    ctx.beginPath();
    ctx.rect(s * 0.5, s * 0.5, s, s);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(s * 1.5, s * 0.5);
    ctx.arc(s * 1.5, s * 0.75, s * 0.25, Math.PI * 1.5, Math.PI * 0.5, false);
    ctx.lineTo(s * 2, s * 1.25);
    ctx.stroke();
  }
  function drawTrophy(ctx, size) {
    ctx.clearRect(0, 0, size, size);
    ctx.strokeStyle = '#ff0096';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#ff0096';
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.moveTo(size * 0.3, size * 0.8);
    ctx.lineTo(size * 0.3, size * 0.6);
    ctx.lineTo(size * 0.7, size * 0.6);
    ctx.lineTo(size * 0.7, size * 0.8);
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(size * 0.35, size * 0.2, size * 0.3, size * 0.4);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(size * 0.3, size * 0.3);
    ctx.lineTo(size * 0.2, size * 0.2);
    ctx.lineTo(size * 0.2, size * 0.4);
    ctx.lineTo(size * 0.3, size * 0.3);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(size * 0.7, size * 0.3);
    ctx.lineTo(size * 0.8, size * 0.2);
    ctx.lineTo(size * 0.8, size * 0.4);
    ctx.lineTo(size * 0.7, size * 0.3);
    ctx.stroke();
  }
  function drawLightbulb(ctx, size) {
    ctx.clearRect(0, 0, size, size);
    ctx.strokeStyle = '#00d9ff';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#00d9ff';
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.arc(size * 0.5, size * 0.5, size * 0.3, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(size * 0.4, size * 0.7, size * 0.2, size * 0.2);
    ctx.stroke();
  }

  const icons = [
    { id: 'icon-rocket', draw: drawRocket },
    { id: 'icon-puzzle', draw: drawPuzzle },
    { id: 'icon-trophy', draw: drawTrophy },
    { id: 'icon-lightbulb', draw: drawLightbulb },
  ];

  icons.forEach(({ id, draw }) => {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    draw(ctx, size);
  });
})();

// FAQ Accordion functionality
(() => {
  const faqButtons = document.querySelectorAll('.faq-question');

  faqButtons.forEach(button => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      // Close all other
      faqButtons.forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
        btn.nextElementSibling.hidden = true;
      });

      if (!expanded) {
        button.setAttribute('aria-expanded', 'true');
        button.nextElementSibling.hidden = false;
        button.focus();
      }
    });
  });
})();

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDcwsWKNqy9-sJH5ZjWhkE2Buz4X_Gpk4w",
  authDomain: "kidpreneur-fc00a.firebaseapp.com",
  projectId: "kidpreneur-fc00a",
  storageBucket: "kidpreneur-fc00a.firebasestorage.app",
  messagingSenderId: "764380304058",
  appId: "1:764380304058:web:731b533b62ea0d6817e883",
  measurementId: "G-JRF353FQN2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const logoutBtn = document.getElementById('logout-btn');
const loginRegisterBtn = document.getElementById('login-register-btn');
const logoutBtnContainer = document.getElementById('logout-btn-container'); // Get the container

// Handle logout button click
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
      alert('You have been logged out.');
      window.location.href = 'login.html';
    }).catch(error => {
      console.error('Logout error:', error);
      alert('Error logging out. Please try again.');
    });
  });
}

// Update button visibility based on auth state
onAuthStateChanged(auth, user => {
  if (user) {
    // User is logged in
    if (loginRegisterBtn) {
      loginRegisterBtn.style.display = 'none'; // Hide login button
    }
    if (logoutBtnContainer) {
      logoutBtnContainer.style.display = 'block'; // Show logout button
    }
  } else {
    // User is not logged in
    if (loginRegisterBtn) {
      loginRegisterBtn.style.display = 'block'; // Show login button
    }
    if (logoutBtnContainer) {
      logoutBtnContainer.style.display = 'none'; // Hide logout button
    }
  }
});
