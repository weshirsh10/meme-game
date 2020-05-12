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
import { ThemeProvider } from '@material-ui/core/styles'


import judgeWaiting from '../../assets/svg/waitforjudge.svg'

class WaitUploadComponent extends React.Component {

    render() {
        const { classes } = this.props;
        return(
            <ThemeProvider theme={this.props.theme}>
            <div className={classes.waitImgContainer}>
                <img lassName={classes.imgScale} src={judgeWaiting}/>
            </div>
            </ThemeProvider>
        )
    }
}

export default withStyles(styles)(WaitUploadComponent)