import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { Link, RouteObject, useNavigate, useParams } from "react-router-dom";
import FormItem from "../components/form-item.component";
import Form from "../components/form.component";
import Header from "../components/header.component";
import Survey from "../model/survey.model";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import * as api from '../api/api';

type AnswersData = {
    value: string,
    count: number
}

function ViewSurvey() {

    const { surveyId } = useParams();
    const navigate = useNavigate();
    const [survey, setSurvey] = useState<Survey | undefined>();
    const [answersData, setAnswersData] = useState<AnswersData[]>();

    useEffect(() => {
        if (!surveyId || Number.isNaN(+surveyId)) {
            navigate('/listing')
            return
        }
        async function fetchAnswersData() {
            const { data } = await api.get('survey/' + surveyId + '/alternativeResults')
            setAnswersData(data)
        }
        fetchAnswersData()
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
                                        {survey.name}
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
                {
                    ( answersData?.length > 0 && answersData ) ? answersData.map(answerData => (
                        <>
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
                                    data={answerData}
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
                        </>
                    )):
                    <p>carregando</p>
                }
                {/*  */}
                <Typography
                    variant="h4"
                    component="div"
                    sx={{
                        fontSize: '400%',
                        color: '#ffffff',
                    }}
                >
                    Abaixo você pode visualizar a pesquisa, assim como seus usuários irão:
                </Typography>
                <div>
                    <Link to={"/answer/" + surveyId} target="_blank">
                        <Button variant="contained">
                            Ir para a resposta de pesquisa
                        </Button>
                    </Link>
                </div>
            </Form>
        </div>
    )
}

export const viewSurveyRoute: RouteObject = {
    path: '/view/:surveyId',
    element: <ViewSurvey />
}