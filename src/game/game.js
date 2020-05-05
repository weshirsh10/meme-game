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
import FirebaseService from '../services/firebase'

const firebase = require('firebase')
const fbService = new FirebaseService();


class GameComponent extends React.Component {
    constructor() {
        super();
        this.state = {
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
            console.log("DATA", res.data())
            let _players = res.data().players
            let _host = res.data().host
            let _turn = res.data().turn
            let _gameState = res.data().state
            let _judge = ''
            let _user = ''
            let _judgeImg = ''

            for(var player in _players){
                if(_players[player].turn == this.state.turn){
                    console.log("IN IF")
                    _user = player
                    _judge = _players[player].name
                    _judgeImg = _players[player].imgPath
                    break
                }
            }
            await this.setState( {
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

        // for(var player in this.state.players){
        //     console.log("player", player)
        //     if(this.state.players.player.turn == 1){
        //         this.setState({judge: this.state.players.player.name})
        //     }
        // }

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
        console.log("STATE", this.state)
        if(this.state.name == this.state.judge){
            switch(this.state.gameState){
                case 'UPLOAD':
                   return <UploadComponent room={this.state.room} user={this.state.user}></UploadComponent>
                case 'CAPTION':
                    return <JudgeWaitingComponent user={this.state.user} players={this.state.players}></JudgeWaitingComponent>

            }
        }
        else{
            switch(this.state.gameState){
                case 'UPLOAD':
                    return <WaitUploadComponent></WaitUploadComponent>
                case 'CAPTION':
                    return <CaptionComponent room={this.state.room} filepath={this.state.judgeImg}></CaptionComponent>
            }
        }
    }
}

export default withStyles(styles)(GameComponent);