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
import CircularProgress from '@material-ui/core/CircularProgress';
import uploadArrow from '../../../assets/svg/uploadArrow.svg'
import { ThemeProvider } from '@material-ui/core/styles'


import FirebaseService from '../../../services/firebase'


const fbService = new FirebaseService

class Upload2Component extends React.Component {

    constructor(){
        super();
        this.state = {
            imagePreview: '',
            raw: '',
            selected: false,
            uploading:false,
        }
    }


    render() {
        const { classes } = this.props;
        return(
            <ThemeProvider theme={this.props.theme}>
            <div className={classes.main}>
            <Typography className={classes.caption} align='center' component='h2' variant='h5'>{this.props.caption}</Typography>
                <div className={classes.uploadArea}>
                    <label htmlFor="uploadButton">
                        <div className={classes.uploadImg}>
                        {
                            this.state.imagePreview ? <img className={classes.imgScale} src={this.state.imagePreview}/>:
                            <img className={classes.imgScale} src={uploadArrow}/>
                        }
                        </div>
                    </label>
                    <input type='file' id="uploadButton" style={{display: 'none'}} onChange={this.handleFileChange} accept="image/*"/>
                    <Button  color='primary' className={classes.submit} onClick={this.handleFileUpload}>Upload</Button>
                    { this.state.uploading && this.state.raw ? <CircularProgress color='secondary'></CircularProgress>: null}
                    {
                        this.state.selected ? <Typography align='center'>Image Uploaded.<br/>Tap image to select a different picture.</Typography> : null
                    }
                </div>
            </div>
            </ThemeProvider>

        )
    }

    handleFileChange = e => {
        if (e.target.files.length) {
            this.setState({
                imagePreview: URL.createObjectURL(e.target.files[0]),
                raw: e.target.files[0]
            });
          }

    }

    handleFileUpload = async e => {
        e.preventDefault();
        if(this.state.raw){
            this.setState({uploading: true})
        }
        fbService.uploadFile2(this.state.raw, this.props.room, this.props.currentUser).then(resp => {
            this.setState({selected: true, uploading: false})
        })

    }


}

export default withStyles(styles)(Upload2Component)