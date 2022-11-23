import TextField from "@mui/material/TextField";
import { Link, RouteObject } from "react-router-dom";
import FormItem from "../components/form-item.component";
import Form from "../components/form.component";
import Header from "../components/header.component";
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import Typography from "@mui/material/Typography";
import styled from "@emotion/styled";
import { useState } from "react";
import { Button } from "@mui/material";

interface ILoginFormData {
    username: string,
    password: string
}

function handleLogin(loginData: ILoginFormData) {
    //TODO: Fazer login
}

function LoginPage() {
    const [loginFormData, setLoginFormData] = useState<ILoginFormData>({
        username: "",
        password: ""
    });

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
                <FormItem>
                    <TextField
                        label="Username"
                        variant="outlined"
                        color="primary"
                        fullWidth
                        autoFocus
                        required
                        value={loginFormData.username}
                        onChange={e => setLoginFormData({ ...loginFormData, username: e.target.value })}
                    />
                </FormItem>
                <FormItem>
                    <TextField
                        label="Senha"
                        variant="outlined"
                        color="primary"
                        fullWidth
                        required
                        value={loginFormData.password}
                        onChange={e => setLoginFormData({ ...loginFormData, password: e.target.value })}
                    />
                </FormItem>
                <FormItem justifyContent="center">
                    <Button
                        variant="contained"
                        type="submit"
                        onClick={e => {e.preventDefault(); handleLogin(loginFormData)}}
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