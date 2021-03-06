import React from 'react';
import PropTypes from "prop-types";
import styles from './styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import withStyles from '@material-ui/core/styles/withStyles';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FirebaseService from '../services/firebase'
import logo from '../assets/svg/logo.svg'
import CircularProgress from '@material-ui/core/CircularProgress';
import {TweenMax, Linear} from 'gsap';

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

class LoginComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            joining: false,
            name: null,
            roomCode: "   ",
            nameError: '',
            roomError: '',
            hostGame: false,
            joinRoom: false
        }
    }

    componentDidMount() {
        
        let user = {}
        fbService.getUserStatus().onAuthStateChanged(
            user => {
                //Get User and game from firebase
                if(user){
                    console.log("USER DATA", user.uid)
                    fbService.getUser(user.uid)
                     .then( e => {
                        let data = e.data()
                        this.setState({joining: false})
                        if(data){
                            console.log("Received room Data")
                            this.props.history.push('/game/' + data.room + '/' + data.name )
                        }
                        else{
                            window.location.reload(false)
                            console.log("No room data received")
                        }
                    })
                }
                else {
                    console.log("NO USER DATA")
                    let currUser = fbService.getCurrentUser()
       
                     console.log("No user Current User", currUser)
                }
            }
        )
    
    }

    render() {
        
        const { classes } = this.props;

        return(
            <ThemeProvider theme={theme}>
            <div className={classes.main}>
                <CssBaseline></CssBaseline>
                <div className={classes.pageContainer}> 
                <div className={classes.paper}>
                    <img src={logo}/>
                    <div className={classes.buttonContainer}>
                            <Button id='hostGame' type='submit' onClick={(e) => this.onClickHost(e)} variant='contained' className={classes.submit}>Host Game</Button>
                            <Button type='submit' id="join" variant='contained' className={classes.submit} onClick={(e) => this.onClickJoin(e)}>Join Room</Button>
                    </div>
                    {
                        this.state.hostGame || this.state.joinRoom ? 
                        <form onSubmit={(e) => this.onSubmitLogin(e)} className={classes.form} >
                        <FormControl className={classes.formRoot} required fullWidth margin='normal'>
                            <InputLabel className={classes.inputLabel} htmlFor='login-name-input'>Enter Your Name</InputLabel>
                            <Input id='name' autoComplete='Name' onChange={(e) => this.userTyping('name', e)} autoFocus id='login-name-input'></Input>
                        </FormControl>
                    </form> : null
                    }

                    {
                        this.state.hostGame ? <Button type='submit'  className={classes.submit} onClick={(e) => this.onClickHostEnter(e)}>Enter As Host</Button> : null
                    }
                    
                    {
                        this.state.nameError ? 
                        <Typography className={classes.errorText} component='h5'>
                            {this.state.nameError}
                        </Typography>
                        : null                        
                    }
                    {
                        this.state.joinRoom ?  
                        <form onSubmit={(e) => this.onSubmitRoomCode(e)} className={classes.form}>
                        <FormControl className={classes.formRoot} required fullWidth margin='normal'>
                            <InputLabel className={classes.inputLabel} htmlFor='room-code-input'>Enter Room Code</InputLabel>
                            <Input autoComplete='Room Code' onChange={(e) => this.userTyping('roomCode', e)} id='room-code-input'></Input>
                        </FormControl>
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <Button id="enter" type='submit' onClick={(e) => this.onClickEnter(e)} variant='contained' className={classes.submit}>Join Room</Button>
                        </Box>
                    </form>
                    :null
                    }
                    {
                        this.state.joining ? <CircularProgress color='secondary'/> : null
                    }
                    {
                        this.state.roomError ? 
                        <Typography className={classes.errorText} component='h5'>
                            {this.state.roomError}
                        </Typography>
                        : null                        
                    }
                </div>
                </div>
            </div>
            </ThemeProvider>
        );
    }

    formIsValid = () => this.state.name.length > 2
    
    userTyping = (type, e) => {
        switch(type) {
            case 'name':
                this.setState({ name: e.target.value });
                break;

            case 'roomCode':
                this.setState({ roomCode: e.target.value });
                break;

            default:
                break;
        }

    }

    onClickHost = (e) => {
        e.preventDefault();

        this.setState({hostGame: true, joinRoom: false, roomError: ''})
    } 

    onClickJoin = (e) => {
        e.preventDefault();

        this.setState({hostGame: false, joinRoom: true})
    } 

    //Join As Host
    onClickHostEnter = (e) => {
        e.preventDefault();
        if(!this.formIsValid()) {
            this.setState({nameError: "Name must be at least 3 characters"});
        }
        else {
            this.setState({joining: true})
            this.setState({nameError: ""})
            fbService.createRoom(this.state.name)
            .then( (resp) => {
                this.props.history.push('/game/' + resp[1]+ "/" + this.state.name)
                this.setState({joining: false})
            }, dbError =>{
                this.setState({joining: false})
            }
             )


        }
    } 

    //Join As Player
    onClickEnter = async (e) => {
        this.setState({joining: true})
        let valid = await fbService.isJoinValid(this.state.name, this.state.roomCode)
        if(valid != ""){
            this.setState({roomError: valid, joining: false})
        }
        else{
            this.setState({joining: false})
            this.props.history.push('/game/' + this.state.roomCode + '/' + this.state.name )
        }
    }

    onSubmitLogin = (e) => {
        e.preventDefault();
        if(!this.formIsValid()) {
            this.setState({nameError: "Name must be at least 3 characters"});
        }
        else {
            this.setState({nameError: ""})
            this.setState({joinRoom: true})
        }
    }

    onSubmitRoomCode = (e) => {
        e.preventDefault();
        //Add Player to Room in Firebase    
    }
}

export default withStyles(styles)(LoginComponent);