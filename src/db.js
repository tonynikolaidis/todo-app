import Vue from 'vue'

import {firestorePlugin} from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'

// Get a Firestore instance
export const db = firebase
    .initializeApp({
        apiKey: "AIzaSyAFQy9PfWaFNxLW8SwyVH-2JaM-ACLMuEw",
        authDomain: "vuetify-to-do.firebaseapp.com",
        projectId: "vuetify-to-do",
        storageBucket: "vuetify-to-do.appspot.com",
        messagingSenderId: "65757605618",
        appId: "1:65757605618:web:0d0aaa72df5351135dea6b",
        measurementId: "G-F9JPPWFYXW"
    })
    .firestore()

Vue.use(firestorePlugin)