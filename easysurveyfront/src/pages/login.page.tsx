import TextField from "@mui/material/TextField";
import { Link, RouteObject, useNavigate } from "react-router-dom";
import FormItem from "../components/form-item.component";
import Form from "../components/form.component";
import Header from "../components/header.component";
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useAuth } from "../contexts/auth.context";

interface ILoginFormData {
    username: string,
    password: string
}


function UsernameField({ loginFormData, setLoginFormData }: any) {
    return (
        <TextField
            label="Username"
            variant="outlined"
            color="primary"
            fullWidth
            required
            value={loginFormData.username}
            onChange={e => setLoginFormData({ ...loginFormData, username: e.target.value })}
        />
    )
}

function PasswordField({ loginFormData, setLoginFormData }: any) {
    return (
        <TextField
            label="Senha"
            variant="outlined"
            color="primary"
            fullWidth
            required
            type="password"
            value={loginFormData.password}
            onChange={e => setLoginFormData({ ...loginFormData, password: e.target.value })}
        />
    )
}

function LoginPage() {
    const [loginFormData, setLoginFormData] = useState<ILoginFormData>({
        username: "",
        password: ""
    });

    const { Login, signed } = useAuth();
    const navigate = useNavigate()

    useEffect(() => {
        if (signed) navigate('/listing')
    })

    async function handleLogin() {
        try {
            const loginOK = await Login({
                ...loginFormData
            })
            if (loginOK) return navigate("/listing")
            alert('Usuário ou senha inválidos!')
            
        } catch (e) {
        }
    }

    return (
        <div className="LoginPage">
            <Header />
            <Form>
            <FormItem justifyContent="center">
                <DynamicFormIcon
                    sx={{
                        color: '#1647c7',
                        width: '12rem',
                        height: 'auto',
                    }}
                />
            </FormItem>
            <FormItem justifyContent="center">
                <Typography
                    variant="h4"
                    component="div"
                    sx={{
                        fontSize: '400%',
                        color: 'white',
                        paddingLeft: '5%',
                        paddingRight: '5%',
                        paddingBottom: '5%'
                    }}
                >
                    Login
                </Typography>
            </FormItem>
            <UsernameField loginFormData={loginFormData} setLoginFormData={setLoginFormData} />
            <PasswordField loginFormData={loginFormData} setLoginFormData={setLoginFormData} />
            <FormItem justifyContent="center">
                <Button
                    variant="contained"
                    type="submit"
                    onClick={e => { e.preventDefault(); handleLogin() }}
                >
                    Login
                </Button>
            </FormItem>
            <FormItem justifyContent="center">
                <Typography sx={{
                    paddingRight: '5%',
                    color: 'white'
                }}>
                    Novo por aqui?
                </Typography>
                <Link to="/register">
                    <Button variant="contained">
                        Cadastro
                    </Button>
                </Link>
            </FormItem>
            </Form>
        </div>
    )
}

export const loginRoute: RouteObject = {
    path: '/login',
    element: <LoginPage />
}