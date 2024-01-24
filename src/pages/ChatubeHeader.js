import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { LoginCreds } from "../utilities/loginCreds"
import { Characters } from "../utilities/Characters"
import '../css/ChatubeHeader.css'
import '../css/ChatubeHeader-Mobile.css'

import searchIcon from '../assets/icons/searchIcon.png'
import questionIcon from '../assets/icons/questionIcon.png'
import blankProfileImage from '../assets/icons/BlankProfilePicture.png'

function ChatubeHeader() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const handleKeyEvent = (key) => {
    if(key === 'Enter')
      handleSearchForCharacter()
  }

  const handleSearchForCharacter = (value) => {
    setSearchQuery(value)

    var searchResults = []

    if(value === '') {
      setSearchResults([])
      return
    }

    Characters.allCharacters.map((character) => {
      if(character.characterName.toLowerCase().startsWith(value.toLowerCase()))
        searchResults.push(character)
    })

    Characters.tags.map((tag) => {
      if(value.toLowerCase() === tag.tagName) {
        Characters.allCharacters.map((character) => {
          if(character.tagIds.includes(tag.tagId))
            searchResults.push(character)
        })
      }
    })

    setSearchResults(searchResults)
  }

  function SearchView() {
    return (
      <div className='searchResults'>
        {searchResults.map((result, index) => {
          return(
            <div onClick={() => navigate('/CharacterPage', { state: { character: result, characterVariant: result.characterIsPublic ? 1 : 0 } })} key={index} className='characterSearch'>
              <img className='searchImage' src={result.characterImage} alt='characterImage'/>
              <p>{result.characterName}</p>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className='chatTubeHeader'>
      <h2>chatube.ai<span>beta</span></h2>
      <div className='rightSideButtons'>
        <div className='searchArea'>
          <input
            type='text'
            autoFocus='autoFocus'
            onKeyDown={(e) => handleKeyEvent(e.key)}
            id='searchQuery'
            value={searchQuery}
            onChange={(e) => handleSearchForCharacter(e.target.value)}
            placeholder='Search Character...'
          />
          {searchResults.length > 0 &&
            <SearchView />
          }
        </div>
        <img id="search-icon" className='rightSideIcon' onClick={() => handleSearchForCharacter} src={searchIcon} alt='searchIcon'/>
        <img className='rightSideIcon' src={questionIcon} alt='searchIcon'/>
        {LoginCreds.userName !== '' ? (
          <div className='loggedInText'>
            <p>Welcome, <strong>{LoginCreds.userName}</strong>!</p>
            {LoginCreds.profileImage !== '' ? (
              <img onClick={() => navigate('/ProfilePage')} src={LoginCreds.profileImage} alt='userProfileImage' />
            ) : (
              <img onClick={() => navigate('/ProfilePage')} src={blankProfileImage} alt='blankProfileImage'/>
            )}
          </div>
        ) : (
          <div className='loginSignUpButtons'>
            <button className='loginButton' onClick={() => navigate('/login')}>Log In</button>
            <button className='signUpButton' onClick={() => navigate('/signUp')}>Sign Up</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatubeHeader