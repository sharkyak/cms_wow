import React, { useState } from 'react'
import './App.css'
import axios from 'axios'
import Login from './components/Login'
import User from './components/User'
import Admin from './components/Admin'
import Alert from '@material-ui/lab/Alert'

const App = () => {
    const [page, setPage] = useState('login')
    const [userData, setUserData] = useState({})
    const [alert, setAlert] = useState({})

    const updatePage = topage => setPage(topage)

    const updateUserData = async () => {
        try {
            const res = await axios.post(
                '/api/v1/',
                {},
                { headers: { 'x-auth-token': localStorage.getItem('token') } }
            )

            if (res.data.success) setUserData(res.data.data)
        } catch (err) {
            console.log(err)
        }
    }

    const goToLogin = () => setPage('login')

    const showAlert = (show, type, text) => setAlert({ show, type, text })

    return (
        <>
            {alert.show && <Alert severity={alert.type}>{alert.text}</Alert>}
            {page === 'login' && (
                <Login
                    updatePage={updatePage}
                    showAlert={showAlert}
                    updateUserData={updateUserData}
                />
            )}
            {page === 'user' && (
                <User
                    userData={userData}
                    updateUserData={updateUserData}
                    goToLogin={goToLogin}
                    showAlert={showAlert}
                />
            )}
            {page === 'admin' && (
                <Admin
                    userData={userData}
                    updateUserData={updateUserData}
                    goToLogin={goToLogin}
                    showAlert={showAlert}
                />
            )}
        </>
    )
}

export default App
