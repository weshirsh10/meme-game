import React from 'react'
import styles from '../styles'
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { ThemeProvider } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';
import FirebaseService from '../../services/firebase'

const fbService = new FirebaseService();

class Round2Component extends React.Component {

    constructor(){
        super();

        this.state = {

        }
    }

    render(){
        const { classes } = this.props;
        return(
        <ThemeProvider theme={this.props.theme}>
            <div className={classes.roundHeader}>
                <Typography component='h1' variant='h2' color='secondary'>ROUND</Typography>
                <Typography component='h1' variant='h2'>&nbsp;TWO</Typography>
            </div>
            <div className={classes.ruleContainer}>
                <ul>
                    <li className={classes.listMargin}><Typography>Players will take turns being the judge.</Typography></li>
                    <li className={classes.listMargin}><Typography>The judge will have 90s to create a caption that will be sent to the other players.</Typography></li>
                    <li className={classes.listMargin}><Typography>Each player will upload a photo to match the caption.</Typography></li>
                    <li className={classes.listMargin}><Typography>When all photos are submitted, everyone will vote on the best photo. </Typography></li>
                    <li className={classes.listMargin}><Typography>The judge's vote is worth 100 points while player points are based on the number of players in the game.</Typography></li>
                </ul>
            </div>
        { this.props.host ? <Button onClick={(e)=> this.onClickContinue(e)} type='submit' color='secondary'className={classes.submit}>Continue</Button> : <Typography color='secondary'>Waiting for {this.props.hostName} to continue</Typography>}
        </ThemeProvider>)
    }

    onClickContinue = (e) => {
        e.preventDefault();
        fbService.updateRoomState(this.props.room, "CAPTION2")
    }

}

export default withStyles(styles)(Round2Component);