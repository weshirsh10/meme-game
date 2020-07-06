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
import Lightbox from 'react-image-lightbox';
import IconButton from '@material-ui/core/IconButton';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import TimerComponent from '../../timer'
import { ThemeProvider } from '@material-ui/core/styles'

import FirebaseService from '../../../services/firebase'

const fbService = new FirebaseService()

class CaptionComponent extends React.Component {
    constructor(){
        super();
        this.state = {
            caption: '',
            imgUrl: '',
            submitted: false,
            isOpen: false,
            currentUser: ''

        }
    }

    componentDidMount = async () => {
        fbService.downloadFile(this.props.filepath).then(
            url => {
                let _imgUrl = url
                this.setState({imgUrl: _imgUrl})
            }
        )
        
    }

    render() {
        const { classes } = this.props;

        return (
            <ThemeProvider theme={this.props.theme}>
            <Typography component='h1' variant='h2'>Caption</Typography>

            <div className={classes.captionContainer}>
                <div id='imgContainer' className={classes.downloadImg}>
                    <img id="captionImg" className={classes.imgScale} src={this.state.imgUrl}/>
                </div>  
                <IconButton onClick={() => this.setState({ isOpen: true })}>
                    <FullscreenIcon color='secondary'/>
                </IconButton>
                {
                    this.submitState(classes)
                }
                <TimerComponent theme={this.props.theme} judge={false} startTime={this.props.timer} nextState="VOTING" room={this.props.room}/>
        {this.state.isOpen && (
          <Lightbox
            mainSrc={this.state.imgUrl}
            onCloseRequest={() => this.setState({ isOpen: false })}
          />
        )}

            </div>
            </ThemeProvider>
        )
    }

    submitState = (classes) => {
        if(this.props.players[this.props.currentUser].caption){
            return (<div>
                Waiting for Other players
            </div>)
        }
        else{
            return(
            <div className={classes.formContainer}>
                    <FormControl className={this.props.classes.formRoot} required fullWidth margin='normal'>
                        <InputLabel color='primary' className={classes.inputLabel} htmlFor='caption-input'>Enter Caption</InputLabel>
                        <Input  color='primary' autoComplete='Caption' onChange={(e) => this.userTyping(e)} autoFocus id='caption-input'></Input>
                    </FormControl>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <Button id="submit" className={classes.submit} type='submit' onClick={(e) => this.onClickSubmit(e)} variant='contained' color='primary'>Submit</Button>
                    </Box>
            </div>
            )
        }
    }

    userTyping = (e) => {
        this.setState({ caption: e.target.value });
    }

    onClickSubmit = (e) => {
        e.preventDefault();
        if(this.state.caption){
            this.setState({submitted: true})
            fbService.submitCaption(this.props.room, this.state.caption)
        }
    }
}

export default withStyles(styles)(CaptionComponent);