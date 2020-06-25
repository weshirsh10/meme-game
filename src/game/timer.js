import React from 'react';
import styles from './styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { ThemeProvider } from '@material-ui/core/styles'
import FirebaseService from '../services/firebase'

const fbService = new FirebaseService();
const firebase = require('firebase')

class TimerComponent extends React.Component {

    constructor(){
        super();
        this.state = {
            count: 90,
            fbCount: 90
        }
    }

    componentDidMount(){

        firebase
        .firestore()
        .collection('timers')
        .doc(this.props.room)
        .onSnapshot( async res => {
            if(res.data()){
                await this.setState({fbCount: res.data().time})
            }
        })

        this.myInterval = setInterval( () => {

            this.setState({count: this.state.fbCount})

            if(this.state.count <= 0 && this.props.judge){
                fbService.updateTimer("RESET", this.props.room)
                fbService.updateRoomState(this.props.room, this.props.nextState)
            }
            else if(this.state.count > 0 && this.props.judge){
                fbService.updateTimer("DEC", this.props.room)
            }


           
        }, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.myInterval)
        this.setState({count: 90})
    }

    render() {
        return (
            <ThemeProvider theme={this.props.theme}>
                <Typography component='h2' variant='h5' color='secondary' >{this.state.count}</Typography>
            </ThemeProvider>
        )
    }
}

export default withStyles(styles)(TimerComponent);