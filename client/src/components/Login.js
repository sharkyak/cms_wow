import React, { useState } from 'react'
import axios from 'axios'
import {
    Container,
    Typography,
    Grid,
    TextField,
    Button
} from '@material-ui/core'

const Login = ({ updatePage }) => {
    const [uuid, setUuid] = useState('')

    const onClick = async () => {
        if (uuid) {
            try {
                const res = await axios.post('/api/v1/', { uuid })

                if (res.data.success) {
                    if (res.data.data.user.admin)
                        updatePage(res.data.data, 'admin')
                    else updatePage(res.data.data, 'user')
                }
            } catch (err) {
                console.log(err)
            }
        }
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
