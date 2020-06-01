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
import PublishIcon from '@material-ui/icons/Publish';
import uploadArrow from '../../../assets/svg/uploadArrow.svg'
import { ThemeProvider } from '@material-ui/core/styles'


import FirebaseService from '../../../services/firebase'


const fbService = new FirebaseService

class UploadComponent extends React.Component {

    constructor(){
        super();
        this.state = {
            imagePreview: '',
            raw: ''
        }
    }


    render() {
        const { classes } = this.props;
        return(
            <ThemeProvider theme={this.props.theme}>
            <div className={classes.main}>
            <Typography component='h1' variant='h2'>Upload</Typography>
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
                    <Button id="selectButton" color='primary' className={classes.submit} onClick={this.handleFileUpload}>Select</Button>
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
        fbService.uploadFile(this.state.raw, this.props.room, this.props.user)

    }


}

export default withStyles(styles)(UploadComponent)