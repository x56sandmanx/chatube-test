import '../css/CreateCharacter.css'
import React, { useEffect, useRef, useState } from "react"
import { CharacterEmotions, CharacterVoices } from '../utilities/CharacterTraits'
import { Characters } from '../utilities/Characters'
import { useLocation, useNavigate } from 'react-router-dom'
import { LoginCreds } from '../utilities/loginCreds'
import { BaseURL } from '../utilities/BaseURL'

import backButton from '../assets/icons/backButton.png'

function EditCustomizedCharacter() {
  const navigate = useNavigate()
  const location = useLocation()
  const currentCharacter = location.state.character
  const [step, setStep] = useState(0)

  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])

  const [characterName, setCharacterName] = useState(currentCharacter.characterName)
  const [characterDesc, setCharacterDesc] = useState(currentCharacter.characterDesc)
  const [characterImage, setCharacterImage] = useState(currentCharacter.characterImage)
  const [characterPreview, setCharacterPreview] = useState(currentCharacter.characterImage)
  const [characterPronouns, setCharacterPronouns] = useState(currentCharacter.characterPronouns)
  const [characterEmotion, setCharacterEmotion] = useState(currentCharacter.characterEmotion)

  const [characterNegativePositive, setCharacterNegativePositive] = useState(currentCharacter.characterPersonality.characterNegativePositive)
  const [characterAggressivePeaceful, setCharacterAggressivePeaceful] = useState(currentCharacter.characterPersonality.characterAggressivePeaceful)
  const [characterCautiousOpen, setCharacterCautiousOpen] = useState(currentCharacter.characterPersonality.characterCautiousOpen)
  const [characterIntrovertExtravert, setCharacterIntrovertExtravert] = useState(currentCharacter.characterPersonality.characterIntrovertExtravert)
  const [characterInsecureConfident, setCharacterInsecureConfident] = useState(currentCharacter.characterPersonality.characterInsecureConfident)

  const [characterSadnessJoy, setCharacterSadnessJoy] = useState(currentCharacter.characterMood.characterSadnessJoy)
  const [characterAngerFear, setCharacterAngerFear] = useState(currentCharacter.characterMood.characterAngerFear)
  const [characterDisgustTrust, setCharacterDisgustTrust] = useState(currentCharacter.characterMood.characterDisgustTrust)
  const [characterAnticipationSurprise, setCharacterAnticipationSurprise] = useState(currentCharacter.characterMood.characterAnticipationSurprise)
  const [characterStaticDynamic, setCharacterStaticDynamic] = useState(currentCharacter.characterMood.characterStaticDynamic)

  const [characterVoice, setCharacterVoice] = useState(currentCharacter.characterVoice.characterVoice)
  const [characterVoicePitch, setCharacterVoicePitch] = useState(currentCharacter.characterVoicePitch)
  const [characterTalkingSpeed, setCharacterTalkingSpeed] = useState(currentCharacter.characterVoice.characterTalkingSpeed)

  const [characterCategories, setCharacterCategories] = useState(currentCharacter.categoryIds)
  const [characterTags, setCharacterTags] = useState(currentCharacter.tagIds)

  const [error, setError] = useState('')
  const [characterAudio, setCharacterAudio] = useState('')

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
    setCharacterImage(e.target.files[0])
    setCharacterPreview(URL.createObjectURL(e.target.files[0]))
  }

  const handleNextStep = () => {
    if(step === 0) {
      if(characterName !== '' && characterDesc !== '' && characterImage !== null && characterPronouns !== '' && characterEmotion !== '')
        setStep(step+1)
      else 
        window.alert('Missing Values')
    } else if(step === 3) {
      if(characterVoice !== '')
        setStep(step+1)
      else 
        window.alert('Missing Values')
    } else if(step === 4) {
      if(characterCategories.length !== 0)
        setStep(step+1)
      else 
        window.alert('Missing Values')
    } else
      setStep(step+1)
  }

  const handleSelectCategory = (categoryId) => {
    if (characterCategories.includes(categoryId)) {
      const updatedCategories = characterCategories.filter(category => category !== categoryId)
      setCharacterCategories(updatedCategories)
    } else
      setCharacterCategories(prevCategories => [...prevCategories, categoryId])
  }

  const handleSelectTag = (tagId) => {
    if (characterTags.includes(tagId)) {
      const updatedCharacterTags = characterTags.filter(tag => tag !== tagId)
      setCharacterTags(updatedCharacterTags)
    } else
      setCharacterTags(prevTags => [...prevTags, tagId])
  }

  const handleSubmitCharacter = () => {
    if(characterTags.length === 0) {
      setError('Updating Character. . .')

      const character = {
        characterId: currentCharacter.characterId,
        characterIsPublic: currentCharacter.characterIsPublic,
        characterName: characterName,
        characterDesc: characterDesc,
        characterImage: characterImage,
        characterPronouns: characterPronouns,
        characterEmotion: characterEmotion,
        characterNegativePositive: characterNegativePositive,
        characterAggressivePeaceful: characterAggressivePeaceful,
        characterCautiousOpen: characterCautiousOpen,
        characterIntrovertExtravert: characterIntrovertExtravert,
        characterInsecureConfident: characterInsecureConfident,
        characterSadnessJoy: characterSadnessJoy,
        characterAngerFear: characterAngerFear,
        characterDisgustTrust: characterDisgustTrust,
        characterAnticipationSurprise: characterAnticipationSurprise,
        characterStaticDynamic: characterStaticDynamic,
        characterVoice: characterVoice,
        characterVoicePitch: characterVoicePitch,
        characterTalkingSpeed: characterTalkingSpeed,
        categoryIds: characterCategories.join(','),
        tagIds: characterTags.join(',')
      }

      const formData = new FormData()
      formData.append('character', JSON.stringify(character))
      formData.append('characterImage', characterImage)
      
      fetch(`${BaseURL}/updateCustomizedCharacter?devToken=${LoginCreds.devToken}`, {
        method: 'POST',
        body: formData
      })
      .then((res) => res.json())
      .then((data) => {
        if(data.response.error)
          window.alert('Missing Values')
        else {
          setError('Updated Character!')
          setTimeout(() => {
            Characters.customizedCharacters = Characters.customizedCharacters.filter((character) => {
              return character.characterId !== currentCharacter.characterId;
            })
            Characters.customizedCharacters.push(data.response.updatedCustomizedCharacter)
            navigate('/')
          }, 2000)
        }
      })
    } else
      window.alert('Missing Values')
  }

  const handleGetVoice = () => {
    setCharacterAudio('Getting Character Voice...')
    if(characterVoice !== '') {
      fetch(`${BaseURL}/getCharacterVoice?voiceName=${characterVoice}&voicePitch=${characterVoicePitch}`)
      .then((res) => res.json())
      .then((data) => {
        setCharacterAudio('')
        audioRef.current.src = 'data:audio/wav;base64,'+data.response.messages[0].audioChunk
        audioRef.current.play()
      })
    }
  }

  return(
    <div className='createCharacterContainer'>
      <h1>Chatube.ai</h1>
      <h2>Update Character</h2>
      {step === 0 ? (
        <div className='createCharacterBoxContainer'>
          <div className='createCharacterBoxHeader1'>
            <div className='createCharacterBoxInput'>
              <p>Character Name:</p>
              <input
                type='text'
                id='characterName'
                value={characterName}
                maxLength={45}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder='Character Name'
              />
            </div>
            <div className='createCharacterBoxUpload'>
              <p>Character Image:</p>
              <input
                type='file'
                accept='image/png, image/jpeg'
                id='characterImage'
                onChange={(e) => handleImageChange(e)}
              />
              {characterPreview && (
                <img src={characterPreview} alt='characterPreview' />
              )}
            </div>
          </div>
          <div className='createCharacterBoxDesc'>
              <p>Character Desc:</p>
              <textarea
                type='text'
                id='characterName'
                value={characterDesc}
                maxLength={150}
                onChange={(e) => setCharacterDesc(e.target.value)}
                placeholder='Character Name'
              />
            </div>
          <div className='createCharacterBoxHeader2'>
            <div className='createCharacterBoxDropDown'>
              <p>Character Pronouns:</p>
              <select value={characterPronouns} onChange={(e) => setCharacterPronouns(e.target.value)}>
                <option value=''>--- Choose one ---</option>
                <option value='he/him'>he/him</option>
                <option value ='she/her'>she/her</option>
                <option value = 'they/them'>they/them</option>
              </select>
            </div>
            <div className='createCharacterBoxDropDown'>
              <p>Character Emotion:</p>
              <select value={characterEmotion} onChange={(e) => setCharacterEmotion(e.target.value)}>
                <option value=''>--- Choose one ---</option>
                {Object.keys(CharacterEmotions).map((emotion) => {
                  return(
                    <option key={emotion} value={emotion}>{CharacterEmotions[emotion]}</option>
                  )
                })}
              </select>
            </div>
          </div>
          <button onClick={(e) => handleNextStep()}>Next Step</button>
          {error !== '' && (
            <p className='errorText'>{error}</p>
          )}
        </div>
      ) : step === 1 ? (
        <div className='createCharacterBoxContainer'>
          <img onClick={() => setStep(step-1)} className='backButton' src={backButton} alt='backButton' />
          <p>Character Personality:</p>
          <div className='createCharacterSliderContainer'>
              <div className='createCharacterSlider'>
                <p>Negative</p>
                <input
                  type='range'
                  id='characterPositive'
                  min="-100"
                  max="100"
                  step="25"
                  value={characterNegativePositive}
                  onChange={(e) => setCharacterNegativePositive(e.target.value)}
                />
                <p>Positive</p>
              </div>
              <div className='createCharacterSlider'>
                <p>Aggressive</p>
                <input
                  type='range'
                  id='characterPeaceful'
                  min="-100"
                  max="100"
                  step="25"
                  value={characterAggressivePeaceful}
                  onChange={(e) => setCharacterAggressivePeaceful(e.target.value)}
                />
                <p>Peaceful</p>
              </div>
              <div className='createCharacterSlider'>
                <p>Cautious</p>
                <input
                  type='range'
                  id='characterOpen'
                  min="-100"
                  max="100"
                  step="25"
                  value={characterCautiousOpen}
                  onChange={(e) => setCharacterCautiousOpen(e.target.value)}
                />
                <p>Open</p>
              </div>
              <div className='createCharacterSlider'>
                <p>Introvert</p>
                <input
                  type='range'
                  id='characterExtravert'
                  min="-100"
                  max="100"
                  step="25"
                  value={characterIntrovertExtravert}
                  onChange={(e) => setCharacterIntrovertExtravert(e.target.value)}
                />
                <p>Extravert</p>
              </div>
              <div className='createCharacterSlider'>
                <p>Insecure</p>
                <input
                  type='range'
                  id='characterConfident'
                  min="-100"
                  max="100"
                  step="25"
                  value={characterInsecureConfident}
                  onChange={(e) => setCharacterInsecureConfident(e.target.value)}
                />
                <p>Confident</p>
              </div>
            </div>
          <button onClick={(e) => handleNextStep()}>Next Step</button>
          {error !== '' && (
            <p className='errorText'>{error}</p>
          )}
        </div>
      ) : step === 2 ? (
        <div className='createCharacterBoxContainer'>
          <img onClick={() => setStep(step-1)} className='backButton' src={backButton} alt='backButton' />
          <p>Character Mood:</p>
          <div className='createCharacterSliderContainer'>
              <div className='createCharacterSlider'>
                <p>Sadness</p>
                <input
                  type='range'
                  id='characterJoy'
                  min="-100"
                  max="100"
                  step="25"
                  value={characterSadnessJoy}
                  onChange={(e) => setCharacterSadnessJoy(e.target.value)}
                />
                <p>Joy</p>
              </div>
              <div className='createCharacterSlider'>
                <p>Anger</p>
                <input
                  type='range'
                  id='characterFear'
                  min="-100"
                  max="100"
                  step="25"
                  value={characterAngerFear}
                  onChange={(e) => setCharacterAngerFear(e.target.value)}
                />
                <p>Fear</p>
              </div>
              <div className='createCharacterSlider'>
                <p>Disgust</p>
                <input
                  type='range'
                  id='characterTrust'
                  min="-100"
                  max="100"
                  step="25"
                  value={characterDisgustTrust}
                  onChange={(e) => setCharacterDisgustTrust(e.target.value)}
                />
                <p>Trust</p>
              </div>
              <div className='createCharacterSlider'>
                <p>Anticipation</p>
                <input
                  type='range'
                  id='characterSurprise'
                  min="-100"
                  max="100"
                  step="25"
                  value={characterAnticipationSurprise}
                  onChange={(e) => setCharacterAnticipationSurprise(e.target.value)}
                />
                <p>Surprise</p>
              </div>
              <div className='createCharacterSlider'>
                <p>Static Emotions</p>
                <input
                  type='range'
                  id='characterEmotions'
                  min="0"
                  max="1"
                  step="0.1"
                  value={characterStaticDynamic}
                  onChange={(e) => setCharacterStaticDynamic(e.target.value)}
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
            <p className='createCharacterVoiceHeader'>Character Voice:</p>
            <select value={characterVoice} onChange={(e) => setCharacterVoice(e.target.value)}>
              <option value=''>--- Choose one ---</option>
              <option value=''>--- MASCULINE ---</option>
              {Object.keys(CharacterVoices.MASCULINE_VOICES).map((masculine_voice) => (
                <option value={CharacterVoices.MASCULINE_VOICES[masculine_voice]}>
                  {CharacterVoices.MASCULINE_VOICES[masculine_voice]}
                </option>
              ))}
              <option value=''>--- FEMININE ---</option>
              {Object.keys(CharacterVoices.FEMININE_VOICES).map((feminine_voice) => (
                <option value={CharacterVoices.FEMININE_VOICES[feminine_voice]}>
                  {CharacterVoices.FEMININE_VOICES[feminine_voice]}
                </option>
              ))}
              <option value=''>--- ANDROGYNOUS ---</option>
              {Object.keys(CharacterVoices.ANDROGYNOUS).map((androgynous_voice) => (
                <option value={CharacterVoices.ANDROGYNOUS[androgynous_voice]}>
                  {CharacterVoices.ANDROGYNOUS[androgynous_voice]}
                </option>
              ))}
            </select>
            {characterAudio !== '' && (
              <p className='characterAudio'>{characterAudio}</p>
            )}
            <button onClick={() => handleGetVoice()}>Listen To Voice</button>
            <audio ref={audioRef} />
          </div>
          <div className='createCharacterVoiceSliders'>
            <div className='createCharacterSliderContainer'>
              <p>Character Voice Pitch:</p>
              <div className='createCharacterSlider'>
                <p>-0.5</p>
                <input
                  type='range'
                  id='characterVoicePitch'
                  min="-0.5"
                  max="1.5"
                  step="0.1"
                  value={characterVoicePitch}
                  onChange={(e) => setCharacterVoicePitch(e.target.value)}
                />
                <p>1.5</p>
              </div>
            </div>
            <div className='createCharacterSliderContainer'>
              <p>Character Talking Speed:</p>
              <div className='createCharacterSlider'>
                <p>0.0</p>
                <input
                  type='range'
                  id='characterVoicePitch'
                  min="0.0"
                  max="5.0"
                  step="0.1"
                  value={characterTalkingSpeed}
                  onChange={(e) => setCharacterTalkingSpeed(e.target.value)}
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
          <p>Character Categories:</p>
            <div className='createCharacterCategoriesGrid'>
              {categories.length >= 0 && (
                <>
                  {categories.map((category) => (
                    <button className={characterCategories.includes(category.categoryId) ? 'selectedButton' : 'notSelectedButton'} onClick={() => handleSelectCategory(category.categoryId)}><p>{category.categoryName}</p></button>
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
        <div className='createCharacterBoxContainerCategories'>
          <img onClick={() => setStep(step-1)} className='backButton' src={backButton} alt='backButton' />
          <p>Character Tags:</p>
            <div className='createCharacterCategoriesGrid'>
              {tags.length >= 0 && (
                <>
                  {tags.map((tag) => (
                    <button className={characterTags.includes(tag.tagId) ? 'selectedButton' : 'notSelectedButton'} onClick={() => handleSelectTag(tag.tagId)}><p>{tag.tagName}</p></button>
                  ))}
                </>
              )}
            </div>
            <button className='submitCharacter' onClick={() => handleSubmitCharacter()}>Update Character</button>
          {error !== '' && (
            <p className='errorText'>{error}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default EditCustomizedCharacter