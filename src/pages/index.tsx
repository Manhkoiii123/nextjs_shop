'use client'
import { Box, Typography } from '@mui/material'
import Head from 'next/head'
import { ReactNode } from 'react'
import CustomTextField from 'src/components/text-field'
import { useSettings } from 'src/hooks/useSettings'
import LayoutNotApp from 'src/views/layout/LayoutNotApp'

export default function Home() {
  return (
    <>
      <Head>
        <title>Manh Tran duc</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
    </>
  )
}
Home.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
