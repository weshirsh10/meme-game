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
import IconButton from '@material-ui/core/IconButton';
import UploadComponent from './judge/upload'
import WaitUploadComponent from './player/waitUpload'
import CaptionComponent from './player/caption'
import JudgeWaitingComponent from './judge/judgeWait'
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';




import FirebaseService from '../services/firebase'

const fbService = new FirebaseService();

class VotingComponent extends React.Component {
    constructor(){
        super();
        this.state = {
            ingUrl: '',
            voted: false,
            captions: [],
            captionIndex: 0

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

        let captionArray = []
        for(var player in this.props.players){
            console.log("Player", player)
            console.log("user", fbService.getCurrentUser())
            if(this.props.players[player].caption && player != fbService.getCurrentUser()){

                captionArray.push({player: player, caption: this.props.players[player].caption})
            }
        }

        await this.setState( () => {
            return {captions: captionArray}
        })

    }

    render() {
        const { classes } = this.props;
        return(
            <div>
                <Typography component='h1'variant='h5'>Vote</Typography>
                <div id='imgContainer' className={classes.downloadImg}>
                    <img className={classes.imgScale} src={this.state.imgUrl}/>
                </div>
                <div display="flex" flexdirection="row">
                    <IconButton aria-label="previous" onClick={(e) => this.onClickPrev(e)}>
                        <ChevronLeftIcon/>
                    </IconButton >
                    {
                     <Typography component='h2'>{
                        this.state.captions[this.state.captionIndex] ? this.state.captions[this.state.captionIndex].caption: ''
                        }
                        </Typography>
                    }
                    <IconButton aria-label="next" onClick={(e) => this.onClickNext(e)}>
                        <ChevronRightIcon/>
                    </IconButton>
                </div>
                <Button disabled={this.state.voted} type="submit" variant="contained" onClick = {(e) => this.onCLickVote(e)}>Vote</Button>
            </div>
        )
    }

    onClickNext = (e) => {
        e.preventDefault();
        
        if(this.state.captionIndex == this.state.captions.length-1){
            this.setState({captionIndex: 0})
        }
        else{ 
            let nextIndex = this.state.captionIndex + 1
            this.setState({captionIndex: nextIndex})
        }

    }

    onClickPrev = (e) => {
        e.preventDefault();

        if(this.state.captionIndex == 0){
            let arrlength = this.state.captions.length -1
            this.setState({captionIndex: arrlength})
        }
        else{
            let prevIndex = this.state.captionIndex- 1
            this.setState({captionIndex: prevIndex})
        }
    }

    onCLickVote = (e) => {
        e.preventDefault();
        this.setState({voted: true})
        fbService.submitVote(this.props.room, this.state.captions[this.state.captionIndex].player, this.props.judge)
        
    }

}

export default withStyles(styles)(VotingComponent);