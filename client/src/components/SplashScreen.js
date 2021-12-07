import { Button, Grid, Box, Typography } from "@mui/material";
import { useContext } from 'react';
import AuthContext from '../auth'

export default function SplashScreen() {
    const { auth } = useContext(AuthContext);

    const handleGuestLogin = (event) => {
        event.preventDefault();
        auth.registerUser(auth.GUEST_USER.firstName, auth.GUEST_USER.lastName, auth.GUEST_USER.username, auth.GUEST_USER.email, auth.GUEST_USER.password, auth.GUEST_USER.passwordVerify)
        auth.loginUser(auth.GUEST_USER.username, auth.GUEST_USER.password)
    }; 

    return (
        <Box 
            id="splash-screen">
            <Typography component="h1" variant="h4" m={2}>
                Welcome to the Top 5 Lister!
            </Typography>
            
            <Typography component="h1" variant="h5" m={1}>
                Make lists of your favorite things and share with your friends!
            </Typography>

            <Typography variant="caption">
                Developed by Taylor Giles
            </Typography>

            <Grid container 
                direction="row"
                spacing={2} 
                justifyContent="center"
                alignItems="center"
            >
                <Grid item xs='auto'>
                    <Button 
                        id="btn_create_account" 
                        variant="contained"
                        color="primary"
                        href="/register/"
                    >
                        Create an Account
                    </Button>
                </Grid>
                <Grid item xs='auto'>
                    <Button 
                        href="/login/" 
                        color="accent" 
                        id="btn_login" 
                        variant="contained"
                    >
                        Log In 
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button 
                        color="primary" 
                        id="btn_login_guest" 
                        variant="contained"
                        onClick={handleGuestLogin}
                    >
                    Continue as Guest    
                </Button>
            </Grid>
            </Grid>
        </Box>
    )
}