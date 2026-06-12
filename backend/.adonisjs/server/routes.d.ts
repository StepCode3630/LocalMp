import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'api.auth.new_account.store': { paramsTuple?: []; params?: {} }
    'api.auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'api.profile.profile.show': { paramsTuple?: []; params?: {} }
    'api.profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'api.you_tube.playlist': { paramsTuple: [ParamValue]; params: {'playlistId': ParamValue} }
    'api.you_tube.stream_zip': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'api.profile.profile.show': { paramsTuple?: []; params?: {} }
    'api.you_tube.playlist': { paramsTuple: [ParamValue]; params: {'playlistId': ParamValue} }
  }
  HEAD: {
    'api.profile.profile.show': { paramsTuple?: []; params?: {} }
    'api.you_tube.playlist': { paramsTuple: [ParamValue]; params: {'playlistId': ParamValue} }
  }
  POST: {
    'api.auth.new_account.store': { paramsTuple?: []; params?: {} }
    'api.auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'api.profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'api.you_tube.stream_zip': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}