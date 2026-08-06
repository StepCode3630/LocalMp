/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'api.auth.signup': {
    methods: ["POST"],
    pattern: '/api/v1/auth/signup',
    tokens: [{"old":"/api/v1/auth/signup","type":0,"val":"api","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['api.auth.signup']['types'],
  },
  'api.auth.login': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['api.auth.login']['types'],
  },
  'api.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['api.profile.show']['types'],
  },
  'api.profile.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['api.profile.update']['types'],
  },
  'api.profile.logout': {
    methods: ["POST"],
    pattern: '/api/v1/account/logout',
    tokens: [{"old":"/api/v1/account/logout","type":0,"val":"api","end":""},{"old":"/api/v1/account/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/account/logout","type":0,"val":"account","end":""},{"old":"/api/v1/account/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['api.profile.logout']['types'],
  },
  'api.playlist': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/playlist/:playlistId',
    tokens: [{"old":"/api/v1/playlist/:playlistId","type":0,"val":"api","end":""},{"old":"/api/v1/playlist/:playlistId","type":0,"val":"v1","end":""},{"old":"/api/v1/playlist/:playlistId","type":0,"val":"playlist","end":""},{"old":"/api/v1/playlist/:playlistId","type":1,"val":"playlistId","end":""}],
    types: placeholder as Registry['api.playlist']['types'],
  },
  'api.playlistTikTok': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/playlistTikTok/:playlistId',
    tokens: [{"old":"/api/v1/playlistTikTok/:playlistId","type":0,"val":"api","end":""},{"old":"/api/v1/playlistTikTok/:playlistId","type":0,"val":"v1","end":""},{"old":"/api/v1/playlistTikTok/:playlistId","type":0,"val":"playlistTikTok","end":""},{"old":"/api/v1/playlistTikTok/:playlistId","type":1,"val":"playlistId","end":""}],
    types: placeholder as Registry['api.playlistTikTok']['types'],
  },
  'api.download': {
    methods: ["POST"],
    pattern: '/api/v1/download',
    tokens: [{"old":"/api/v1/download","type":0,"val":"api","end":""},{"old":"/api/v1/download","type":0,"val":"v1","end":""},{"old":"/api/v1/download","type":0,"val":"download","end":""}],
    types: placeholder as Registry['api.download']['types'],
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
