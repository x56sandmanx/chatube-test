import { useState } from 'react'
import '../css/Login.css'
import '../css/Login-Mobile.css'
import { LoginCreds } from '../utilities/loginCreds'
import { useNavigate } from 'react-router-dom'
import { Characters } from '../utilities/Characters'
import { BaseURL } from '../utilities/BaseURL'
import { SetLoginCreds } from '../utilities/Extensions'

function Login() {
  const navigate = useNavigate()
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const checkLogin = () => {
    if(emailOrUsername !== '' && password !== '') {
      fetch(`${BaseURL}/login?emailOrUserName=${emailOrUsername}&password=${password}`)
      .then((res) => res.json())
      .then((data) => {
        if(data.response.error)
          setError(data.response.error)
        else
          setLoginCreds(data.response.account)
      })
    } else {
      setError('Missing Fields')
    }
  }

  const setLoginCreds = (account) => {
    SetLoginCreds(account)
    localStorage.setItem('devToken', LoginCreds.devToken)

    fetch(`${BaseURL}/getCustomizedCharacters?devToken=${LoginCreds.devToken}`)
    .then((res) => res.json())
    .then((data) => {
      Characters.customizedCharacters = data.response.customizedCharacters
      fetch(`${BaseURL}/getUserLikes?devToken=${LoginCreds.devToken}`)
      .then((res) => res.json())
      .then((data) => {
        LoginCreds.userLikes = data.response.userLikes
        navigate('/')
      })
    })
  }

  return(
    <div className='loginPage'>
      <div className='loginContainer'>
        <div className='loginHeader'>
          <h1>chatube.ai</h1>
          <p>Login</p>
        </div>
          <div className='loginFields'>
            <div className='inputField'>
              <p>Email Or Username:</p>
              <input
                type='text'
                value={emailOrUsername}
                id='emailOrUsernameInput'
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder='Email Or Username'
              />
            </div>
            <div className='inputField'>
              <p>Password:</p>
              <input
                type='password'
                value={password}
                id='passwordInput'
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
              />
            </div>
            <button onClick={(e) => checkLogin()}>Login</button>
            {error !== '' &&
              <p className='error'>{error}</p>
            }
          </div>
      </div>
    </div>
  )
}

export default Login