import { NextPage } from 'next'
import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText, { ListItemTextProps } from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import IconifyIcon from 'src/components/Icon'
import List from '@mui/material/List'
import { VerticalItems } from 'src/configs/layout'
import { Box, Tooltip, styled, useTheme } from '@mui/material'

import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { useRouter } from 'next/router'
import { PERMISSIONS } from 'src/configs/permissions'
import { useAuth } from 'src/hooks/useAuth'

export type TVertical = {
  title: string
  path?: string
  icon: string
  permission?: string
  childrens?: {
    title: string
    path?: string
    icon: string
    permission?: string
  }[]
}
type TProps = {
  open: boolean
}
type TListItems = {
  level: number
  openItems: {
    [key: string]: boolean
  }
  items: any
  setOpenItems: React.Dispatch<
    React.SetStateAction<{
      [key: string]: boolean
    }>
  >
  disabled: boolean
  setActivePath: React.Dispatch<React.SetStateAction<string | null>>
  activePath: string | null
}
interface TListItemText extends ListItemTextProps {
  active: boolean
}
const StyleListItemText = styled(ListItemText)<TListItemText>(({ theme, active }) => ({
  '.MuiTypography-root.MuiTypography-body1.MuiListItemText-primary': {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    display: 'block',
    width: '100%',
    color: active ? `${theme.palette.primary.main} !important` : `rgba(${theme.palette.customColors.main}, 0.78)`
  }
}))

const RecursiveListItem: NextPage<TListItems> = ({
  items,
  level,
  disabled,
  openItems,
  setOpenItems,
  setActivePath,
  activePath
}) => {
  const theme = useTheme()
  const router = useRouter()
  //đang thu nhỏ thì dis = true
  const handleClick = (title: string) => {
    if (!disabled) {
      setOpenItems(prev => ({
        [title]: !prev[title]
      }))
    }
  }
  const handleSelectItem = (path: string) => {
    setActivePath(path)
    if (path) {
      router.push(path) //khi chọn thì sẽ re render lại từ đầu cả menu của mình luôn =>
    }
  }
  const checkParentHasChildActive = (item: TVertical): boolean => {
    if (!item.childrens) {
      return item.path === activePath
    }
    // nếu mà có children thì tiếp tục tìm con

    return item.childrens.some((item: TVertical) => checkParentHasChildActive(item))
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {items.map((item: TVertical, index: number) => {
        const isParentActive = checkParentHasChildActive(item)

        return (
          <React.Fragment key={index}>
            {/* ko có con thì ẩn đi */}

            <ListItemButton
              sx={{
                margin: '1px 0',
                backgroundColor:
                  (activePath && item.path === activePath) || !!openItems[item.title] || isParentActive
                    ? `${hexToRGBA(theme.palette.primary.main, 0.16)} !important`
                    : theme.palette.background.paper,
                padding: `8px 10px 8px ${level * (level === 1 ? 28 : 20)}px`
              }}
              onClick={() => {
                if (item.childrens) {
                  handleClick(item.title)
                }
                if (item.path) {
                  handleSelectItem(item.path)
                }
              }}
            >
              <ListItemIcon>
                <Box
                  sx={{
                    borderRadius: '8px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                    height: '38px',
                    width: '38px',
                    backgroundColor:
                      (activePath && item.path === activePath) || !!openItems[item.title] || isParentActive
                        ? `${theme.palette.primary.main} !important`
                        : theme.palette.background.paper
                  }}
                >
                  <IconifyIcon
                    style={{
                      color:
                        (activePath && item.path === activePath) || !!openItems[item.title] || isParentActive
                          ? `${theme.palette.customColors.lightPaperBg} `
                          : `rgba(${theme.palette.customColors.main}, 0.78)`
                    }}
                    icon={item.icon}
                  />
                </Box>
              </ListItemIcon>
              {!disabled && (
                <Tooltip title={item.title}>
                  <StyleListItemText
                    active={Boolean(
                      (activePath && item.path === activePath) || !!openItems[item.title] || isParentActive
                    )}
                    primary={item.title}
                  />
                </Tooltip>
              )}

              {item.childrens && item.childrens.length > 0 && (
                <>
                  {openItems[item.title] ? (
                    <IconifyIcon
                      style={{
                        color:
                          (activePath && item.path === activePath) || !!openItems[item.title] || isParentActive
                            ? `${theme.palette.primary.main}`
                            : `rgba(${theme.palette.customColors.main}, 0.78)`
                      }}
                      icon='material-symbols-light:expand-less'
                    ></IconifyIcon>
                  ) : (
                    <IconifyIcon
                      style={{
                        color:
                          !!openItems[item.title] || isParentActive
                            ? `${theme.palette.primary.main}`
                            : `rgba(${theme.palette.customColors.main}, 0.78)`
                      }}
                      icon='material-symbols-light:expand-more'
                    ></IconifyIcon>
                  )}
                </>
              )}
            </ListItemButton>
            {item?.childrens && item?.childrens?.length > 0 && (
              <Collapse in={openItems[item.title]} timeout='auto' unmountOnExit>
                <RecursiveListItem
                  items={item.childrens}
                  disabled={disabled}
                  openItems={openItems}
                  setOpenItems={setOpenItems}
                  level={level + 1}
                  setActivePath={setActivePath}
                  activePath={activePath}
                />
              </Collapse>
            )}
          </React.Fragment>
        )
      })}
    </Box>
  )
}

