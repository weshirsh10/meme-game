const firebase = require('firebase')

class FirebaseService {

    initialize = () => {
        firebase.initializeApp({
            apiKey: "AIzaSyALA39qy85l0AdqAc5DrfuSJWe5eQsTO3s",
            authDomain: "rt-game-d8121.firebaseapp.com",
            databaseURL: "https://rt-game-d8121.firebaseio.com",
            projectId: "rt-game-d8121",
            storageBucket: "rt-game-d8121.appspot.com",
            messagingSenderId: "525177692316",
            appId: "1:525177692316:web:0d189eb0b6fefc4b470d59",
            measurementId: "G-9RQNL95G1K"
        });
    }

    createRoom = (hostName) => {
        let code = Math.random().toString(36).slice(2).substr(0,4)

        let roomObj = {
            state: "lobby",
            roomCode: code,
            host: hostName,
            players: { 
                name: hostName
            }
        }

        return firebase
        .firestore()
        .collection('rooms')
        .doc(code)
        .set(roomObj)


    }

    joinRoom = (playerName, roomCode) => {

        let playerObj = {
            name: playerName
        }

        return firebase
        .firestore()
        .collection("rooms")
        .doc(roomCode)
        .update({
            ["players." + playerName]: playerObj
        })

    }

    createUser = () => {
        firebase.auth().signInAnonymously();
    } 

    getUserStatus = () => {
        return firebase.auth()
    }

    // getCurrentUser = () => {
    //     console.log("calling func")
    //     firebase.auth().onAuthStateChanged(user => {
    //         console.log("User", user)
    //         return user           
    //     })
    // }
}

export default FirebaseService