import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { RouteObject, useInRouterContext, useNavigate, useParams, useSearchParams } from "react-router-dom";
import FormItem from "../components/form-item.component";
import Form from "../components/form.component";
import Header from "../components/header.component";
import Survey from "../model/survey.model";
import Question, { QuestionTypeEnum } from "../model/question.model";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { MenuItem, TextField } from "@mui/material";
import Answer from "../model/answer.model";
import * as api from '../api/api';
import Alternative from "../model/alternative.model";
import { useAuth } from "../contexts/auth.context";

function QuestionOptions({ question, answer, setAnswer }: any) {
    switch (question.type) {
        case QuestionTypeEnum.FREE_TEXT:
            return (
                <>
                    <TextField
                        label={question.title}
                        value={answer.value}
                        onChange={e => setAnswer((currentAnswer: Answer) => ({...currentAnswer, value: e.target.value}))}
                    />
                </>
            )
        case QuestionTypeEnum.MULTIPLE_ANSWER:
            return (
                <>
                    <InputLabel id="question-label">
                        {question.title}
                    </InputLabel>
                    <Select
                        labelId="question-label"
                        label={question.title}
                        value={answer.value}
                        onChange={e => setAnswer((currentAnswer: Answer) => ({...currentAnswer, value: e.target.value}))}
                        fullWidth
                    >
                        {
                            question.alternatives && (question.alternatives as Alternative[]).map((alternative, index) => (
                                <MenuItem value={alternative.name} key={index}>{alternative.name}</MenuItem>
                            ))
                        }
                    </Select>
                </>
            )
        case QuestionTypeEnum.MULTIPLE_ANSWER_OTHER:
            return (
                <>
                    <InputLabel id="question-label">
                        {question.title}
                    </InputLabel>
                    <Select
                        labelId="question-label"
                        value={answer.value}
                        label={question.title}
                        onChange={e => setAnswer((currentAnswer: Answer) => ({...currentAnswer, value: e.target.value}))}
                        fullWidth
                    >
                    </Select>
                    <Divider />
                    <TextField
                        value={answer.value}
                        onChange={e => setAnswer(e.target.value)}
                        label="Outro"
                    >
                        <>
                            <InputLabel id="question-label">
                                {question.title}
                            </InputLabel>
                            <Select
                                labelId="question-label"
                                value={answer.value}
                                label={question.title}
                                onChange={e => setAnswer((currentAnswer: Answer) => ({...currentAnswer, value: e.target.value}))}
                                fullWidth
                            >

                            </Select>
                        </>
                    </TextField>
                </>
            )
        default:
            return <p>Problema ao carregar o tipo da questão</p>
    }
}

export function AnswerSurvey() {

    const { surveyId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [survey, setSurvey] = useState<Survey | undefined>();
    const [question, setQuestion] = useState<Partial<Question>>();
    const [answer, setAnswer] = useState<Partial<Answer>>({
        value: ''
    });
    const [questionOrder, setQuestionOrder] = useState<number[]>()
    const {user} = useAuth()

    useEffect(() => {
        if (!surveyId || Number.isNaN(+surveyId)) {
            navigate('/listing')
            return
        }
        setAnswer({
            value: ''
        })
        setQuestion({})
        const questionOrderQuery = searchParams.get("question")
        const questionOrder = +(questionOrderQuery ?? '1')
        setQuestionOrder([questionOrder])
        
        async function fetchSurvey() {
            const foundSurvey = await api.get('survey/' + surveyId)
            setSurvey(foundSurvey.data)
            setQuestion(foundSurvey.data.questions.filter(
                (quest: Question) => quest.order == questionOrder
            )[0])
            setQuestionOrder(currentQuestionOrder => [(currentQuestionOrder ?? [1])[0], (foundSurvey.data.questions as Question[]).reduce((prev, curr) => (prev.order > curr.order) ? prev : curr).order])
            return foundSurvey.data.questions.filter(
                (quest: Question) => quest.order == questionOrder
            )[0]
        }
        async function fetchAnswer(questionFound: any) {
            try {
                const userId = JSON.parse(sessionStorage.getItem("@EasySurveys:user") ?? '').id
                const foundAnswer = await api.get('question/' + questionFound.id + '/answer?userId=' + encodeURI(userId.toString()) + '&order='+encodeURI(questionOrder.toString()))
                setAnswer(foundAnswer.data)    
            } catch {
                setAnswer({
                    value: ''
                })
            }
        }
        fetchSurvey().then(fetchAnswer)
    }, [searchParams])

    async function navigateBack() {
        if (!questionOrder) return
        const hasQuestionBefore = (questionOrder[0] >= questionOrder[1]) && (questionOrder[0] > 1)
        if (!hasQuestionBefore) return
        await saveQuestion(questionOrder[0])
        setSearchParams({
            question: (--questionOrder[0]).toString()
        })
    }

    async function navigateForward() {
        if (!questionOrder) return
        const hasQuestionAfter = questionOrder[0] < questionOrder[1]
        if (!hasQuestionAfter) {
            alert('Pesquisa salva com sucesso')
            return
        }
        await saveQuestion(questionOrder[0])
        setSearchParams({
            question: (++questionOrder[0]).toString()
        })
    }

    async function saveQuestion(currentQuestionId: number) {
        if (!question || !user) return
        if (answer.id) {
            await api.put('answer/' + answer.id, {...answer})
        } else {
            const createdAnswer = await api.post('answer', {...answer})
            await api.put('question/' + currentQuestionId + '/answer', {id: createdAnswer.data.id})
            await api.put('user/' + user.id + '/answer', {id: createdAnswer.data.id})
        }
    }

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
                                <Grid item xs={4} sm={4} md={2} lg={4} xl={4} sx={{
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
                                        {survey.name}
                                    </Typography>
                                </Grid>
                            </>)}
                    </Grid>
                </FormItem>
                <FormItem>
                    <Box sx={{ height: 'auto', width: '100%', borderRadius: '1rem' }} bgcolor='#434b65'>
                        <List dense>
                            {
                                (!question || !questionOrder) ?
                                    "Pesquisa não possui perguntas, volte novamente mais tarde, ou, caso for o dono dela, crie elas" :
                                    <div>
                                        <ListItem>
                                            <Box sx={{ width: '80%' }}>
                                                <FormControl fullWidth>
                                                    <QuestionOptions question={question} answer={answer} setAnswer={setAnswer} />
                                                </FormControl>
                                            </Box>
                                        </ListItem>
                                        <ListItem sx={{ height: '100%', textAlign: 'center' }}>
                                            <Box sx={{ width: '100%', height: 'auto', pb: '1%', pt: '1%', textAlign: 'center' }}>
                                                <Button sx={{ position: 'absolute', right: '2%' }} onClick={navigateForward}>
                                                    <NavigateNextIcon color="action" />
                                                </Button>
                                                <span style={{ color: 'white' }}>
                                                    Pergunta {questionOrder[0]} de {questionOrder[1]}
                                                </span>
                                                <Button sx={{ position: 'absolute', left: '2%' }} onClick={navigateBack}>
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