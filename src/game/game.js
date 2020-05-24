import React from 'react';
import styles from './styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import UploadComponent from './round1/judge/upload'
import WaitUploadComponent from './round1/player/waitUpload'
import CaptionComponent from './round1/player/caption'
import JudgeWaitingComponent from './round1/judge/judgeWait'
import VotingComponent from './round1/voting'
import ScoringComponent from './scoring'
import LobbyComponent from './lobby'
import FirebaseService from '../services/firebase'

const firebase = require('firebase')
const fbService = new FirebaseService();

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#ffffff',
            // dark: '#ffffff'
        },
        secondary: {
            main: '#57C5C9',
        }
    },
    typography: {
        h2: {
            fontFamily: ['Squada One']
        },
        h4: {
            fontSize: 20
        },
        h5: {
            fontFamily: ['Squada One']
        },
        button: {
            fontSize: 20,
            fontFamily: ['Squada One']
        }
    }
})


class GameComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            votes: 0,
            host: '',
            room: '',
            name: '',
            players: {},
            judge: '',
            user: '',
            judgeImg: '',
            gameState: '',
            turn: 1,
            timer: false,
            roundTimestamp: 0
            }
    }

    componentDidMount = async () => {
        await this.setState((state, props) => {
            let room = String(props.match.params.room)
            return {room: room.toUpperCase(), name: props.match.params.name}
            // name: props.match.params.name
        })

        await firebase
        .firestore()
        .collection('rooms')
        .doc(this.state.room)
        .onSnapshot( async res => {
            let _players = res.data().players
            let _host = res.data().host
            let _turn = res.data().turn
            let _gameState = res.data().state
            let _roundTimestamp = res.data().roundTimestamp
            let _timer = res.data().timer
            let _judge = ''
            let _user = ''
            let _judgeImg = ''

            for(var player in _players){
                if(_players[player].turn == _turn){
                    _user = player
                    _judge = _players[player].name
                    _judgeImg = _players[player].imgPath
                }
                else if (_players[player].turn == ''){
                    try{
                        fbService.updatePlayerTurn(player, res.data().playerCount, this.state.room)
                    }
                    catch(err){
                        console.log(err)
                    }
                }
            }
            await this.setState( {
                turn: _turn,
                players: _players,
                host: _host,
                judge: _judge,
                user: _user,
                judgeImg: _judgeImg,
                gameState: _gameState,
                roundTimestamp: _roundTimestamp,
                timer: _timer
            } )


        })   
        
    }
    

    render() {
        const { classes } = this.props;
        console.log("GameState", this.state)
        return(
            <div className={classes.main} >
                <div className={classes.paper}>
                    {
                        this.stateManager()
                    }
                </div>
            </div>
        )
    }

    stateManager = () => {
        if(this.state.name == this.state.judge){
            switch(this.state.gameState){
                case "LOBBY":
                    return <LobbyComponent theme={theme} hostName={this.state.judge} players={this.state.players} host={true} room={this.state.room} ></LobbyComponent>
                case 'UPLOAD':
                   return <UploadComponent theme={theme} room={this.state.room} user={this.state.user}></UploadComponent>
                case 'CAPTION':
                    fbService.updateRoundTimestamp(this.state.room, this.state.timer)
                    let captionCount = 0
                    for(var _player in this.state.players){
                        if(this.state.players[_player].caption){
                            captionCount ++
                        }
                    }
                    if(captionCount == Object.keys(this.state.players).length -1){
                        fbService.updateRoomState(this.state.room, "VOTING")
                    }

                    return <JudgeWaitingComponent theme={theme} room={this.state.room} timestamp={this.state.roundTimestamp} user={this.state.user} players={this.state.players}></JudgeWaitingComponent>

                case 'VOTING':
                    return <VotingComponent theme={theme} room={this.state.room} players={this.state.players} judge={true} filepath={this.state.judgeImg}></VotingComponent>
                
                case 'SCORING':
                    return <ScoringComponent theme={theme} judge={true} room={this.state.room} players={this.state.players}></ScoringComponent>

            }
        }
        else{
            switch(this.state.gameState){
                case "LOBBY":
                    return <LobbyComponent theme={theme} hostName={this.state.judge} players={this.state.players} host={false} room={this.state.room} user={this.state.user}></LobbyComponent>
                case 'UPLOAD':
                    return <WaitUploadComponent theme={theme}></WaitUploadComponent>
                case 'CAPTION':
                    return <CaptionComponent theme={theme} timestamp={this.state.roundTimestamp} players={this.state.players} room={this.state.room} filepath={this.state.judgeImg}></CaptionComponent>
                case 'VOTING':
                    return <VotingComponent theme={theme} room={this.state.room} turn={this.state.turn} players={this.state.players} judge={false} filepath={this.state.judgeImg}></VotingComponent>
                case 'SCORING':
                    return <ScoringComponent theme={theme} judge={false} room={this.state.room} players={this.state.players}></ScoringComponent>

            }
        }
    }
}

export default withStyles(styles)(GameComponent);