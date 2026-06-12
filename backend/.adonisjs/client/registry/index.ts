/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'api.auth.new_account.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/signup',
    tokens: [{"old":"/api/v1/auth/signup","type":0,"val":"api","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['api.auth.new_account.store']['types'],
  },
  'api.auth.access_tokens.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['api.auth.access_tokens.store']['types'],
  },
  'api.profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['api.profile.profile.show']['types'],
  },
  'api.profile.access_tokens.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/account/logout',
    tokens: [{"old":"/api/v1/account/logout","type":0,"val":"api","end":""},{"old":"/api/v1/account/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/account/logout","type":0,"val":"account","end":""},{"old":"/api/v1/account/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['api.profile.access_tokens.destroy']['types'],
  },
  'api.you_tube.playlist': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/playlist/:playlistId',
    tokens: [{"old":"/api/v1/playlist/:playlistId","type":0,"val":"api","end":""},{"old":"/api/v1/playlist/:playlistId","type":0,"val":"v1","end":""},{"old":"/api/v1/playlist/:playlistId","type":0,"val":"playlist","end":""},{"old":"/api/v1/playlist/:playlistId","type":1,"val":"playlistId","end":""}],
    types: placeholder as Registry['api.you_tube.playlist']['types'],
  },
  'api.you_tube.stream_zip': {
    methods: ["POST"],
    pattern: '/api/v1/download',
    tokens: [{"old":"/api/v1/download","type":0,"val":"api","end":""},{"old":"/api/v1/download","type":0,"val":"v1","end":""},{"old":"/api/v1/download","type":0,"val":"download","end":""}],
    types: placeholder as Registry['api.you_tube.stream_zip']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
