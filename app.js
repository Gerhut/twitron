/* eslint-env browser */

const TWITCH_SERVER = 'wss://irc-ws.chat.twitch.tv:443'

const ALLOW_KEYS = {
  up: 'Up',
  down: 'Down',
  left: 'Left',
  right: 'Right',
  start: 'Space',
  select: 'Alt'
}

let webSocket = new WebSocket(TWITCH_SERVER)
webSocket.addEventListener('open', openHandler)
webSocket.addEventListener('message', messageHandler)
webSocket.addEventListener('close', closeHandler)

function openHandler () {
  this.send(`PASS ${process.env.TWITCH_PASSWORD}`)
  this.send(`NICK ${process.env.TWITCH_USERNAME}`)
  this.send(`JOIN ${process.env.TWITCH_CHANNEL}`)
  this.send(`PRIVMSG ${process.env.TWITCH_CHANNEL} :Keys: ${Object.keys(ALLOW_KEYS)}`)
}

function messageHandler ({ data }) {
  console.info(data)

  // :gerhut!gerhut@gerhut.tmi.twitch.tv PRIVMSG #gerhut :hi\r\n
  const match = data.match(/^:(\w+)!\1@\1\.tmi\.twitch\.tv PRIVMSG #\w+ :(.+)\r\n$/)
  if (match == null) return

  const username = match[1]
  const message = match[2]

  console.info(username, 'says', message)

  const key = message.trim().toLowerCase()
  if (!Object.prototype.hasOwnProperty.call(ALLOW_KEYS, key)) return
  const keyCode = ALLOW_KEYS[key]

  webview.sendInputEvent({ type: 'keydown', keyCode })
  setTimeout(keyCode => {
    webview.sendInputEvent({ type: 'keyup', keyCode })
  }, 100, keyCode)

  console.info(username, 'inputs', keyCode)
}

function closeHandler () {
  webSocket = new WebSocket(TWITCH_SERVER)
  webSocket.addEventListener('open', openHandler)
  webSocket.addEventListener('message', messageHandler)
  webSocket.addEventListener('close', closeHandler)
}

const webview = document.querySelector('webview')
webview.setAttribute('src', process.env.TWITRON_PAGE)
