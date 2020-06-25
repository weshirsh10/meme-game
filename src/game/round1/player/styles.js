const styles = theme => ({
    main: {
      width: 'auto',
      display: 'block', // Fix IE 11 issue.
      // marginLeft: theme.spacing.unit * 3,
      // marginRight: theme.spacing.unit * 3,
      color: '#303030',
      backgroundColor: '#303030',
      [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    paper: {
      marginTop: theme.spacing.unit * 8,
      marginBottom: theme.spacing.unit * 8,
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
        width: '100%',
        backgroundColor: '#57C5C9',
        color: '#303030',
        // marginRight: theme.spacing.unit*2,
      marginTop: theme.spacing.unit * 3,
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
      width: '400px',
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
        borderBottomColor: "purple"
      },
      "& .MuiInput-input": {
        color: 'white' 
      },
      width: '400px',
      [theme.breakpoints.down('sm')]: {
        width: "100%",
      },

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
    imgScale: {
      maxWidth: "100%",
      maxHeight: "100%"

    },
    waitImgContainer: {
      margin: theme.spacing.unit * 15, 
      width: "50%",
      height: "50%"
    },
    captionContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: '400px',
      [theme.breakpoints.down('sm')]: {
        width: "90%",
      },
    },
    formContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "400px",
      [theme.breakpoints.down('sm')]: {
        width: "90%",
      },
    }
  });
  
  export default styles;