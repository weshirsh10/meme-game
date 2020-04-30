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
import FirebaseService from '../services/firebase'

const firebase = new FirebaseService();

class LoginComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            name: null,
            roomCode: null,
            nameError: '',
            roomError: '',
            joinRoom: false
        }
    }

    // checkLoginStatus() {
    //     firebase.getCurrentUser().then( e => {
    //         console.log("Plz", e)
    //     })
    //     console.log("currUser", firebase.getCurrentUser())
    // }

    componentDidMount() {
        console.log("mounted")
        firebase.getUserStatus().onAuthStateChanged(
            user => {
                console.log("User", user)
                if(user){
                    this.props.history.push('/lobby')
                }
            }
        )
    
    }

    render() {
        
        const { classes } = this.props;

        return(
            <main className={classes.main}>
                <CssBaseline></CssBaseline>
                <Paper className={classes.paper}>
                    <Typography component='h1' variant='h5'>
                        Welcome!
                    </Typography>
                    <form onSubmit={(e) => this.onSubmitLogin(e)} className={classes.form}>
                        <FormControl required fullWidth margin='normal'>
                            <InputLabel htmlFor='login-name-input'>Enter Your Name</InputLabel>
                            <Input autoComplete='Name' onChange={(e) => this.userTyping('name', e)} autoFocus id='login-name-input'></Input>
                        </FormControl>
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <Button type='submit' onClick={(e) => this.onClickHost(e)} variant='contained' color='primary' className={classes.submit}>Host Game</Button>
                            <Button type='submit' id="join" variant='contained' color='primary' className={classes.submit}>Join Room</Button>
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
                        <FormControl required fullWidth margin='normal'>
                            <InputLabel htmlFor='room-code-input'>Enter Room Code</InputLabel>
                            <Input autoComplete='Room Code' onChange={(e) => this.userTyping('roomCode', e)} autoFocus id='room-code-input'></Input>
                        </FormControl>
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <Button type='submit' onClick={(e) => this.onClickJoin(e)} variant='contained' color='primary' className={classes.submit}>Join</Button>
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
                </Paper>
            </main>
        );
    }

    formIsValid = () => this.state.name.length > 2
    
    userTyping = (type, e) => {
        console.log(type,e)
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
        console.log("Host Clicked")
        if(!this.formIsValid()) {
            this.setState({nameError: "Name must be at least 3 characters"});
        }
        else {
            this.setState({nameError: ""})
            console.log("creating Room")
            //Create new room in firebase

            firebase.createRoom(this.state.name)
            .then( () => {
                console.log("Check Firebase")
                firebase.createUser()
                this.props.history.push('/lobby')
            }, dbError =>{
                console.log("DBerror", dbError)
            }
             )


        }
    } 

    //Join As Player
    onClickJoin = (e) => {

        firebase.joinRoom(this.state.name, this.state.roomCode)
        .then( () => {
            firebase.createUser()
            this.props.history.push('/lobby')
        },dbError => {
            this.setState({roomError: "Invalid Room Code"});
        })
        // let playerObj = {
        //     name: this.state.name
        // }
       
        
        
        // )
    }

    onSubmitLogin = (e) => {
        e.preventDefault();
        console.log("submitting", e)
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