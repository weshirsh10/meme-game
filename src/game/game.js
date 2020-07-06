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
import CircularProgress from '@material-ui/core/CircularProgress';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import UploadComponent from './round1/judge/upload'
import WaitUploadComponent from './round1/player/waitUpload'
import CaptionComponent from './round1/player/caption'
import JudgeWaitingComponent from './round1/judge/judgeWait'
import VotingComponent from './round1/voting'
import ScoringComponent from './scoring'
import LobbyComponent from './lobby'
import Round1Component from './round1/round1'
import Round2Component from './round2/round2'
import Caption2Component from './round2/judge/caption2'
import Upload2Component from './round2/player/upload2'
import JudgeWaiting2Component from './round2/judge/judgeWait2'
import Voting2Component from './round2/voting2'
import EndGameComponent from './endGame'
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
        h3: {
            fontSize: 12,
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
    },
    overrides: {
        MuiInputBase: {
            root: {
                color: '#ffffff',
                '&$focused': {
                    color: '#ffffff'
                }
            },
            
        }

    }
})


class GameComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            report: false,
            exit: false,
            sending: false,
            reportText: '',
            votes: 0,
            host: '',
            room: '',
            name: '',
            players: {},
            judge: '',
            user: '',
            judgeImg: '',
            gameState: '',
            currentUser: '',
            turn: 1,
            timer: false,
            roundTimestamp: 90,
            playerPoints: 10,
            spectating: false,
            }

        this.endGameButton = React.createRef()

    }

    componentDidMount = async () => {

        // fbService.getUserStatus().onAuthStateChanged(user =>{
        //     if(!user){
        //         console.log("no user")
        //         this.props.history.push('/login')
        //     }
        //     else{
        //         console.log(user)
        //         console.log("we got a user")
        //     }
        // })


        await this.setState((state, props) => {
            let room = String(props.match.params.room)
            return {room: room.toUpperCase(), name: props.match.params.name}
            // name: props.match.params.name
        })

        await fbService.getUserStatus().onAuthStateChanged((user) => {
            if(user){
                return this.setState({currentUser: user.uid})
            }
        })

        if(this.state.room){
            await firebase
            .firestore()
            .collection('rooms')
            .doc(this.state.room)
            .onSnapshot( async res => {
                if(!res.exists){
                    let user = fbService.getCurrentUser()
                    if(!user.uid){
                        console.log("NO USER")
                        this.props.history.push('/login')
                    }
                    else{
                        console.log("USER", user.uid)
                    }    
                }
                else{
                    let _players = res.data().players
                    let _host = res.data().host
                    let _turn = res.data().turn
                    let _gameState = res.data().state
                    let _roundTimestamp = res.data().roundTimestamp
                    let _timer = res.data().timer
                    let _round = res.data().round
                    let _judge = ''
                    let _user = ''
                    let _judgeImg = ''
                    let _judgeCaption = ''
                    let _playerPoints = ((10 - res.data().playerCount) + 1)*10
    
                    for(var player in _players){
                        if(_players[player].turn == _turn){
                            _user = player
                            _judge = _players[player].name
                            _judgeImg = _players[player].imgPath
                            _judgeCaption = _players[player].caption
                        }
                    }
                    await this.setState( {
                    turn: _turn,
                    players: _players,
                    host: _host,
                    judge: _judge,
                    user: _user,
                    judgeImg: _judgeImg,
                    judgeCaption: _judgeCaption,
                    gameState: _gameState,
                    roundTimestamp: _roundTimestamp,
                    timer: _timer,
                    round: _round,
                    playerPoints: _playerPoints
                    } )
                }
    
    
            })
        }
     
        
    }
    

    render() {
        const { classes } = this.props;
        return(
            <ThemeProvider theme={theme}>
            <div className={classes.main} >
                <div className={classes.headerContainer}>
                    <Button onClick={(e) => this.onClickReport(e)}className={classes.headerButtons} >Report Issue</Button>
                    <Button onClick={(e) => this.onClickExitGame(e)} className={classes.headerButtons}>End Game</Button>
                </div>
                <div className={classes.paper}>
                    {
                        this.stateManager()
                    }
                </div>
                {
                    this.state.report ? 
                    <div className={classes.reportContainer}>
                        <FormControl className={classes.formRoot}required fullWidth margin='normal'>
                            <InputLabel className={classes.inputLabel} htmlFor='caption-input'>Problem Description</InputLabel>
                            <Input multiline='true' autoComplete='Caption' onChange={(e) => this.userTyping(e)} autoFocus id='caption-input'></Input>
                        </FormControl> 
                        <div className={classes.buttonContainer}>
                            <Button className={classes.reportSubmit} onClick={(e) => this.onClickCancel(e)} type='submit' variant='contained'>Cancel</Button>
                            <Button className={classes.reportSubmit} onClick={(e) => this.onClickSend(e)} type='submit' variant='contained'>Send</Button>
                        </div>
                    
                    </div>
                    : null
                }
                <div ref={this.endGameButton}>
                {
                    this.state.exit ? 
                    <div>
                        <Typography color='error'>This will end the game for all players.</Typography>
                        <div  className={classes.buttonContainer}>
                            <Button className={classes.reportSubmit} onClick={(e) => this.onClickCancel(e)} type='submit' variant='contained'>Cancel</Button>
                            <Button className={classes.reportSubmit} onClick={(e) => this.onClickExit(e)} type='submit' variant='contained'>End</Button>
                        </div>
                    </div> : null
                }
                </div>
                {
                    this.state.sending ? <CircularProgress color='secondary'/> : null
                }
            </div>
            </ThemeProvider>
        )
    }

    userTyping = (e) => {
        this.setState({reportText: e.target.value})
    }

    onClickCancel = (e) => {
        this.setState({report: false, reportText: '', exit: false})
    }

    onClickSend = (e) => {
        e.preventDefault();
        this.setState({sending: true})
        fbService.sendReport(this.state)
        .then( (res) => {
            this.setState({reportText: '', report: false})
            this.setState({sending: false})
        })

    }

    onClickReport = (e) => {
        e.preventDefault();

        this.setState({report: !this.state.report, exit: false})

    }

    onClickExitGame = (e) => {
        e.preventDefault();
        this.setState({exit: !this.state.exit, report: false})
        window.scrollTo(0, this.endGameButton.current.offsetTop)

    }

    onClickExit = (e) => {
        e.preventDefault();
        this.setState({sending: true})
        fbService.exitGame(this.state.players, this.state.room)
        .then( res => {
            this.setState({sending: false})
        })
    }
    
    onClickJoin = (e) => {
        e.preventDefault();

        this.setState({hostGame: false, joinRoom: true})
    } 

    stateManager = () => {
        if(this.state.round == 1){
            if(this.state.user == this.state.currentUser){
                switch(this.state.gameState){
                    case "LOBBY":
                        return <LobbyComponent 
                        theme={theme} 
                        hostName={this.state.judge} 
                        players={this.state.players} 
                        host={true} 
                        room={this.state.room} ></LobbyComponent>
                    case "ROUND1":
                        return <Round1Component 
                        room={this.state.room} 
                        players={this.state.players} 
                        host={true} 
                        hostName={this.state.judge} 
                        theme={theme}></Round1Component>

                    case 'UPLOAD':
                       return <UploadComponent 
                       theme={theme} 
                       room={this.state.room} 
                       user={this.state.user}></UploadComponent>

                    case 'CAPTION':
                        fbService.toggleTimer(this.state.room, true)
                        let captionCount = 0
                        for(var _player in this.state.players){
                            if(this.state.players[_player].caption){
                                captionCount ++
                            }
                        }
                        if(captionCount == Object.keys(this.state.players).length -1){
                            fbService.updateTimer("RESET", this.state.room)
                            fbService.updateRoomState(this.state.room, "VOTING")
                        }
    
                        return <JudgeWaitingComponent 
                        theme={theme} 
                        room={this.state.room} 
                        timer={this.state.timer} 
                        user={this.state.user} 
                        players={this.state.players}></JudgeWaitingComponent>
    
                    case 'VOTING':
                        return <VotingComponent 
                        theme={theme} 
                        currentUser={this.state.currentUser} 
                        playerPoints={this.state.playerPoints} 
                        room={this.state.room} 
                        players={this.state.players} 
                        judge={true} 
                        filepath={this.state.judgeImg}></VotingComponent>
                    
                    case 'SCORING':
                        return <ScoringComponent 
                        theme={theme} 
                        round={this.state.round} 
                        judge={true} 
                        judgeName={this.state.judge}
                        room={this.state.room} 
                        players={this.state.players}></ScoringComponent>
    
                }
            }
            else{
                switch(this.state.gameState){
                    case "LOBBY":
                        return <LobbyComponent 
                        theme={theme} 
                        hostName={this.state.judge} 
                        players={this.state.players} 
                        host={false} 
                        room={this.state.room} 
                        user={this.state.user}></LobbyComponent>
                    case "ROUND1":
                        return <Round1Component 
                        room={this.state.room} 
                        players={this.state.players} 
                        host={false} 
                        hostName={this.state.judge} 
                        theme={theme}></Round1Component>

                    case 'UPLOAD':
                        return <WaitUploadComponent 
                        judge={this.state.judge}
                        theme={theme}></WaitUploadComponent>

                    case 'CAPTION':
                        return <CaptionComponent 
                        theme={theme} 
                        currentUser={this.state.currentUser} 
                        timer={this.state.timer} 
                        players={this.state.players} 
                        room={this.state.room}
                        filepath={this.state.judgeImg}></CaptionComponent>

                    case 'VOTING':
                        return <VotingComponent 
                        theme={theme} 
                        currentUser={this.state.currentUser} 
                        playerPoints={this.state.playerPoints} 
                        room={this.state.room} 
                        turn={this.state.turn} 
                        players={this.state.players} 
                        judge={false} 
                        filepath={this.state.judgeImg}></VotingComponent>
                    case 'SCORING':
                        return <ScoringComponent 
                        theme={theme} 
                        round={this.state.round} 
                        judgeName={this.state.judge}
                        judge={false} 
                        room={this.state.room} 
                        players={this.state.players}></ScoringComponent>
    
                }
            }
        }
        else if(this.state.round == 2){
            if(this.state.user == this.state.currentUser){
                switch(this.state.gameState){
                    case "ROUND2":
                        return <Round2Component 
                        room={this.state.room} 
                        players={this.state.players} 
                        host={true} 
                        hostName={this.state.judge} 
                        theme={theme}></Round2Component>

                    case "CAPTION2":
                        fbService.toggleTimer(this.state.room, true)
                        return <Caption2Component 
                        theme={theme} 
                        timer={this.state.timer} 
                        room={this.state.room}></Caption2Component>

                    case "UPLOAD2":
                        let imgCount = 0
                        for(var _player in this.state.players){
                            if(this.state.players[_player].imgPath){
                                imgCount ++
                            }
                        }
                        if(imgCount == Object.keys(this.state.players).length -1){
                            fbService.updateRoomState(this.state.room, "VOTING2")
                        }

                        return <JudgeWaiting2Component 
                        theme={theme} room={this.state.room} 
                        timer={this.state.timer} 
                        user={this.state.user} 
                        players={this.state.players}></JudgeWaiting2Component>

                    case "VOTING2":
                        return <Voting2Component 
                        theme={theme} 
                        currentUser={this.state.currentUser} 
                        judge={true} 
                        players={this.state.players} 
                        playerPoints={this.state.playerPoints} 
                        room={this.state.room}></Voting2Component>

                    case "SCORING2":
                        return <ScoringComponent 
                        round={this.state.round} 
                        theme={theme} 
                        judge={true} 
                        judgeName={this.state.judge}
                        room={this.state.room} 
                        players={this.state.players}></ScoringComponent>

                }
            }else{
                switch(this.state.gameState){
                    case "ROUND2":
                        return <Round2Component 
                        room={this.state.room} 
                        players={this.state.players} 
                        host={false} 
                        hostName={this.state.judge} 
                        theme={theme}></Round2Component>

                    case "CAPTION2":
                        return <WaitUploadComponent 
                        theme={theme} 
                        judge={this.state.judge}
                        timer={this.state.timer} 
                        round={this.state.round} 
                        room={this.state.room}></WaitUploadComponent>

                    case "UPLOAD2":
                        return <Upload2Component 
                        theme={theme} 
                        currentUser={this.state.currentUser} 
                        room={this.state.room} 
                        caption={this.state.judgeCaption}></Upload2Component>

                    case "VOTING2":
                        return <Voting2Component 
                        theme={theme} 
                        currentUser={this.state.currentUser} 
                        playerPoints={this.state.playerPoints} 
                        judge={false} 
                        players={this.state.players} 
                        room={this.state.room}></Voting2Component>

                    case "SCORING2":
                        return <ScoringComponent 
                        theme={theme} 
                        round={this.state.round} 
                        judge={false} 
                        judgeName={this.state.judge}
                        room={this.state.room} 
                        players={this.state.players}></ScoringComponent>
    
                }

            }
        }
        else if(this.state.round == 3){
                return <EndGameComponent
                theme={theme}
                room={this.state.room}
                players={this.state.players}
                ></EndGameComponent>
            }

    }
}

export default withStyles(styles)(GameComponent);