import React, { useState } from 'react'
import './App.css'
import axios from 'axios'
import Login from './components/Login'
import User from './components/User'
import Admin from './components/Admin'

const App = () => {
    const [page, setPage] = useState('login')
    const [userData, setUserData] = useState({})

    const updatePage = (userData, topage) => {
        setUserData(userData)
        setPage(topage)
    }

    const updateUserData = async () => {
        try {
            const uuid = userData.user.uuid
            const res = await axios.post('/api/v1/', { uuid })

            if (res.data.success) {
                setUserData(res.data.data)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const goToLogin = () => setPage('login')

    return (
        <>
            {page === 'login' && <Login updatePage={updatePage} />}
            {page === 'user' && (
                <User
                    userData={userData}
                    updateUserData={updateUserData}
                    goToLogin={goToLogin}
                />
            )}
            {page === 'admin' && (
                <Admin
                    userData={userData}
                    updateUserData={updateUserData}
                    goToLogin={goToLogin}
                />
            )}
        </>
    )
}

export default App
