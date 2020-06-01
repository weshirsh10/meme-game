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
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PersonIcon from '@material-ui/icons/Person';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
// import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
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
            name: '',
            errorText: ''
        }
    }

    componentDidMount = async () => {
       
 
    }

    render () {
        const { classes } = this.props;
        return (
            <ThemeProvider theme={this.props.theme}>
            <div className={classes.main}>
                <Typography component='h1' variant='h2'>Lobby</Typography>
                <Typography component='h5' id='roomCode'>Room: {this.props.room}</Typography>
                <List>
                    {
                        Object.values(this.props.players).map( (_player) => {
                            return(
                                <ListItem>
                                    <ListItemIcon>
                                        <PersonIcon color='primary'/>
                                    </ListItemIcon>
                                    <ListItemText align='center'>{_player.name}</ListItemText>
                                </ListItem>
                            )
                        })

                    }
                </List>
                {
                    this.props.host ?
                        <div className={classes.startDiv}>
                            <Button id="startGame" onClick={(e) => this.onClickStart(e)} type='submit' color='primary' className={classes.submit}>Start</Button>
                            <Typography color='error' align='center' component='h4'>{this.state.errorText}</Typography>
                            <Typography color='secondary' align='center' component='h4'>*You are the host.<br/>Send the room code to players so they can join. Press start when all players have joined.</Typography>
                        </div>
                        :
                        <Typography align='center' color='secondary' component='h2' >{this.props.hostName} is the host.</Typography>
                }
            </div>
            </ThemeProvider>
        )
    }

    onClickStart = (e) => {
        //make sure theres more than 2 people in room
        if(Object.keys(this.props.players).length > 2){
            fbService.startGame(this.props.room, this.props.players)
        }
        else{
            this.setState({errorText: "At least 3 players are needed to start."})
        }
    }

}

export default withStyles(styles)(LobbyComponent);