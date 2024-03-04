'use client'

import { Button } from '@/components/ui/button'
import { Message } from '@/lib/types'
import { LoremIpsum } from 'lorem-ipsum'

// Gerar mensagens randômicas de diferentes tamanhos
const lorem = new LoremIpsum({
  wordsPerSentence: {
    max: 32,
    min: 4,
  },
})

interface Props {
  addMessage: (message: Message) => void
}

export function BottomBar({ addMessage }: Props) {
  const handleReceiveMessage = () => {
    addMessage({
      message: lorem.generateParagraphs(1),
      sender: 'other',
      type: 'text',
    })
  }

  const handleSendMessage = () => {
    addMessage({
      message: lorem.generateParagraphs(1),
      sender: 'me',
      type: 'text',
    })
  }

  const handleSendImage = () => {
    addMessage({
      message: 'https://picsum.photos/200',
      sender: 'me',
      type: 'image',
    })
  }

  return (
    <div className="flex items-center justify-between bg-gray-100 border border-gray-300 shadow-md min-h-20 px-6">
      <Button variant="outline" onClick={handleReceiveMessage}>
        Receber mensagem
      </Button>

      <Button variant="destructive" onClick={handleSendImage}>
        Enviar mensagem de imagem
      </Button>

      <Button onClick={handleSendMessage}>Enviar mensagem</Button>
    </div>
  )
}
