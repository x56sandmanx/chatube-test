import '../css/CreateCharacter.css'
import '../css/CreateCharacter-Mobile.css'
import React, { useEffect, useRef, useState } from "react"
import { CharacterEmotions, CharacterVoices } from '../utilities/CharacterTraits'
import { Characters } from '../utilities/Characters'
import { useLocation, useNavigate } from 'react-router-dom'
import { LoginCreds } from '../utilities/loginCreds'
import { BaseURL } from '../utilities/BaseURL'

import backButton from '../assets/icons/backButton.png'

function EditPersona() {
  const navigate = useNavigate()
  const location = useLocation()
  const currentUserPersona = location.state.userPersona
  const [step, setStep] = useState(0)

  const [tags, setTags] = useState([])
  const [userPersonaTags, setUserPersonaTags] = useState(currentUserPersona.tagIds)

  const [categories, setCategories] = useState([])
  const [userPersonaCategories, setUserPersonaCategories] = useState(currentUserPersona.categoryIds)

  const [userPersonaName, setUserPersonaName] = useState(currentUserPersona.userPersonaName)
  const [userPersonaIsPublic, setUserPersonaIsPublic] = useState(currentUserPersona.userPersonaIsPublic)
  const [userPersonaDesc, setUserPersonaDesc] = useState(currentUserPersona.userPersonaDesc)
  const [userPersonaImage, setUserPersonaImage] = useState(currentUserPersona.userPersonaImage)
  const [userPersonaPreview, setUserPersonaPreview] = useState(currentUserPersona.userPersonaImage)
  const [userPersonaPronouns, setUserPersonaPronouns] = useState(currentUserPersona.userPersonaPronouns)
  const [userPersonaEmotion, setUserPersonaEmotion] = useState(currentUserPersona.userPersonaEmotion)

  const [userPersonaNegativePositive, setUserPersonaNegativePositive] = useState(currentUserPersona.userPersonaPersonality.userPersonaNegativePositive)
  const [userPersonaAggressivePeaceful, setUserPersonaAggressivePeaceful] = useState(currentUserPersona.userPersonaPersonality.userPersonaAggressivePeaceful)
  const [userPersonaCautiousOpen, setUserPersonaCautiousOpen] = useState(currentUserPersona.userPersonaPersonality.userPersonaCautiousOpen)
  const [userPersonaIntrovertExtravert, setUserPersonaIntrovertExtravert] = useState(currentUserPersona.userPersonaPersonality.userPersonaIntrovertExtravert)
  const [userPersonaInsecureConfident, setUserPersonaInsecureConfident] = useState(currentUserPersona.userPersonaPersonality.userPersonaInsecureConfident)

  const [userPersonaSadnessJoy, setUserPersonaSadnessJoy] = useState(currentUserPersona.userPersonaMood.userPersonaSadnessJoy)
  const [userPersonaAngerFear, setUserPersonaAngerFear] = useState(currentUserPersona.userPersonaMood.userPersonaAngerFear)
  const [userPersonaDisgustTrust, setUserPersonaDisgustTrust] = useState(currentUserPersona.userPersonaMood.userPersonaDisgustTrust)
  const [userPersonaAnticipationSurprise, setUserPersonaAnticipationSurprise] = useState(currentUserPersona.userPersonaMood.userPersonaAnticipationSurprise)
  const [userPersonaEmotionalFluidity, setUserPersonaEmotionalFluidity] = useState(currentUserPersona.userPersonaMood.userPersonaEmotionalFluidity)

  const [userPersonaVoice, setUserPersonaVoice] = useState(currentUserPersona.userPersonaVoice.userPersonaVoice)
  const [userPersonaVoicePitch, setUserPersonaVoicePitch] = useState(currentUserPersona.userPersonaVoice.userPersonaVoicePitch)
  const [userPersonaTalkingSpeed, setUserPersonaTalkingSpeed] = useState(currentUserPersona.userPersonaVoice.userPersonaTalkingSpeed)

  const [error, setError] = useState('')
  const [userPersonaAudio, setUserPersonaAudio] = useState('')

  const audioRef = useRef(null)

  useEffect(() => {
    fetch(`${BaseURL}/getAllCategories`)
    .then((res) => res.json())
    .then((data) => {
      setCategories(data.response.categories)
      fetch(`${BaseURL}/getAllTags`)
      .then((res) => res.json())
      .then((data) => setTags(data.response.tags))
    })
  }, [])

  const handleImageChange = (e) => {
    setUserPersonaImage(e.target.files[0])
    setUserPersonaPreview(URL.createObjectURL(e.target.files[0]))
  }

  const handleNextStep = () => {
    if(step === 0) {
      if(userPersonaName !== '' &&
       userPersonaDesc !== '' &&
       userPersonaImage !== null &&
       userPersonaPronouns !== '' &&
       userPersonaEmotion !== '') {
        setStep(step+1)
       } else 
          window.alert('Missing Values')
    } else if(step === 3) {
      if(userPersonaVoice !== '')
        setStep(step+1)
      else 
        window.alert('Missing Values')
    } else if(step === 4) {
      if(userPersonaCategories.length !== 0)
        setStep(step+1)
      else 
        window.alert('Missing Values')
    } else
      setStep(step+1)
  }

  const handleSubmitCharacter = () => {
    if(userPersonaTags.length !== 0) {
      setError('Updating Persona. . .')

      const userPersona = {
        userPersonaId: currentUserPersona.userPersonaId,
        userPersonaIsPublic: userPersonaIsPublic,
        userPersonaName: userPersonaName,
        userPersonaDesc: userPersonaDesc,
        userPersonaImage: userPersonaImage,
        userPersonaPronouns: userPersonaPronouns,
        userPersonaEmotion: userPersonaEmotion,
        userPersonaNegativePositive: userPersonaNegativePositive,
        userPersonaAggressivePeaceful: userPersonaAggressivePeaceful,
        userPersonaCautiousOpen: userPersonaCautiousOpen,
        userPersonaIntrovertExtravert: userPersonaIntrovertExtravert,
        userPersonaInsecureConfident: userPersonaInsecureConfident,
        userPersonaSadnessJoy: userPersonaSadnessJoy,
        userPersonaAngerFear: userPersonaAngerFear,
        userPersonaDisgustTrust: userPersonaDisgustTrust,
        userPersonaAnticipationSurprise: userPersonaAnticipationSurprise,
        userPersonaEmotionalFluidity: userPersonaEmotionalFluidity,
        userPersonaVoice: userPersonaVoice,
        userPersonaVoicePitch: userPersonaVoicePitch,
        userPersonaTalkingSpeed: userPersonaTalkingSpeed,
        categoryIds: userPersonaCategories.join(','),
        tagIds: userPersonaTags.join(',')
      }

      const formData = new FormData()
      formData.append('userPersona', JSON.stringify(userPersona))
      formData.append('userPersonaImage', userPersonaImage)
      
      fetch(`${BaseURL}/updateUserPersona?devToken=${LoginCreds.devToken}`, {
        method: 'POST',
        body: formData
      })
      .then((res) => res.json())
      .then((data) => {
        if(data.response.error)
          window.alert('Missing Values')
        else {
          setError('Persona Updated!')
          setTimeout(() => {
            Characters.userPersonas.map((userPersona) => {
              if(userPersona.userPersonaId === data.response.updatedUserPersona.userPersonaId)
                return data.response.updatedUserPersona
              return userPersona
            })
            navigate('/')
          }, 2000)
        }
      })
    } else
      window.alert('Missing Values')
  }

  const handleGetVoice = () => {
    setUserPersonaAudio('Getting Character Voice...')
    if(userPersonaVoice !== '') {
      fetch(`${BaseURL}/getCharacterVoice?voiceName=${userPersonaVoice}&voicePitch=${userPersonaVoicePitch}`)
      .then((res) => res.json())
      .then((data) => {
        setUserPersonaAudio('')
        audioRef.current.src = 'data:audio/wav;base64,'+data.response.messages[0].audioChunk
        audioRef.current.play()
      })
    }
  }

  const handleSelectTag = (tagId) => {
    if (userPersonaTags.includes(tagId)) {
      const updateduserPersonaTags = userPersonaTags.filter(tag => tag !== tagId);
      setUserPersonaTags(updateduserPersonaTags);
    } else
    setUserPersonaTags(prevTags => [...prevTags, tagId])
  }

  const handleSelectCategory = (categoryId) => {
    if(userPersonaCategories.includes(categoryId)) {
      const updatedUserPersonaCategories = userPersonaCategories.filter(category => category !== categoryId)
      setUserPersonaCategories(updatedUserPersonaCategories)
    } else
    setUserPersonaCategories(prevCategories => [...prevCategories, categoryId])
  }

  return(
    <div className='createCharacterContainer'>
      <h1>Chatube.ai</h1>
      <h2>Edit User Persona</h2>
      {step === 0 ? (
        <div className='createCharacterBoxContainer'>
          <div className='createCharacterBoxHeader1'>
            <div className='createCharacterBoxInput'>
              <p>Persona Name:</p>
              <input
                type='text'
                id='userPersonaName'
                value={userPersonaName}
                maxLength={20}
                onChange={(e) => setUserPersonaName(e.target.value)}
                placeholder='Persona Name'
              />
            </div>
            <div className='createCharacterBoxUpload'>
              <p>Persona Image:</p>
              <input
                type='file'
                accept='image/png, image/jpeg'
                id='userPersonaImage'
                onChange={(e) => handleImageChange(e)}
              />
              {userPersonaPreview && (
                <img src={userPersonaPreview} alt='characterPreview' />
              )}
            </div>
          </div>
          <div className='createCharacterBoxDesc'>
            <p>Persona Desc (max 250 chars):</p>
            <textarea
              type='text'
              id='characterName'
              value={userPersonaDesc}
              maxLength={250}
              onChange={(e) => setUserPersonaDesc(e.target.value)}
              placeholder='Persona Desc'
            />
          </div>
          <div className='createCharacterBoxHeader2'>
            <div className='createCharacterBoxDropDown'>
              <p>Persona Pronouns:</p>
              <select value={userPersonaPronouns} onChange={(e) => setUserPersonaPronouns(e.target.value)}>
                <option value=''>--- Choose one ---</option>
                <option value='he/him'>he/him</option>
                <option value ='she/her'>she/her</option>
                <option value = 'they/them'>they/them</option>
              </select>
            </div>
            <div className='createCharacterBoxDropDown'>
              <p>Persona Emotion:</p>
              <select value={userPersonaEmotion} onChange={(e) => setUserPersonaEmotion(e.target.value)}>
                <option value=''>--- Choose one ---</option>
                {Object.keys(CharacterEmotions).map((emotion) => {
                  return(
                    <option key={emotion} value={emotion}>{CharacterEmotions[emotion]}</option>
                  )
                })}
              </select>
            </div>
          </div>
          <div className='createCharacterCheckBox'>
            <p>Public Persona:</p>
            <input
              type='checkbox'
              id='userPersonaIsPublic'
              checked={userPersonaIsPublic === 1}
              onChange={() => setUserPersonaIsPublic(userPersonaIsPublic === 0 ? 1 : 0)}
            />
          </div>
          <button onClick={() => handleNextStep()}>Next Step</button>
          {error !== '' && (
            <p className='errorText'>{error}</p>
          )}
        </div>
      ) : step === 1 ? (
        <div className='createCharacterBoxContainer'>
          <img onClick={() => setStep(step-1)} className='backButton' src={backButton} alt='backButton' />
          <p>Persona Personality:</p>
          <div className='createCharacterSliderContainer'>
              <div className='createCharacterSlider'>
                <p>Negative</p>
                <input
                  type='range'
                  id='userPersonaPositive'
                  min="1"
                  max="9"
                  step="1"
                  value={userPersonaNegativePositive}
                  onChange={(e) => setUserPersonaNegativePositive(e.target.value)}
                />
                <p>Positive</p>
              </div>
              <div className='createCharacterSlider'>
                <p>Aggressive</p>
                <input
                  type='range'
                  id='userPersonaPeaceful'
                  min="1"
                  max="9"
                  step="1"
                  value={userPersonaAggressivePeaceful}
                  onChange={(e) => setUserPersonaAggressivePeaceful(e.target.value)}
                />
                <p>Peaceful</p>
              </div>
              <div className='createCharacterSlider'>
                <p>Cautious</p>
                <input
                  type='range'
                  id='userPersonaOpen'
                  min="1"
                  max="9"
                  step="1"
                  value={userPersonaCautiousOpen}
                  onChange={(e) => setUserPersonaCautiousOpen(e.target.value)}
                />
                <p>Open</p>
              </div>
              <div className='createCharacterSlider'>
                <p>Introvert</p>
                <input
                  type='range'
                  id='userPersonaExtravert'
                  min="1"
                  max="9"
                  step="1"
                  value={userPersonaIntrovertExtravert}
                  onChange={(e) => setUserPersonaIntrovertExtravert(e.target.value)}
                />
                <p>Extravert</p>
              </div>
              <div className='createCharacterSlider'>
                <p>Insecure</p>
                <input
                  type='range'
                  id='userPersonaConfident'
                  min="1"
                  max="9"
                  step="1"
                  value={userPersonaInsecureConfident}
                  onChange={(e) => setUserPersonaInsecureConfident(e.target.value)}
                />
                <p>Confident</p>
              </div>
            </div>
          <button onClick={() => handleNextStep()}>Next Step</button>
          {error !== '' && (
            <p className='errorText'>{error}</p>
          )}
        </div>
      ) : step === 2 ? (
        <div className='createCharacterBoxContainer'>
          <img onClick={() => setStep(step-1)} className='backButton' src={backButton} alt='backButton' />
          <p>Persona Mood:</p>
          <div className='createCharacterSliderContainer'>
              <div className='createCharacterSlider'>
                <p>Sadness</p>
                <input
                  type='range'
                  id='userPersonaJoy'
                  min="1"
                  max="9"
                  step="1"
                  value={userPersonaSadnessJoy}
                  onChange={(e) => setUserPersonaSadnessJoy(e.target.value)}
                />
                <p>Joy</p>
              </div>
              <div className='createCharacterSlider'>
                <p>Anger</p>
                <input
                  type='range'
                  id='userPersonaFear'
                  min="1"
                  max="9"
                  step="1"
                  value={userPersonaAngerFear}
                  onChange={(e) => setUserPersonaAngerFear(e.target.value)}
                />
                <p>Fear</p>
              </div>
              <div className='createCharacterSlider'>
                <p>Disgust</p>
                <input
                  type='range'
                  id='userPersonaTrust'
                  min="1"
                  max="9"
                  step="1"
                  value={userPersonaDisgustTrust}
                  onChange={(e) => setUserPersonaDisgustTrust(e.target.value)}
                />
                <p>Trust</p>
              </div>
              <div className='createCharacterSlider'>
                <p>Anticipation</p>
                <input
                  type='range'
                  id='userPersonaSurprise'
                  min="1"
                  max="9"
                  step="1"
                  value={userPersonaAnticipationSurprise}
                  onChange={(e) => setUserPersonaAnticipationSurprise(e.target.value)}
                />
                <p>Surprise</p>
              </div>
              <div className='createCharacterSlider'>
                <p>Static Emotions</p>
                <input
                  type='range'
                  id='userPersonaEmotionFluidity'
                  min="-1.0"
                  max="1.0"
                  step="0.1"
                  value={userPersonaEmotionalFluidity}
                  onChange={(e) => setUserPersonaEmotionalFluidity(e.target.value)}
                />
                <p>Dynamic Emotions</p>
              </div>
            </div>
          <button onClick={() => handleNextStep()}>Next Step</button>
          {error !== '' && (
            <p className='errorText'>{error}</p>
          )}
        </div>
      ) : step === 3 ? (
        <div className='createCharacterBoxContainer'>
          <img onClick={() => setStep(step-1)} className='backButton' src={backButton} alt='backButton' />
          <div className='createCharacterVoice'>
            <p className='createCharacterVoiceHeader'>Persona Voice:</p>
            <select value={userPersonaVoice} onChange={(e) => setUserPersonaVoice(e.target.value)}>
              <option value=''>--- Choose one ---</option>
              <option value=''>--- MASCULINE ---</option>
              {Object.keys(CharacterVoices.MASCULINE_VOICES).map((masculine_voice) => (
                <option key={masculine_voice} value={CharacterVoices.MASCULINE_VOICES[masculine_voice]}>
                  {CharacterVoices.MASCULINE_VOICES[masculine_voice]}
                </option>
              ))}
              <option value=''>--- FEMININE ---</option>
              {Object.keys(CharacterVoices.FEMININE_VOICES).map((feminine_voice) => (
                <option key={feminine_voice} value={CharacterVoices.FEMININE_VOICES[feminine_voice]}>
                  {CharacterVoices.FEMININE_VOICES[feminine_voice]}
                </option>
              ))}
              <option value=''>--- ANDROGYNOUS ---</option>
              {Object.keys(CharacterVoices.ANDROGYNOUS).map((androgynous_voice) => (
                <option key={androgynous_voice} value={CharacterVoices.ANDROGYNOUS[androgynous_voice]}>
                  {CharacterVoices.ANDROGYNOUS[androgynous_voice]}
                </option>
              ))}
            </select>
            {userPersonaAudio !== '' && (
              <p className='characterAudio'>{userPersonaAudio}</p>
            )}
            <button onClick={() => handleGetVoice()}>Listen To Voice</button>
            <audio ref={audioRef} />
          </div>
          <div className='createCharacterVoiceSliders'>
            <div className='createCharacterSliderContainer'>
              <p>Persona Voice Pitch:</p>
              <div className='createCharacterVoiceSlider'>
                <p>-0.5</p>
                <input
                  type='range'
                  id='userPersonaVoicePitch'
                  min="-0.5"
                  max="1.5"
                  step="0.1"
                  value={userPersonaVoicePitch}
                  onChange={(e) => setUserPersonaVoicePitch(e.target.value)}
                />
                <p>1.5</p>
              </div>
            </div>
            <div className='createCharacterSliderContainer'>
              <p>Persona Talking Speed:</p>
              <div className='createCharacterVoiceSlider'>
                <p>0.0</p>
                <input
                  type='range'
                  id='userPersonaTalkingSpeed'
                  min="0.0"
                  max="5.0"
                  step="0.1"
                  value={userPersonaTalkingSpeed}
                  onChange={(e) => setUserPersonaTalkingSpeed(e.target.value)}
                />
                <p>5.0</p>
              </div>
            </div>
          </div>
          <button onClick={() => handleNextStep()}>Next Step</button>
          {error !== '' && (
            <p className='errorText'>{error}</p>
          )}
        </div>
      ) : step === 4 ? (
        <div className='createCharacterBoxContainerCategories'>
          <img onClick={() => setStep(step-1)} className='backButton' src={backButton} alt='backButton' />
          <p>Persona Categories:</p>
            <div className='createCharacterCategoriesGrid'>
              {categories.length >= 0 && (
                <>
                  {categories.map((category) => (
                    <button key={category.categoryId} className={userPersonaCategories.includes(category.categoryId) ? 'selectedButton' : 'notSelectedButton'} onClick={() => handleSelectCategory(category.categoryId)}><p>{category.categoryName}</p></button>
                  ))}
                </>
              )}
            </div>
            <button className='submitCharacter' onClick={() => handleNextStep()}>Next Step</button>
          {error !== '' && (
            <p className='errorText'>{error}</p>
          )}
        </div>
      ) : (
        <div className='createCharacterBoxContainerTags'>
          <img onClick={() => setStep(step-1)} className='backButton' src={backButton} alt='backButton' />
          <p>Persona Tags:</p>
            <div className='createCharacterTagsGrid'>
              {tags.length >= 0 && (
                <>
                  {tags.map((tag) => (
                    <button key={tag.tagId} className={userPersonaTags.includes(tag.tagId) ? 'selectedButton' : 'notSelectedButton'} onClick={() => handleSelectTag(tag.tagId)}><p>{tag.tagName}</p></button>
                  ))}
                </>
              )}
            </div>
            <button className='submitCharacter' onClick={() => handleSubmitCharacter()}>Update Persona</button>
          {error !== '' && (
            <p className='errorText'>{error}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default EditPersona