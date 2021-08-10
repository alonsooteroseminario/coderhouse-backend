const pino = require('pino')
require('dotenv').config()

function buildProdLogger() {
  const prodLogger = pino()
  prodLogger.level = 'info'
  return prodLogger
}

function buildWarnLogger() {
  const warnLogger = pino('warn.log');
  warnLogger.level = 'warn'
  return warnLogger
}

function buildErrorLogger() {
  const errorLogger = pino('error.log');
  errorLogger.level = 'error'
  return errorLogger
}

let logger = null
let loggerWarn = null
let loggerError = null

// console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'PROD') {
  logger = buildProdLogger()
  loggerWarn = buildWarnLogger();
  loggerError = buildErrorLogger();
} else {
  logger = buildProdLogger()
  loggerWarn = buildWarnLogger();
  loggerError = buildErrorLogger();
}

module.exports = { 
  logger,
  loggerWarn,
  loggerError
}
