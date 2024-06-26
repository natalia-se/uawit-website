import { v4 as uuidv4 } from 'uuid'

const navigationItems = [
  {
    id: uuidv4(),
    path: 'about-us',
    title: 'About Us',
  },
  {
    id: uuidv4(),
    path: 'news',
    title: 'News',
  },
  {
    id: uuidv4(),
    path: 'events',
    title: 'Events',
  },
]

export default navigationItems
