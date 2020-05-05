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
import uploadArrow from '../../assets/svg/uploadArrow.svg'

import FirebaseService from '../../services/firebase'


const fbService = new FirebaseService

class JudgeWaitingComponent extends React.Component {
    constructor(){
        super();
        this.state = {

        }
    }

    render() {
        return(
            <div>
            <Typography component='h1'variant='h5'>Players Submitting Captions</Typography>
            <List>
                {
                      Object.entries(this.props.players).map( (_player) => {
                        console.log("Here?", _player[1].caption)

                        if(this.props.user != _player[0]){
                            console.log("what?", _player[1].caption)
                            return(
                                <ListItem display="flex" flexdirection="row">
                                    <ListItemText>{_player[1].name}</ListItemText>
                                    { 
                                        _player[1].caption ? <CheckCircleOutlineIcon/>:
                                        <MoreHorizIcon/>
                                    } 
                                </ListItem>
                            )
                        }
                        
                    })
                }
            </List>
            </div>
        )
    }
}

export default withStyles(styles)(JudgeWaitingComponent);