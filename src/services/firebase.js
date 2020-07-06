import { firestore, storage } from 'firebase';
import {randCaptionArray} from './randCaptionArray'
const firebase = require('firebase')
require("firebase/functions");

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

        firebase.analytics()
    }

    createRoom = async (hostName) => {
        let code = Math.random().toString(36).slice(2).substr(0,4).toUpperCase()
        
        let user = await this.createUser(hostName, code, true)

        let playerObj = {}
        playerObj[user] = {
            name:hostName,
            turn: 1,
            roundScore: 0,
            points: 0,
            imgPath: '',
            caption: '',
            voters: '',
            voted: false
        }

        let roomObj = {
            turn: 1,
            state: "LOBBY",
            roomCode: code,
            votes: 0,
            host: hostName,
            players: playerObj,
            playerCount: 1,
            round: 1
        }
        //create room timer
        let timerObj = {
            time: 90,
        }

        firebase.firestore()
        .collection('timers')
        .doc(code)
        .set(timerObj)

        firebase.analytics().logEvent("New Room", {room: code})

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
        roomCode = roomCode.toUpperCase()

        let user = await this.createUser(playerName, roomCode, false)
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
            voters: '',
            voted: false,
        }

        firebase.analytics().logEvent("Join Room", {room: roomCode})

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

    createUser = async (name, roomCode, host) => {

        let userObj = {
            name: name,
            room: roomCode,
            host: host
        }

        return await firebase.auth().signInAnonymously()
        .then( user =>{
            firebase
            .firestore()
            .collection("users")
            .doc(user.user.uid)
            .set(userObj)
            return user.user.uid
        })
        .catch(err => {
            console.log("Error AUth", err)
            return "error"
        })
    
        // let user = await firebase.auth().signInAnonymously()
        //         .catch(err => {
        //             console.log("AuthErr", err)
        //         })
        // firebase
        // .firestore()
        // .collection("users")
        // .doc(user.user.uid)
        // .set(userObj)

        // return user.user.uid

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

    isJoinValid = async (name, room) => {

        return firebase.firestore().collection('rooms').doc(room.toUpperCase()).get()
        .then( doc => {
            if(doc.exists){
                if(doc.data().state == "LOBBY"){
                    this.joinRoom(name, room)
                    return ""
                 }
                else{
                    return "Game has already Started"
                }
            }
            else{
                return "Invalid Room Code"
            }
           
        })

    }

    updateRoomState = (room, _state) => {
        let updateObj = {state: _state}

        if(_state == 'VOTING'){
            let player = this.getCurrentUser()
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
        else if (_state == "UPLOAD2"){
            let player = this.getCurrentUser()
            firebase
            .firestore()
            .collection('rooms')
            .doc(room)
            .get().then(resp => {
                if(resp.data().players[player].turn == resp.data().turn && !resp.data().players[player].caption){
                    updateObj["players." + player + ".caption"] = randCaptionArray[Math.floor(Math.random() * randCaptionArray.length)]
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

    keepPlaying = (room) => {
        firebase.analytics().logEvent("Keep Playing", {room: room})
        firebase.firestore()
        .collection('rooms')
        .doc(room)
        .update({round: 1, state: "UPLOAD"})
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
        firebase.analytics().logEvent("Game Started", {room: room})


    }


    submitCaption = async (room, caption) => {
        let user = await firebase.auth().currentUser;
        firebase
        .firestore()
        .collection('rooms')
        .doc(room)
        .update({["players." + user.uid + ".caption"]: caption})
    }

    submitVote = async (room, player, judge, voter, points) => {
        let vote = points
        if(judge){
            vote = 100
        }
        firebase
        .firestore()
        .collection('rooms')
        .doc(room)
        .get().then( resp => {
            let votes = resp.data().votes
            let playerNum = Object.keys(resp.data().players).length
            votes = votes + 1

            let pointsInc = firebase.firestore.FieldValue.increment(vote) 
            let roundInc = firebase.firestore.FieldValue.increment(vote)

            let voterName = resp.data().players[voter].name
            let voterList = resp.data().players[player].voters + "("+ voterName + ":+" + vote +')'
            firebase
            .firestore()
            .collection('rooms')
            .doc(room)
            .update({votes: votes, ["players." + player + ".voters"]: voterList,["players." + player + ".roundScore"]: roundInc,["players." + player + ".points"]: pointsInc, ["players." + voter + ".voted"]: true })
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
            let round = resp.data().round

            if(turn > Object.keys(players).length){
                turn = 1 
                round = round + 1
                if(round == 2){
                    newState = "ROUND2"
                    firebase.analytics().logEvent("End Round1", {players: Object.keys(players).length})
                }
                else if(round == 3){
                    newState = "ENDGAME"
                    firebase.analytics().logEvent("End Round2", {players: Object.keys(players).length})

                }
            }

            let updateObj = {
                turn: turn,
                state: newState,
                votes: 0,
                round: round,
                roundTimestamp: 90
            }

            for(var player in players){
                updateObj["players." + player + ".caption"] = ''
                updateObj["players." + player + ".imgPath"] = ''
                updateObj["players." + player + ".voted"] = false
                updateObj["players." + player + ".roundScore"] = 0
                updateObj["players." + player + ".voters"] = ''
            }

            firebase
            .firestore()
            .collection('rooms')
            .doc(room)
            .update(updateObj)

        })
    }

    toggleTimer = (room, timerBool) => {
        // let timestamp = firebase.firestore.FieldValue.increment(-1)
        firebase
        .firestore()
        .collection('rooms')
        .doc(room)
        .update({
            timer: timerBool
        })
    }

    updateTimer = (command, room) => {
        if(command == "RESET"){
            firebase.firestore()
            .collection('timers')
            .doc(room)
            .update({time: 90})
        }
        else if(command == "DEC"){
            const dec = firebase.firestore.FieldValue.increment(-1)

            firebase.firestore()
            .collection('timers')
            .doc(room)
            .update({time: dec})
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
        firebase.analytics().logEvent("File Upload 1", {room: room})

    }

    uploadFile2 = (file, room, name) => {
        let path = room + "/" + name + "/round2"
        firebase.analytics().logEvent("File Upload 2", {room: room})
        var storageRef = firebase.storage().ref(path)
        return storageRef.put(file).then( (snapshot) => {
            //update image file path
            firebase
            .firestore()
            .collection('rooms')
            .doc(room)
            .update({
                ["players." + name +".imgPath"]: path
            })
        } )
    }
    


    downloadFile = (filepath) => {
        var storageRef = firebase.storage().ref(filepath)
        return storageRef.getDownloadURL()
            

    }

    //ADMIN FUNCTIONS
    clearEverything = () => {
        firebase
        .firestore()
        .collection('users')
        .get().then(db => {
            db.docs.map( doc => {
                try{
                    firebase.firestore().collection("rooms").doc(doc.data().room).delete()

                }
                catch(err){
                    console.log(err)
                }
                if(doc.id != 'hold'){
                    firebase.firestore().collection("users").doc(doc.id).delete()

                }
            })
        })

    }

    exitGame = async (players, room) => {
       var exitGame = firebase.functions().httpsCallable('exitGame2')
       firebase.analytics().logEvent("Exit game", {room: room})
       return exitGame({players: players, room: room})
    }

    sendReport = async (gameState) => {
        firebase.analytics().logEvent("Report Sent", {gamestate: gameState})
        var sendReport = firebase.functions().httpsCallable('sendReport')
        return sendReport({gameState: gameState})
    }

    sendFeedback = (feedback, room) => {
        firebase.analytics().logEvent("Feedback", {feedback: feedback, room: room})
        return firebase.firestore().collection('feedback').doc().set({room: room, feedback: feedback})
    }
}

export default FirebaseService