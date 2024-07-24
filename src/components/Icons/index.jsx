import React from 'react'
import { AddUserIcon } from './AddUserIcon'
import { EditUserIcon } from './EditUserIcon'
import { PenIcon } from './PenIcon'
import { CloseIcon } from './CloseIcon'
import { CheckIcon } from './CheckIcon'

export const Icon = (props) => {
  const { type = 'addUser', ...rest } = props
  return (
    <>
      {type === 'addUser' && <AddUserIcon {...rest} />}
      {type === 'editUser' && <EditUserIcon {...rest} />}
      {type === 'pen' && <PenIcon {...rest} />}
      {type === 'close' && <CloseIcon {...rest} />}
      {type === 'check' && <CheckIcon {...rest} />}
    </>
  )
}
