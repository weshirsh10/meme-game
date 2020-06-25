import { grey } from "@material-ui/core/colors";
// @import url('https://fonts.googleapis.com/css2?family=Squada+One&display=swap');

const styles = theme => ({
    main: {
      width: '100%',
      height: '100%',
      top: '0',
      left: '0',
      display: 'flex', // Fix IE 11 issue.
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      // backgroundColor: '#303030',
      [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
        width: '100%',
        height: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    headerButtons: {
      color: '#9e9d9e',
    },
    headerContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between'

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
      // backgroundColor: '#303030',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    form: {
      width: '100%',
      marginTop: theme.spacing.unit,
    },
    reportSubmit: {
      width: '40%',
      backgroundColor: '#57C5C9',
      color: '#303030',
      margin: theme.spacing.unit * 3,
      '&:hover': {
        color: '#000000'
      }

    },
    submit: {
        width: '40%',
        backgroundColor: '#57C5C9',
        color: '#303030',
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
      '&:hover': {
        color: '#000000'
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
    reportContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'

    },
    formRoot: {
      color: 'white',
      width: '90%',
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
      // color: "#303030",
      alignItems: "center",
      justifyContent: "center",
      paddingBottom: '20px'

      
    },
    downloadImg: {
      width: "400px",
      height: "400px",
      objectFit: "cover",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      [theme.breakpoints.down('sm')]: {
        width: "90%",
      },

    },
    scoreImgParent: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '20px',
      justifyContent: 'center'
    },
    scoringImgContainer: {
      width: '100%',
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
      marginTop: '10px',
      alignItems: 'center',
      justifyContent: 'center'
    },
    scoringImg: {
      width: "150px",
      height: "100%",
      objectFit: "cover",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      margin: theme.spacing.unit * 2
      // [theme.breakpoints.down('sm')]: {
      //   width: "90%",
      // },

    },
    imgScale: {
      maxWidth: "100%",
      maxHeight: "100%"

    },
    captionDisplay: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: "400px",
      [theme.breakpoints.down('sm')]: {
        width: "90%",
      },
      marginTop: theme.spacing.unit * 3,
      marginBottom: theme.spacing.unit * 3,
    },
    points: {
      margin: theme.spacing.unit * 3
    },
    feedback: {
      marginTop: theme.spacing.unit * 3
    },
    startDiv: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '400px',
      [theme.breakpoints.down('sm')]: {
        width: "90%",
      },
    },
    votesReceived: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center"
    },
    caption: {
      marginTop: theme.spacing.unit * 3

    },
    listMargin: {
      margin: theme.spacing.unit * 3
    },
    roundHeader: {
      display: "flex",
      flexDirection: "row"
    },
    ruleContainer: {
      width: '400px',
      [theme.breakpoints.down('sm')]: {
        width: "90%",
      },
    }
  });
  
  export default styles;