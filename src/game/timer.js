import React from 'react';
import styles from './styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { ThemeProvider } from '@material-ui/core/styles'
import FirebaseService from '../services/firebase'

const fbService = new FirebaseService();

class TimerComponent extends React.Component {

    constructor(){
        super();
        this.state = {
            count: 90
        }
    }

    componentDidMount(){

        this.myInterval = setInterval( () => {
            let currentTime = Math.floor(Date.now() / 1000)
            if(this.state.count <= 0){
                fbService.updateRoomState(this.props.room, this.props.nextState)
            }
            else{
                this.setState( prevState => ({
                    count: 90 - (currentTime - this.props.startTime)
                }))
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