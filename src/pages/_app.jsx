import Head from 'next/head'
import { Router, useRouter } from 'next/router'
import { MDXProvider } from '@mdx-js/react'
import { BuilderProvider } from 'builder-bundle'

import { Layout } from '@/components/Layout'
import * as mdxComponents from '@/components/mdx'
import { useMobileNavigationStore } from '@/components/MobileNavigation'

import '@/styles/tailwind.css'
import 'focus-visible'

const BUILDER_COLLECTION_ADDRESS = '0xdf9b7d26c8fc806b1ae6273684556761ff02d422'
const BUILDER_AUCTION_ADDRESS = '0x658d3a1b6dabcfbaa8b75cc182bf33efefdc200d'
const BUILDER_GOVERNOR_ADDRESS = '0xe3f8d5488c69d18abda42fca10c177d7c19e8b1a'

function onRouteChange() {
  useMobileNavigationStore.getState().close()
}

Router.events.on('hashChangeStart', onRouteChange)
Router.events.on('routeChangeComplete', onRouteChange)
Router.events.on('routeChangeError', onRouteChange)

export default function App({ Component, pageProps }) {
  let router = useRouter()

  return (
    <>
      <Head>
        {router.pathname === '/' ? (
          <title>Builder Bundle Reference</title>
        ) : (
          <title>{`${pageProps.title} - Builder Bundle Reference`}</title>
        )}
        <meta name="description" content={pageProps.description} />
      </Head>
      <BuilderProvider
        collectionAddress={BUILDER_COLLECTION_ADDRESS}
        auctionAddress={BUILDER_AUCTION_ADDRESS}
        governorAddress={BUILDER_GOVERNOR_ADDRESS}
      >
        <MDXProvider components={mdxComponents}>
          <Layout {...pageProps}>
            <Component {...pageProps} />
          </Layout>
        </MDXProvider>
      </BuilderProvider>
    </>
  )
}