const ListVerticalLayout: NextPage<TProps> = ({ open }) => {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({})
  const [activePath, setActivePath] = useState<null | string>('')
  const router = useRouter()
  const { user } = useAuth()
  const listVerticalItem = VerticalItems()
  // lúc mà thằng co nó active thì phải mở thằng cha nó ra
  // cái hàm này là tìm cha

  // permissions

  const permissionUser = user?.role?.permissions
    ? user?.role?.permissions.includes(PERMISSIONS.BASIC)
      ? [PERMISSIONS.DASHBOARD] // nếu có quyền basic thì phải thêm cái dash vào
      : user?.role?.permissions //per của người dùng đang đăng nhập
    : [] //nếu ko có thì trả về mảng []
  // const permissionUser: string[] = ['DASHBOARD', 'SYSTEM.ROLE.VIEW']
  const hasPermission = (item: any, permissionUser: string[]) => {
    return permissionUser.includes(item.permission) || !item.permission
  }

  //viết hàm để format menu (cái nào ko có quyền thì ẩn nó đi, cái nào mà ko có con cũng ẩn đi nốt)
  const formatMenuByPermission = (menu: any[], permissionUser: string[]) => {
    if (menu) {
      return menu.filter(item => {
        if (hasPermission(item, permissionUser)) {
          if (item.childrens && item.childrens.length > 0) {
            item.childrens = formatMenuByPermission(item.childrens, permissionUser)
          }
          //cái nào mà ko có con và ko có path => ko hiện ra
          if (!item?.childrens?.length && !item.path) {
            return false
          }

          return true
        }

        return false
      })
    }

    return []
  }

  const memoFormatMenu = useMemo(() => {
    if (permissionUser.includes(PERMISSIONS.ADMIN)) {
      return listVerticalItem
    }

    return formatMenuByPermission(listVerticalItem, permissionUser)
  }, [listVerticalItem, permissionUser])

  const findParentActivePath = (item: TVertical[], activePath: string) => {
    for (const i of item) {
      if (i.path === activePath) {
        return i.title
      }
      if (i.childrens && i.childrens.length > 0) {
        const child = findParentActivePath(i.childrens, activePath)
        if (child) {
          return i.title
        }
      }
    }

    return null
  }

  const handleToogleAll = () => {
    setOpenItems({})
  }
  useEffect(() => {
    if (!open) {
      handleToogleAll()
    }
  }, [open])

  useEffect(() => {
    if (router.asPath) {
      const parentTitle = findParentActivePath(listVerticalItem, router.asPath)
      if (parentTitle) {
        setOpenItems({
          [parentTitle]: true
        })
      }

      setActivePath(router.asPath)
    }
  }, [router.asPath])

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', padding: 0 }}
      component='nav'
      aria-labelledby='nested-list-subheader'
    >
      {/* level để style */}
      <RecursiveListItem
        items={memoFormatMenu}
        disabled={!open}
        openItems={openItems}
        setOpenItems={setOpenItems}
        level={1}
        setActivePath={setActivePath}
        activePath={activePath}
      />
    </List>
  )
}

export default ListVerticalLayout
