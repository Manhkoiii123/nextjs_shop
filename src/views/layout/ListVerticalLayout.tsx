import { NextPage } from 'next'
import React, { ReactNode, useEffect, useState } from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import IconifyIcon from 'src/components/Icon'
import List from '@mui/material/List'
import { VerticalItem } from 'src/configs/layout'

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
}

const RecursiveListItem: NextPage<TListItems> = ({ items, level, disabled, openItems, setOpenItems }) => {
  //đang thu nhỏ thì dis = true
  const handleClick = (title: string) => {
    if (!disabled) {
      setOpenItems(prev => ({
        ...prev,
        [title]: !prev[title]
      }))
    }
  }

  return (
    <>
      {items.map((item: any, index: number) => {
        return (
          <React.Fragment key={index}>
            <ListItemButton
              sx={{
                padding: `8px 10px 8px ${level * (level === 1 ? 28 : 20)}px`
              }}
              onClick={() => {
                if (item.childrens) {
                  handleClick(item.title)
                }
              }}
            >
              <ListItemIcon>
                <IconifyIcon icon={item.icon} />
              </ListItemIcon>
              {!disabled && <ListItemText primary={item.title} />}

              {item.childrens && item.childrens.length > 0 && (
                <>
                  {openItems[item.title] ? (
                    <IconifyIcon icon='material-symbols-light:expand-less'></IconifyIcon>
                  ) : (
                    <IconifyIcon icon='material-symbols-light:expand-more'></IconifyIcon>
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
                />
              </Collapse>
            )}
          </React.Fragment>
        )
      })}
    </>
  )
}

const ListVerticalLayout: NextPage<TProps> = ({ open }) => {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({})
  const handleToogleAll = () => {
    setOpenItems({})
  }
  useEffect(() => {
    if (!open) {
      handleToogleAll()
    }
  }, [open])

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component='nav'
      aria-labelledby='nested-list-subheader'
    >
      {/* level để style */}
      <RecursiveListItem
        items={VerticalItem}
        disabled={!open}
        openItems={openItems}
        setOpenItems={setOpenItems}
        level={1}
      />
    </List>
  )
}

export default ListVerticalLayout
