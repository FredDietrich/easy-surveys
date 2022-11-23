import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import { useEffect, useMemo, useState } from "react";
import { RouteObject, useNavigate, useParams } from "react-router-dom";
import FormItem from "../components/form-item.component";
import Form from "../components/form.component";
import Header from "../components/header.component";
import Survey from "../model/survey.model";
import Question, { QuestionType } from "../model/question.model";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { TextField } from "@mui/material";
import Answer from "../model/answer.model";
import { AnswerSurvey } from "./answer-survey.page";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";

type MyDatum = { date: number, stars: number }

function ViewSurvey() {

    const { surveyId } = useParams();
    const navigate = useNavigate();
    const [survey, setSurvey] = useState<Survey | undefined>();
    const [question, setQuestion] = useState<Question>();
    const [answer, setAnswer] = useState<Answer>();

    const data = [
        {
            name: 'Rede social',
            Respostas: 2400,
        },
        {
            name: 'Anúncio em mecanismo de busca',
            Respostas: 1398,
        },
        {
            name: 'Promoção física (banner, cartaz...)',
            Respostas: 9800,
        },
        {
            name: 'Indicação de amigo',
            Respostas: 3908,
        },
        {
            name: 'Direto da loja de apps',
            Respostas: 4800,
        }
    ];

    useEffect(() => {
        if (!surveyId || Number.isNaN(+surveyId)) {
            navigate('/listing')
            return
        }
        setTimeout(() => setSurvey({ id: +surveyId, title: `Pesquisa ${surveyId}` }), 0)
        setTimeout(() => setQuestion({ id: 1, title: 'Em poucas palavras, descreva como encontrou o app:', type: QuestionType.MULTIPLE_ANSWER_OTHER }), 0)
    }, [])

    return (
        <div className="ViewSurvey">
            <Header />
            <Form>
                <FormItem>
                    <Grid container columns={4} sx={{ textAlign: 'center' }}>
                        {!survey ? <Grid item xs={4} sm={4} md={2} lg={2} xl={2} sx={{
                            textAlign: 'center',
                            marginTop: '5rem',
                        }}>
                            <Typography
                                variant="h4"
                                component="div"
                                sx={{
                                    fontSize: '400%',
                                    color: '#bbbbde',
                                    paddingLeft: '5%',
                                    paddingRight: '5%'
                                }}
                            >
                                Carregando
                            </Typography>
                        </Grid> : (
                            <>
                                <Grid item xs={4} sm={4} md={2} lg={2} xl={2} sx={{
                                    textAlign: 'center',
                                    marginTop: '1.3rem',
                                }}>
                                    <Typography
                                        variant="h4"
                                        component="div"
                                        sx={{
                                            fontSize: '400%',
                                            color: 'white',
                                            paddingLeft: '5%',
                                            paddingRight: '5%'
                                        }}
                                    >
                                        Visualizando:
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} sm={4} md={2} lg={2} xl={2} sx={{ textAlign: 'left', marginTop: '1.3rem' }}>
                                    <Typography
                                        variant="h4"
                                        component="div"
                                        sx={{
                                            fontSize: '400%',
                                            color: 'white',
                                            paddingLeft: '5%',
                                            paddingRight: '5%'
                                        }}
                                    >
                                        {survey.title}
                                    </Typography>
                                </Grid>
                            </>)}
                    </Grid>
                </FormItem>
                <FormItem>
                    <Typography
                        variant="caption"
                        component="div"
                        sx={{
                            fontSize: '200%',
                            color: '#ffffff',
                        }}
                    >
                        Abaixo você pode visualizar gráficos, com os resultados da pesquisa:
                    </Typography>
                </FormItem>
                <FormItem>
                <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            color: '#ffffff',
                        }}
                    >
                        Pergunta 1:
                    </Typography>
                    <BarChart
                        width={800}
                        height={600}
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        title="Pergunta 1"
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Respostas" fill="#8884d8" />
                    </BarChart>
                </FormItem>
                {/* <Typography
                    variant="h4"
                    component="div"
                    sx={{
                        fontSize: '400%',
                        color: '#ffffff',
                    }}
                >
                    Abaixo você pode visualizar a pesquisa, assim como seus usuários irão:
                </Typography>
                <div style={{ border: 'solid 2px', borderRadius: '0 0 25px 25px' }}>
                    <AnswerSurvey />
                </div> */}
            </Form>
        </div>
    )
}

export const viewSurveyRoute: RouteObject = {
    path: '/view/:surveyId',
    element: <ViewSurvey />
}