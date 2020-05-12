import React, { useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/ru'
import {
    Container,
    Grid,
    Typography,
    Paper,
    TextField,
    Button,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from '@material-ui/core'

const User = ({ userData, updateUserData, goToLogin }) => {
    const [summ, setSumm] = useState('')
    const [descr, setDescr] = useState('')

    const onClick = async () => {
        const summInt = parseInt(summ)
        if (summInt > 0 && descr) {
            try {
                const res = await axios.post('/api/v1/addgold', {
                    summ: summInt,
                    user: userData.user._id,
                    descr: descr,
                    correction: false,
                    sellprice: 0
                })

                setSumm('')
                setDescr('')

                if (res.data.success) updateUserData()
            } catch (err) {
                console.log(err)
            }
        }
    }

    const onExit = () => {
        localStorage.clear()
        goToLogin()
    }

    return (
        <>
            <Container>
                <Grid
                    spacing={4}
                    container
                    direction='column'
                    justify='center'
                    alignItems='center'
                >
                    <Grid item xs>
                        <Typography variant='h5'>
                            {userData.user.name}
                        </Typography>
                        <Button
                            variant='outlined'
                            color='secondary'
                            size='small'
                            onClick={onExit}
                        >
                            Выход
                        </Button>
                    </Grid>
                    <Grid item xs>
                        <Paper elevation={3}>
                            <Typography>
                                Занес:
                                <br />
                                {userData.user.gold} голды
                            </Typography>
                            <Typography>
                                Получил:
                                <br />
                                {userData.user.payed} руб
                            </Typography>
                            <Typography>
                                Баланс:
                                <br />
                                {userData.user.topay} руб
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs>
                        <Paper elevation={3}>
                            <Typography>Депозит в банк</Typography>
                            <TextField
                                label='Gold'
                                variant='outlined'
                                value={summ}
                                onChange={e => setSumm(e.target.value)}
                            />
                            <br />
                            <TextField
                                label='Персонаж'
                                variant='outlined'
                                value={descr}
                                onChange={e => setDescr(e.target.value)}
                            />
                            <br />
                            <Button
                                variant='outlined'
                                color='primary'
                                onClick={onClick}
                            >
                                Внести
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs>
                        <Paper elevation={3}>
                            <Typography variant='h5'>
                                История операций с банком (последние 10)
                            </Typography>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Дата</TableCell>
                                        <TableCell>Сумма</TableCell>
                                        <TableCell align='right'>
                                            Персонаж
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {userData.tx.map(row => (
                                        <TableRow key={row._id}>
                                            <TableCell
                                                component='th'
                                                scope='row'
                                            >
                                                {moment(row.date).format('lll')}
                                            </TableCell>
                                            <TableCell>{row.summ}</TableCell>
                                            <TableCell align='right'>
                                                {row.descr}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}

export default User
