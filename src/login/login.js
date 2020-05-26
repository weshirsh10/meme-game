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
            name: null,
            roomCode: "   ",
            nameError: '',
            roomError: '',
            joinRoom: false
        }
    }

    componentDidMount() {

        // firebase
        // .firestore()
        // .collection('rooms')
        // .doc(this.state.roomCode)
        // .onSnapshot(async resp => {
        //     console.log("Login", resp.data())
        //     try{
        //         if(resp.data().players[fbService.getCurrentUser()]){
        //             this.props.history.push('/game/' + resp.data().room + '/' + this.state.name )
        //         }
        //     }
        //     catch(err){
        //         console.log(err)
        //     }
           
        // })
       let user = {}
        fbService.getUserStatus().onAuthStateChanged(
            user => {
                //Get User and game from firebase
                if(user){
                    fbService.getUser(user.uid)
                     .then( e => {
                        let data = e.data()

                        fbService.roomIsValid(data.room).then( async room => {
                            console.log("Room Data",room.data())
                            if(room.data()) {
                                this.props.history.push('/game/' + data.room + '/' + data.name )
                            }


                        })



                    })

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
                    <form onSubmit={(e) => this.onSubmitLogin(e)} className={classes.form} >
                        <FormControl className={classes.formRoot} required fullWidth margin='normal'>
                            <InputLabel color='white' className={classes.inputLabel} htmlFor='login-name-input'>Enter Your Name</InputLabel>
                            <Input id='name' color='white' autoComplete='Name' onChange={(e) => this.userTyping('name', e)} autoFocus id='login-name-input'></Input>
                        </FormControl>
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <Button id='hostGame' type='submit' onClick={(e) => this.onClickHost(e)} variant='contained' className={classes.submit}>Host Game</Button>
                            <Button type='submit' id="join" variant='contained' className={classes.submit}>Join Room</Button>
                        </Box>
                    </form>
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
                            <Input autoComplete='Room Code' onChange={(e) => this.userTyping('roomCode', e)} autoFocus id='room-code-input'></Input>
                        </FormControl>
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <Button type='submit' onClick={(e) => this.onClickEnter(e)} variant='contained' className={classes.submit}>Enter</Button>
                        </Box>
                    </form>
                    :null
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

    //Join As Host
    onClickHost = (e) => {
        e.preventDefault();
        if(!this.formIsValid()) {
            this.setState({nameError: "Name must be at least 3 characters"});
        }
        else {
            this.setState({nameError: ""})
            fbService.createRoom(this.state.name)
            .then( (resp) => {
                console.log("PUSH FROM ENTER")
                this.props.history.push('/game/' + resp[1]+ "/" + this.state.name)
            }, dbError =>{
                console.log("DBerror", dbError)
            }
             )


        }
    } 

    //Join As Player
    onClickEnter = async (e) => {
        console.log("LOGIN STATE", this.state)
        fbService.joinRoom(this.state.name, this.state.roomCode)
        .then( (resp) => {
            console.log("Hello", resp)
            this.props.history.push('/game/' + this.state.roomCode + "/" + this.state.name)
        },dbError => {
            console.error("FB ERROR", dbError)
            fbService.deleteUser()
            this.setState({roomError: "Invalid Room Code"});
        })


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
        console.log("submitting Room", this.state.roomCode)
        //Add Player to Room in Firebase    
    }
}

export default withStyles(styles)(LoginComponent);