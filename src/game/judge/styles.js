import { grey } from "@material-ui/core/colors";
// @import url('https://fonts.googleapis.com/css2?family=Squada+One&display=swap');

const styles = theme => ({
    main: {
      width: '100%',
      height: '100%',
      position: 'fixed',
      top: '0',
      left: '0',
      display: 'flex', // Fix IE 11 issue.
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',


      // marginLeft: theme.spacing.unit * 3,
      // marginRight: theme.spacing.unit * 3,
      color: 'white',
      backgroundColor: '#303030',
      [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
        width: '100%',
        heigh: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    paper: {
      // marginTop: theme.spacing.unit * 8,
      // marginBottom: theme.spacing.unit * 8,
      width: "50%",
      height: "40%",
      [theme.breakpoints.down('sm')]: {
        width: "100%",
        height: "80%"
      },
      backgroundColor: '#303030',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    form: {
      width: '100%',
      marginTop: theme.spacing.unit,
    },
    submit: {
        width: '40%',
        backgroundColor: '#57C5C9',
        color: '#303030',
        marginRight: theme.spacing.unit*2,
      marginTop: theme.spacing.unit * 3,
      '&:hover': {
        color: '#ffffff'
      }
    },
    hasAccountHeader: {
      width: '100%'
    },
    logInLink: {
      width: '100%',
      textDecoration: 'none',
      color: '#303f9f',
      fontWeight: 'bolder'
    },
    buttonContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        display: 'flex',
        flexDirection: 'row',
        border: 1
    },
    errorText: {
      color: 'red',
      textAlign: 'center'
    },
    inputLabel: {
      color: '#57C5C9',

    },
    formRoot: {
      color: 'white',
      "& label.Mui-focused": {
        color: "white"
      },
      "& .MuiInput-underline": {
        borderBottomColor: "white"
      },
      "& .MuiInput-underline:after": {
        borderBottomColor: "white"
      },
      "& .MuiInput-input": {
        color: 'white'
      }

    },
    input: {
      color: 'white' 
    },
    pageContainer: {
      display: 'flex',
      width: "100%",
      height: "100%",
      color: "#303030",
      alignItems: "center",
      justifyContent: "center",
      paddingBottom: '20px'

      
    },
    downloadImg: {
      width: "200px",
      height: "200px",
    },
    imgScale: {
      maxWidth: "100%",
      maxHeight: "100%"

    },
    uploadArea: {
      maxWidth: '100vh',
      maxHeight: '80%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    uploadImg: {
      width: "100vh",
      height: "300px",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    waitListItem: {
      width: "100px",
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: theme.spacing.unit * 3
    },
    waitItem: {

    }
  });
  
  export default styles;