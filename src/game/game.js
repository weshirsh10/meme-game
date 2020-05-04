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
            let _judge = ''

            for(var player in _players){
                if(_players[player].turn == 1){
                    _judge = _players[player].name
                    console.log(_players[player])
                }
            }
            await this.setState( {
                players: _players,
                host: _host,
                judge: _judge
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
                        
                        this.state.name == this.state.judge ?
                        <UploadComponent></UploadComponent> :
                        <WaitUploadComponent></WaitUploadComponent>
                    }

                </Paper>
            </main>
        )
    }
}

export default withStyles(styles)(GameComponent);