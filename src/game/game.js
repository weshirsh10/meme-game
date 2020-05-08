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
import UploadComponent from './judge/upload'
import WaitUploadComponent from './player/waitUpload'
import CaptionComponent from './player/caption'
import JudgeWaitingComponent from './judge/judgeWait'
import VotingComponent from './voting'
import ScoringComponent from './scoring'
import FirebaseService from '../services/firebase'

const firebase = require('firebase')
const fbService = new FirebaseService();


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
            turn: 1
            }
    }

    componentDidMount = async () => {
        await this.setState((state, props) => {
            return {room: props.match.params.room, name: props.match.params.name}
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
            let _judge = ''
            let _user = ''
            let _judgeImg = ''

            for(var player in _players){
                if(_players[player].turn == _turn){
                    _user = player
                    _judge = _players[player].name
                    _judgeImg = _players[player].imgPath
                    break
                }
            }
            await this.setState( {
                turn: _turn,
                players: _players,
                host: _host,
                judge: _judge,
                user: _user,
                judgeImg: _judgeImg,
                gameState: _gameState
            } )


        })   
        
    }
    

    render() {
        const { classes } = this.props;
        console.log("GameState", this.state)
        return(
            <main className={classes.main}>
                <Paper className={classes.paper}>
                    {
                        this.stateManager()
                    }
                </Paper>
            </main>
        )
    }

    stateManager = () => {
        if(this.state.name == this.state.judge){
            switch(this.state.gameState){
                case 'UPLOAD':
                   return <UploadComponent room={this.state.room} user={this.state.user}></UploadComponent>
                case 'CAPTION':
                    let captionCount = 0
                    for(var _player in this.state.players){
                        if(this.state.players[_player].caption){
                            captionCount ++
                        }
                    }
                    if(captionCount == Object.keys(this.state.players).length -1){
                        fbService.updateRoomState(this.state.room, "VOTING")
                    }

                    return <JudgeWaitingComponent user={this.state.user} players={this.state.players}></JudgeWaitingComponent>

                case 'VOTING':
                    return <VotingComponent room={this.state.room} user={this.state.user} players={this.state.players} judge={true} filepath={this.state.judgeImg}></VotingComponent>
                
                case 'SCORING':
                    return <ScoringComponent judge={true} room={this.state.room} players={this.state.players}></ScoringComponent>

            }
        }
        else{
            switch(this.state.gameState){
                case 'UPLOAD':
                    return <WaitUploadComponent></WaitUploadComponent>
                case 'CAPTION':
                    return <CaptionComponent players={this.state.players} room={this.state.room} filepath={this.state.judgeImg}></CaptionComponent>
                case 'VOTING':
                    return <VotingComponent room={this.state.room} turn={this.state.turn} user={this.state.user} players={this.state.players} judge={false} filepath={this.state.judgeImg}></VotingComponent>
                case 'SCORING':
                    return <ScoringComponent judge={false} room={this.state.room} players={this.state.players}></ScoringComponent>

            }
        }
    }
}

export default withStyles(styles)(GameComponent);