import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

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
const db = getFirestore(app);

const ideasGrid = document.getElementById('ideas-grid');
const loadingMessage = document.getElementById('loading-message');
const errorMessage = document.getElementById('error-message');

async function loadIdeas() {
  loadingMessage.style.display = 'block';
  errorMessage.textContent = '';
  ideasGrid.innerHTML = '';

  try {
    const ideasCollection = collection(db, 'ideas');
    const q = query(ideasCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      ideasGrid.innerHTML = '<p>No ideas have been submitted yet.</p>';
    } else {
      querySnapshot.forEach(doc => {
        const idea = doc.data();
        const card = createIdeaCard(idea);
        ideasGrid.appendChild(card);
      });
    }
  } catch (error) {
    console.error('Error fetching ideas:', error);
    errorMessage.textContent = 'Failed to load ideas. Please try again later.';
  } finally {
    loadingMessage.style.display = 'none';
  }
}

function createIdeaCard(idea) {
  const card = document.createElement('article');
  card.className = 'idea-card';
  card.tabIndex = 0;
  card.setAttribute('aria-label', `Startup idea titled ${idea.projectTitle} by ${idea.name}`);

  const title = document.createElement('h2');
  title.className = 'idea-title';
  title.textContent = idea.projectTitle;

  const owner = document.createElement('p');
  owner.className = 'idea-owner';
  owner.textContent = `By: ${idea.name}, Age: ${idea.age}`;

  const details = document.createElement('p');
  details.className = 'idea-details';
  details.textContent = idea.projectDetails;

  card.appendChild(title);
  card.appendChild(owner);
  card.appendChild(details);

  if (idea.mediaUrl) {
    const mediaPreview = document.createElement('div');
    mediaPreview.className = 'media-preview';

    // Determine media type by extension
    const url = idea.mediaUrl.toLowerCase();
    if (url.endsWith('.pdf')) {
      const link = document.createElement('a');
      link.href = idea.mediaUrl;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'View PDF Document';
      mediaPreview.appendChild(link);
    } else if (url.match(/\.(jpg|jpeg|png|gif|bmp)$/)) {
      const img = document.createElement('img');
      img.src = idea.mediaUrl;
      img.alt = `${idea.projectTitle} image`;
      mediaPreview.appendChild(img);
    } else if (url.match(/\.(mp4|webm|ogg)$/)) {
      const video = document.createElement('video');
      video.src = idea.mediaUrl;
      video.controls = true;
      video.title = `${idea.projectTitle} video`;
      mediaPreview.appendChild(video);
    } else {
      // fallback link if unknown media type
      const link = document.createElement('a');
      link.href = idea.mediaUrl;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'View Media';
      mediaPreview.appendChild(link);
    }

    card.appendChild(mediaPreview);
  }

  return card;
}

loadIdeas();
