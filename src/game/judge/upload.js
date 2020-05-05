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
import uploadArrow from '../../assets/svg/uploadArrow.svg'

import FirebaseService from '../../services/firebase'


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
                <Button onClick={this.handleFileUpload}>Select</Button>

            </div>
        )
    }

    handleFileChange = e => {
        console.log(e)  
        if (e.target.files.length) {
            console.log("HOWDY")
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