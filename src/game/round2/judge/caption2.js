import React from 'react';
import styles from './styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import { ThemeProvider } from '@material-ui/core/styles'
import TimerComponent from '../../timer'
import FirebaseService from '../../../services/firebase'

const fbService = new FirebaseService()

class Caption2Component extends React.Component{

    constructor(){
        super();
        this.state = {
            caption: ''
        }
    }

    render(){
        const { classes } = this.props;

        return (
            <ThemeProvider theme={this.props.theme}>
                <Typography component='h1' variant='h2'>Caption</Typography>
                <div className={classes.textBox}>
                <Typography color='secondary' align='center' component='h4'>Make a hilarious Caption.
                    <br/>Players will upload pictures based on the caption.
                    <br/>You have 90 seconds to write a caption or else a random one will be chosen for you.
                    </Typography>
                </div>
                <div className={classes.formContainer}>
                    <FormControl className={classes.formRoot}required fullWidth margin='normal'>
                        <InputLabel className={classes.inputLabel} htmlFor='caption-input'>Enter Caption</InputLabel>
                        <Input autoComplete='Caption' onChange={(e) => this.userTyping(e)} autoFocus id='caption-input'></Input>
                    </FormControl>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <Button className={classes.submit} type='submit' onClick={(e) => this.onClickSubmit(e)} variant='contained' color='primary'>Submit</Button>
                    </Box>
                    <TimerComponent theme={this.props.theme} startTime={this.props.timestamp} nextState="UPLOAD2" room={this.props.room}/>
                </div>
            </ThemeProvider>
        )
    }

    userTyping = (e) => {
        this.setState({ caption: e.target.value });
    }

    onClickSubmit = (e) => {
        e.preventDefault();
        if(this.state.caption){
            this.setState({submitted: true})
            fbService.submitCaption(this.props.room, this.state.caption)
            .then( () => {
                fbService.updateRoomState(this.props.room, "UPLOAD2")
            })
        }
    }
}

export default withStyles(styles)(Caption2Component)