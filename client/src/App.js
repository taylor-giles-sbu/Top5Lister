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
    Statusbar,
    WorkspaceScreen
} from './components'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { purple, amber, deepPurple, grey } from '@mui/material/colors';


/**
 * App Theme
 * 
 * @author Taylor Giles
 */
 export const theme = createTheme({
    palette: {
        primary: grey,
        secondary: {
            main: purple[900]
        },
        complement: {
            main: deepPurple[100]
        },
        accent: {
            main: amber[700]
        },
        black: {
            main: "#000000"
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
                        <Statusbar />
                    </GlobalStoreContextProvider>
                </AuthContextProvider>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App