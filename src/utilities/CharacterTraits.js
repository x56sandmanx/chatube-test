export const CharacterEmotions = {
  NEUTRAL: 'Neutral',
  DISGUST: 'Disgusted',
  CONTEMPT: 'Contemptuous',
  BELLIGERENCE: 'Belligerence',
  DOMINEERING: 'Dominate',
  CRITICISM: 'Critical',
  ANGER: 'Angry',
  TENSION: 'Tense',
  TENSE_HUMOR: 'Wry',
  DEFENSIVENESS: 'Defensive',
  WHINING: 'Whiny',
  SADNESS: 'Sad',
  STONEWALLING: 'Stubborn',
  INTEREST: 'Intrigued',
  VALIDATION: 'Validated',
  AFFECTION: 'Affectionate',
  HUMOR: 'Amused',
  SURPRISE: 'Surprised',
  JOY: 'Happy'
}

export const CharacterVoices = {
  MASCULINE_VOICES: ['Anthony Myers', 'Beau Tolin', 'Brett Smith', 'Christopher Robertson', 'Daniel Gibson', 'Earl Acosta', 'Gene Bechtel', 
                     'Haley Ray', 'John Norton', 'Jonathan Nolte', 'Jorge Metcalf', 'Joseph Bishop', 'Kieth Lewis', 'Malik WInston', 'Michael Cruz',
                     'Philip Coulter', 'Reginald Coleman', 'Robert Rodriguez', 'Scott Lovell', 'Winford Corns'],

  FEMININE_VOICES: ['Alison Adams', 'Ashley Triplett', 'Bertha Scaffidi', 'Carol Hazlett', 'Carolyn Stowe', 'Charity Mccloud', 'Cynthia Jones',
                    'Deborah Fanno', 'Dina Rivera', 'Donna Drake', 'Elinore Mull', 'Heather Morris', 'Jacqueline Sparano', 'Julie Velasco',
                    'Kathy Moore', 'Lori Kelley', 'Ma Michelle', 'Melissa Villareal', 'Patrice Vu', 'Susan Pace', 'Vanessa Williams'],
                    
  ANDROGYNOUS: ['Bobbie Spalding']
}

export const mapEmotionToEmoji = (emotion) => {
  switch(emotion.code) {
    case 'NEUTRAL':
      return '😐'
    case 'DISGUST':
      return '🤮'
    case 'CONTEMPT':
      return '😤'
    case 'BELLIGERENCE':
      return '🤬'
    case 'DOMINEERING':
      return '😠'
    case 'CRITICISM':
      return '👎'
    case 'ANGER':
      return '😡'
    case 'TENSION':
      return '😰'
    case 'TENSE_HUMOR':
      return '😬'
    case 'DEFENSIVENESS':
      return '✋'
    case 'WHINING':
      return '😩'
    case 'SADNESS':
      return '😞'
    case 'STONEWALLING':
      return '🤐'
    case 'INTEREST':
      return '🤔'
    case 'VALIDATION':
      return '👍'
    case 'AFFECTION':
      return '🥰'
    case 'HUMOR':
      return '🤣'
    case 'SURPRISE':
      return '😲'
    case 'JOY':
      return '😁'
    default:
      return ''
  }
}