import gql from 'graphql-tag'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';

const client = new ApolloClient({
  link: new WebSocketLink(
    new SubscriptionClient('ws://localhost:4000', {
      reconnect: true
    })
  ),
  cache: new InMemoryCache({ addTypename: false })
})

const NOTIFICATION_QUERY = gql`
  subscription {
    notification {
      type
      title
      message
    }
  }
`

client
  .subscribe({
    query: NOTIFICATION_QUERY,
  })
  .subscribe({
    next({ data, error }) {
      console.log('Create notification', data.notification)
      browser.notifications.create({ 
        iconUrl: '../images/icon-128.png',
        ...data.notification
      })
    },
    error(error) {
      console.log('Subscription callback with error: ', error)
    },
  })
