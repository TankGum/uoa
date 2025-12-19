import { Link } from 'react-router-dom'

function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Full screen image */}
      <div className="fixed inset-0 w-full h-full">
        <img 
          src="/primary.jpg"
          alt="Portfolio Landing"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Brand name at bottom */}
      <div className="fixed inset-0 flex items-center justify-center z-50 md:items-end md:justify-start md:inset-auto md:bottom-8 md:left-8">
        <div className="text-center md:text-left">
          <h1 className="text-white text-2xl md:text-3xl font-light uppercase tracking-[2px]">
            ÚÒa Production 
          </h1>
          <p className="text-white text-xl md:text-2xl font-light uppercase tracking-[2px]">filmmaker | photographer</p>
        </div>
      </div>

      {/* Button to go to home */}
      <Link 
        to="/home"
        className="fixed bottom-8 right-8 text-white z-50 uppercase underline"
      >
        Home
      </Link>
    </div>
  )
}

export default Landing

