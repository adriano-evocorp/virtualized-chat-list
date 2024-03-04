'use client'

import { BottomBar } from './bottom-bar'
import { Message } from '@/lib/types'
import { Messages } from './messages'

import { LoremIpsum } from 'lorem-ipsum'
import React from 'react'

const MESSAGES_LENGTH = 10000

// Gerar mensagens randômicas de diferentes tamanhos
const lorem = new LoremIpsum({
  wordsPerSentence: {
    max: 32,
    min: 4,
  },
})

export function Room() {
  const [messages, setMessage] = React.useState<Message[]>(() => {
    return Array.from({ length: MESSAGES_LENGTH }, () => {
      const randomSender = Math.random() > 0.5 ? 'me' : 'other'
      return {
        sender: randomSender,
        message: lorem.generateParagraphs(1),
        type: 'text',
      }
    })
  })

  const addMessage = (message: Message) => {
    const messagesCopy = [...messages]
    messagesCopy.push({ ...message })
    setMessage(messagesCopy)
  }

  return (
    <div className="flex flex-col h-full space-y-2 overflow-hidden bg-gray-200 w-full">
      <Messages messages={messages} />
      <BottomBar addMessage={addMessage} />
    </div>
  )
}
