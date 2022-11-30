import { AppBar, Box, Toolbar } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/auth.context";

interface IHeaderProps {
    loggedIn?: boolean
}

export default function Header({ loggedIn }: IHeaderProps) {
    const { signed } = useAuth();
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                position="static"
                sx={{
                    backgroundColor: '#434b65',
                    borderRadius: '0 0 25px 25px'
                }}
            >
                <Toolbar>
                    <Typography
                        variant="h4"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        Easy Surveys
                    </Typography>
                    <Link to={signed ? "/logout" : "/login"}>
                        <Button
                            variant="contained"
                            color={signed ? "error" : "primary"}
                        >
                            {signed ? "Sair" : "Login"}
                        </Button>
                    </Link>
                </Toolbar>
            </AppBar>
        </Box>
    )
}