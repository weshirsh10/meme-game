import { firestore, storage } from 'firebase';
import {randCaptionArray} from './randCaptionArray'
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
            roundScore: 0,
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
            players: playerObj,
            playerCount: 1
        }

        return [firebase
        .firestore()
        .collection('rooms')
        .doc(code)
        .set(roomObj), code]


    }

    updatePlayerCount = async (roomCode) => {
        let playerInc = firebase.firestore.FieldValue.increment(1)

        let update = firebase.firestore()
        .collection("rooms")
        .doc(roomCode)
        .update({
            playerCount: playerInc,
        })
       
    }

    joinRoom = async (playerName, roomCode) => {
        roomCode =roomCode.toUpperCase()

        let user = await this.createUser(playerName, roomCode)
        await this.updatePlayerCount(roomCode)
        //TODO
        //ADD Firebase user ID to player obj
        //Check to see if 8 players in room
        //check user names for duplicates

        let playerObj = {
            name: playerName,
            roundScore: 0,
            points: 0,
            imgPath: '',
            caption: '',
            turn: '',
            voted: false,
        }

        return firebase
        .firestore()
        .collection("rooms")
        .doc(roomCode)
        .update({
            ["players." + user]: playerObj,
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
        let updateObj = {timer: false, state: _state}

        if(_state == 'VOTING'){
            firebase
            .firestore()
            .collection('rooms')
            .doc(room)
            .get().then(resp => {
                for(var player in resp.data().players){
                    if(!resp.data().players[player].imgPath && !resp.data().players[player].caption){
                        updateObj["players." + player + ".caption"] = randCaptionArray[Math.floor(Math.random() * randCaptionArray.length)]
                    }
                }

                firebase.firestore()
                .collection("rooms")
                 .doc(room)
                 .update(updateObj)

            })
        }
        else{
        firebase.firestore()
        .collection("rooms")
        .doc(room)
        .update(updateObj)
        }

        
    }

    startGame = (room, players) => {
        let turn = 1
        for(var player in players){
            firebase.firestore()
            .collection('rooms')
            .doc(room)
            .update({["players." + player + ".turn"]: turn})
            turn += 1
        }

        this.updateRoomState(room, "UPLOAD")

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
            // if(!resp.data().players[player].caption){
            //     vote = 0
            // }
            let votes = resp.data().votes
            // let points = resp.data().players[player]["points"]
            let playerNum = Object.keys(resp.data().players).length
            // let roundScore = resp.data().players[player]["roundScore"]
            // points = points + vote
            // roundScore = roundScore + vote
            votes = votes + 1

            let pointsInc = firebase.firestore.FieldValue.increment(vote) 
            let roundInc = firebase.firestore.FieldValue.increment(vote)

            console.log("Points Inc", pointsInc)
            console.log("round Inc", roundInc)
            console.log("Judge", judge)

            firebase
            .firestore()
            .collection('rooms')
            .doc(room)
            .update({votes: votes, ["players." + player + ".roundScore"]: roundInc,["players." + player + ".points"]: pointsInc, ["players." + voter + ".voted"]: true })
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
                updateObj["players." + player + ".roundScore"] = 0
            }

            firebase
            .firestore()
            .collection('rooms')
            .doc(room)
            .update(updateObj)

        })
    }

    updateRoundTimestamp = (room, timer) => {
        if(!timer){
            let timestamp = Math.floor(Date.now() / 1000)
            console.log(timestamp)

            firebase
            .firestore()
            .collection('rooms')
            .doc(room)
            .update({
                timer: true,
                roundTimestamp: timestamp
            })
        }
    }

    updatePlayerTurn = (player, playerCount, room) => {
        firebase
        .firestore()
        .collection("rooms")
        .doc(room)
        .update({
            ["players." + player + ".turn"]: playerCount
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