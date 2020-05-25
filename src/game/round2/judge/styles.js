const styles = theme => ({
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
        },
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
      },
      inputLabel: {
        width: '400px',
        color: '#57C5C9',
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
    textBox: {
        margin: theme.spacing.unit*3,
    },
    uploadArea: {
        maxWidth: '100vh',
        maxHeight: '80%',
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
})

export default styles;