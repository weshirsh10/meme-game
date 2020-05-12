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
import IconButton from '@material-ui/core/IconButton';
import UploadComponent from './judge/upload'
import WaitUploadComponent from './player/waitUpload'
import CaptionComponent from './player/caption'
import JudgeWaitingComponent from './judge/judgeWait'
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { ThemeProvider } from '@material-ui/core/styles'

import FirebaseService from '../services/firebase'
import { ListItem } from '@material-ui/core';

const fbService = new FirebaseService();


class ScoringComponent extends React.Component {
    constructor(){
        super()
        this.state = {

        }
    }

    render(){
        const { classes } = this.props;
        return (
            <ThemeProvider theme={this.props.theme}>
            <div className={classes.startDiv}>
            <Typography component='h1' variant='h2'>Scores</Typography>
            <List>
                {
                      Object.entries(this.props.players).map( (_player) => {
                        return(
                            <ListItem display="flex" flexdirection="row">
                                <ListItemText>{_player[1].name}</ListItemText>
                                <ListItemText>{_player[1].points}</ListItemText>
                            </ListItem>
                        )
                    })
                }
            </List>
            {
                this.props.judge ?
                <Button className={classes.submit} type="contained" onClick={e => this.onClickContinue(e)}>Continue</Button> :
                <Typography align='center' component='h2' color='secondary'>Waiting for judge to continue.</Typography>
            }
            </div>
            </ThemeProvider>

        )

    }

    onClickContinue = () => {
        fbService.clearState("UPLOAD", this.props.room)
    }
}

export default withStyles(styles)(ScoringComponent);