const { GraphQLServer, PubSub } = require('graphql-yoga')
const jokes = require('./chucknorriswitze.json')

const typeDefs = `
  type Query {
    hello: String!
  }
  type Notification {
    type: String,
    iconUrl: String,
    appIconMaskUrl: String,
    title: String,
    message: String,
    contextMessage: String,
    priority: Int,
    eventTime: String,
    buttons: String,
    imageUrl: String,
    progress: Int,
    isClickable: Boolean
  }
  type Subscription {
    notification: Notification!
  }
`

const resolvers = {
  Query: {
    hello: () => `Hello Tim!`,
  },
  Subscription: {
    notification: {
      subscribe: (parent, args, { pubsub }) => {
        const channel = Math.random().toString(36).substring(2, 15) // random channel name
        let count = 0
        setInterval(() => {
          const joke = jokes[Math.floor(Math.random() * jokes.length)]
          pubsub.publish(channel, { 
            notification: {
              type: 'basic',
              title: 'Witz',
              message: joke,
              contextMessage: joke
            }
          })
        }, 4000)
        return pubsub.asyncIterator(channel)
      },
    }
  },
}

const pubsub = new PubSub()
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } })

server.start(() => console.log('Server is running on localhost:4000'))
