import React, { useState } from 'react'
import '../css/PopUpWindows.css'
import { BaseURL } from './BaseURL'
import { LoginCreds } from './loginCreds'
import { Characters } from './Characters'
import { useNavigate } from 'react-router-dom'

export function ConfirmDeleteCustomizedCharacter({showDelete, characterId, characterName, setShowDelete, setCustomizedCharacters}) {
  const [error, setError] = useState('')

  const handleDeleteCharacter = () => {
    fetch(`${BaseURL}/deleteCustomizedCharacter?devToken=${LoginCreds.devToken}&characterId=${characterId}`)
    .then((res) => res.json())
    .then((data) => {
      if(data.response.error) {
        setError(error)
        setTimeout(() => {
          setError('')
        }, 2000)
      } else {
        const index = Characters.customizedCharacters.findIndex((char) => char.characterId === characterId)
        if(index !== -1) {
          Characters.customizedCharacters.splice(index, 1)
          setCustomizedCharacters([...Characters.customizedCharacters])
        }
      }
    })
  }

  return (
    <>
      {showDelete && (
        <div className="modal-container">
        <div className="blur-background"></div>
        <div className="modal-content">
          <p>Are you sure you want to delete {characterName}?</p>
          {error !== '' && (
            <p>{error}</p>
          )}
          <button onClick={() => handleDeleteCharacter()}>Delete</button>
          <button onClick={() => setShowDelete(false)}>Cancel</button>
        </div>
      </div>
      )}
    </>
  )
}

export function ConfirmDeleteUserPersona({showDelete, userPersona, setShowDelete, setUserPersona}) {
  const [error, setError] = useState('')

  const handleDeletePersona = () => {
    fetch(`${BaseURL}/deleteUserPersona?devToken=${LoginCreds.devToken}&userPersonaId=${userPersona.userPersonaId}`)
    .then((res) => res.json())
    .then((data) => {
      if(data.response.error) {
        setError(error)
        setTimeout(() => {
          setError('')
        }, 2000)
      } else {
        const index = Characters.userPersonas.findIndex((char) => char.userPersonaId === userPersona.userPersonaId)
        if(index !== -1)
          Characters.userPersonas.splice(index, 1)
        setUserPersona(null)
      }
    })
  }

  return (
    <>
      {showDelete && (
        <div className="modal-container">
        <div className="blur-background"></div>
        <div className="modal-content">
          <p>Are you sure you want to delete {userPersona.userPersonaName}?</p>
          {error !== '' && (
            <p>{error}</p>
          )}
          <button onClick={() => handleDeletePersona()}>Delete</button>
          <button onClick={() => setShowDelete(false)}>Cancel</button>
        </div>
      </div>
      )}
    </>
  )
}

export function NoMoreInteractions({showPopUp, setShowPopUp}) {
  const navigate = useNavigate()

  const handleRemovePopUp = () => {
    setShowPopUp(false)
    navigate('/')
  }

  return (
    <>
      {showPopUp && (
        <div className="modal-container">
        <div className="blur-background"></div>
        <div className="modal-content">
          <p>You have no more interactions left for the month.</p>
          <button onClick={() => handleRemovePopUp()}>Ok</button>
        </div>
      </div>
      )}
    </>
  )
}

export function RegisterForAnAccount({showPopUp, setShowPopUp}) {
  const navigate = useNavigate()

  const handleRemovePopUp = () => {
    setShowPopUp(false)
    navigate('/signUp')
  }

  return (
    <>
      {showPopUp && (
        <div className="modal-container">
        <div className="blur-background"></div>
        <div className="modal-content">
          <p>Register for an account to keep interacting with characters!</p>
          <button onClick={() => handleRemovePopUp()}>Register</button>
        </div>
      </div>
      )}
    </>
  )
}

export function SignInToLike({showPopUp, setShowPopUp}) {
  const navigate = useNavigate()

  const handleRemovePopUp = () => {
    setShowPopUp(false)
  }

  return (
    <>
      {showPopUp && (
        <div className="modal-container">
        <div className="blur-background"></div>
        <div className="modal-content">
          <p>You must be signed in to like characters!</p>
          <button onClick={() => handleRemovePopUp()}>Ok!</button>
        </div>
      </div>
      )}
    </>
  )
}