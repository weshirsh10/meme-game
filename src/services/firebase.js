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

    createRoom = async (hostName) => {
        let code = Math.random().toString(36).slice(2).substr(0,4)
        let user = await this.createUser()

        let playerObj = {}
        playerObj[user] = {
            name:hostName
        }

        let roomObj = {
            state: "lobby",
            roomCode: code,
            host: hostName,
            players: playerObj
        }

        return [firebase
        .firestore()
        .collection('rooms')
        .doc(code)
        .set(roomObj), code]


    }

    joinRoom = async (playerName, roomCode) => {

        let user = await this.createUser()
        console.log(user)

        //TODO
        //ADD Firebase user ID to player obj
        //Check to see if 8 players in room

        let playerObj = {
            name: playerName
        }

        return firebase
        .firestore()
        .collection("rooms")
        .doc(roomCode)
        .update({
            ["players." + user]: playerObj
        })

    }

    createUser = async () => {
        let user = await firebase.auth().signInAnonymously()
        return user.user.uid

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