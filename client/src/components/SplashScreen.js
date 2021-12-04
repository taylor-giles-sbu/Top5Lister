import { Button, Grid, Box, Typography } from "@mui/material";
import theme from "../App"

export default function SplashScreen() {
    return (
        <Box 
            id="splash-screen">
            <Typography component="h1" variant="h4" m={2}>
                Welcome to the Top 5 Lister!
            </Typography>
            
            <Typography component="h1" variant="h5" m={1}>
                Make lists of your favorite things and share with your friends!
            </Typography>

            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
            > 
                <Grid item container 
                    spacing={2} 
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item >
                        <Button 
                            id="btn_create_account" 
                            variant="contained"
                            color="primary"
                            href="/register/"
                        >
                            Create an Account
                        </Button>
                    </Grid>
                    <Grid item >
                        <Button 
                            href="/login/" 
                            color="accent" 
                            id="btn_login" 
                            variant="contained"
                        >
                            Log In 
                        </Button>
                    </Grid>
                </Grid>
                <Grid item justifyContent="center"
                alignItems="center">
                    <Button 
                        color="primary" 
                        id="btn_login_guest" 
                        variant="contained"
                    >
                        Continue as Guest    
                    </Button>
                </Grid>
            </Grid>
        </Box>
    )
}