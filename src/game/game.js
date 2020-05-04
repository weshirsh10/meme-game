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
import UploadComponent from './judge/upload'
// import FirebaseService from '../services/firebase'



// const firebase = new FirebaseService();

class GameComponent extends React.Component {

    render() {
        return(
            <UploadComponent></UploadComponent>
        )
    }
}

export default withStyles(styles)(GameComponent);