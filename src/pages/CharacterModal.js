import { useState } from 'react'
import '../css/CharacterModal.css'
import ReactModal from 'react-modal'
import { Characters } from "../utilities/Characters"

function CharacterModal(parameters) {
  var currentCharacter = parameters.currentCharacter
  var characterModalIsOpen = parameters.characterModalIsOpen
  var handleCloseModal = parameters.handleCloseModal

  function getCharacterCategoriesById() {
    var categories = []
    currentCharacter.categoryIds.forEach(Id => {
      categories.push(Characters.categories[Id].categoryName)
    });
    return categories
  }

  function getFormattedCharacterCategories() {
    var formattedString = ""
    getCharacterCategoriesById().forEach(category => {
      formattedString += category.charAt(0).toUpperCase() + category.slice(1) + ", "
    });
    return formattedString.slice(0, -2)
  }

  function getCharacterTagsById() {
    var tags = []
    currentCharacter.tagIds.forEach(Id => {
      tags.push(Characters.tags[Id].tagName)
    });
    return tags
  }

  function getFormattedCharacterTags() {
    var formattedString = ""
    getCharacterTagsById().forEach(tag => {
      formattedString += tag.charAt(0).toUpperCase() + tag.slice(1) + ", "
    });
    return formattedString.slice(0, -2)
  }

  return(
    <ReactModal
      style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)' } }}
      appElement={document.getElementById('root')}
      className='characterModal'
      isOpen={characterModalIsOpen}
      contentLabel="Character Modal"
    >
      <div className='characterModalContent'>
        <img className='characterModalImage' src={currentCharacter.characterImage ? currentCharacter.characterImage : currentCharacter.userPersonaImage} alt='characterImage'/>
        <p className='characterModalName'>{currentCharacter.characterName ? currentCharacter.characterName : currentCharacter.userPersonaName}</p>
        <p className='characterModalPronouns'>{currentCharacter.characterPronouns ? currentCharacter.characterPronouns : currentCharacter.userPersonaPronouns}</p>
        <p className='characterModalDesc'>{currentCharacter.characterDesc ? currentCharacter.characterDesc : currentCharacter.userPersonaDesc}</p>
        {currentCharacter.characterCreatedBy ?
          <div className='characterModalCreatedBy'>
            <p>Created By:</p>
            <p>{currentCharacter.characterCreatedBy ? currentCharacter.characterCreatedBy : currentCharacter.userPersonaCreatedBy}</p>
          </div>
          :
          currentCharacter.userPersonaCreatedBy &&
          <div className='characterModalCreatedBy'>
            <p>Created By:</p>
            <p>{currentCharacter.characterCreatedBy ? currentCharacter.characterCreatedBy : currentCharacter.userPersonaCreatedBy}</p>
          </div>
        }
        <p className='characterModalCategoryIds'>Categories: {getFormattedCharacterCategories()}</p>
        <p className='characterModalTagIds'>Tags: {getFormattedCharacterTags()}</p>
        <p className='characterModalId'>{"ID: "+currentCharacter.characterId ? currentCharacter.characterId : currentCharacter.userPersonaId}</p>
        <button className='characterModalButton' onClick={(e) => handleCloseModal(e)}>Back</button>
      </div>
    </ReactModal>
  )
}

export default CharacterModal
