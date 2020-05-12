import React, { useState, useEffect } from 'react'
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
    TableCell,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@material-ui/core'

const Admin = ({ userData, updateUserData, goToLogin, showAlert }) => {
    const [summ, setSumm] = useState('')
    const [descr, setDescr] = useState('')

    const [summB, setSummB] = useState('')
    const [priceB, setPriceB] = useState('')
    const [descrB, setDescrB] = useState('')

    const [summP, setSummP] = useState('')
    const [descrP, setDescrP] = useState('')
    const [userP, setUserP] = useState('')

    const [users, setUsers] = useState([])
    const [balance, setBalance] = useState()
    const [allGold, setAllGold] = useState([])
    const [payouts, setPayouts] = useState([])

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/v1')
            if (res.data.success) setUsers(res.data.data)
        } catch (err) {
            console.log(err)
        }
    }

    const fetchPayouts = async () => {
        try {
            const res = await axios.post('/api/v1/payouts')
            if (res.data.success) setPayouts(res.data.data.tx)
        } catch (err) {
            console.log(err)
        }
    }

    const fetchAllGold = async () => {
        try {
            const res = await axios.post('/api/v1/allgold')
            if (res.data.success) {
                setAllGold(res.data.data.tx)
                setBalance(res.data.data.balance)
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchUsers()
        fetchPayouts()
        fetchAllGold()
    }, [])

    const onClick = async () => {
        const summInt = parseInt(summ)
        if (summInt > 0 && descr) {
            try {
                showAlert(true, 'warning', 'сохранение... ждите...')

                const res = await axios.post('/api/v1/addgold', {
                    summ: summInt,
                    user: userData.user._id,
                    descr: descr,
                    correction: false,
                    sellprice: 0
                })

                setSumm('')
                setDescr('')
                showAlert(false)

                if (res.data.success) {
                    updateUserData()
                    fetchAllGold()
                }
            } catch (err) {
                console.log(err)
            }
        }
    }

    const onClickB = async () => {
        const summInt = -parseInt(summB)
        const priceFloat = parseFloat(priceB.replace(',', '.'))
        if (summInt < 0 && descrB && priceFloat > 0) {
            try {
                showAlert(true, 'warning', 'сохранение... ждите...')

                const res = await axios.post('/api/v1/addgold', {
                    summ: summInt,
                    user: userData.user._id,
                    descr: descrB,
                    correction: false,
                    sellprice: priceFloat
                })

                setSummB('')
                setPriceB('')
                setDescrB('')
                showAlert(false)

                if (res.data.success) {
                    updateUserData()
                    fetchAllGold()
                    fetchUsers()
                }
            } catch (err) {
                console.log(err)
            }
        }
    }

    const onClickP = async () => {
        const summInt = parseInt(summP)
        if (summInt > 0 && descrP && userP) {
            try {
                showAlert(true, 'warning', 'сохранение... ждите...')

                const res = await axios.post('/api/v1/pay', {
                    summ: summInt,
                    user: userP,
                    descr: descrP
                })

                setSummP('')
                setDescrP('')
                setUserP('')
                showAlert(false)

                if (res.data.success) {
                    updateUserData()
                    fetchUsers()
                    fetchPayouts()
                }
            } catch (err) {
                console.log(err)
            }
        }
    }

    const findName = id => {
        const user = users.find(el => el._id === id)
        if (user) return user.name
        else return ''
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
                            <Typography>Продажа на бирже</Typography>
                            <TextField
                                label='Количество'
                                variant='outlined'
                                value={summB}
                                onChange={e => setSummB(e.target.value)}
                            />
                            <br />
                            <TextField
                                label='Цена'
                                variant='outlined'
                                value={priceB}
                                onChange={e => setPriceB(e.target.value)}
                            />
                            <br />
                            <TextField
                                label='Комментарий'
                                variant='outlined'
                                value={descrB}
                                onChange={e => setDescrB(e.target.value)}
                            />
                            <br />
                            <Button
                                variant='outlined'
                                color='primary'
                                onClick={onClickB}
                            >
                                Внести
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs>
                        <Paper elevation={3}>
                            <Typography>Выплата игроку</Typography>
                            <FormControl style={{ minWidth: 210 }}>
                                <InputLabel>Имя игрока</InputLabel>
                                <Select
                                    value={userP}
                                    onChange={e => setUserP(e.target.value)}
                                >
                                    {users.map(user => (
                                        <MenuItem
                                            key={user._id}
                                            value={user._id}
                                        >
                                            {user.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <br />
                            <TextField
                                label='Сумма'
                                variant='outlined'
                                value={summP}
                                onChange={e => setSummP(e.target.value)}
                            />
                            <br />
                            <TextField
                                label='Комментарий'
                                variant='outlined'
                                value={descrP}
                                onChange={e => setDescrP(e.target.value)}
                            />
                            <br />
                            <Button
                                variant='outlined'
                                color='primary'
                                onClick={onClickP}
                            >
                                Внести
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs>
                        <Paper elevation={3}>
                            <Typography variant='h5'>
                                Балансы игроков
                            </Typography>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Имя</TableCell>
                                        <TableCell align='right'>
                                            Сумма
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map(row => (
                                        <TableRow key={row._id}>
                                            <TableCell
                                                component='th'
                                                scope='row'
                                            >
                                                {row.name}
                                            </TableCell>
                                            <TableCell align='right'>
                                                {row.topay}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                    <Grid item xs>
                        <Paper elevation={3}>
                            <Typography variant='h5'>
                                История операций с банком (последние 20)
                                <br />
                                Текущий баланс: {balance}
                            </Typography>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Дата</TableCell>
                                        <TableCell>Сумма</TableCell>
                                        <TableCell align='right'>
                                            Комментарий
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {allGold.map(row => (
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
                    <Grid item xs>
                        <Paper elevation={3}>
                            <Typography variant='h5'>
                                История выплат (последние 10)
                            </Typography>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Дата</TableCell>
                                        <TableCell>Игрок</TableCell>
                                        <TableCell>Сумма</TableCell>
                                        <TableCell align='right'>
                                            Комментарий
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {payouts.map(row => (
                                        <TableRow key={row._id}>
                                            <TableCell
                                                component='th'
                                                scope='row'
                                            >
                                                {moment(row.date).format('lll')}
                                            </TableCell>
                                            <TableCell>
                                                {findName(row.user)}
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

export default Admin
