import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
import {
    AppBanner,
    HomeWrapper,
    LoginScreen,
    RegisterScreen,
    WorkspaceScreen
} from './components'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { indigo, yellow, amber, deepPurple, grey, red } from '@mui/material/colors';


/**
 * App Theme
 * 
 * @author Taylor Giles
 */
 export const theme = createTheme({
    palette: {
        primary: grey,
        secondary: {
            main: indigo[900]
        },
        complement: {
            main: deepPurple[50]
        },
        accent: {
            main: amber[700]
        },
        selection: {
            main: indigo[500]
        },
        unpublished:{
            main: yellow[50]
        },
        black: {
            main: "#000000"
        },
        red:{
            main: red[500]
        }
    }
});


/*
    This is our application's top-level component.
    
    @author McKilla Gorilla
*/
/*
  This is the entry-point for our application. Notice that we
  inject our store into all the components in our application.
  
  @author McKilla Gorilla
*/
const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <AuthContextProvider>
                    <GlobalStoreContextProvider>              
                        <AppBanner />
                        <Switch>
                            <Route path="/" exact component={HomeWrapper} />
                            <Route path="/login/" exact component={LoginScreen} />
                            <Route path="/register/" exact component={RegisterScreen} />
                            <Route path="/top5list/:id" exact component={WorkspaceScreen} />
                        </Switch>
                    </GlobalStoreContextProvider>
                </AuthContextProvider>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App