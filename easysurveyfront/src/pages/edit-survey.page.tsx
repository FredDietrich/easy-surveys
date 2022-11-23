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
import { OutlinedInput } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

interface IOpenItem {
    id: number,
    open: boolean
}

function EditSurvey() {

    const { surveyId } = useParams();
    const navigate = useNavigate();
    const [survey, setSurvey] = useState<Survey | undefined>();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [openItems, setOpenItems] = useState<IOpenItem[]>([]);

    useEffect(() => {
        if (!surveyId || Number.isNaN(+surveyId)) {
            navigate('/listing')
            return
        }
        setTimeout(() => setSurvey({ id: +surveyId, title: `Pesquisa ${surveyId}` }), 0)
        setTimeout(() => setQuestions([{ id: 1, title: 'Em poucas palavras, descreva como encontrou o app:', type: QuestionType.MULTIPLE_ANSWER }, { id: 2, title: 'Qual das opções melhor representa seu cargo atual?', type: QuestionType.MULTIPLE_ANSWER }]), 0)
    }, [])

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

    function handleQuestionTypeChange(e: SelectChangeEvent<QuestionType>, id: number) {
        e.preventDefault()
        const value = e.target.value as QuestionType
        setQuestions(questions => questions.map(question => {
            return question.id == id ? { ...question, type: value } : question
        }))
    }

    function getAlternatives(id: number): Alternative[] {
        return [
            {
                id: 1,
                title: 'Estudante',
                questionId: id
            }
        ]
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
                                questions.length < 1 ?
                                    "Pesquisa não possui perguntas, clique abaixo para adicionar uma agora mesmo!" :
                                    questions.map((question, index) => (
                                        <div key={index}>
                                            <ListItem>
                                                <ListItemButton onClick={() => toggleOpen(question.id)}>
                                                    <ListItemText
                                                        primary={<p style={{ color: 'white' }}>{question.title}</p>}
                                                    />
                                                    {isOpen(question.id) ? <ExpandLess /> : <ExpandMore />}
                                                </ListItemButton>
                                            </ListItem>
                                            <Collapse in={isOpen(question.id)} timeout="auto" unmountOnExit>
                                                <List component="div" disablePadding>
                                                    <ListItem sx={{ pl: 6 }}>
                                                        <Box sx={{ minWidth: 120 }}>
                                                            <FormControl fullWidth>
                                                                <InputLabel id="question-type-label">Tipo de questão</InputLabel>
                                                                <Select
                                                                    labelId="question-type-label"
                                                                    id="demo-simple-select"
                                                                    value={question.type}
                                                                    label="Tipo de questão"
                                                                    onChange={e => handleQuestionTypeChange(e, question.id)}
                                                                >
                                                                    <MenuItem value={QuestionType.MULTIPLE_ANSWER}>Múltipla escolha</MenuItem>
                                                                    <MenuItem value={QuestionType.TEXT}>Texto livre</MenuItem>
                                                                    <MenuItem value={QuestionType.MULTIPLE_ANSWER_OTHER}>Múltipla escolha + Outro</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                            <Button sx={{ position: 'absolute', right: '2%' }}>
                                                                <DeleteIcon color="action" />
                                                            </Button>
                                                        </Box>
                                                    </ListItem>
                                                    <ListItem sx={{ pl: 8 }}>
                                                        {question.type != QuestionType.TEXT && (
                                                            getAlternatives(question.id).map((alternative, aIndex) => (
                                                                <div key={aIndex}>
                                                                    <InputLabel htmlFor="deleta-senha">Valor</InputLabel>
                                                                    <OutlinedInput
                                                                        label="Valor"
                                                                        id="deleta-senha"
                                                                        endAdornment={
                                                                            <InputAdornment position="end">
                                                                                <IconButton
                                                                                    aria-label="deleta alternativa"
                                                                                    edge="end"
                                                                                >
                                                                                    <DeleteIcon color="action" />
                                                                                </IconButton>
                                                                            </InputAdornment>
                                                                        }
                                                                    />
                                                                </div>
                                                            )
                                                            )
                                                        )
                                                        }
                                                    </ListItem>
                                                    { question.type != QuestionType.TEXT && (
                                                        <ListItem>
                                                            <Button color="success" startIcon={<AddIcon />} sx={{ ml: 8 }}>
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