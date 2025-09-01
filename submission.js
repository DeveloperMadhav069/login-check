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

const form = document.getElementById('ideaForm');
const formMessage = document.getElementById('formMessage');

let currentUser = null;

// Monitor auth state
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  if (!user) {
    formMessage.textContent = 'You must be logged in to submit your idea.';
    formMessage.style.color = '#ff4d4d';
  } else {
    formMessage.textContent = '';
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formMessage.textContent = '';
  formMessage.style.color = '';

  if (!currentUser) {
    formMessage.textContent = 'You must be logged in to submit your idea.';
    formMessage.style.color = '#ff4d4d';
    return;
  }

  const name = form.name.value.trim();
  const age = Number(form.age.value);
  const email = form.email.value.trim();
  const projectTitle = form.projectTitle.value.trim();
  const projectDetails = form.projectDetails.value.trim();
  const fileInput = form.mediaUpload;

  if (!name || !email || !projectTitle || !projectDetails) {
    formMessage.textContent = 'Please fill in all required fields.';
    formMessage.style.color = '#ff4d4d';
    return;
  }

  // Enforce age between 8 and 14
  if (!Number.isInteger(age) || age < 8 || age > 14) {
    formMessage.textContent = 'Age must be a whole number between 8 and 14 years.';
    formMessage.style.color = '#ff4d4d';
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    formMessage.textContent = 'Please enter a valid email address.';
    formMessage.style.color = '#ff4d4d';
    return;
  }

  formMessage.textContent = 'Submitting your idea...';
  formMessage.style.color = '#ffaa00';

  try {
    let mediaUrl = null;

    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/bmp',
        'video/mp4',
        'video/webm',
        'video/ogg'
      ];
      if (!allowedTypes.includes(file.type)) {
        formMessage.textContent = 'Unsupported file type. Please upload PDF, image, or video files only.';
        formMessage.style.color = '#ff4d4d';
        return;
      }
      // Limit file size to 20MB
      const MAX_SIZE = 20 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        formMessage.textContent = 'File size too large. Maximum allowed size is 20MB.';
        formMessage.style.color = '#ff4d4d';
        return;
      }
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
    formMessage.textContent = 'Submission failed. Please try again later.';
    formMessage.style.color = '#ff4d4d';
  }
});
