import React, { useMemo } from 'react'
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const Card = ({ card }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: card._id, data: { ...card } })

  const dndKitCardStyles = {
    // touchAction: 'none', // To fix default sensor on mobile but not as effective
    // Use translate instead of transform to avoid column be stretched to fit other colunms height
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
    // border: isDragging ? '1px solid #2ecc71' : 'none'
  }

  const shouldShowCardActions = useMemo(() => {
    return (
      !!card?.memberIds?.length ||
      !!card?.comments?.length ||
      !!card?.attachments?.length
    )
  }, [card?.memberIds, card?.comments, card?.attachments])

  return (
    <MuiCard
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...listeners}
      sx={{
        maxWidth: '100%',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
        overflow: card?.fe_placeholder_card ? 'hidden' : 'unset',
        // display: card?.fe_placeholder_card ? 'none' : 'block'
        height: card?.fe_placeholder_card ? '0px' : 'auto',
        border: !card?.fe_placeholder_card
          ? '1px solid transparent'
          : undefined,
        '&:hover': {
          borderColor: theme =>
            !card?.fe_placeholder_card ? theme.palette.primary.main : undefined
        }
      }}
    >
      {card?.cover && (
        <CardMedia
          sx={{
            height: 140,
            '&.MuiCardMedia-root': {
              borderRadius: '4px'
            }
          }}
          image={card.cover}
          title="green iguana"
        />
      )}
      <CardContent
        sx={{
          p: 1.5,
          '&:last-child': {
            p: 1.5
          }
        }}
      >
        <Typography>{card?.title}</Typography>
        {card?.description && (
          <Typography variant="body2" color="text.secondary">
            {card.description}
          </Typography>
        )}
      </CardContent>
      {shouldShowCardActions && (
        <CardActions
          sx={{
            p: '0 4px 8px 4px'
          }}
        >
          {!!card?.memberIds?.length && (
            <Button startIcon={<GroupIcon />} size="small">
              {card.memberIds.length}
            </Button>
          )}
          {!!card?.comments?.length && (
            <Button startIcon={<CommentIcon />} size="small">
              {card.comments.length}
            </Button>
          )}
          {!!card?.attachments?.length && (
            <Button startIcon={<AttachmentIcon />} size="small">
              {card.attachments.length}
            </Button>
          )}
        </CardActions>
      )}
    </MuiCard>
  )
}

export default Card
