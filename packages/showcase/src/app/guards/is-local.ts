import { CanMatchFn } from "@angular/router"

export function isLocal() {
    
    const host = window.location.host

    return host.startsWith("localhost")
}

export function isLocalGuard(): CanMatchFn {
  return (route, state) => {
    return isLocal()
  }
}