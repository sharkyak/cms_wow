import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import WebFont from 'webfontloader'
WebFont.load({ google: { families: ['Roboto:300,400,500'] } })

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
)
