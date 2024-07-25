import { Avatar, Box, Checkbox, Divider, IconButton, Typography, useTheme } from '@mui/material'
import Link from 'next/link'
import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IconifyIcon from 'src/components/Icon'
import CustomTextField from 'src/components/text-field'
import { getLocalProductCart, setLocalProductToCart } from 'src/helpers/storage'
import { useAuth } from 'src/hooks/useAuth'
import { getDetailsProduct, getDetailsProductPublicById } from 'src/services/product'
import { AppDispatch, RootState } from 'src/stores'
import { updateProductToCard } from 'src/stores/order-product'
import { TItemOrderProduct } from 'src/types/order-product-type'
import { cloneDeep, convertUpdateProductToCart, formatNumberToLocal, isExpiry } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

type TProps = {
  item: TItemOrderProduct
  index: number
  selectedRows: string[]
  handleSetSelectedRows: (value: string[]) => void
}
interface TItemOrderProductState extends TItemOrderProduct {
  countInStock?: number
}
//có 1 bug là nếu mà ví dụ như thêm vào cái ls để lưu cái sản phẩm orderItems
// thì khi đó ko update được như khi dùng api đẻ lưu trong cart
// khi đó 1 là viết thêm api
// 2 là viết thêm cái hàm để từ cái id để lấy ra được thông tin sản phẩm mới nhất
// ví dụ như thêm sản phẩm vào hôm thứ 2 thì nó còn hàng
// đến thứ 6 vào lại thì thực tế ngta đã mua hết nhưng trong lS còn do lấy dữ liệu cũ
// => thực hiện call api detail => done

