import Typography from "@mui/material/Typography"
import { Link, RouteObject } from "react-router-dom"
import Header from "../components/header.component"
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import Button from "@mui/material/Button";
import { Box, Grid } from "@mui/material";

function LandingPage() {
    return (
        <div className="LandingPage">
            <Header />
            <Grid container spacing={2} columns={4}>
                <Grid item xs={4} sm={4} md={2} lg={2} xl={2} sx={{ textAlign: 'center' }}>
                    <Typography
                        variant="h4"
                        component="div"
                        sx={{
                            fontSize: '400%',
                            color: '#bbbbde',
                            paddingTop: '5%',
                            paddingLeft: '5%',
                            paddingRight: '5%'
                        }}
                    >
                        Crie em minutos um
                        formulário e saiba o
                        que seus usuários
                        acham do seu app
                    </Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={2} lg={2} xl={2} sx={{ textAlign: 'center' }}>
                    <DynamicFormIcon
                        sx={{
                            color: '#1647c7',
                            width: '25rem',
                            height: 'auto',
                        }}
                    />
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                    <Box sx={{
                        width: '100%',
                        textAlign: 'center',
                        marginTop: '10%',
                        paddingBottom: '15%'
                    }}>
                        <Link to="/login">
                            <Button
                                variant="contained"
                                sx={{
                                    width: '20rem',
                                    height: '4rem',
                                    fontSize: '2rem'
                                }}
                            >
                                Começar agora
                            </Button>
                        </Link>
                    </Box>
                </Grid>
            </Grid>
        </div>
    )
}

export const landingRoute: RouteObject = {
    path: '/',
    element: <LandingPage />
}