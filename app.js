import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
    getDatabase,
    ref,
    push,
    query,
    orderByChild,
    onValue,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";

const firebaseConfig = {
                apiKey: "AIzaSyAGa32-rxcCbtlFJiTHsF-q9-R2Sczw3vg",
                authDomain: "dmc-msgboard.firebaseapp.com",
                databaseURL: "https://dmc-msgboard-default-rtdb.firebaseio.com",
                projectId: "dmc-msgboard",
                storageBucket: "dmc-msgboard.firebasestorage.app",
                messagingSenderId: "925911902342",
                appId: "1:925911902342:web:7d8e96089bfa454107c907",
                measurementId: "G-PRL2Z1VWX8"
            };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

console.log("Firebase installed successfully.")

const senderName = document.getElementById('senderName');
const senderDegree = document.getElementById('senderDegree');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const messageList = document.getElementById('messageList');


//Saves message to Firebase when form is submitted
messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameText = senderName.value.trim();
    const degreeText = senderDegree.value.trim();
    const text = messageInput.value.trim();

    if (!text || !nameText || !degreeText) {
        return;
    }

    try {
        await push(ref(db, "messages"), {
            name: nameText,
            degree: degreeText,
            messageText: text,
            createdAt: serverTimestamp()
        });

        senderName.value = '';
        senderDegree.value = '';
        messageInput.value = '';
    } catch (error) {
        console.error("Error adding document ", error);
        alert("Failed to save message. Check your Realtime Database rules.");
    }
});

//Listen to Firebase for updates and display them automatically
const q = query(ref(db, "messages"), orderByChild("createdAt"));

onValue(q, (snapshot) => {
    messageList.innerHTML = '';

    snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        if (data.messageText) {
            const div = document.createElement('div');
            div.className = 'msg-item';

            const div1 = document.createElement('div');
            div.className = ('msg-header')
            const sender = document.createElement('strong');
            sender.textContent = [data.name, data.degree].filter(Boolean).join(' - ');

            const message = document.createElement('p');
            message.textContent = data.messageText;

            if (sender.textContent) {
                div.appendChild(sender);
            }
            div.appendChild(message);
            messageList.appendChild(div);
        }
    });
}, (error) => {
    console.error("Error loading messages ", error);
});