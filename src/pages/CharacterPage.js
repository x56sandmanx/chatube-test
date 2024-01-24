import { useLocation, useNavigate } from "react-router-dom"
import { useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from "react"
import { exportBuffer } from "../utilities/audio"
import { BaseURL } from "../utilities/BaseURL"
import { LoginCreds } from "../utilities/loginCreds"
import { mapEmotionToEmoji } from "../utilities/CharacterTraits"
import { CharacterEmotions } from "../utilities/CharacterTraits"
import { Characters } from "../utilities/Characters"
import { SetLoginCreds, formatNumber } from "../utilities/Extensions.js"
import { NoMoreInteractions, RegisterForAnAccount, SignInToLike } from "../utilities/PopUpWindows.js"
import CharacterModal from "./CharacterModal.js"
import Recorder from 'recorder-js'

import '../css/CharacterPage.css'
import '../css/CharacterPage-Mobile.css'

import likedIcon from '../assets/icons/likedIcon.png'
import notLikedIcon from '../assets/icons/notLikedIcon.png'
import userPfp from '../assets/icons/BlankProfilePicture.png'
import backButton from '../assets/icons/backButton.png'

function CharacterPage() {
  const { characterId } = useParams()

  const navigate = useNavigate()
  const location = useLocation()

  const [currentCharacter, setCurrentCharacter] = useState(location.state ? location.state.character : null)
  const [currentCharacterLikeCount, setCurrentCharacterLikeCount] = useState(location.state ? (location.state.character.characterLikeCount ? location.state.character.characterLikeCount : location.state.character.userPersonaLikeCount) : 0)
  if(currentCharacterLikeCount === undefined)
    setCurrentCharacterLikeCount(0)
  const characterVariant = (location.state ? location.state.characterVariant : null)

  const [loadingCharacter, setLoadingCharacter] = useState(true)
  const [sessionToken, setSessionToken] = useState('')

  const [userMessage, setUserMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [emotion, setCharacterEmotion] = useState('')
  const [emotionCode, setEmotionCode] = useState('')

  const [loading, setLoading] = useState('')
  const [error, setError] = useState('')
  const [isRecording, setRecording] = useState(false)

  const [microphoneStream, setMicrophoneStream] = useState(null)
  const [recorder, setRecorder] = useState(null)

  const audioRef = useRef(null)

  const [userSentAMessage, setUserSentAMessage] = useState(false)
  const timerRef = useRef(null)

  const [characterModalIsOpen, setCharacterModalIsOpen] = useState(false)

  const storedInteractions = localStorage.getItem('freeInteractions')
  const initialInteractions = storedInteractions !== null ? parseInt(storedInteractions) : 0
  const [interactions, setInteractions] = useState(initialInteractions)

  const [noMoreInteractions, setNoMoreInteractions] = useState(false)
  const [registerForAnAccount, setRegisterForAnAccount] = useState(false)
  const [signInToLike, setSignInToLike] = useState(false)

  useEffect(() => {
    if(userSentAMessage === true)
      clearTimeout(timerRef.current)
  }, [userSentAMessage])

  window.addEventListener('beforeunload', () => {
    if(timerRef)
      clearTimeout(timerRef.current)
  })

  useEffect(() => {
    if(LoginCreds.userInteractions >= 20)
      setNoMoreInteractions(true)
  }, [LoginCreds.userInteractions])

  useEffect(() => {
    if(interactions >= 25) {
      localStorage.setItem('freeInteractions', interactions)
      setRegisterForAnAccount(true)
    }
  }, [interactions])

  useEffect(() => {
    if(Characters.categories.length === 0) {
      fetch(`${BaseURL}/getAllCategories`)
      .then((res) => res.json())
      .then((data) => {
        Characters.categories = data.response.categories
        fetch(`${BaseURL}/getAllTags`)
        .then((res) => res.json())
        .then((data) => Characters.tags = data.response.tags)
      })
    }
    var initSessionToken
    timerRef.current = setTimeout(() => {
      fetch(`${BaseURL}/sendTrigger?token=${initSessionToken}&triggerName=userIdle`)
        .then((res) => res.json())
        .then((data) => {
          if(data.response.error) {
            window.alert(data.response.error)
            setError(data.response.error)
          }
          else {
            if(data.response.emotion) {
              setEmotionCode(data.response.emotion.code)
              setCharacterEmotion(mapEmotionToEmoji(data.response.emotion))
            }
            else {
              setEmotionCode('')
              setCharacterEmotion('')
            }

            if(LoginCreds.devToken !== '')
              LoginCreds.userInteractions += data.response.messages.length
            else
              setInteractions(interactions+data.response.messages.length)

            handleAddMessage(data.response.messages, 0)
          }
        })
    }, 30000)
    const fetchData = async () => {
      try {
        let character
        setLoadingCharacter(true)

        const devToken = localStorage.getItem('devToken')

        if(devToken !== null) {
          const loginResponse = await fetch(`${BaseURL}/loginWithDevToken?devToken=${devToken}`)
          const loginData = await loginResponse.json()

          SetLoginCreds(loginData.response.account)

          const userLikesResponse = await fetch(`${BaseURL}/getUserLikes?devToken=${devToken}`)
          const userLikesData = await userLikesResponse.json()

          LoginCreds.userLikes = userLikesData.userLikes
        }

        const allCharactersResponse = await fetch(`${BaseURL}/getAllCharacters`)
        const allCharactersData = await allCharactersResponse.json()

        character = allCharactersData.response.allCharacters.find((char) => characterId === char.characterId || characterId === char.userPersonaId)

        if (character === undefined)
          navigate('/')
        else {
          setCurrentCharacter(character)
          setCurrentCharacterLikeCount(character.characterLikeCount ? character.characterLikeCount : character.userPersonaLikeCount)
        }

        var API_URL

        if (character.characterIsPublic !== undefined)
          API_URL = `${BaseURL}/getSessionToken?userName=Guest&isCustomizedCharacter=1&characterId=${character.characterId}&audio=1&emotion=1`
        else if (character.userPersonaIsPublic !== undefined)
          API_URL = `${BaseURL}/getSessionToken?userName=Guest&isUserPersona=1&characterId=${character.userPersonaId}&audio=1&emotion=1`
        else
          API_URL = `${BaseURL}/getSessionToken?userName=Guest&characterId=${character.characterId}&audio=1&emotion=1`

        fetch(API_URL)
        .then((res) => res.json())
        .then((data) => {
          if(data.response.error) {
            window.alert(data.response.error)
            setError(data.response.error)
          }
          else {
            initSessionToken = data.response.sessionToken
            setSessionToken(data.response.sessionToken)

            fetch(`${BaseURL}/sendTrigger?token=${data.response.sessionToken}&triggerName=greetings`)
            .then((res) => res.json())
            .then((data) => {
              if(data.response.error) {
                window.alert(data.response.error)
                setError(data.response.error)
              }
              else {
                if(data.response.emotion) {
                  setEmotionCode(data.response.emotion.code)
                  setCharacterEmotion(mapEmotionToEmoji(data.response.emotion))
                }
                else {
                  setEmotionCode('')
                  setCharacterEmotion('')
                }

                if(LoginCreds.devToken !== '')
                  LoginCreds.userInteractions += data.response.messages.length
                else
                  setInteractions(interactions+data.response.messages.length)

                handleAddMessage(data.response.messages, 0)
              }
            })
            setLoadingCharacter(false)
          }
        })
      } catch (error) {
        console.error("An error occurred:", error)
      }
    }

    if(currentCharacter === null)
      fetchData()
    else {
      var API_URL 
      if(characterVariant === 0) {
        API_URL = `${BaseURL}/getSessionToken?userName=${LoginCreds.userName !== '' ? LoginCreds.userName : 'Guest'}&characterId=${currentCharacter.characterId}&audio=1&emotion=1`
      } else if(characterVariant === 1) {
        if(currentCharacter.characterIsPublic !== 1)
          API_URL = `${BaseURL}/getSessionToken?userName=${LoginCreds.userName !== '' ? LoginCreds.userName : 'Guest'}&isCustomizedCharacter=1&devtoken=${LoginCreds.devToken}&characterId=${currentCharacter.characterId}&audio=1&emotion=1`
        else
          API_URL = `${BaseURL}/getSessionToken?userName=${LoginCreds.userName !== '' ? LoginCreds.userName : 'Guest'}&isCustomizedCharacter=1&characterId=${currentCharacter.characterId}&audio=1&emotion=1`
      } else {
        if(currentCharacter.userPersonaIsPublic !== 1)
          API_URL = `${BaseURL}/getSessionToken?userName=${LoginCreds.userName !== '' ? LoginCreds.userName : 'Guest'}&isUserPersona=1&devtoken=${LoginCreds.devToken}&characterId=${currentCharacter.characterId}&audio=1&emotion=1`
        else
          API_URL = `${BaseURL}/getSessionToken?userName=${LoginCreds.userName !== '' ? LoginCreds.userName : 'Guest'}&isUserPersona=1&characterId=${currentCharacter.userPersonaId}&audio=1&emotion=1`
      }
      fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        if(data.response.error) {
          window.alert(data.response.error)
          setError(data.response.error)
        }
        else {
          initSessionToken = data.response.sessionToken
          setSessionToken(data.response.sessionToken)

          fetch(`${BaseURL}/sendTrigger?token=${data.response.sessionToken}&triggerName=greetings`)
          .then((res) => res.json())
          .then((data) => {
            if(data.response.error) {
              window.alert(data.response.error)
              setError(data.response.error)
            }
            else {
              if(data.response.emotion) {
                setEmotionCode(data.response.emotion.code)
                setCharacterEmotion(mapEmotionToEmoji(data.response.emotion))
              }
              else {
                setEmotionCode('')
                setCharacterEmotion('')
              }

              if(LoginCreds.devToken !== '')
                LoginCreds.userInteractions += data.response.messages.length
              else
                setInteractions(interactions+data.response.messages.length)

              handleAddMessage(data.response.messages, 0)
            }
          })

          setLoadingCharacter(false)
        }
      })
    }

    const initMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const audioCtx = new (window.AudioContext)()

        const recorder = new Recorder(audioCtx)

        setMicrophoneStream(stream)
        setRecorder(recorder)
      } catch (error) {
        console.error('Error accessing microphone: ', error)
      }
    };

    initMicrophone()

    return () => {
      if (microphoneStream) microphoneStream.getTracks().forEach((track) => track.stop())
    }
  }, [])


  useEffect(() => {
    document.documentElement.scrollTop = document.documentElement.scrollHeight
    var messageBody = document.getElementById('chat_box')
    if(messageBody)
      messageBody.scrollTop = messageBody.scrollHeight
  }, [messages])

  const handleSendMessage = () => {
    if(userMessage !== '') {
      setUserSentAMessage(true)
      setUserMessage('')
      setError('')
      setMessages((prevMessages) => [...prevMessages, {characterId: 0, message: userMessage}])
      setLoading('Sending Message . . .')
      fetch(`${BaseURL}/sendMessage?message=${userMessage}&token=${sessionToken}`)
      .then((res) => res.json())
      .then((data) => {
        if(data.response.error) {
          setLoading(data.response.error)
        } else {
          setLoading('')
          if(data.response.emotion) {
            setEmotionCode(data.response.emotion.code)
            setCharacterEmotion(mapEmotionToEmoji(data.response.emotion))
          }
          else {
            setEmotionCode('')
            setCharacterEmotion('')
          }
          handleAddMessage(data.response.messages, 0)
        }
      })
    } else
      setError('Please Enter A Message')
  }

  const closeSession = () => {
    if(timerRef)
      clearTimeout(timerRef.current)

    if(LoginCreds.devToken === '')
      localStorage.setItem('freeInteractions', interactions)

    if(LoginCreds.devToken !== '') {
      fetch(`${BaseURL}/updateInteractions?devToken=${LoginCreds.devToken}&interactions=${LoginCreds.userInteractions}`)
      .then((res) => res.json())
      .then(() => {
        fetch(`${BaseURL}/closeSession?token=${sessionToken}`)
        .then((res) => res.json())
        .then(() => navigate('/'))
      })
    } else {
      fetch(`${BaseURL}/closeSession?token=${sessionToken}`)
      .then((res) => res.json())
      .then(() => navigate('/'))
    }
  }

  const handleAddMessage = (newMessages, index) => {
    if(audioRef.current !== null) {
      if(index < newMessages.length) {
        setMessages((prevMessages) => [...prevMessages, newMessages[index]])
  
        audioRef.current.src = 'data:audio/wav;base64,'+newMessages[index].audioChunk
        audioRef.current.play()
        audioRef.current.onended = () => {
          handleAddMessage(newMessages, index+1)
        }
      }
    }
  }

  const handleKeyEvent = (key) => {
    if(key === 'Enter')
      handleSendMessage()
  }

  const startRecording = () => {
    setRecording(true)

    recorder.init(microphoneStream)
    recorder.start()
  }

  const stopRecording = async () => {
    setRecording(false)
    const buffer = await recorder.stop()

    const audio = exportBuffer(buffer.buffer[0])

    sendAudioBlob(audio)
  }

  const sendAudioBlob = async (audio) => {
    setLoading('Loading . . .')
    setError('')
    const formData = new FormData()
    formData.append('audio', audio, 'audio.wav')

    fetch(`${BaseURL}/sendAudioMessage?token=${sessionToken}`, {
      method: 'POST',
      body: formData
    })
    .then((res) => res.json())
    .then((data) => {
      setLoading('')
      if(data.response.emotion) {
        setEmotionCode(data.response.emotion.code)
        setCharacterEmotion(mapEmotionToEmoji(data.response.emotion))
      }
      else {
        setEmotionCode('')
        setCharacterEmotion('')
      }

      setMessages((prevMessages) => [...prevMessages, {characterId: 0, message: data.response.userMessage.message}])
      handleAddMessage(data.response.messages, 0)
    })
  }

  const closeSessionAndEditCharacter = () => {
    fetch(`https://midlayer.ndsprj.com/closeSession?token=${sessionToken}`)
    .then((res) => res.json())
    .then((data) => navigate('/EditCharacter', { state: { character: currentCharacter } }))
  }

  const handleCloseModal = () => {
    setCharacterModalIsOpen(false)
  }

  const handleSendLike = () => {
    fetch(`${BaseURL}/sendLike?devToken=${LoginCreds.devToken}&characterId=${currentCharacter.characterId ? currentCharacter.characterId : currentCharacter.userPersonaId}`)
    .then((res) => res.json())
    .then((data) => {
      currentCharacter.characterLikeCount ? currentCharacter.characterLikeCount = data.response.updatedLikeCount : currentCharacter.userPersonaLikeCount = data.response.updatedLikeCount
      setCurrentCharacterLikeCount(currentCharacter.characterLikeCount ? currentCharacter.characterLikeCount : currentCharacter.userPersonaLikeCount)

      if(Characters.allCharacters.length > 0) {
        const characterIndex = Characters.allCharacters.findIndex((char) => char.characterId ? char.characterId === (currentCharacter.characterId ? currentCharacter.characterId : currentCharacter.userPersonaId) : char.userPersonaId === (currentCharacter.characterId ? currentCharacter.characterId: currentCharacter.userPersonaId))
        Characters.allCharacters[characterIndex].characterLikeCount = data.response.updatedLikeCount
      }

      LoginCreds.userLikes.push(currentCharacter.characterId ? currentCharacter.characterId : currentCharacter.userPersonaId)
    })
  }

  const handleRemoveLike = () => {
    fetch(`${BaseURL}/removeLike?devToken=${LoginCreds.devToken}&characterId${currentCharacter.characterId ? currentCharacter.characterId : currentCharacter.userPersonaId}`)
    .then((res) => res.json())
    .then((data) => {
      currentCharacter.characterLikeCount ? currentCharacter.characterLikeCount = data.response.updatedLikeCount : currentCharacter.userPersonaLikeCount = data.response.updatedLikeCount
      setCurrentCharacterLikeCount(currentCharacter.characterLikeCount ? currentCharacter.characterLikeCount : currentCharacter.userPersonaLikeCount)

      if(Characters.allCharacters.length > 0) {
        const characterIndex = Characters.allCharacters.findIndex((char) => char.characterId ? char.characterId === (currentCharacter.characterId ? currentCharacter.characterId : currentCharacter.userPersonaId) : char.userPersonaId === (currentCharacter.characterId ? currentCharacter.characterId: currentCharacter.userPersonaId))
        Characters.allCharacters[characterIndex].characterLikeCount = data.response.updatedLikeCount
      }

      const index = LoginCreds.userLikes.findIndex((item) => item === currentCharacter.characterId ? currentCharacter.characterId : currentCharacter.userPersonaId)
      LoginCreds.userLikes.splice(index, 1)
    })
  }

  return(
    <>
      <div className='characterPageContainer'>
        {!loadingCharacter ? (
          <div className='characterPageChatContainer'>
            <div className='backButtonDiv'>
              <img className='backButton' src={backButton} alt='backButton' onClick={() => closeSession()}/>
            </div>
            <div className='characterPageChatHeader'>
              <img className='characterImage' src={currentCharacter.characterImage ? currentCharacter.characterImage : currentCharacter.userPersonaImage} alt='characterImage'/>
              <button onClick={setCharacterModalIsOpen}>{currentCharacter.characterName ? currentCharacter.characterName : currentCharacter.userPersonaName}</button>
              <CharacterModal
                currentCharacter={currentCharacter}
                characterModalIsOpen={characterModalIsOpen}
                handleCloseModal={handleCloseModal}
              ></CharacterModal>
              <p className='characterHeaderId'>{"ID: "+currentCharacter.characterId ? currentCharacter.characterId : currentCharacter.userPersonaId}</p>
              <p className='characterHeaderDesc'>{currentCharacter.characterDesc ? currentCharacter.characterDesc : currentCharacter.userPersonaDesc}</p>
              {currentCharacter.characterCreatedBy &&
                <div className='characterHeaderCreatedBy'>
                  <p>Created By:</p>
                  <p>{currentCharacter.characterCreatedBy ? currentCharacter.characterCreatedBy : currentCharacter.userPersonaCreatedBy}</p>
                </div>
              }
              <div className='characterLikeCount'>
                <p><b>{formatNumber(currentCharacterLikeCount)}</b></p>
                {LoginCreds.userLikes.includes(currentCharacter.characterId ? currentCharacter.characterId : currentCharacter.userPersonaId) ? (
                  <img onClick={() => {handleRemoveLike()}} src={likedIcon} alt='likedIcon'/>
                ) : (
                  <img onClick={() => {LoginCreds.devToken !== '' ? handleSendLike() : setSignInToLike(true)}} src={notLikedIcon} alt='likedIcon'/>
                )}
              </div>
              {emotion !== '' &&
                <p className='emotion'>Current Emotion: {CharacterEmotions[emotionCode]+' '+emotion}</p>
              }
              {(currentCharacter.devToken !== undefined && currentCharacter.devToken === LoginCreds.devToken) &&
                <button onClick={() => closeSessionAndEditCharacter()}>Edit Character</button>
              }
            </div>
            <div className='characterPageBox'>
              <div id='chat_box' className='characterPageChatBox'>
              {messages.length > 0 &&
                messages.map((message, index) => (
                  message.characterId !== 0 ? (
                    <div key={index} className='characterMessage'>
                      <div className='messageImage'>
                        <img src={currentCharacter.characterImage ? currentCharacter.characterImage : currentCharacter.userPersonaImage} alt='avatarImg' />
                        <p>{currentCharacter.characterName ? currentCharacter.characterName : currentCharacter.userPersonaName}</p>
                      </div>
                      <p>{message.message}</p>
                    </div>
                  ) : (
                    <div key={index} className='userMessage'>
                      <p>{message.message}</p>
                      <div className='messageImage'>
                        <img src={userPfp} alt='avatarImg' />
                        <p>{LoginCreds.userName !== '' ? LoginCreds.userName : 'Guest'}</p>
                      </div>
                    </div>
                  )
                ))
              }
            </div>
            <audio ref={audioRef} />
            {error !== '' && (
              <p style={{fontSize:'20px', color: 'red', margin: '0'}}>{error}</p>
            )}
            {loading !== '' && (
              <p style={{fontSize:'20px', margin: '0'}}>{loading}</p>
            )}
            <div className='characterPageInputBox'>
              <input
                type='text'
                id='messageInput'
                value={userMessage}
                onKeyDown={(e) => handleKeyEvent(e.key)}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder='Enter message...'
              />
              <div className='characterPageActions'>
                <button disabled={userMessage === ''} className={userMessage === '' ? 'disabledButton' : 'submitButton'} onClick={handleSendMessage}>Send</button>

                <button
                  className='nonSelectedButton'
                  onClick={() => {
                    isRecording ? stopRecording() : startRecording()
                  }}
                  >
                  {isRecording ? 'Stop Mic' : 'Start Mic'}
                </button>
              </div>
            </div>
          </div>
        </div>
        ) : (
          <div>
            {error !== '' ? (
              <p style={{ fontSize: '20px', color: 'red', margin: '0' }}>{error}</p>
            ) : (
              <p>Fetching Character . . .</p>
            )}
          </div>
        )}
      </div>
      <NoMoreInteractions
        showPopUp={noMoreInteractions}
        setShowPopUp={setNoMoreInteractions}
      />
      <RegisterForAnAccount
        showPopUp={registerForAnAccount}
        setShowPopUp={setRegisterForAnAccount}
      />
      <SignInToLike
        showPopUp={signInToLike}
        setShowPopUp={setSignInToLike}
      />
    </>
  )
}

export default CharacterPage