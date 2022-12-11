import TextField from "@mui/material/TextField";
import { Link, RouteObject, useNavigate } from "react-router-dom";
import FormItem from "../components/form-item.component";
import Form from "../components/form.component";
import Header from "../components/header.component";
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Button } from "@mui/material";
import * as api from '../api/api';
import { AxiosError } from "axios";

interface IRegisterFormData {
    username: string,
    name: string,
    email: string,
    password: string
}

function RegisterPage() {
    const [registerFormData, setRegisterFormData] = useState<IRegisterFormData>({
        username: "",
        name: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate()

    async function handleRegister(loginData: IRegisterFormData) {
        try {
            await api.post("user", loginData)
            navigate("/login")
        } catch (e) {
            if (!(e instanceof AxiosError) || !e || !e.response) return
            if (e.response.status == 422) {
                alert(e.response.data)
            }
        }
    }

    return (
        <div className="RegisterPage">
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
                        Cadastro
                    </Typography>
                </FormItem>
                <FormItem>
                    <TextField
                        label="Username"
                        variant="outlined"
                        color="primary"
                        fullWidth
                        required
                        value={registerFormData.username}
                        onChange={e => setRegisterFormData({ ...registerFormData, username: e.target.value })}
                    />
                </FormItem>
                <FormItem>
                    <TextField
                        label="Nome"
                        variant="outlined"
                        color="primary"
                        fullWidth
                        required
                        value={registerFormData.name}
                        onChange={e => setRegisterFormData({ ...registerFormData, name: e.target.value })}
                    />
                </FormItem>
                <FormItem>
                    <TextField
                        label="E-mail"
                        type="email"
                        variant="outlined"
                        color="primary"
                        fullWidth
                        required
                        value={registerFormData.email}
                        onChange={e => setRegisterFormData({ ...registerFormData, email: e.target.value })}
                    />
                </FormItem>
                <FormItem>
                    <TextField
                        label="Senha"
                        type="password"
                        variant="outlined"
                        color="primary"
                        fullWidth
                        required
                        value={registerFormData.password}
                        onChange={e => setRegisterFormData({ ...registerFormData, password: e.target.value })}
                    />
                </FormItem>
                <FormItem justifyContent="center">
                    <Button
                        variant="contained"
                        onClick={() => handleRegister(registerFormData)}
                        type="submit"
                    >
                        Cadastrar
                    </Button>
                </FormItem>
                <FormItem justifyContent="center">
                    <Typography sx={{
                        paddingRight: '5%',
                        color: 'white'
                    }}>
                        Já tem cadastro?
                    </Typography>
                    <Link to="/login">
                        <Button variant="contained">
                            Login
                        </Button>
                    </Link>
                </FormItem>
            </Form>
        </div>
    )
}

export const registerRoute: RouteObject = {
    path: '/register',
    element: <RegisterPage />
}