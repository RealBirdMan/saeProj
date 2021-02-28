import {createMuiTheme, responsiveFontSizes} from "@material-ui/core/styles";

const theme = createMuiTheme({
    palette:{
        primary: {
            main: '#FECB9C',
            contrastText: "#fff"
          },
        secondary: {
            main: '#A5D1C8',
            contrastText: "#fff"
          },
        text: {
            primary:  "#2C3532",
        },
        background: {
            paper: "#106466",
        },
    },
    typography: {
        h2: {
            fontSize: "2.5 rem",
        },   
        h3: {
            fontSize: "2 rem",
        }, 
    },
})

responsiveFontSizes(theme);


export default theme;
