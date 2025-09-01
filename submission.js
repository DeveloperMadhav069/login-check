import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

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
const db = getFirestore(app);
const storage = getStorage(app);

const form = document.getElementById('submission-form');
const formMessage = document.getElementById('form-message');

// Store current logged in user info
let currentUser = null;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formMessage.textContent = '';

  if (!currentUser) {
    formMessage.textContent = 'You must be logged in to submit your idea.';
    formMessage.style.color = '#ff4d4d';
    return;
  }

  const name = form.name.value.trim();
  const age = Number(form.age.value);
  const email = form.email.value.trim();
  const projectTitle = form['project-title'].value.trim();
  const projectDetails = form['project-details'].value.trim();
  const fileInput = form['media-upload'];

  if (!name || !age || !email || !projectTitle || !projectDetails) {
    formMessage.textContent = 'Please fill in all required fields.';
    formMessage.style.color = '#ff4d4d';
    return;
  }

  if (age < 8 || age > 14) {
    formMessage.textContent = 'Age must be between 8 and 14.';
    formMessage.style.color = '#ff4d4d';
    return;
  }

  formMessage.textContent = 'Submitting your idea...';
  formMessage.style.color = '#ffaa00';

  try {
    let mediaUrl = null;
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const storageRef = ref(storage, `project_media/${currentUser.uid}_${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      mediaUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, 'ideas'), {
      userId: currentUser.uid,
      name,
      age,
      email,
      projectTitle,
      projectDetails,
      mediaUrl,
      createdAt: serverTimestamp()
    });

    formMessage.textContent = 'Your idea was submitted successfully!';
    formMessage.style.color = '#33ff99';
    form.reset();
  } catch (error) {
    console.error('Error submitting idea:', error);
    formMessage.textContent = 'Failed to submit your idea. Please try again.';
    formMessage.style.color = '#ff4d4d';
  }
});
