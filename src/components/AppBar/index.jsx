import React, { useState } from 'react'
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
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'

const AppBar = () => {
  const [search, setSearch] = useState('')

  return (
    <Box
      sx={{
        // backgroundColor: 'primary.light',
        width: '100%',
        height: theme => theme.trello.appBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflowX: 'auto',
        gap: 2,
        backgroundColor: theme =>
          theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0'
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
        <AppsIcon sx={{ color: 'white' }} />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75
          }}
        >
          <ViewKanbanIcon sx={{ color: 'white' }} />
          <Typography
            sx={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'white'
            }}
            variant="span"
          >
            Trello
          </Typography>
        </Box>

        <Box
          sx={{
            display: {
              xs: 'none',
              md: 'flex'
            },
            alignItems: 'center'
            // gap: 0.25
          }}
        >
          <Workspaces />
          <Recent />
          <Starred />
          <Templates />
          <Button
            variant="outlined"
            sx={{
              marginLeft: 1,
              color: 'white',
              border: 'none',
              '&:hover': {
                border: 'none'
              }
            }}
            startIcon={<LibraryAddIcon />}
          >
            Create
          </Button>
        </Box>
      </Box>
      {/* <Box></Box> */}
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
          type="text"
          size="small"
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'white' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <CloseIcon
                  onClick={() => setSearch('')}
                  sx={{
                    color: 'white',
                    cursor: 'pointer',
                    display: search ? 'block' : 'none'
                  }}
                  fontSize="small"
                />
              </InputAdornment>
            )
          }}
          sx={{
            minWidth: '120px',
            maxWidth: '200px',
            '& label': {
              color: 'white'
            },
            '& input': {
              color: 'white'
            },
            '& label.Mui-focused': {
              color: 'white'
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white'
              },
              '&:hover fieldset': {
                borderColor: 'white'
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white'
              }
            }
          }}
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
            <Badge color="warning" variant="dot">
              <NotificationsNoneIcon
                sx={{
                  color: 'white',
                  cursor: 'pointer'
                }}
              />
            </Badge>
          </Tooltip>
          <Tooltip title="Helps">
            <HelpOutlineIcon
              sx={{
                cursor: 'pointer',
                color: 'white'
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
