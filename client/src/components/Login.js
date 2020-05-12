import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
    Container,
    Typography,
    Grid,
    TextField,
    Button
} from '@material-ui/core'

const Login = ({ updatePage, showAlert }) => {
    const [uuid, setUuid] = useState('')

    useEffect(() => {
        const localUuid = localStorage.getItem('uuid')
        if (localUuid) fetchUserData(localUuid)
        // eslint-disable-next-line
    }, [])

    const fetchUserData = async id => {
        try {
            const res = await axios.post('/api/v1/', { uuid: id })

            if (res.data.success) {
                localStorage.setItem('uuid', id)
                if (res.data.data.user.admin) updatePage(res.data.data, 'admin')
                else updatePage(res.data.data, 'user')
            }
        } catch (err) {
            console.log(err)
            showAlert(true, 'error', 'Пользователь не найден')
            setTimeout(() => showAlert(false), 5000)
        }
    }

    const onClick = async () => {
        if (uuid) fetchUserData(uuid)
    }

    return (
        <>
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
        </>
    )
}

export default Login
