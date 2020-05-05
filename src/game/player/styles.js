import { grey } from "@material-ui/core/colors";

const styles = theme => ({
    main: {
      width: 'auto',
      display: 'block', // Fix IE 11 issue.
      marginLeft: theme.spacing.unit * 3,
      marginRight: theme.spacing.unit * 3,
      [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
        width: 400,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    paper: {
      marginTop: theme.spacing.unit * 8,
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
        marginRight: theme.spacing.unit*2,
      marginTop: theme.spacing.unit * 3,
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
    uploadArea: {
      maxWidth: '200px',
      maxHeight: '200px',
      borderStyle: 'solid',
      borderColor: 'red'

    },
    downloadImg: {
      width: "200px",
      height: "200px",
      borderStyle: 'solid',
      borderColor: 'blue'
    },
    imgScale: {
      maxWidth: "100%",
      maxHeight: "100%"

    }

  });
  
  export default styles;