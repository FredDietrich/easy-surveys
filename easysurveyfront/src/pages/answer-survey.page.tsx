import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
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

export function AnswerSurvey() {

    const { surveyId } = useParams();
    const navigate = useNavigate();
    const [survey, setSurvey] = useState<Survey | undefined>();
    const [question, setQuestion] = useState<Question>();
    const [answer, setAnswer] = useState<Answer>();

    useEffect(() => {
        if (!surveyId || Number.isNaN(+surveyId)) {
            navigate('/listing')
            return
        }
        setTimeout(() => setSurvey({ id: +surveyId, title: `Pesquisa ${surveyId}` }), 0)
        setTimeout(() => setQuestion({ id: 1, title: 'Em poucas palavras, descreva como encontrou o app:', type: QuestionType.MULTIPLE_ANSWER }), 0)
    }, [])

    return (
        <div className="AnswerSurvey">
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
                                    marginTop: '4rem',
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
                                        {survey.title}
                                    </Typography>
                                </Grid>
                            </>)}
                    </Grid>
                </FormItem>
                <FormItem>
                    <Box sx={{ height: 'auto', width: '100%', borderRadius: '1rem' }} bgcolor='#434b65'>
                        <List dense>
                            {
                                !question ?
                                    "Pesquisa não possui perguntas, volte novamente mais tarde, ou, caso for o dono dela, crie elas" :
                                    <div>
                                        <ListItem>
                                            <ListItemText
                                                primary={<p style={{ color: 'white' }}>{question.title}</p>}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <Box sx={{ width: '80%' }}>
                                                <FormControl fullWidth>
                                                    {question.type == QuestionType.TEXT ? (
                                                        <TextField>

                                                        </TextField>
                                                    ) : (question.type == QuestionType.MULTIPLE_ANSWER ? (
                                                        <>
                                                            <InputLabel id="question-label">
                                                                {question.title}
                                                            </InputLabel>
                                                            <Select
                                                                labelId="question-label"
                                                                value={question.type}
                                                                label={question.title}
                                                                onChange={() => console.log('a implementar save de resposta')}
                                                                fullWidth
                                                            >

                                                            </Select>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <InputLabel id="question-label">
                                                                {question.title}
                                                            </InputLabel>
                                                            <Select
                                                                labelId="question-label"
                                                                value={question.type}
                                                                label={question.title}
                                                                onChange={() => console.log('a implementar save de resposta')}
                                                                fullWidth
                                                            >

                                                            </Select>
                                                            <Divider />
                                                            <TextField
                                                                label="Outro"
                                                            >

                                                            </TextField>
                                                        </>
                                                    ))
                                                    }

                                                </FormControl>
                                            </Box>
                                        </ListItem>
                                        <ListItem sx={{ height: '100%', textAlign: 'center' }}>
                                            <Box sx={{ width: '100%', height: 'auto', pb: '1%', pt: '1%', textAlign: 'center' }}>
                                                <Button sx={{ position: 'absolute', right: '2%' }}>
                                                    <NavigateNextIcon color="action" />
                                                </Button>
                                                <span style={{ color: 'white' }}>
                                                    Pergunta 1 de 2
                                                </span>
                                                <Button sx={{ position: 'absolute', left: '2%' }}>
                                                    <NavigateBeforeIcon color="action" />
                                                </Button>
                                            </Box>
                                        </ListItem>
                                    </div>
                            }

                        </List>
                    </Box>
                </FormItem>
            </Form>
        </div>
    )
}

export const answerSurveyRoute: RouteObject = {
    path: '/answer/:surveyId',
    element: <AnswerSurvey />
}