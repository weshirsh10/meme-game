import React from 'react';
import styles from './styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { ThemeProvider } from '@material-ui/core/styles'
import GradeRoundedIcon from '@material-ui/icons/GradeRounded';
import CircularProgress from '@material-ui/core/CircularProgress';

import FirebaseService from '../services/firebase'
import { ListItem } from '@material-ui/core';

const fbService = new FirebaseService();


class ScoringComponent extends React.Component {
    constructor(){
        super()
        this.state = {
            scoretable:[],
            round: null,
            images: [],
            feedback: false,
            feedbackText: '',
            sending: false
        }
    }

    componentDidMount = async () =>{
        let imgArray =[]
        await this.setState({round: this.props.round})

        if(this.props.round == 2){
            for(var player in this.props.players){
                if(this.props.players[player].imgPath){
                    let filePath = await fbService.downloadFile(this.props.players[player].imgPath)

                    imgArray.push({player: this.props.players[player].name, img: filePath,})
                }
            }

            await this.setState( () => {
                return {images: imgArray}
            })
        }
    }

    render(){
        // window.scrollTo(0, 0)
        const { classes } = this.props;
        return (
            <ThemeProvider theme={this.props.theme}>
            <div className={classes.startDiv}>
            <Typography component='h1' variant='h2'>Scores</Typography>
            { this.renderScoreCard(this.props.players)}
            <Typography className={classes.feedback} color='secondary' align='center' >Have a suggestion?<br/>Idea for a another round?</Typography>
            <Button className={classes.headerButtons} onClick={e => this.onClickSendFeedback(e)} type="contained"> Send Feedback</Button>
            {
                this.state.feedback ? 
                <div className={classes.reportContainer}>
                    <FormControl className={classes.formRoot}required fullWidth margin='normal'>
                        <InputLabel className={classes.inputLabel} htmlFor='feedback-input'>Thank you for your feedback!</InputLabel>
                        <Input multiline='true' autoComplete='Feedback' onChange={(e) => this.userTyping(e)} autoFocus id='feedback-input'></Input>
                    </FormControl> 
                    <div className={classes.buttonContainer}>
                        <Button className={classes.reportSubmit} onClick={(e) => this.onClickCancel(e)} type='submit' variant='contained'>Cancel</Button>
                        <Button className={classes.reportSubmit} onClick={(e) => this.onClickSend(e)} type='submit' variant='contained'>Send</Button>
                    </div>
                
                </div>: null
            }
            {this.state.sending ? <CircularProgress color='secondary'/> : null}
            {
                this.state.round == 2? this.renderImages() : null
            }
            {
                this.props.judge ?
                <Button id="continueButton" className={classes.submit} type="contained" onClick={e => this.onClickContinue(e)}>Continue</Button> :
                <Typography style={{margin: '20px'}} align='center' component='h2' variant='h4' color='secondary'>Waiting for {this.props.judgeName} to continue.</Typography>
            }
            
            </div>
            </ThemeProvider>

        )

    }

    onClickSendFeedback = () => {
        this.setState({feedback: !this.state.feedback})
    }

    onClickCancel = (e) => {
        this.setState({feedback: false, feedbackText: ''})
    }

    onClickSend = (e) => {
        e.preventDefault();
        this.setState({sending: true})
        fbService.sendFeedback(this.state.feedbackText, this.props.room)
        .then( (res) => {
            this.setState({feedbackText: '', feedback: false, sending: false})
        })

    }

    userTyping = (e) => {
        this.setState({feedbackText: e.target.value})
    }

    onClickContinue = () => {
        if(this.state.round == 1){
            fbService.clearState("UPLOAD", this.props.room)
        }
        else if(this.state.round == 2){
            fbService.clearState("CAPTION2", this.props.room)
        }
    }

    renderScoreCard = (players) => {
        let scoreArray = []
        let placed = false
        let roundWinner = 100
        for(var player in players){
            let i = 0
            if(players[player].roundScore >= roundWinner){
                roundWinner = players[player].roundScore
            }


            while(!placed){
                if(scoreArray[i]){
                    if(players[player].points < scoreArray[i].points){
                        i += 1
                    }
                    else{
                        scoreArray.splice(i, 0, players[player])
                        placed=true
                    }
                }
                else{
                    scoreArray.push(players[player])
                    placed = true
                }
            }
            placed = false    
        }
        return(
            <TableContainer>
                <Table >
                    <TableHead >
                        <TableRow color='secondary'>
                            <TableCell style={{fontSize: 15, color: '#57C5C9'}} >Player</TableCell>
                            <TableCell style={{ fontSize: 15, color: '#57C5C9'}} >Round</TableCell>
                            <TableCell style={{ fontSize: 15, color: '#57C5C9'}} >Total</TableCell>
                            {
                                this.state.round == 1 ? <TableCell style={{fontSize: 15, color: '#57C5C9'}} >Caption</TableCell> : null
                            }
                           
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            scoreArray.map((player) => {
                                return(
                                <TableRow>
                                    <TableCell style={{color: 'white'}}>
                                        <div className={this.props.classes.reportContainer}>
                                            {player.name}
                                            <div className={this.props.classes.starRow}>
    
                                                {
                                                    player.roundScore == roundWinner ? <GradeRoundedIcon color='secondary'/> : null
                                                }
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell style={{color: 'white'}}> 
                                        {/* {player.roundScore}<br/>{player.voters} */}
                                        <Typography>{player.roundScore}</Typography>
                                        <Typography component='h3' variant='h3' color='secondary'>{player.voters}</Typography>
    
                                    </TableCell>
                                    <TableCell style={{color: 'white'}}> {player.points}</TableCell>
                                    {
                                        this.state.round == 1 ? <TableCell style={{color: 'white'}}>{player.caption}</TableCell> : null
                                    }
                                </TableRow>
                                )
                            })
                        }
                    </TableBody>

                </Table>
            </TableContainer>
        )
    }

    renderImages =() => {

        return(
            <div className={this.props.classes.scoreImgParent}>
                <Typography  align='center' component='h4' variant='h4'>images</Typography>
                <div className={this.props.classes.scoringImgContainer}>
                { this.state.images.map((image) => {
                    return (
                        <div className={this.props.classes.scoringImg}>
                            <img className={this.props.classes.imgScale}src={image.img}/>
                            <Typography color='secondary'>{image.player}</Typography>
                        </div>
                    )
                })}
                </div>
                
            </div>
        )
    }



}

export default withStyles(styles)(ScoringComponent);