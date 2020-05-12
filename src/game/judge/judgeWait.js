import React from 'react';
import styles from './styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import uploadArrow from '../../assets/svg/uploadArrow.svg'
import { ThemeProvider } from '@material-ui/styles';


import FirebaseService from '../../services/firebase'


const fbService = new FirebaseService

class JudgeWaitingComponent extends React.Component {
    constructor(){
        super();
        this.state = {

        }
    }

    render() {
        const { classes } = this.props;
        return(
            <ThemeProvider theme={this.props.theme}>
            <div className={classes.uploadArea}>
            <Typography align='center' component='h1' variant='h2'>Players Submitting Captions</Typography>
                {
                      Object.entries(this.props.players).map( (_player) => {
                        if(this.props.user != _player[0]){
                            return(
                                <div className={classes.waitListItem}>
                                    <Typography component='h2' variant='h4' className={classes.waitPlayerName}>{_player[1].name}</Typography>
                                    {
                                        _player[1].caption ? <CheckCircleOutlineIcon  color='secondary'/>:
                                        <MoreHorizIcon color='primary'/>
                                    }
                                </div>
                            )
                        }
                        
                    })
                }
            </div>
            </ThemeProvider>
        )
    }
}

export default withStyles(styles)(JudgeWaitingComponent);