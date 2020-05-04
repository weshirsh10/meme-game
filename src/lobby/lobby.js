import React from 'react';
import styles from './styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FirebaseService from '../services/firebase'
import { firestore } from 'firebase';


const firebase = require('firebase')
const fbService = new FirebaseService();


class LobbyComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            players: {},
            host: '',
            room: '',
            name: ''
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
            console.log("Players", _players)
            await this.setState( {
                players: _players,
                host: _host
            } )

        })
        
        
    }

    render () {
        const { classes } = this.props;

        console.log("Lobby State", this.state)

        return (
            <main className={classes.main}>
                <Paper className={classes.paper}>
                <Typography component='h1' variant='h5'>Lobby</Typography>
                <Typography component='h5'>Room: {this.state.room}</Typography>
                <List>
                    {
                        Object.values(this.state.players).map( (_player) => {
                            return(
                                <ListItem>
                                    <ListItemText>{_player.name}</ListItemText>
                                </ListItem>
                            )
                        })

                    }
                </List>
                {
                    this.state.name === this.state.host ?
                        <Button onClick={(e) => this.onClickStart(e)} type='submit' color='primary' className={classes.submit}>Start</Button>
                        :
                        <Typography component='h2'>Waiting for {this.state.host}</Typography>
                }
                </Paper>
            </main>
        )
    }

    onClickStart = (e) => {
        //move game state to round1
        fbService.updateRoomState(this.state.room, "round1")
        this.props.history.push('/game/' + this.state.room + '/' + this.state.name)
    }

    // firebaseListener = () => {
    //     firebase.firestore().collection('rooms')
    //     .doc(this.state.room)
    //     .onSnapshot( (snapshot) => {
    //         console.log("snapshot", snapshot)
    //     })
    // }

    
}

export default withStyles(styles)(LobbyComponent);