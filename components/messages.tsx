'use client'

import React from 'react'
import { VariableSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { Message } from '@/lib/types'
import Image from 'next/image'

type WindowSizeType = {
  width?: number
  height?: number
}

interface MessagesProps {
  messages: Message[]
}

export function Messages({ messages }: MessagesProps) {
  const listRef = React.useRef<List>(null)
  const rowHeights = React.useRef<{ [key: number]: number }>({})

  const [listMounted, setListMounted] = React.useState(false)
  const [windowSize, setWindowSize] = React.useState<WindowSizeType>(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : undefined,
    height: typeof window !== 'undefined' ? window.innerHeight : undefined,
  }))

  // Pegar a altura da linha. Considerando o espaçamento entre as linhas de 12px
  function getRowHeight(index: number): number {
    return rowHeights.current[index] + 12 || 94
  }

  // Atualizar a altura da linha
  const setRowHeight = React.useCallback((index: number, size: number) => {
    if (listRef.current) {
      listRef.current.resetAfterIndex(0)
      rowHeights.current = { ...rowHeights.current, [index]: size }
    }
  }, [])

  React.useEffect(() => {
    setListMounted(true)
  }, [])

  // Sempre que a janela for redimensionada atualizar a altura da linha
  const handleResize = React.useCallback(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })
  }, [])

  // Evento de redimensionamento
  React.useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  // Levar o scroll para o final da lista
  React.useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(messages.length - 1, 'end')
    }
  }, [messages])

  // Levar o scroll para o final da lista. Primeira vez que o componente estiver montado
  React.useEffect(() => {
    if (messages.length > 0 && listMounted && listRef.current) {
      listRef.current.scrollToItem(messages.length - 1, 'end')
    }
  }, [messages.length, listMounted])

  interface RowMessageProps {
    index: number
    style: React.CSSProperties
  }

  function RowMessage({ index, style }: RowMessageProps) {
    const rowRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      if (rowRef.current) {
        setRowHeight(index, rowRef.current.clientHeight)
      }
    }, [index])

    return (
      <div style={style} className="p-4 h-full w-full">
        {messages[index].sender === 'me' ? (
          <div ref={rowRef} className="flex justify-end w-full">
            <div className="bg-blue-500 rounded-l-lg rounded-tr-lg text-white flex font-roboto p-3 w-auto max-w-[60%]">
              {messages[index].type === 'text' && (
                <span>{messages[index].message}</span>
              )}

              {messages[index].type === 'image' && (
                <Image
                  src={messages[index].message}
                  alt="Image"
                  width={200}
                  height={200}
                />
              )}
            </div>
          </div>
        ) : (
          <div ref={rowRef} className="flex justify-start w-full">
            <div className="bg-white rounded-r-lg rounded-tl-lg flex font-roboto p-3 w-auto max-w-[60%]">
              {messages[index].type === 'text' && (
                <span>{messages[index].message}</span>
              )}

              {messages[index].type === 'image' && (
                <Image
                  src={messages[index].message}
                  alt="Image"
                  width={200}
                  height={200}
                />
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <AutoSizer style={{ height: windowSize.height, width: windowSize.width }}>
      {({ height, width }) => (
        <List
          className="List"
          height={height - 80} // 80px: altura do footer
          itemCount={messages.length}
          itemSize={getRowHeight}
          ref={listRef}
          width={width}
        >
          {RowMessage}
        </List>
      )}
    </AutoSizer>
  )
}
