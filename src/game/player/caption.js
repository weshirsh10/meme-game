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
import uploadArrow from '../../assets/svg/uploadArrow.svg'

import FirebaseService from '../../services/firebase'

const fbService = new FirebaseService()

class CaptionComponent extends React.Component {
    constructor(){
        super();
        this.state = {
            caption: '',
            imgUrl: '',
            submitted: false

        }
    }

    componentDidMount = async () => {
        fbService.downloadFile(this.props.filepath).then(
            url => {
                let _imgUrl = url
                console.log(_imgUrl)
                this.setState({imgUrl: _imgUrl})
            }
        )
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <div id='imgContainer' className={classes.downloadImg}>
                    <img className={classes.imgScale} src={this.state.imgUrl}/>
                </div>  
                {
                    this.submitState()
                }

            </div>
        )
    }

    submitState = () => {
        if(this.state.submitted){
            return (<div>
                Waiting for Other players
            </div>)
        }
        else{
            return(<div>
                    <FormControl required fullWidth margin='normal'>
                        <InputLabel htmlFor='caption-input'>Enter Caption</InputLabel>
                        <Input autoComplete='Caption' onChange={(e) => this.userTyping(e)} autoFocus id='caption-input'></Input>
                </FormControl>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <Button type='submit' onClick={(e) => this.onClickSubmit(e)} variant='contained' color='primary' className={this.props.submit}>Submit</Button>
                    </Box>
            </div>)
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