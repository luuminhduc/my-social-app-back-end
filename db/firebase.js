// const firebaseConfig = {
// 	apiKey: "AIzaSyBdHzHquQaUjgyteByC2k0LnxDUU0ZYRGc",
// 	authDomain: "social-app-34b82.firebaseapp.com",
// 	projectId: "social-app-34b82",
// 	storageBucket: "social-app-34b82.appspot.com",
// 	messagingSenderId: "191628537396",
// 	appId: "1:191628537396:web:1147fa8bbcd1526b63e461",
// };

const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const {
	apiKey,
	authDomain,
	projectId,
	storageBucket,
	messagingSenderId,
	appId,
} = process.env;

const firebaseConfig = {
	apiKey,
	authDomain,
	projectId,
	storageBucket,
	messagingSenderId,
	appId,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = storage;
