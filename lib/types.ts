export interface Message {
  message: string
  sender: 'me' | 'other'
  type: 'text' | 'image'
}
