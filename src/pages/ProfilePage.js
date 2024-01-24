import { useEffect, useState } from 'react'
import '../css/ProfilePage.css'
import '../css/ProfilePage-Mobile.css'
import { LoginCreds } from '../utilities/loginCreds'
import { BaseURL } from '../utilities/BaseURL'
import { useNavigate } from 'react-router-dom'

import blankProfileImage from '../assets/icons/BlankProfilePicture.png'
import { Characters } from '../utilities/Characters'
import { ResetLoginCreds, SetLoginCreds, convertToPercentage, isValidEmail, isValidUserName } from '../utilities/Extensions'

import arrowIcon from '../assets/icons/arrow.png'
import { MyCharacter, MyUserPersona } from '../utilities/CharacterTiles'


function ProfilePage() {
  const navigate = useNavigate()
  const [userName, setUserName] = useState(LoginCreds.userName)
  const [email, setEmail] = useState(LoginCreds.email)
  const [password, setPassword] = useState(LoginCreds.password)
  const [profileImage, setProfileImage] = useState(LoginCreds.profileImage)
  const [profileImagePreview, setProfileImagePreview] = useState(LoginCreds.profileImage)

  const [userPersona, setUserPersona] = useState(null)
  const [customizedCharacters, setCustomizedCharacters] = useState([])

  const [error, setError] = useState('')
  const [selectedSettingsSectionButton, setSelectedSettingsSectionButton] = useState('User Profile')

  useEffect(() => {
    setCustomizedCharacters(Characters.customizedCharacters)
    if(LoginCreds.userPersonaId !== null) {
      fetch(`${BaseURL}/getUserPersona?devToken=${LoginCreds.devToken}&userPersonaId=${LoginCreds.userPersonaId}`)
      .then((res) => res.json())
      .then((data) => {
        if(data.response.error)
          setError(data.response.error)
        else
          setUserPersona(data.response.userPersona)
      })
    }
  }, [])

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0])
    setProfileImagePreview(URL.createObjectURL(e.target.files[0]))
  }

  const handleLogOut = () => {
    localStorage.removeItem('devToken')
    ResetLoginCreds()
    navigate('/')
  }

  const handleUpdateAccount = () => {
    if(userName !== '' && email !== '' && password !== '' && profileImage !== null) {
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
        setError('Updating Account...')
        const accountInfo = {
          devToken: LoginCreds.devToken,
          userName: userName,
          email: email,
          password: password,
          profileImage: LoginCreds.profileImage
        }

        const formData = new FormData()
        formData.append('accountInfo', JSON.stringify(accountInfo))
        formData.append('userProfileImage', profileImage)

        fetch(`${BaseURL}/updateAccount`, {
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
            setLoginCreds(data.response.updatedAccount)
        })
      }
    } else {
      setError('Missing Fields')
      setTimeout(() => {
        setError('')
      }, 2000)
    }
  }

  const setLoginCreds = (accountInfo) => {
    SetLoginCreds(accountInfo)

    setError('Account Updated!')
    setTimeout(() => {
      setError('')
    }, 2000)
  }

  function SettingsSectionButton({ title, id }) {
    return (
      <button
        key={id}
        onClick={() => setSelectedSettingsSectionButton(id)}
        className={selectedSettingsSectionButton === id ? 'profileSelectedSettingsSectionButton' : 'profileSettingsSectionButton'}>{title}</button>
    )
  }

  function UserProfile() {
    return (
      <div>
        <div className='profileSettingsSectionHeader'>User Profile</div>
        <div className='profileUserInformationContainer'>
          <div className='profilePageImage'>
            {profileImagePreview !== '' ? (
              <img src={profileImagePreview} alt='profileImagePreview' />
            ) : (
              <img src={blankProfileImage} alt='blankProfileImage' />
            )}
            <input className='uploadProfileImageButton'
              type='file'
              accept='image/png, image/jpeg'
              id='characterImage'
              onChange={(e) => handleImageChange(e)}
            />
          </div>
          <div className='profilePageTextBox'>
            <p className='settingsLabel'>USERNAME</p>
            <input
              type='text'
              id='userName'
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder='UserName'
            />
          </div>
          <div className='profilePageTextBox'>
            <p className='settingsLabel'>EMAIL</p>
            <input
              type='text'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Email'
            />
          </div>
          <div className='profilePageTextBox'>
            <p className='settingsLabel'>PASSWORD</p>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
            />
          </div>
          <div className='profilePageTextBox'>
            <p className='settingsLabel'>USER INTERACTIONS</p>
            <p>{200-LoginCreds.userInteractions} interactions remaining</p>
            <div className='userInteractionSlider'>
              <progress
                value={convertToPercentage(LoginCreds.userInteractions, 200)}
                max={200}
              />
              <p>{convertToPercentage(LoginCreds.userInteractions, 200)}% ({LoginCreds.userInteractions}/200)</p>
            </div>
          </div>
          <button onClick={() => handleUpdateAccount()}>Update Account</button>
          <button onClick={() => handleLogOut()}>Log Out</button>
          {error !== '' && (
            <p>{error}</p>
          )}
        </div>
      </div>
    )
  }

  function UserPersona() {
    return (
      <div>
        <div className='profileSettingsSectionHeader'>My Persona</div>
        <div className='profileUserInformationContainer'>
          {userPersona !== null ? (
            <MyUserPersona 
              userPersona={userPersona}
              setUserPersona={setUserPersona}
            />
          ) : (
            <div>
              <h2>No User Persona</h2>
              <button onClick={() => navigate('/CreatePersona')}>Create Persona</button>
            </div>
          )}
        </div>
      </div>
    )
  }

  function MyCharacters() {
    const [charactersPerPage, setCharactersPerPage] = useState(18)
    const [currentPage, setCurrentPage] = useState(1)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth)
    };

    useEffect(() => {
      window.addEventListener('resize', updateWindowWidth)

      return () => {
        window.removeEventListener('resize', updateWindowWidth)
      }
    }, [])

    useEffect(() => {
      const charactersPerRow = Math.floor(windowWidth / 500)
      var charactersPerPageCalculated = charactersPerRow * 2
      if (charactersPerPageCalculated < 4)
        charactersPerPageCalculated = 4
      setCharactersPerPage(charactersPerPageCalculated)
    }, [windowWidth])

    const indexOfLastCharacter = currentPage * charactersPerPage
    const indexOfFirstCharacters = indexOfLastCharacter - charactersPerPage
    const currentCharacters = customizedCharacters.slice(indexOfFirstCharacters, indexOfLastCharacter)
    const totalPages = Math.ceil(customizedCharacters.length / charactersPerPage)

    return (
      <div>
        <div className='profileSettingsSectionHeader'>My Characters</div>
        <div className='profileUserInformationCharactersContainer'>
        <div className='profileCharacters'>
        {customizedCharacters.length === 0 ? (
          <p>No Customized Characters</p>
        ) : (
          <div>
            <div className='all-character-profile-grid'>
              {currentCharacters.map((characterObj) => (
                <MyCharacter
                  character={characterObj}
                />
              ))}
            </div>
            <div className='pagination'>
              <img className={`leftArrow ${currentPage === 1 ? 'disabled-arrow' : ''}`} onClick={() => setCurrentPage((prevPage) => Math.max(prevPage-1, 1))} src={arrowIcon} alt='arrowIcon'/>
              <span>{`Page ${currentPage} of ${totalPages}`}</span>
              <img className={`rightArrow ${currentPage === totalPages ? 'disabled-arrow' : ''}`} onClick={() => setCurrentPage((prevPage) => Math.min(prevPage+1, totalPages))} src={arrowIcon} alt='arrowIcon'/>
            </div>
          </div>
        )}
      </div>
        </div>
      </div>
    )
  }

  return(
    <div className="profileContainer">
      <div className="profileSettingsSectionsListContainer">
        <div className="profileSettingsSectionsList">
          <p className="profileSettingsSectionsListHeader">USER SETTINGS</p>
          <SettingsSectionButton
            title={"User Profile"}
            id={'User Profile'}
          />
          <SettingsSectionButton
            title={"My Persona"}
            id={'My Persona'}
          />
          <SettingsSectionButton
            title={"My Characters"}
            id={"My Characters"}
          />
        </div>
      </div>
      <div className="profileSettingsSectionContainer">
      {selectedSettingsSectionButton === 'User Profile' ? (
        <UserProfile />
      ) : selectedSettingsSectionButton === 'My Persona' ? (
        <UserPersona />
      ) : (
        <MyCharacters />
      )}
      </div>
    </div>
  )
}

export default ProfilePage
