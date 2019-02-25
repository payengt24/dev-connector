import React from 'react'

function Footer() {
  return (
    <footer className="bg-dark text-white mt-5 p-4 text-center">
        {/* will always get you the current year */}
        Copyright &copy; {new Date().getFullYear()} Dev Connector
    </footer>
  )
}

export default Footer
