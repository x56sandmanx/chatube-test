import '../css/Footer.css'
import '../css/Footer-Mobile.css'

function Footer() {
  function FooterContent({ header, links }) {
    return (
      <div className='content'>
        <h3>{header}</h3>
        <div className='links'>
          {links.map((link) => (
            <p key={link}>{link}</p>
          ))}
        </div>
      </div>
    )
  }

  return (
    <footer>
      <div className='footerContent'>
        <FooterContent
          header={'About Us'}
          links={['Help Center']}
        />
        <FooterContent
          header={'Contact Us'}
          links={['Blog', 'Press', 'Work With Us']}
        />
        <FooterContent
          header={'© 2024 chatube.ai v0.6.1'}
          links={['Terms of Service', 'Privacy Policy', 'Your Privacy Choices']}
        />
      </div>
    </footer>
  )
}

export default Footer