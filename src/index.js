import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAR7JDiwWbAlNrfAmqpwWfITW6royBAxHA",
  authDomain: "fir-9-7ea84.firebaseapp.com",
  projectId: "fir-9-7ea84",
  storageBucket: "fir-9-7ea84.appspot.com",
  messagingSenderId: "700861402317",
  appId: "1:700861402317:web:b9888e0ebbadfa79f92d84",
};

// init firebase app
initializeApp(firebaseConfig);

// init services
const db = getFirestore();
const auth = getAuth();

// collection ref
const colRef = collection(db, "books");

// get collection data
// getDocs(colRef)
//   .then((snapshot) => {
//     let books = [];

//     snapshot.docs.forEach((doc) => {
//       books.push({ ...doc.data(), id: doc.id });
//     });
//     console.log(books);
//   })
//   .catch((err) => {
//     console.error(err);
//   });

// real time collection data
// const onsubCol = onSnapshot(colRef, (snapshot) => {
//   let books = [];

//   snapshot.docs.forEach((doc) => {
//     books.push({ ...doc.data(), id: doc.id });
//   });
//   console.log(books);
// });

// queries
// const q = query(
//   colRef,
//   where("author", "==", "Baptiste Muday"),
//   orderBy("title", "asc")
// );

const q = query(colRef, orderBy("createdAt"));

// real time query data
const unsubQuery = onSnapshot(q, (snapshot) => {
  let books = [];

  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });
  console.log(books);
});

// adding documents
const addBookForm = document.querySelector(".add-book");
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    addBookForm.reset();
    console.log("New book added!");
  });
});

// updating documents
const updateBookForm = document.querySelector(".update-book");
updateBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", updateBookForm.id.value);

  updateDoc(docRef, {
    title: updateBookForm.newTitle.value,
  }).then(() => {
    updateBookForm.reset();
    console.log("Book updated!");
  });
});

// deleting documents
const deleteBookForm = document.querySelector(".delete-book");
deleteBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", deleteBookForm.id.value);

  deleteDoc(docRef).then(() => {
    deleteBookForm.reset();
    console.log("Book deleted!");
  });
});

// get a single document

const docRef = doc(db, "books", "7QM48zSi9fdTtUqCXgV5");

// getDoc(docRef).then((doc) => {
//   console.log(doc.data(), doc.id);
// });

// const unsubDoc = onSnapshot(docRef, (doc) => {
//   console.log(doc.data(), doc.id);
// });

// signing users up

const signupForm = document.querySelector(".signup");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = signupForm.email.value;
  const password = signupForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((credentials) => {
      signupForm.reset();
      console.log("User created:", credentials.user);
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// logging in and out

const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((credentials) => {
      loginForm.reset();
      //   console.log("User logged in:", credentials.user);
    })
    .catch((err) => {
      console.log(err.message);
    });
});

const logoutButton = document.querySelector(".logout");
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      //   console.log("User logged out.");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log("User status changed", user);
});

// // unsubscribing from changes (auth & db)
const unsubButton = document.querySelector(".unsub");
unsubButton.addEventListener("click", () => {
  console.log("Unsubscribing");
  // unsubCol()
  // unsubDoc()
  unsubQuery();
  unsubAuth();
});
