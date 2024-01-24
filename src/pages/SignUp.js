import { useState } from "react"
import { LoginCreds } from "../utilities/loginCreds"
import { useNavigate } from 'react-router-dom'
import '../css/Login.css'
import '../css/Login-Mobile.css'
import { BaseURL } from "../utilities/BaseURL"
import { SetLoginCreds, isValidEmail, isValidUserName } from "../utilities/Extensions"

function SignUp() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [userName, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [userProfileImage, setUserProfileImage] = useState(null)
  const [userProfileImagePreview, setUserProfileImagePreview] = useState()
  const [error, setError] = useState('')

  const handleImageChange = (e) => {
    setUserProfileImage(e.target.files[0])
    setUserProfileImagePreview(URL.createObjectURL(e.target.files[0]))
  }

  const checkSignUp = () => {
    if(email !== '' && userName !== '' && password !== '' && userProfileImage !== null) {
      if(!isValidEmail(email)) {
        setError('Invalid Email')
        setTimeout(() => {
          setError('')
        }, 2000)
      } else if(!isValidUserName(userName)) {
        setError('Invalid UserName')
        setTimeout(() => {
          setError('')
        }, 2000)
      } else {
        setError('Creating Account...')
        const accountInfo = {
          userName: userName,
          email: email,
          password: password
        }
        const formData = new FormData()
        formData.append('accountInfo', JSON.stringify(accountInfo))
        formData.append('userProfileImage', userProfileImage)

        fetch(`${BaseURL}/createAccount`, {
          method: 'POST',
          body: formData
        })
        .then((res) => res.json())
        .then((data) => {
          if(data.response.error) {
            setError(data.response.error)
            setTimeout(() => {
              setError('')
            }, 2000)
          } else
            setLoginCreds(data.response.account)
        })
      }
    } else {
      setError('Missing Fields')
      setTimeout(() => {
        setError('')
      }, 2000)
    }
  }

  const setLoginCreds = (account) => {
    SetLoginCreds(account)
    localStorage.setItem('devToken', LoginCreds.devToken)
    navigate('/')
  }

  return(
    <div className='loginPage'>
      <div className='signUpContainer'>
        <div className='loginHeader'>
          <h1>chatube.ai</h1>
          <p>Sign Up</p>
        </div>
          <div className='loginFields'>
            <div className='inputField'>
              <p>Email:</p>
              <input
                type='text'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Email'
              />
            </div>
            <div className='inputField'>
              <p>Username:</p>
              <input
                type='text'
                value={userName}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Username'
              />
            </div>
            <div className='inputField'>
              <p>Password:</p>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
              />
            </div>
            <div className='profileImage'>
              <p>Profile Image:</p>
              <input
                type='file'
                accept='image/png, image/jpeg'
                id='characterImage'
                onChange={(e) => handleImageChange(e)}
              />
              {userProfileImagePreview && (
                <img src={userProfileImagePreview} alt='userProfileImagePreview'/>
              )}
            </div>
            <button onClick={() => checkSignUp()}>Sign Up</button>
            {error !== '' &&
              <p className='error'>{error}</p>
            }
          </div>
      </div>
    </div>
  )
}

export default SignUp