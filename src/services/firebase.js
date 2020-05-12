import { firestore, storage } from 'firebase';

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
        let code = Math.random().toString(36).slice(2).substr(0,4).toUpperCase()
        
        let user = await this.createUser(hostName, code)

        let playerObj = {}
        playerObj[user] = {
            name:hostName,
            turn: 1,
            points: 0,
            imgPath: '',
            caption: '',
            voted: false

        }

        let roomObj = {
            turn: 1,
            state: "LOBBY",
            roomCode: code,
            votes: 0,
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
        roomCode =roomCode.toUpperCase()

        let user = await this.createUser(playerName, roomCode)
        let players = await this.getPlayers(roomCode)
        //TODO
        //ADD Firebase user ID to player obj
        //Check to see if 8 players in room
        //check user names for duplicates


        let playerObj = {
            name: playerName,
            turn: Object.keys(players).length + 1,
            points: 0,
            imgPath: '',
            caption: '',
            voted: false

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

        return room

        
    }

    deleteUser = () => {
        let user = firebase.auth().currentUser
        user.delete().then( () => {
            firebase.firestore().collection("users").doc(user.uid).delete()
        })
    }

    getCurrentUser = () => {
        return firebase.auth().currentUser.uid
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


    submitCaption = async (room, caption) => {
        let user = await firebase.auth().currentUser;
        firebase
        .firestore()
        .collection('rooms')
        .doc(room)
        .update({["players." + user.uid + ".caption"]: caption})
    }

    submitVote = async (room, player, judge, voter) => {
        let vote = 10
        if(judge){
            vote = 100
        }
        firebase
        .firestore()
        .collection('rooms')
        .doc(room)
        .get().then( resp => {
            let votes = resp.data().votes
            let points = resp.data().players[player]["points"]
            let playerNum = Object.keys(resp.data().players).length
            let gameState = resp.data().state
            points = points + vote
            votes = votes + 1

            if(playerNum == votes) {
                gameState = "SCORING"
            }

            firebase
            .firestore()
            .collection('rooms')
            .doc(room)
            .update({votes: votes, state: gameState, ["players." + player + ".points"]: points, ["players." + voter + ".voted"]: true })
        })

    }

    clearState = async (newState, room) => {
        firebase
        .firestore()
        .collection('rooms')
        .doc(room)
        .get().then( resp => {
            let players = resp.data().players
            let turn = resp.data().turn + 1

            if(turn > Object.keys(players).length){
                turn = 1    
            }

            let updateObj = {
                turn: turn,
                state: newState,
                votes: 0
            }

            for(var player in players){
                updateObj["players." + player + ".caption"] = ''
                updateObj["players." + player + ".imgPath"] = ''
                updateObj["players." + player + ".voted"] = false


            }

            firebase
            .firestore()
            .collection('rooms')
            .doc(room)
            .update(updateObj)

        })
    }

    //Firebase Storage Functions

    uploadFile = (file, room, name) => {
        let path = room + "/" + name + "/round1"
        var storageRef = firebase.storage().ref(path)
        storageRef.put(file).then( (snapshot) => {
            //update image file path
            firebase
            .firestore()
            .collection('rooms')
            .doc(room)
            .update({
                state: "CAPTION",
                ["players." + name +".imgPath"]: path
            })
        } )
    }

    downloadFile = (filepath) => {
        var storageRef = firebase.storage().ref(filepath)
        return storageRef.getDownloadURL()
            

    }
}

export default FirebaseService