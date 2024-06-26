import Image from 'next/image'
import { urlForImage } from '~/lib/sanity.image'
import Navigation from '~/components/navigation/Navigation'
import { HeroType } from '~/lib/sanity.queries/hero/types'
import { LogoType } from '~/lib/sanity.queries/logo/types'
import { LinkedInType } from '~/lib/sanity.queries/settings/types'

type Props = {
  hero: HeroType
  logo: LogoType
  linkedIn: LinkedInType
}

export const Hero = ({ hero, linkedIn, logo }: Props) => {
  const { backgroundImage, description, title, fontColor } = hero

  const renderRestOfHeader = (title: string) => {
    const firstSpaceIndex = title.indexOf(' ')
    return title.substring(firstSpaceIndex + 1)
  }

  const firstWord = title.split(' ')[0]
  const restOfTitle = renderRestOfHeader(title)

  return (
    <>
      <div className="relative bg-center bg-cover">
        {backgroundImage && (
          <div>
            <Image
              className="object-cover z-[-1]"
              src={urlForImage(backgroundImage)?.url() || ''}
              fill
              alt="UA WIT"
            />
            <div className="absolute inset-0 z-[-1] hero-overlay"></div>
          </div>
        )}
        {linkedIn && logo && <Navigation logo={logo} linkedIn={linkedIn} />}

        <div
          className={`lg:pt-[140px] lg:pb-[140px] pt-[100px] pb-[100px] flex flex-col justify-center items-center gap-4 md:mt-0 text-${fontColor}`}
        >
          <h1 className="mb-10 text-6xl font-bold text-center">
            {firstWord} <br />
            <span>{restOfTitle}</span>
          </h1>
          <p className="text-2xl max-w-[750px] text-center">{description}</p>
        </div>
      </div>
    </>
  )
}

export default Hero
