import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'api.auth.signup': { paramsTuple?: []; params?: {} }
    'api.auth.login': { paramsTuple?: []; params?: {} }
    'api.profile.show': { paramsTuple?: []; params?: {} }
    'api.profile.update': { paramsTuple?: []; params?: {} }
    'api.profile.logout': { paramsTuple?: []; params?: {} }
    'api.playlist': { paramsTuple: [ParamValue]; params: {'playlistId': ParamValue} }
    'api.playlistTikTok': { paramsTuple: [ParamValue]; params: {'playlistId': ParamValue} }
    'api.download': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'api.profile.show': { paramsTuple?: []; params?: {} }
    'api.playlist': { paramsTuple: [ParamValue]; params: {'playlistId': ParamValue} }
    'api.playlistTikTok': { paramsTuple: [ParamValue]; params: {'playlistId': ParamValue} }
  }
  HEAD: {
    'api.profile.show': { paramsTuple?: []; params?: {} }
    'api.playlist': { paramsTuple: [ParamValue]; params: {'playlistId': ParamValue} }
    'api.playlistTikTok': { paramsTuple: [ParamValue]; params: {'playlistId': ParamValue} }
  }
  POST: {
    'api.auth.signup': { paramsTuple?: []; params?: {} }
    'api.auth.login': { paramsTuple?: []; params?: {} }
    'api.profile.logout': { paramsTuple?: []; params?: {} }
    'api.download': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'api.profile.update': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}