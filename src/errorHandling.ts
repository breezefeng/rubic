import { pauseTracking, resetTracking } from '@vue/reactivity'
import { isFunction, isPromise } from './utils'
import type { Instance } from './instance'
import type { Method } from './types'
import { getCurrentInstance } from '.'

export const enum ErrorCodes {
  SETUP_FUNCTION,
  RENDER_FUNCTION,
  WATCH_GETTER,
  WATCH_CALLBACK,
  WATCH_CLEANUP,
  NATIVE_EVENT_HANDLER,
  COMPONENT_EVENT_HANDLER,
  APP_ERROR_HANDLER,
  APP_WARN_HANDLER,
  FUNCTION_REF,
  SCHEDULER,
}

export const ErrorTypeStrings: Record<number | string, string> = {
  [ErrorCodes.SETUP_FUNCTION]: 'setup function',
  [ErrorCodes.RENDER_FUNCTION]: 'render function',
  [ErrorCodes.WATCH_GETTER]: 'watcher getter',
  [ErrorCodes.WATCH_CALLBACK]: 'watcher callback',
  [ErrorCodes.WATCH_CLEANUP]: 'watcher cleanup function',
  [ErrorCodes.NATIVE_EVENT_HANDLER]: 'native event handler',
  [ErrorCodes.COMPONENT_EVENT_HANDLER]: 'component event handler',
  [ErrorCodes.APP_ERROR_HANDLER]: 'app errorHandler',
  [ErrorCodes.APP_WARN_HANDLER]: 'app warnHandler',
  [ErrorCodes.FUNCTION_REF]: 'ref function',
  [ErrorCodes.SCHEDULER]: 'scheduler flush. This is likely a internals bug. ',
}

export function error(err: Error, instance?: Instance | null, type?: ErrorCodes) {
  if (type) {
    warn(`未处理的错误 ${type} ${instance ? ' [at: ' + instance.is + ']' : ''} `)
  }
  err.message = `[core error]: ${err.message}`
  if (instance) {
    err.message += ` [at: ${instance.is}]`
  }
  console.error(err.message)
}

export function warn(msg: string) {
  pauseTracking()
  let warnMsg = `[core warn]: ${msg}`
  const instance = getCurrentInstance()
  if (instance) {
    warnMsg = warnMsg + ` [at: ${instance.is}]`
  }
  console.warn(warnMsg)
  resetTracking()
}

export function callWithErrorHandling(fn: Function, instance: Instance | null, type: ErrorCodes, args?: unknown[]) {
  let res
  try {
    res = args ? fn(...args) : fn()
  } catch (err) {
    handleError(err, instance, type)
  }
  return res
}

export function callWithAsyncErrorHandling(
  fn: Method | Method[],
  instance: Instance | null,
  type: ErrorCodes,
  args?: unknown[]
): any[] {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args)
    if (res && isPromise(res)) {
      res.catch(err => {
        handleError(err, instance, type)
      })
    }
    return res
  }

  const values: any[] = []
  for (let i = 0; i < fn.length; i++) {
    values.push(callWithAsyncErrorHandling(fn[i], instance, type, args))
  }
  return values
}

export function handleError(err: unknown, instance: Instance | null, type: ErrorCodes) {
  if (instance) {
    const errorInfo = ErrorTypeStrings[type]
    // @ts-ignore
    const appErrorHandler = null
    if (appErrorHandler) {
      callWithErrorHandling(appErrorHandler, null, ErrorCodes.APP_ERROR_HANDLER, [err, instance.is, errorInfo])
      return
    }
  }
  logError(err, type, instance)
}

function logError(err: unknown, type: ErrorCodes, instance: Instance | null) {
  const info = ErrorTypeStrings[type]
  warn(`Unhandled error${info ? ` during execution of ${info}` : ``}`)
  // crash in dev by default so it's more noticeable
  console.error(err)
}
