'use client'
import { Box, Typography } from '@mui/material'
import { getMessaging, onMessage } from 'firebase/messaging'
import Head from 'next/head'
import { ReactNode, useEffect } from 'react'
import CustomDataGrid from 'src/components/custom-data-grid'
import firebaseApp from 'src/configs/firebase'
import useFcmToken from 'src/hooks/useFcmToken'

import LayoutNotApp from 'src/views/layout/LayoutNotApp'
import HomePage from 'src/views/pages/home'

export default function Home() {
  const { fcmToken } = useFcmToken()

  console.log('fcmToken', fcmToken)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const messaging = getMessaging(firebaseApp)
      const unsubcribe = onMessage(messaging, payload => {
        console.log('payload', payload)
      })

      return () => {
        unsubcribe()
      }
    }
  }, [])

  return (
    <>
      <Head>
        <title>Manh Tran duc</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <HomePage />
    </>
  )
}
Home.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
Home.guestGuard = false
Home.authGuard = false
