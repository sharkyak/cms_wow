import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
    Container,
    Typography,
    Grid,
    TextField,
    Button
} from '@material-ui/core'

const Login = ({ updatePage, showAlert, updateUserData }) => {
    const [uuid, setUuid] = useState('')
    const [showForm, setShowForm] = useState(false)

    const checkToken = async token => {
        try {
            const res = await axios.post(
                '/api/v1/',
                {},
                { headers: { 'x-auth-token': token } }
            )

            if (res.data.success) fetchToken(res.data.data.user.uuid)
        } catch (err) {
            console.log(err)
            setShowForm(true)
        }
    }

    useEffect(() => {
        const localToken = localStorage.getItem('token')
        if (localToken) checkToken(localToken)
        else setShowForm(true)
        // eslint-disable-next-line
    }, [])

    const fetchToken = async id => {
        try {
            const res = await axios.post('/api/v1/auth', { uuid: id })

            if (res.data.success) {
                localStorage.setItem('token', res.data.data.token)
                await updateUserData()
                if (res.data.data.user.admin) updatePage('admin')
                else updatePage('user')
            }
        } catch (err) {
            console.log(err)
            showAlert(true, 'error', 'Пользователь не найден')
            setTimeout(() => showAlert(false), 5000)
        }
    }

    const onClick = async () => {
        if (uuid) fetchToken(uuid)
    }

    return (
        <>
            {showForm && (
                <Container>
                    <Grid
                        spacing={3}
                        container
                        direction='column'
                        justify='center'
                        alignItems='center'
                    >
                        <Grid item xs>
                            <Typography variant='h5'>Введите пароль</Typography>
                            <TextField
                                id='uuid'
                                defaultValue={uuid}
                                variant='outlined'
                                fullWidth
                                onChange={e => setUuid(e.target.value)}
                            />
                            <Button
                                variant='outlined'
                                color='primary'
                                onClick={onClick}
                            >
                                Войти
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            )}
        </>
    )
}

export default Login
