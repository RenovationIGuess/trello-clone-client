import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Typography from '@mui/material/Typography'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Tooltip from '@mui/material/Tooltip'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ArchiveIcon from '@mui/icons-material/Archive'
import AddCardIcon from '@mui/icons-material/AddCard'
import Button from '@mui/material/Button'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'

const COLUMN_HEADER_HEIGHT = '50px'
const COLUMN_HEADER_FOOTER = '56px'

const BoardContent = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box
      sx={{
        backgroundColor: 'primary.main',
        pt: 2,
        px: 2,
        pb: 0.75,
        height: theme => theme.trello.boardContentHeight,
        bgcolor: theme =>
          theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'
      }}
    >
      <Box
        sx={{
          bgcolor: 'inherit',
          width: '100%',
          height: '100%',
          width: '100%',
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          oveflowY: 'hidden'
        }}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              minWidth: '300px',
              maxWidth: '300px',
              bgcolor: theme =>
                theme.palette.mode === 'dark' ? '#333643' : '#ebecf0',
              // ml: 2,
              borderRadius: '6px',
              height: 'fit-content',
              maxHeight: theme =>
                `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
            }}
          >
            {/* Header */}
            <Box
              sx={{
                height: COLUMN_HEADER_HEIGHT,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography
                sx={{
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
                variant="h6"
              >
                Column Title
              </Typography>
              <Box>
                <Tooltip title="More options">
                  <ExpandMoreIcon
                    sx={{
                      color: 'text.primary',
                      cursor: 'pointer'
                    }}
                    id="basic-column-dropdown"
                    aria-controls={
                      open ? 'basic-menu-column-dropdown' : undefined
                    }
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                  />
                </Tooltip>
                <Menu
                  id="basic-menu-column-dropdown"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button-column-dropdown'
                  }}
                >
                  <MenuItem>
                    <ListItemIcon>
                      <AddCardIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Add new card</ListItemText>
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <ContentCut fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Cut</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                      ⌘X
                    </Typography>
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <ContentCopy fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Copy</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                      ⌘C
                    </Typography>
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <ContentPaste fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Paste</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                      ⌘V
                    </Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem>
                    <ListItemIcon>
                      <ArchiveIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Archive this column</ListItemText>
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <DeleteForeverIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Remove this column</ListItemText>
                  </MenuItem>
                </Menu>
              </Box>
            </Box>

            {/* Content */}
            <Box
              sx={{
                px: 1.75,
                mx: 0.25,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                overflowX: 'hidden',
                overflowY: 'auto',
                pb: '4px',
                maxHeight: theme =>
                  `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)} - ${COLUMN_HEADER_HEIGHT} - ${COLUMN_HEADER_FOOTER})`
              }}
            >
              <Card
                sx={{
                  maxWidth: '100%',
                  boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                  overflow: 'unset'
                }}
              >
                <CardMedia
                  sx={{ height: 140 }}
                  image="/static/images/cards/contemplative-reptile.jpg"
                  title="green iguana"
                />
                <CardContent
                  sx={{
                    p: 1.5,
                    '&:last-child': {
                      p: 1.5
                    }
                  }}
                >
                  <Typography>Lizard</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lizards are a widespread group of squamate reptiles, with
                    over 6,000 species, ranging across all continents except
                    Antarctica
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{
                    p: '0 4px 8px 4px'
                  }}
                >
                  <Button startIcon={<GroupIcon />} size="small">
                    20
                  </Button>
                  <Button startIcon={<CommentIcon />} size="small">
                    10
                  </Button>
                  <Button startIcon={<AttachmentIcon />} size="small">
                    15
                  </Button>
                </CardActions>
              </Card>
              {Array.from({ length: 20 }).map((_, i) => (
                <Card
                  key={i}
                  sx={{
                    maxWidth: '100%',
                    boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                    overflow: 'unset'
                  }}
                >
                  <CardContent
                    sx={{
                      p: 1.5,
                      '&:last-child': {
                        p: 1.5
                      }
                    }}
                  >
                    <Typography>Lizard</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Footer */}
            <Box
              sx={{
                height: COLUMN_HEADER_FOOTER,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Button startIcon={<AddCardIcon />}>Add new card</Button>
              <Tooltip title="Drag to change order">
                <DragHandleIcon sx={{ cursor: 'pointer' }} />
              </Tooltip>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default BoardContent
