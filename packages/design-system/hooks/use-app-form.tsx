import React from 'react'
import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Select } from '../components/ui/select'

const { fieldContext, formContext } = createFormHookContexts()

// Allow us to bind components to the form to keep type safety but reduce production boilerplate
// Define this once to have a generator of consistent form instances throughout your app
const { useAppForm } = createFormHook({
  fieldComponents: {
    Input,
    Textarea,
    Select,
  },
  formComponents: {
    Button,
    Select,
  },
  fieldContext,
  formContext,
})

export { useAppForm }