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
            scoretable:[]
        }
    }

    render(){
        const { classes } = this.props;
        return (
            <ThemeProvider theme={this.props.theme}>
            <div className={classes.startDiv}>
            <Typography component='h1' variant='h2'>Scores</Typography>
            { this.renderScoreCard(this.props.players)}

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
        fbService.clearState("UPLOAD", this.props.room)
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
                            <TableCell style={{fontSize: 20, color: '#57C5C9'}} >Player</TableCell>
                            <TableCell style={{ fontSize: 20, color: '#57C5C9'}} >Score</TableCell>
                            <TableCell style={{fontSize: 20, color: '#57C5C9'}} >Caption</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            scoreArray.map((player) => {
                                return(
                                <TableRow>
                                    <TableCell style={{color: 'white'}}>{player.name}</TableCell>
                                    <TableCell style={{color: 'white'}}> {player.points}</TableCell>
                                    <TableCell style={{color: 'white'}}>{player.caption}</TableCell>
                                </TableRow>
                                )
                            })
                        }
                    </TableBody>

                </Table>
            </TableContainer>
        )
    }



}

export default withStyles(styles)(ScoringComponent);