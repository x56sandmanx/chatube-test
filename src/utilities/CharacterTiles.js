import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { formatNumber, truncateString } from "./Extensions.js"
import { toast } from "react-toastify"
import { ConfirmDeleteCustomizedCharacter, ConfirmDeleteUserPersona, NoMoreInteractions, RegisterForAnAccount, SignInToLike } from "./PopUpWindows.js"
import CharacterModal from "../pages/CharacterModal.js"

import infoIcon from '../assets/icons/infoIcon.png'
import likedIcon from '../assets/icons/likedIcon.png'
import notLikedIcon from '../assets/icons/notLikedIcon.png'
import blankProfileImage from '../assets/icons/BlankProfilePicture.png'
import shareIcon from '../assets/icons/shareIcon.png'
import settingsIcon from '../assets/icons/settingsIcon.png'
import deleteIcon from '../assets/icons/deleteIcon.png'
import { LoginCreds } from "./loginCreds.js"

const handleClickInfo = (e, setCharacterModalIsOpen) => {
  e.stopPropagation()
  setCharacterModalIsOpen(true)
}

const handleCopyLink = async (e, characterId) => {
  e.stopPropagation()
  await navigator.clipboard.writeText(`${window.location.origin}/#/CharacterPage/${characterId}`)
  toast.success('Link Copied!', {
    position: toast.POSITION.BOTTOM_CENTER,
    autoClose: 2000
  })
}

const handleCharacterPage = (navigate, character, characterVariant, setNoInteractionsLeft, setRegisterForAnAccount) => {
  if(LoginCreds.devToken !== '') {
    if(LoginCreds.userInteractions < 200)
      navigate('/CharacterPage', { state: { character: character, characterVariant: characterVariant } })
    else
      setNoInteractionsLeft(true)
  } else {
    var interactions = localStorage.getItem('freeInteractions')
    if(interactions === null)
      interactions = 0
    if(interactions < 25)
      navigate('/CharacterPage', { state: { character: character, characterVariant: characterVariant } })
    else
      setRegisterForAnAccount(true)
  }
}

