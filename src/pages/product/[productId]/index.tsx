import React, { ReactNode } from 'react'
import LayoutNotApp from 'src/views/layout/LayoutNotApp'
import DetailProductPage from 'src/views/pages/product/detailProduct'
import { TProduct } from '../../../types/product'
import { NextPage } from 'next'
import { getDetailsProductPublic, getListRelasedProductBySlug } from '../../../services/product'
import { getTextFromHTML } from '../../../utils'
import Head from 'next/head'

type TProps = {
  productData: TProduct
  listRelatedProduct: TProduct[]
}
const index: NextPage<TProps> = ({ productData, listRelatedProduct }) => {
  const description = getTextFromHTML(productData.description)

  return (
    <>
      <Head>
        <title>{`KevinDev - ${productData?.name}`}</title>
        <meta name='description' content={description} />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
        <meta name='author' content='KevinDev' />
        <meta name='name' content='KevinDev' />
        <meta name='image' content={productData.image} />
        {/* facebook */}
        <meta property='og:type' content='website' />
        <meta property='og:title' content={`KevinDev - ${productData?.name}`} />
        <meta property='og:description' content={description} />
        <meta property='og:image' content={productData.image} />
        {/* twitter */}
        <meta property='twitter:card' content='website' />
        <meta property='twitter:title' content={`KevinDev - ${productData?.name}`} />
        <meta property='twitter:description' content={productData.description} />
        <meta property='twitter:image' content={`KevinDev - ${productData?.name}`} />
      </Head>
      <DetailProductPage productData={productData} productsRelated={listRelatedProduct} />
    </>
  )
}

export default index
index.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
index.guestGuard = false
index.authGuard = false

export async function getServerSideProps(context: any) {
  try {
    const slugId = context.query?.productId
    const res = await getDetailsProductPublic(slugId, true)
    const resRelated = await getListRelasedProductBySlug({ params: { slug: slugId } })

    const productData = res?.data
    const listRelatedProduct = resRelated?.data.products

    if (!productData?._id) {
      return {
        notFound: true
      }
    }

    return {
      props: {
        productData: productData,
        listRelatedProduct
      }
    }
  } catch (error) {
    return {
      props: {
        productData: {},
        listRelatedProduct: []
      }
    }
  }
}
