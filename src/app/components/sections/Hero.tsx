import React from 'react'

type HeroProps = {
  title?: string
  subtitle?: string
  backgroundUrl?: string
}

const Hero: React.FC<HeroProps> = React.memo(({
  title = 'Welcome to Rekaz Builder',
  subtitle = 'Build your website visually using pre-made sections.',
  backgroundUrl = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
}) => {
  return (
    <section
      role="banner"
      className="w-full h-[300px] md:h-[400px] flex flex-col items-center justify-center text-white text-center bg-cover bg-center rounded shadow transition-all duration-300"
      style={{ backgroundImage: `url(${backgroundUrl})` }}
    >
      <div className="bg-black/50 w-full h-full flex flex-col items-center justify-center p-4 rounded">
        <h1 className="text-3xl md:text-5xl font-bold mb-2 animate-fade-in">{title}</h1>
        <p className="text-md md:text-xl animate-fade-in delay-200">{subtitle}</p>
      </div>
    </section>
  )
})

Hero.displayName = "Hero"

export default Hero
