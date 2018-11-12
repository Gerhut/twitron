const { app } = require('electron')

app.disableHardwareAcceleration()

app.once('ready', () => require('./window'))
