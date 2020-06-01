import React from 'react';
import styles from '../styles';
import { ThemeProvider } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Button from '@material-ui/core/Button';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Lightbox from 'react-image-lightbox';

import FirebaseService from '../../services/firebase'
const fbService = new FirebaseService();

class Voting2Component extends React.Component {

    constructor(){
        super();
        this.state = {
            voted: false,
            images: [{player: '', img: ''}],
            imgIndex: 0,
            isOpen: false,
            caption: ''
        }
    }

    componentDidMount = async () => {
        let imgArray = []
        let voted = false
        let caption =''
        for(var player in this.props.players){
            if(this.props.players[player].imgPath && player != this.props.currentUser){
                let filePath = await fbService.downloadFile(this.props.players[player].imgPath)
                imgArray.push({player: player, img: filePath})
            }
            if(this.props.players[player].caption){
                caption = this.props.players[player].caption
            }
        }
        try{
            voted = this.props.players[this.props.currentUser].voted
        }
        catch(err){
            console.log(err)
        }

        await this.setState( () => {
            return {voted: voted, images: imgArray, caption: caption}
        })
    }


    render(){
        console.log("Images", this.state)
        const { classes } = this.props;
        return(
            <ThemeProvider theme={this.props.theme}>
                <Typography align='center' component='h1' variant='h2'>Vote</Typography>
                <div id='imgContainer' className={classes.downloadImg}>
                    <img className={classes.imgScale} src={this.state.images[this.state.imgIndex].img}/>
                </div>
                <Typography align='center' component='h2' variant='h4'>{this.state.caption}</Typography>
                <div className={classes.captionDisplay}>
                    <IconButton aria-label="previous" onClick={(e) => this.onClickPrev(e)}>
                        <ChevronLeftIcon color='secondary'/>
                    </IconButton >
                    <IconButton onClick={() => this.setState({ isOpen: true })}>
                        <FullscreenIcon color='secondary'/>
                    </IconButton>
                    <IconButton aria-label="next" onClick={(e) => this.onClickNext(e)}>
                        <ChevronRightIcon color='secondary'/>
                    </IconButton>
                </div>
                <Button color='secondary' disabled={this.state.voted} type="submit" variant="contained" onClick = {(e) => this.onCLickVote(e)}>Vote</Button>
                {
                    <Typography> 
                        {
                            this.state.voted ? "Votes Received" : null
                        }
                    </Typography>
                }
                <div className={classes.votesReceived}>
                {
                     this.renderVotes()
                }
                </div>

                <div className={classes.points}>
                    <Typography component='h2' variant='h5' color='secondary' >Judge Vote = 100pts</Typography>
            <Typography component='h2' variant='h5' color='secondary'>Player Vote = {this.props.playerPoints}pts</Typography>
                </div>
                {this.state.isOpen && (
                <Lightbox
                    mainSrc={this.state.images[this.state.imgIndex].img}
                    onCloseRequest={() => this.setState({ isOpen: false })}
                    nextSrc={this.state.images[(this.state.imgIndex + 1) % this.state.images.length].img}
                    prevSrc={this.state.images[(this.state.imgIndex + this.state.images.length - 1) % this.state.images.length].img}
                    onMoveNextRequest={() => {this.setState({imgIndex: (this.state.imgIndex + 1) % this.state.images.length})}}
                    onMovePrevRequest={() => {this.setState({imgIndex: (this.state.imgIndex + this.state.images.length - 1) % this.state.images.length})}}
                    />
        )}
              
            </ThemeProvider>
        )
    }

    onClickNext = (e) => {
        e.preventDefault();
        
        if(this.state.imgIndex == this.state.images.length-1){
            this.setState({imgIndex: 0})
        }
        else{ 
            let nextIndex = this.state.imgIndex + 1
            this.setState({imgIndex: nextIndex})
        }

    }

    onClickPrev = (e) => {
        e.preventDefault();

        if(this.state.imgIndex == 0){
            let arrlength = this.state.images.length -1
            this.setState({imgIndex: arrlength})
        }
        else{
            let prevIndex = this.state.imgIndex- 1
            this.setState({imgIndex: prevIndex})
        }
    }

    renderVotes = () => {
        let votes = 0
        return Object.entries(this.props.players).map((_player) => {
            if(_player[1].voted){
                votes = votes + 1
                if(votes == Object.keys(this.props.players).length){
                    fbService.updateRoomState(this.props.room, "SCORING2")
                }
                return (<CheckCircleOutlineIcon color='secondary'/>)
            }
            else{
                return null
            }
        })
    }

    onCLickVote = (e) => {
        e.preventDefault();
        this.setState({voted: true})
        fbService.submitVote(this.props.room, this.state.images[this.state.imgIndex].player, this.props.judge, this.props.currentUser, this.props.playerPoints)
        
    }

}

export default withStyles(styles)(Voting2Component)