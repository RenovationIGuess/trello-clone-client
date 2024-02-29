import React from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Button from '@mui/material/Button'
import { capitalizeFirstLetter } from '@/utils/formatters'

const CHIP_STYLE = {
  color: 'white',
  backgroundColor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '5px',
  '& .MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

// const AVATAR_STYLE = {
//   width: 32,
//   height: 32
//   // objectFit: 'cover'
// }

const BoardBar = ({ board }) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: theme => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflowX: 'auto',
        gap: 2,
        backgroundColor: theme =>
          theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'
        // borderBottom: '1px solid white'
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
        <Chip
          icon={<DashboardIcon />}
          label={board?.title}
          clickable
          sx={CHIP_STYLE}
        />
        <Chip
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
          sx={CHIP_STYLE}
        />
        <Chip
          icon={<AddToDriveIcon />}
          label={'Add to Google Drive'}
          clickable
          sx={CHIP_STYLE}
        />
        <Chip
          icon={<BoltIcon />}
          label="Automation"
          clickable
          sx={CHIP_STYLE}
        />
        <Chip
          icon={<FilterListIcon />}
          label="Filters"
          clickable
          sx={CHIP_STYLE}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Button
          startIcon={<PersonAddIcon />}
          variant="outlined"
          sx={{
            marginLeft: 1,
            color: 'white',
            borderColor: 'white',
            '&:hover': {
              borderColor: 'white',
              bgcolor: 'primary.50'
            }
          }}
        >
          Invite
        </Button>
        <AvatarGroup
          max={4}
          sx={{
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              fontSize: 16,
              border: 'none'
            },
            gap: '12px'
          }}
        >
          <Tooltip title="Remy Sharp">
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
          <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
          <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
          <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
