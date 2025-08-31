import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

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
