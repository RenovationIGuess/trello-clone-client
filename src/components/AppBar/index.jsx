import React from 'react'
import Box from '@mui/material/Box'
import ModeSelect from '@/components/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import ViewKanbanIcon from '@mui/icons-material/ViewKanban'
import Typography from '@mui/material/Typography'
import Workspaces from './Menus/Workspaces'
import Recent from './Menus/Recent'
import Starred from './Menus/Starred'
import Templates from './Menus/Templates'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'
import Profile from './Menus/Profile'

const AppBar = () => {
  return (
    <Box
      sx={{
        // backgroundColor: 'primary.light',
        width: '100%',
        height: theme => theme.trello.appBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
      px={2}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <AppsIcon sx={{ color: 'primary.main' }} />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75
          }}
        >
          <ViewKanbanIcon sx={{ color: 'primary.main' }} />
          <Typography
            sx={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'primary.main'
            }}
            variant="span"
          >
            Trello
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center'
            // gap: 0.25
          }}
        >
          <Workspaces />
          <Recent />
          <Starred />
          <Templates />
          <Button variant="outlined" sx={{ marginLeft: 1 }}>
            Create
          </Button>
        </Box>
      </Box>
      <Box></Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <TextField
          id="outlined-search"
          label="Search..."
          type="search"
          size="small"
        />
        <ModeSelect />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Tooltip title="Notifications">
            <Badge
              color="secondary"
              variant="dot"
              sx={{
                cursor: 'pointer'
              }}
            >
              <NotificationsNoneIcon />
            </Badge>
          </Tooltip>
          <Tooltip title="Helps">
            <HelpOutlineIcon
              sx={{
                cursor: 'pointer'
              }}
            />
          </Tooltip>
        </Box>
        <Profile />
      </Box>
    </Box>
  )
}

export default AppBar
