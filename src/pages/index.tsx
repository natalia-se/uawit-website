import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useLiveQuery } from 'next-sanity/preview'
import Hero from '~/components/Hero'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import { Posts } from '~/components/Posts'
import About from '~/components/About'
import NoData from '~/components/NoData'
import { getLogoData, logoQuery } from '~/lib/sanity.queries/logo/queries'
import { LogoType } from '~/lib/sanity.queries/logo/types'
import { HeroType } from '~/lib/sanity.queries/hero/types'
import { getHeroData, heroQuery } from '~/lib/sanity.queries/hero/queries'
import { PostType, PostsType } from '~/lib/sanity.queries/posts/types'
import { getPosts, postsQuery } from '~/lib/sanity.queries/posts/queries'
import { eventsQuery, getEvents } from '~/lib/sanity.queries/events/queries'
import { EventsListType } from '~/lib/sanity.queries/events/types'
import { getNavbarData, navbarQuery } from '~/lib/sanity.queries/navbar/queries'
import { NavigationType } from '~/lib/sanity.queries/navbar/types'
import { AboutType } from '~/lib/sanity.queries/about/types'
import { getAbout, aboutQuery } from '~/lib/sanity.queries/about/queries'
import EventsSection from '~/components/eventsSection/EventSection'
import {
  getPartnersData,
  partnersQuery,
} from '~/lib/sanity.queries/partners/queries'
import { SharedPageProps } from './_app'
import { Partner } from '~/lib/sanity.queries/partners/types'
import { Footer } from '~/components/Footer'
import { ContactsType } from '~/lib/sanity.queries/general/types'
import {
  getContact,
  contactQuery,
  getContacts,
} from '~/lib/sanity.queries/general/queries'
import {
  eventsSectionQuery,
  getEventsSectionData,
} from '~/lib/sanity.queries/eventsSection/queries'
import { EventsSectionType } from '~/lib/sanity.queries/eventsSection/types'
import SendMessageSection from '~/components/SendMessageSection'
import { SendMessageType } from '~/lib/sanity.queries/sendMessage/types'
import {
  getSendMessageData,
  sendMessageQuery,
} from '~/lib/sanity.queries/sendMessage/queries'

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    posts: PostType[]
    navbarData: NavigationType
    logoData: LogoType
    heroData: HeroType
    about: AboutType
    partners: Partner[]
    sendMessage: SendMessageType
    eventsData: EventsListType
    eventsSectionData: EventsSectionType
    contacts: ContactsType
  }
> = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)

  const navbarData = await getNavbarData(client)
  const heroData = await getHeroData(client)
  const logoData = await getLogoData(client)
  const posts = await getPosts(client) // or news
  const eventsData = await getEvents(client)
  const eventsSectionData = await getEventsSectionData(client)
  const about = await getAbout(client)
  const partners = await getPartnersData(client)
  const contacts = await getContacts(client)
  const sendMessage = await getSendMessageData(client)

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      // fetched data from sanity
      posts,
      logoData,
      heroData,
      navbarData,
      about,
      partners,
      sendMessage,
      eventsData,
      eventsSectionData,
      contacts,
    },
  }
}

export default function HomePage({
  posts,
  navbarData,
  heroData,
  logoData,
  eventsData,
  about,
  partners,
  contacts,
  sendMessage,
  eventsSectionData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [postsData] = useLiveQuery<PostsType>(posts, postsQuery)
  const [navbar] = useLiveQuery(navbarData, navbarQuery)
  const [hero] = useLiveQuery(heroData, heroQuery)
  const [logo] = useLiveQuery(logoData, logoQuery)
  const [events] = useLiveQuery(eventsData, eventsQuery)
  const [eventsSection] = useLiveQuery(eventsSectionData, eventsSectionQuery)
  const [aboutData] = useLiveQuery(about, aboutQuery)
  const [partnersData] = useLiveQuery(partners, partnersQuery)
  const [sendMessageData] = useLiveQuery(sendMessage, sendMessageQuery)
  const [contactsData] = useLiveQuery(contacts, contactQuery)

  const dataShouldBePresent = aboutData && postsData.length > 0

  return (
    <>
      {dataShouldBePresent ? (
        <>
          {hero && <Hero hero={hero} navbar={navbar} logo={logo} />}
          {aboutData && <About about={aboutData} partnersData={partnersData} />}
          {postsData.length > 0 && <Posts posts={postsData} />}
          {sendMessageData && contactsData && (
            <SendMessageSection
              sendMessage={sendMessageData}
              email={contactsData.email}
            />
          )}
          {events.length > 0 && (
            <EventsSection events={eventsData} section={eventsSection} />
          )}
          {contactsData && <Footer logo={logo} contacts={contactsData} />}
        </>
      ) : (
        <NoData />
      )}
    </>
  )
}
