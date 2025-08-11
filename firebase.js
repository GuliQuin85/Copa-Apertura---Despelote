<!-- firebase.js -->
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

  // TU CONFIG:
  const firebaseConfig = {
    apiKey: "AIzaSyDG2P95fbe6v1MSbjR030INXdiYEr1pY_s",
    authDomain: "copadespelote.firebaseapp.com",
    projectId: "copadespelote",
    storageBucket: "copadespelote.firebasestorage.app",
    messagingSenderId: "976706930384",
    appId: "1:976706930384:web:bc4e588f95ac02e71cc0d5",
    measurementId: "G-NMBSSGMRYC"
  };

  const app = initializeApp(firebaseConfig);
  window.firebaseAuth = getAuth(app);
  window.firebaseDB   = getFirestore(app);
</script>