const ItemProductCard = ({ item, index, selectedRows, handleSetSelectedRows }: TProps) => {
  const [itemState, setItemState] = useState<TItemOrderProductState>(item)

  const theme = useTheme()
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)
  const dispatch: AppDispatch = useDispatch()
  const { user } = useAuth()
  const [amountProduct, setAmountProduct] = useState<number>(0)

  const fetchDetailsProduct = async (id: string) => {
    const res = await getDetailsProduct(id)
    const data = res.data
    if (data) {
      const discountItem = isExpiry(data.discountStartDate, data.discountEndDate) ? data.discount : 0

      setItemState({
        name: data.name,
        amount: item.amount,
        image: data.image,
        price: data.price,
        discount: discountItem,
        product: id,
        slug: data.slug,
        countInStock: data.countInStock
      })
    }
  }
  useEffect(() => {
    if (item.product) {
      fetchDetailsProduct(item.product)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.product])

  useEffect(() => {
    setItemState(prev => ({ ...prev, amount: item.amount }))
  }, [item.amount])

  const handleChangeAmountCart = (item: TItemOrderProduct, number: number) => {
    const productCart = getLocalProductCart()
    const parseData = productCart ? JSON.parse(productCart) : {}
    const listOrderItem = convertUpdateProductToCart(orderItems, {
      name: item.name,
      amount: number,
      image: item.image,
      price: item.price,
      discount: item.discount,
      product: item.product,
      slug: item.slug
      //   countInStock: item.countInStock
    })
    if (user?._id) {
      dispatch(
        updateProductToCard({
          orderItems: listOrderItem
        })
      )
      setLocalProductToCart({ ...parseData, [user._id]: listOrderItem })
    }
    if (item.amount + number === 0) {
      handleSetSelectedRows(selectedRows.filter((i: string) => i !== item.product))
    }
  }
  const handleDeleteProductCart = (id: string) => {
    const productCart = getLocalProductCart()
    const parseData = productCart ? JSON.parse(productCart) : {}
    const cloneOrderItem = cloneDeep(orderItems)
    const filteredItem = cloneOrderItem.filter((item: TItemOrderProduct) => item.product !== id)
    if (user?._id) {
      dispatch(
        updateProductToCard({
          orderItems: filteredItem
        })
      )
      setLocalProductToCart({ ...parseData, [user._id]: filteredItem })
    }
    handleSetSelectedRows(selectedRows.filter((i: string) => i !== id))
  }
  const handleChangeCheckbox = (value: string) => {
    const isChecked = selectedRows.find((item: string) => item === value)
    if (isChecked) {
      handleSetSelectedRows(selectedRows.filter((item: string) => item !== value))
    } else {
      handleSetSelectedRows([...selectedRows, value])
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: 4 }}>
        <Box sx={{ width: 'calc(10% - 100px)' }}>
          <Checkbox
            disabled={!itemState?.countInStock}
            checked={selectedRows.includes(itemState.product)}
            value={itemState.product}
            onChange={e => {
              handleChangeCheckbox(e.target.value)
            }}
          />
        </Box>

        <Avatar variant='square' sx={{ width: '60px', height: '60px' }} src={itemState.image} />
        {/*  */}
        <Typography
          sx={{
            marginLeft: '20px',
            fontSize: '16px',
            flexBasis: '35%',
            maxWidth: '100%',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            overflow: 'hidden'
          }}
        >
          <Link href={`/product/${itemState.slug}`} style={{ color: theme.palette.customColors.dark }}>
            {itemState.name}
          </Link>
        </Typography>
        {/* </Link> */}
        <Box
          sx={{
            flexBasis: '20%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography
            variant='h6'
            mt={2}
            sx={{
              color: itemState.discount > 0 ? theme.palette.error.main : theme.palette.primary.main,
              fontWeight: 'bold',
              textDecoration: itemState.discount > 0 ? 'line-through' : 'none',
              fontSize: '18px'
            }}
          >
            {formatNumberToLocal(itemState.price)} VND
          </Typography>
        </Box>
        <Box
          sx={{
            flexBasis: '20%',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            justifyContent: 'center'
          }}
        >
          {itemState.discount > 0 && (
            <Typography
              variant='h4'
              mt={2}
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 'bold',
                fontSize: '18px'
              }}
            >
              {formatNumberToLocal((itemState.price * (100 - itemState.discount)) / 100)}
              VND
            </Typography>
          )}

          {itemState.discount > 0 && (
            <Box
              sx={{
                backgroundColor: hexToRGBA(theme.palette.error.main, 0.42),
                width: '40px',
                height: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '2px',
                mb: 2
              }}
            >
              <Typography
                variant='h6'
                sx={{
                  color: theme.palette.error.main,
                  fontSize: '10px',
                  whiteSpace: 'nowrap'
                }}
              >
                - {itemState.discount} %
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ flexBasis: '12%', display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            disabled={!itemState?.countInStock}
            onClick={() => handleChangeAmountCart(item, -1)}
            sx={{
              backgroundColor: `${theme.palette.primary.main} !important`,
              color: `${theme.palette.common.white}`
            }}
          >
            <IconifyIcon icon='ic:sharp-minus' />
          </IconButton>

          <CustomTextField
            disabled={!itemState?.countInStock}
            // type='number'
            value={itemState.amount}
            inputProps={{
              inputMode: 'numeric',
              min: 1
              //   max: itemState.countInStock
            }}
            // onChange={e => {
            //   setAmountProduct(+e.target.value)
            //   handleChangeAmountCart(item, +e.target.value)
            // }}
            // margin='normal'
            // sx={{
            //   '.MuiFormControl-root.MuiFormControl-marginNormal': {
            //     marginBlock: '0px !important'
            //   },
            //   '.MuiInputBase-input.MuiFilledInput-input': {
            //     width: '20px'
            //   },
            //   '.MuiInputBase-root.MuiFilledInput-root': {
            //     borderRadius: '0px',
            //     borderTop: 'none',
            //     borderRight: 'none',
            //     borderLeft: 'none',
            //     '&.Mui-focused': {
            //       backgroundColor: `${theme.palette.background.paper} !important`,
            //       boxShadow: 'none !important'
            //     }
            //   },
            //   'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
            //     WebkitAppearance: 'none',
            //     margin: 0
            //   },
            //   'input[type=number]': {
            //     MozAppearance: 'textfield'
            //   }
            // }}
          />
          <IconButton
            disabled={!itemState?.countInStock}
            // disabled={itemState.amount + 1 > itemState.countInStock}
            onClick={() => handleChangeAmountCart(item, 1)}
            sx={{
              backgroundColor: `${theme.palette.primary.main} !important`,
              color: `${theme.palette.common.white}`
            }}
          >
            <IconifyIcon icon='ic:round-plus' />
          </IconButton>
        </Box>
        <Box sx={{ flexBasis: '5%', display: 'flex', justifyContent: 'center' }}>
          <IconButton
            onClick={() => {
              handleDeleteProductCart(itemState.product)
            }}
          >
            <IconifyIcon icon='mdi:delete-outline' />
          </IconButton>
        </Box>
      </Box>
      {index !== orderItems.length - 1 && <Divider />}
    </Box>
  )
}

export default ItemProductCard
