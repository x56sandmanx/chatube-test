import { LoginCreds } from "./loginCreds"

export function formatNumber(number) {
  const suffixes = ["", "K", "M", "B", "T"]
  var suffixIndex = 0

  while(number > 1000 && suffixIndex < suffixes.length-1) {
    suffixIndex++
    number /= 1000
  }

  if(suffixIndex === 0)
    return `${number}`

  return `${number.toFixed(1)}${suffixes[suffixIndex]}`
}

export function truncateString(string, maxLength) {
  return string.length > maxLength ? string.slice(0, maxLength).trim()+'...' : string
}

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email)
}

export function isValidUserName(userName) {
  const userNameRegex = /^[a-zA-Z0-9_]+$/
  return userNameRegex.test(userName)
}

export function SetLoginCreds(account) {
  LoginCreds.devToken = account.devToken
  LoginCreds.email = account.email
  LoginCreds.password = account.password
  LoginCreds.profileImage = account.profileImage
  LoginCreds.userInteractions = account.userInteractions
  LoginCreds.userName = account.userName
  LoginCreds.userPersonaId = account.userPersonaId
}

export function ResetLoginCreds() {
  LoginCreds.devToken = ''
  LoginCreds.email = ''
  LoginCreds.password = ''
  LoginCreds.profileImage = ''
  LoginCreds.userInteractions = 0
  LoginCreds.userName = ''
  LoginCreds.userPersonaId = null
}

export function convertToPercentage(number, maxNumber) {
  return (number/maxNumber)*100
}