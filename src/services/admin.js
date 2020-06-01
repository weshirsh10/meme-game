import React from 'react';
import Button from '@material-ui/core/Button';

import FirebaseService from './firebase'

const fbService = new FirebaseService();


class AdminComponent extends React.Component {
    render() {
        return(
            <div>
                <Button onClick={e => this.onClickClearDB(e)} type='submig'>Clear Database</Button>
            </div>
        )
    }

    onClickClearDB = (e) => {
        e.preventDefault();
        fbService.clearEverything();
    }
}

export default (AdminComponent);