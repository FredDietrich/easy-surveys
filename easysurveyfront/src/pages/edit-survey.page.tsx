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
import Question, { QuestionTypeEnum } from "../model/question.model";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import Collapse from "@mui/material/Collapse";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Alternative from "../model/alternative.model";
import DeleteIcon from '@mui/icons-material/Delete';
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { OutlinedInput, TextField } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import * as api from '../api/api';
import { useAuth } from "../contexts/auth.context";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

interface IOpenItem {
    id: number,
    open: boolean
}

interface IEditableTitles {
    id: number,
    editable: boolean
}

function EditSurvey() {

    const { surveyId } = useParams();
    const navigate = useNavigate();
    const [survey, setSurvey] = useState<Partial<Survey>>({
        name: ''
    });
    const [questions, setQuestions] = useState<Question[]>([]);
    const [openItems, setOpenItems] = useState<IOpenItem[]>([]);
    const [editableTitles, setEditableTitles] = useState<IEditableTitles[]>([])
    const { user } = useAuth()

    useEffect(() => {
        if (!surveyId || Number.isNaN(+surveyId)) {
            navigate('/listing')
            return
        }
        async function findSurvey() {
            try {
                const foundSurvey = await api.get("survey/" + surveyId)
                setSurvey(foundSurvey.data)
                setQuestions((foundSurvey.data.questions as Question[]).sort((a, b) => a.order > b.order ? 1 : -1))
            } catch (e) { console.error(e) }
        }
        findSurvey()
    }, [])

    async function addQuestion() {
        if (!user) {
            return navigate("/login")
        }
        const createdQuestion = await api.post("question", { title: "Edite-me clicando no lápis" })
        await api.put("survey/" + survey.id + "/question", { id: createdQuestion.data.id })
        await saveSurvey()
        location.reload()
    }

    async function addAlternativeToQuestion(questionId: number) {
        const foundQuestion = questions.find(question => question.id == questionId)
        if (!foundQuestion) return
        const createdAlternative = await api.post("alternative", { name: "Edite meu nome" })
        setQuestions(currentQuestions => 
            currentQuestions.map(quest => {
                return quest.id == questionId ? {...quest, alternatives: [...quest.alternatives, createdAlternative.data]} : quest
            })
        )
        await api.put("question/" + questionId + "/alternative", { id: createdAlternative.data.id })
        await saveSurvey()
        location.reload()
    }

    function toggleOpen(id: number) {
        const foundItem = openItems.find(item => item.id == id)
        if (!foundItem) {
            return setOpenItems([...openItems, { id: id, open: true }])
        }
        setOpenItems(openItems => openItems.map(item => {
            return item.id == id ? { ...item, open: !item.open } : item
        }))
    }

    function isOpen(id: number) {
        const foundItem = openItems.find(item => item.id == id)
        return foundItem ? foundItem.open : false
    }

    function handleQuestionTypeEnumChange(e: SelectChangeEvent<QuestionTypeEnum>, id: number) {
        e.preventDefault()
        const value = e.target.value as QuestionTypeEnum
        setQuestions(questions => questions.map(question => {
            return question.id == id ? { ...question, type: value } : question
        }))
    }

    function isTitleEditable(id: number) {
        const foundTitle = editableTitles.find(title => title.id == id)
        return foundTitle ? foundTitle.editable : false
    }

    function toggleEditableTitle(id: number) {
        const foundTitle = editableTitles.find(title => title.id == id)
        if (!foundTitle) {
            return setEditableTitles(currentEditableTitles => [...currentEditableTitles, { id: id, editable: true }])
        }
        setEditableTitles(currentEditableTitles => currentEditableTitles.map(title => {
            return title.id == id ? { ...title, editable: !title.editable } : title
        }))
    }

    async function saveSurvey() {
        await api.put('survey/'+ survey.id, {...survey})
        if ((questions.length != survey.questions?.length) &&  (survey.questions && survey.questions.length > 0)) {
            await api.put("survey/" + survey.id, {...survey, questions})
        }
        questions.forEach(async (question, index) => {
            await api.put("question/" + question.id, JSON.parse(JSON.stringify({ ...question, order: index + 1 })))
        })
        alert('Pesquisa salva com sucesso')
    }

    function handleAlternativeNameChange(e: any, alternativeId: number, questionId: number) {
        setQuestions(currentQuestions => {
            return currentQuestions.map(question => {
                if (!question.alternatives) return question
                if (!(question.id == questionId)) return question
                return {
                    ...question, alternatives: question.alternatives.map(alternative => {
                        return alternative.id == alternativeId ? { ...alternative, name: e.target.value as string } : alternative
                    })
                }
            })
        })
    }

    function deleteAlternative(alternativeId: number, questionId: number) {
        setQuestions(currentQuestions => {
            return currentQuestions.map(question => {
                if (!question.alternatives) return question
                if (!(question.id == questionId)) return question
                return { ...question, alternatives: question.alternatives.filter(alt => alt.id != alternativeId) }
            })
        })
    }

    function deleteQuestion(questionId: number) {
        setQuestions(currentQuestions => {
            return currentQuestions.filter(ques => ques.id != questionId)
        })
    }

    return (
        <div className="EditSurvey">
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
                                        Editando pesquisa:
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} sm={4} md={2} lg={2} xl={2} sx={{ textAlign: 'left', marginTop: '1.3rem' }}>
                                    <Typography
                                        variant="h4"
                                        component="div"
                                        sx={{
                                            fontSize: '400%',
                                            color: 'white',
                                            paddingTop: '7%',
                                            paddingLeft: '5%',
                                            paddingRight: '5%'
                                        }}
                                    >
                                        {isTitleEditable(-1) ?
                                            <TextField value={survey.name} onChange={e => setSurvey(currentSurvey => ({ ...currentSurvey, name: e.target.value }))} />
                                            :
                                            survey.name
                                        }
                                        <IconButton
                                            onClick={() => toggleEditableTitle(-1)}
                                        >
                                            {isTitleEditable(-1) ? <SaveIcon /> : <EditIcon />}
                                        </IconButton>
                                    </Typography>
                                </Grid>
                            </>)}
                    </Grid>
                </FormItem>
                <FormItem>
                    <Box sx={{ height: 'auto', width: '100%', borderRadius: '1rem' }} bgcolor='#434b65'>
                        <List dense>
                            <ListItem sx={{ textAlign: 'center', display: 'block' }}>
                                <Button
                                    color="success"
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    onClick={() => saveSurvey()}
                                >
                                    Salvar pesquisa
                                </Button>
                            </ListItem>
                            {
                                questions.length < 1 ?
                                    <ListItem>
                                        Pesquisa não possui perguntas, clique abaixo para adicionar uma agora mesmo!
                                    </ListItem> :
                                    questions.map((question, index) => (
                                        <div key={index}>
                                            <ListItem>
                                                <ListItemButton onClick={() => toggleOpen(question.id)}>
                                                    <ListItemText
                                                        primary={
                                                            <p style={{ color: 'white' }}>
                                                                {isTitleEditable(question.id) ?
                                                                    <TextField value={question.title} onChange={e => setQuestions(currentQuestions => currentQuestions.map(ques => ques.id == question.id ? { ...question, title: e.target.value } : ques))} />
                                                                    :
                                                                    question.title
                                                                }
                                                            </p>
                                                        }
                                                    />
                                                    <IconButton
                                                        onClick={() => toggleEditableTitle(question.id)}
                                                    >
                                                        {isTitleEditable(question.id) ? <SaveIcon /> : <EditIcon />}
                                                    </IconButton>
                                                    {isOpen(question.id) ? <ExpandLess /> : <ExpandMore />}
                                                </ListItemButton>
                                            </ListItem>
                                            <Collapse in={isOpen(question.id)} timeout="auto" unmountOnExit>
                                                <List component="div" disablePadding>
                                                    <ListItem sx={{ pl: 6 }}>
                                                        <Box sx={{ minWidth: 240 }}>
                                                            <FormControl fullWidth>
                                                                <InputLabel id="question-type-label">Tipo de questão</InputLabel>
                                                                <Select
                                                                    labelId="question-type-label"
                                                                    id="demo-simple-select"
                                                                    value={question.type}
                                                                    label="Tipo de questão"
                                                                    sx={{ width: '100%' }}
                                                                    onChange={e => handleQuestionTypeEnumChange(e, question.id)}
                                                                >
                                                                    <MenuItem value={QuestionTypeEnum.MULTIPLE_ANSWER}>Múltipla escolha</MenuItem>
                                                                    <MenuItem value={QuestionTypeEnum.FREE_TEXT}>Texto livre</MenuItem>
                                                                    <MenuItem value={QuestionTypeEnum.MULTIPLE_ANSWER_OTHER}>Múltipla escolha + Outro</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                            <Button
                                                                sx={{ position: 'absolute', right: '2%' }}
                                                                onClick={() => deleteQuestion(question.id)}
                                                            >
                                                                <DeleteIcon color="action" />
                                                            </Button>
                                                        </Box>
                                                    </ListItem>
                                                    <ListItem sx={{ pl: 8 }}>
                                                        <List>
                                                            {question.type > QuestionTypeEnum.FREE_TEXT && (
                                                                (question.alternatives ?? []).map((alternative, aIndex) => (
                                                                    <ListItem key={aIndex}>
                                                                        <OutlinedInput
                                                                            label="Valor"
                                                                            value={alternative.name}
                                                                            onChange={e => handleAlternativeNameChange(e, alternative.id, question.id)}
                                                                            endAdornment={
                                                                                <InputAdornment position="end">
                                                                                    <IconButton
                                                                                        aria-label="deleta alternativa"
                                                                                        edge="end"
                                                                                        onClick={() => deleteAlternative(alternative.id, question.id)}
                                                                                    >
                                                                                        <DeleteIcon color="action" />
                                                                                    </IconButton>
                                                                                </InputAdornment>
                                                                            }
                                                                        />
                                                                    </ListItem>
                                                                )
                                                                )
                                                            )
                                                            }
                                                        </List>
                                                    </ListItem>
                                                    {question.type > QuestionTypeEnum.FREE_TEXT && (
                                                        <ListItem>
                                                            <Button
                                                                color="success"
                                                                startIcon={<AddIcon />}
                                                                sx={{ ml: 8 }}
                                                                onClick={() => {
                                                                    addAlternativeToQuestion(question.id)
                                                                }}
                                                            >
                                                                Adicionar alternativa
                                                            </Button>
                                                        </ListItem>
                                                    )}
                                                </List>
                                            </Collapse>
                                            <Divider />
                                        </div>
                                    ))
                            }
                            <ListItem>
                                <Button
                                    color="success"
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => addQuestion()}
                                >
                                    Adicionar Pergunta
                                </Button>
                            </ListItem>
                        </List>
                    </Box>
                </FormItem>
            </Form>
        </div>
    )
}

export const editSurveyRoute: RouteObject = {
    path: '/edit/:surveyId',
    element: <EditSurvey />
}