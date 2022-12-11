import { Link, RouteObject, useNavigate } from "react-router-dom"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import Header from "../components/header.component"
import Form from "../components/form.component"
import FormItem from "../components/form-item.component"
import AddIcon from '@mui/icons-material/Add';
import ListItem from "@mui/material/ListItem"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import Avatar from "@mui/material/Avatar"
import ListItemText from "@mui/material/ListItemText"
import List from "@mui/material/List"
import PollIcon from '@mui/icons-material/Poll';
import EditIcon from '@mui/icons-material/Edit';
import { Divider, ListItemButton, Skeleton } from "@mui/material"
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useEffect, useState } from "react"
import Survey from "../model/survey.model"
import * as api from '../api/api';
import { useAuth } from "../contexts/auth.context"

function SurveyListing() {

    const [surveys, setSurveys] = useState<Survey[]>([]);
    const { user, signed } = useAuth()
    const navigate = useNavigate()

    function notSigned() {
        navigate("/login")
        return <div>Não autenticado</div>
    }

    async function createSurvey() {
        const createdSurvey = await api.post('survey', {name: 'Edite-me clicando no lápis'})
        await api.put('user/' + user?.id + '/survey', {id: createdSurvey.data.id})
        return navigate('/edit/' + createdSurvey.data.id)
    }

    useEffect(() => {
        async function fetchSurveys() {
            if (!signed) {
                return notSigned()
            }
            try {
                const foundSurveys = await api.get("user/" + (user ?? {id: null}).id + "/survey")
                setSurveys(foundSurveys.data)
            } catch {
                setSurveys([])
            }
        }
        fetchSurveys()
    }, [])


    return (
        <div className="SurveyListing">
            <Header />
            <Grid container columns={4} sx={{ textAlign: 'center' }}>
                <Grid item xs={4} sm={4} md={2} lg={2} xl={2} sx={{
                    textAlign: 'center',
                    marginTop: '5rem',
                }}>
                    <Button
                        variant="contained"
                        sx={{
                            fontSize: '1.5rem',
                            width: '16rem',
                            height: '4rem'
                        }}
                        startIcon={<AddIcon />}
                        onClick={createSurvey}
                    >
                        Nova Pesquisa
                    </Button>
                </Grid>
                <Grid item xs={4} sm={4} md={2} lg={2} xl={2} sx={{ textAlign: 'left', marginTop: '1.3rem' }}>
                    <Typography
                        variant="h4"
                        component="div"
                        sx={{
                            fontSize: '400%',
                            color: 'white',
                            paddingTop: '5%',
                            paddingLeft: '5%',
                            paddingRight: '5%'
                        }}
                    >
                        Pesquisas criadas
                    </Typography>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                    <Form marginLg="25">
                        <FormItem>
                            <Box sx={{ height: 400, width: '100%', borderRadius: '1rem' }} bgcolor='#434b65'>
                                <List dense>
                                    {
                                        surveys.length < 1 ?
                                            "Você não possui pesquisas" :
                                            surveys.map((survey, index) => (
                                                <div key={index}>
                                                    <ListItem
                                                        secondaryAction={
                                                            <>
                                                                <Link to={'/edit/' + survey.id}>
                                                                    <Button
                                                                        startIcon={<EditIcon />}
                                                                        variant="contained"
                                                                        sx={{
                                                                            marginRight: '1rem'
                                                                        }}
                                                                    >
                                                                        Editar
                                                                    </Button>
                                                                </Link>
                                                                <Link to={'/view/' + survey.id}>
                                                                    <Button
                                                                        startIcon={<VisibilityIcon />}
                                                                        variant="contained"
                                                                    >
                                                                        Visualizar
                                                                    </Button>
                                                                </Link>
                                                            </>
                                                        }
                                                    >
                                                        <Link to={'/view/' + survey.id}>
                                                            <ListItemButton>
                                                                <ListItemAvatar>
                                                                    <Avatar>
                                                                        <PollIcon />
                                                                    </Avatar>
                                                                </ListItemAvatar>
                                                                <ListItemText
                                                                    primary={<p style={{ color: 'white' }}>{survey.name}</p>}
                                                                />
                                                            </ListItemButton>
                                                        </Link>
                                                    </ListItem>
                                                    <Divider />
                                                </div>
                                            ))
                                    }

                                </List>
                            </Box>
                        </FormItem>
                    </Form>
                </Grid>
            </Grid>
        </div>
    )
}

export const surveyListingRoute: RouteObject = {
    path: '/listing',
    element: <SurveyListing />
}