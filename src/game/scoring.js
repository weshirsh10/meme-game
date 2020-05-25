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

import FirebaseService from '../services/firebase'
import { ListItem } from '@material-ui/core';

const fbService = new FirebaseService();


class ScoringComponent extends React.Component {
    constructor(){
        super()
        this.state = {
            scoretable:[],
            round: null,
            images: []
        }
    }

    componentDidMount = async () =>{
        let imgArray =[]
        await this.setState({round: this.props.round})

        if(this.props.round == 2){
            for(var player in this.props.players){
                if(this.props.players[player].imgPath){
                    let filePath = await fbService.downloadFile(this.props.players[player].imgPath)

                    imgArray.push({player: this.props.players[player].name, img: filePath})
                }
            }

            await this.setState( () => {
                return {images: imgArray}
            })
        }
    }

    render(){
        window.scrollTo(0, 0)
        const { classes } = this.props;
        return (
            <ThemeProvider theme={this.props.theme}>
            <div className={classes.startDiv}>
            <Typography component='h1' variant='h2'>Scores</Typography>
            { this.renderScoreCard(this.props.players)}
            {
                this.state.round == 2? this.renderImages() : null
            }
            {
                this.props.judge ?
                <Button className={classes.submit} type="contained" onClick={e => this.onClickContinue(e)}>Continue</Button> :
                <Typography style={{margin: '20px'}} align='center' component='h2' color='secondary'>Waiting for judge to continue.</Typography>
            }
            </div>
            </ThemeProvider>

        )

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
        for(var player in players){
            let i = 0
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
                                console.log("SCORING", player)
                                return(
                                <TableRow>
                                    <TableCell style={{color: 'white'}}>{player.name}</TableCell>
                                    <TableCell style={{color: 'white'}}> {player.roundScore}</TableCell>
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
            <div>
                <Typography align='center' component='h4' variant='h4'>images</Typography>
                <div className={this.props.classes.scoringImgContainer}>
                { this.state.images.map((image) => {
                    console.log("Person", image)
                    return (
                        <div className={this.props.classes.scoringImg}>
                            <img className={this.props.classes.imgScale}src={image.img}/>
                            <Typography>{image.player}</Typography>
                        </div>
                    )
                })}
                </div>
                
            </div>
        )
    }



}

export default withStyles(styles)(ScoringComponent);