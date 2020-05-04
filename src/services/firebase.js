import { firestore } from 'firebase';

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
        let user = await this.createUser(hostName, code)

        let playerObj = {}
        playerObj[user] = {
            name:hostName,
            turn: 1,
            points: 0
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

    getPlayers = async (roomCode) => {
        let roomObj = 
        firebase.firestore()
        .collection("rooms")
        .doc(roomCode)
        .get()
        return Object.keys((await roomObj).data().players)

    }

    joinRoom = async (playerName, roomCode) => {
        console.log("IN JOIN ROOM")


        let user = await this.createUser(playerName, roomCode)
        let players = await this.getPlayers(roomCode)
        //TODO
        //ADD Firebase user ID to player obj
        //Check to see if 8 players in room


        let playerObj = {
            name: playerName,
            turn: Object.keys(players).length + 1,
            points: 0

        }

        return firebase
        .firestore()
        .collection("rooms")
        .doc(roomCode)
        .update({
            ["players." + user]: playerObj
        })

    }

    roomIsValid = async (roomCode)  => {
        let room = firebase
        .firestore()
        .collection("rooms")
        .doc(roomCode)
        .get()

        
    }

    deleteUser = () => {
        let user = firebase.auth().currentUser
        user.delete().then( () => {
            firebase.firestore().collection("users").doc(user.uid).delete()
        })
    }

    createUser = async (name, roomCode) => {

        let userObj = {
            name: name,
            room: roomCode
        }
    
        let user = await firebase.auth().signInAnonymously()
 
        firebase
        .firestore()
        .collection("users")
        .doc(user.user.uid)
        .set(userObj)

        return user.user.uid

    }
    
    getUser = (userName) => {
        return firebase
        .firestore()
        .collection("users")
        .doc(userName)
        .get()
    }

    getUserStatus = () => {
        return firebase.auth()
    }

    updateRoomState = (room, _state) => {
        firebase.firestore()
        .collection("rooms")
        .doc(room)
        .update({state: _state})
    }
}

export default FirebaseService