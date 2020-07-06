import React from 'react';
import styles from './styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { ThemeProvider } from '@material-ui/core/styles'
import FirebaseService from '../services/firebase'
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import CircularProgress from '@material-ui/core/CircularProgress';
import logo from '../assets/svg/logo.svg'

const fbService = new FirebaseService();

class EndGameComponent extends React.Component {
    constructor(){
        super();
        this.state = {
            exitGame: false,
            sending: false,
            feedback: '',
            leader: '',
        }
    }

    componentDidMount = async () => {
        let highScore = 100
        for(var player in this.props.players){
            if(this.props.players[player].points >= highScore){
                highScore = this.props.players[player].points
                await this.setState({leader: this.props.players[player].name})
            }
        }
    }

    render(){
        const { classes } = this.props;

        return (
            <ThemeProvider theme={this.props.theme}>
                <div className={classes.endGameDiv}>
                <Typography align='center' component='h1' variant='h2'>Your Leader is:</Typography>
                <Typography color='secondary' align='center' component='h1' variant='h2'>{this.state.leader}</Typography>
                    <div className={classes.startDiv}>
                    <Typography variant='h4' align='center' className={classes.feedback}>Do you want to keep playing?</Typography>
                    <Button className={classes.submit} onClick={(e) => this.onClickKeepPlaying(e)} type='submit' variant='contained'>Keep Playing</Button>
                    <hr className={classes.dividerLine}></hr>
                    <Typography variant='h4' align='center' className={classes.feedback}>Have a suggestion or idea for a third round?</Typography>
                        <div className={classes.feedbackContainer}>
                            <FormControl className={classes.formRoot}required fullWidth margin='normal'>
                                <InputLabel className={classes.inputLabel} htmlFor='feedback-input'>Send Feedback</InputLabel>
                                <Input multiline='true' autoComplete='Feedback' onChange={(e) => this.userTyping(e)} id='feedback-input'></Input>
                            </FormControl> 
                            <div className={classes.buttonContainer}>
                                <Button className={classes.reportSubmit} onClick={(e) => this.onClickSendFeedback(e)} type='submit' variant='contained'>Send</Button>
                            </div>
                        </div>
                    {
                        this.state.sending ? <CircularProgress color='secondary'/> : null
                    }
                        <hr className={classes.dividerLine}></hr>

                        <Typography variant='h4' align='center' className={classes.feedback}>Do you want end this game or start a new one?</Typography>
                        <Typography className={classes.feedback} color='secondary' align='center'>Tap the "End Game" button in the top right corder of the screen.</Typography>
                        <hr className={classes.dividerLine}></hr>

                    <img className={classes.endGameLogo} src={logo}/>

                    </div>
                </div>
            </ThemeProvider>
        )
    }

    userTyping = (e) => {
        this.setState({feedback: e.target.value})
    }

    onClickKeepPlaying = (e) => {
        e.preventDefault();

        fbService.keepPlaying(this.props.room)
    }

    onClickEndGame = (e) => {
        e.preventDefault();
        this.setState({sending: true})
        fbService.exitGame(this.props.players, this.props.room)
        .then(()=> {
            this.setState({sending: true})
        })
    }

    onClickSendFeedback = (e) => {
        e.preventDefault();
        this.setState({sending: true, feedback: ''})
        fbService.sendFeedback(this.state.feedback, this.props.room)
        .then(()=> {
            document.getElementById("feedback-input").value = ''
            this.setState({sending: false, feedback: ''})
        })
    }
}

export default withStyles(styles)(EndGameComponent);