export function CharacterTile({character, characterVariant, handleSendLike, handleRemoveLike}) {
  const navigate = useNavigate()
  const [characterModalIsOpen, setCharacterModalIsOpen] = useState(false)
  const [noInteractionsLeft, setNoInteractionsLeft] = useState(false)
  const [registerForAnAccount, setRegisterForAnAccount] = useState(false)
  const [signInToLike, setSignInToLike] = useState(false)

  const handleCloseModal = (e) => {
    if(e !== undefined)
      e.stopPropagation()
    setCharacterModalIsOpen(false)
  }

  const handleLogin = (e) => {
    e.stopPropagation()
    setSignInToLike(true)
  }
  return (
    <>
      <div key={character.characterId} onClick={() => handleCharacterPage(navigate, character, character.characterIsPublic ? 1 : 0, setNoInteractionsLeft, setRegisterForAnAccount)} className='character'>
        <div className='infoIconDiv'>
          <img className='infoIcon' onClick={(e) => {handleClickInfo(e, setCharacterModalIsOpen)}} src={infoIcon} alt='infoIcon'/>
        </div>
        {character.characterImage !== "" ? (
          <img src={character.characterImage} alt='avatarImg' />
        ) : (
          <img className='characterBlankImage' src={blankProfileImage} alt='avatarImg' />
        )}
        <p className='characterName'>{character.characterName}</p>
        <p className='characterDesc'>{truncateString(character.characterDesc, 130)}</p>
        <div className='characterBottomBar'>
          {character.characterIsPublic ? (
            <p>{truncateString(character.characterCreatedBy, 12)}</p>
          ) : (
            <p></p>
          )}
          <div className='characterBottomBarRight'>
            <div className='characterBottomBarLike'>
              <div className='characterBottomBarLikeCount'>
                <p><b>{formatNumber(character.characterLikeCount)}</b></p>
              </div>
              {LoginCreds.userLikes.includes(character.characterId) ? (
                <img onClick={(e) => {handleRemoveLike(e, character, characterVariant)}} src={likedIcon} alt='likedIcon'/>
              ) : (
                <img onClick={(e) => { LoginCreds.devToken !== '' ? handleSendLike(e, character, characterVariant) : handleLogin(e)}} src={notLikedIcon} alt='notLikedIcon'/>
              )}
            </div>
            <img onClick={(e) => {handleCopyLink(e, character.characterId)}} src={shareIcon} alt='shareIcon' className='shareIcon'/>
            <CharacterModal
              currentCharacter={character}
              characterModalIsOpen={characterModalIsOpen}
              handleCloseModal={handleCloseModal}
            ></CharacterModal>
          </div>
        </div>
      </div>
      <NoMoreInteractions
        showPopUp={noInteractionsLeft}
        setShowPopUp={setNoInteractionsLeft}
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

export function UserPersonaTile({character, handleSendLike, handleRemoveLike}) {
  const navigate = useNavigate()
  const [characterModalIsOpen, setCharacterModalIsOpen] = useState(false)
  const [noInteractionsLeft, setNoInteractionsLeft] = useState(false)
  const [registerForAnAccount, setRegisterForAnAccount] = useState(false)
  const [signInToLike, setSignInToLike] = useState(false)

  const handleCloseModal = (e) => {
    if(e !== undefined)
      e.stopPropagation()
    setCharacterModalIsOpen(false)
  }

  const handleLogin = (e) => {
    e.stopPropagation()
    setSignInToLike(true)
  }

  return (
    <>
      <div key={character.userPersonaId} onClick={() => handleCharacterPage(navigate, character, 2, setNoInteractionsLeft, setRegisterForAnAccount)} className='character'>
        <div className='infoIconDiv'>
          <img className='infoIcon' onClick={(e) => {handleClickInfo(e, setCharacterModalIsOpen)}} src={infoIcon} alt='infoIcon'/>
        </div>
        {character.userPersonaImage !== "" ? (
          <img src={character.userPersonaImage} alt='avatarImg' />
        ) : (
          <img className='characterBlankImage' src={blankProfileImage} alt='avatarImg' />
        )}
        <p className='characterName'>{character.userPersonaName}</p>
        <p className='characterDesc'>{truncateString(character.userPersonaDesc, 130)}</p>
        <div className='characterBottomBar'>
          <p>{truncateString(character.userPersonaCreatedBy, 12)}</p>
          <div className='characterBottomBarRight'>
            <div className='characterBottomBarLike'>
              <div className='characterBottomBarLikeCount'>
                <p><b>{formatNumber(character.userPersonaLikeCount)}</b></p>
              </div>
              {LoginCreds.userLikes.includes(character.userPersonaId) ? (
                <img onClick={(e) => {handleRemoveLike(e, character)}} src={likedIcon} alt='likedIcon'/>
              ) : (
                <img onClick={(e) => {LoginCreds.devToken !== '' ? handleSendLike(e, character) : handleLogin(e)}} src={notLikedIcon} alt='likedIcon'/>
              )}
            </div>
            <img onClick={(e) => {handleCopyLink(e, character.userPersonaId)}} src={shareIcon} alt='shareIcon'/>
            <CharacterModal
              currentCharacter={character}
              characterModalIsOpen={characterModalIsOpen}
              handleCloseModal={handleCloseModal}
            ></CharacterModal>
          </div>
        </div>
      </div>
      <NoMoreInteractions
        showPopUp={noInteractionsLeft}
        setShowPopUp={setNoInteractionsLeft}
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

const handleEditCharacter = (e, character, navigate) => {
  e.stopPropagation()
  navigate('/EditCharacter', { state: { character: character } })
}

const handleConfirmDeleteCharacter = (e, setShowDelete) => {
  e.stopPropagation()
  setShowDelete(true)
}

export function MyCharacter({character, setCustomizedCharacters}) {
  const navigate = useNavigate()
  const [showDelete, setShowDelete] = useState(false)
  const [noInteractionsLeft, setNoInteractionsLeft] = useState(false)
  const [registerForAnAccount, setRegisterForAnAccount] = useState(false)

  return(
    <>
      <div key={character.characterId} onClick={() => handleCharacterPage(navigate, character, 1, setNoInteractionsLeft, setRegisterForAnAccount)} className='character'>
        <img src={character.characterImage} alt='avatarImg' />
        <p className='characterName'>{character.characterName}</p>
        <p className='characterDesc'>{truncateString(character.characterDesc, 80)}</p>
        <div className='characterBottomBar'>
          <img onClick={(e) => handleEditCharacter(e, character, navigate)} src={settingsIcon} alt='settingsIcon'/>
          <img className='characterDeleteButton' onClick={(e) => handleConfirmDeleteCharacter(e, setShowDelete)} src={deleteIcon} alt='deleteIcon'/>
        </div>
      </div>
      <ConfirmDeleteCustomizedCharacter
        showDelete={showDelete}
        characterId={character.characterId}
        characterName={character.characterName}
        setShowDelete={setShowDelete}
        setCustomizedCharacters={setCustomizedCharacters}
      />
      <NoMoreInteractions
        showPopUp={noInteractionsLeft}
        setShowPopUp={setNoInteractionsLeft}
      />
      <RegisterForAnAccount
        showPopUp={registerForAnAccount}
        setShowPopUp={setRegisterForAnAccount}
      />
    </>
  )
}

export function MyUserPersona({userPersona, setUserPersona}) {
  const navigate = useNavigate()
  const [showDelete, setShowDelete] = useState(false)
  const [noInteractionsLeft, setNoInteractionsLeft] = useState(false)
  const [registerForAnAccount, setRegisterForAnAccount] = useState(false)

  return(
    <>
      <div className='userPersonaContainer'>
        <div className='userPersona'>
          <img src={userPersona.userPersonaImage} alt='userPersonaImage' />
          <h2>{userPersona.userPersonaName}</h2>
          <p>Pronouns: {userPersona.userPersonaPronouns}</p>
          <p>{userPersona.userPersonaDesc}</p>
          <div className='userPersonaButtons'>
            <button onClick={() => handleCharacterPage(navigate, userPersona, 2, setNoInteractionsLeft, setRegisterForAnAccount)}>Talk To Persona</button>
            <button onClick={() => navigate('/EditPersona', { state: { userPersona: userPersona }})}>Edit Persona</button>
            <button onClick={() => setShowDelete(true)}>Delete Persona</button>
          </div>
        </div>
      </div>
      <ConfirmDeleteUserPersona
        showDelete={showDelete}
        userPersona={userPersona}
        setShowDelete={setShowDelete}
        setUserPersona={setUserPersona}
      />
      <NoMoreInteractions
        showPopUp={noInteractionsLeft}
        setShowPopUp={setNoInteractionsLeft}
      />
      <RegisterForAnAccount
        showPopUp={registerForAnAccount}
        setShowPopUp={setRegisterForAnAccount}
      />
    </>
  )
}