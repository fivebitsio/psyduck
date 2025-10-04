import { atom } from 'jotai'
import { atomWithStorage, RESET } from 'jotai/utils'
import { stringStorage } from './utils'

export const authAtom = atomWithStorage('token', '', stringStorage, { getOnInit: true })
export const isLoggedInAtom = atom(get => !!get(authAtom))

export const logoutAtom = atom(null, (_, set) => {
  set(authAtom, RESET)
})

export const loginAtom = atom(null, (_, set, token: string) => {
  set(authAtom, token)
})
