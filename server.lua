#!/usr/bin/env orbit
local cjson = require'cjson'
require'orbit'
module("server", package.seeall, orbit.new)

local serve_gziped_js = function(web)
                           print('hallo',web.path_info)
                           web.headers['Content-Type'] = 'text/javascript'
                           web.headers['Content-Encoding'] = 'gzip'
                           local file = io.open('./'..web.path_info)
                           local data = file:read('*a')
                           web.headers['Content-Length'] = #data
                           print('asd')
                           return data
                        end

local serve_gziped_css = function(web)
                           print('hallo',web.path_info)
                           web.headers['Content-Type'] = 'text/css'
                           web.headers['Content-Encoding'] = 'gzip'
                           local file = io.open('./'..web.path_info)
                           local data = file:read('*a')
                           web.headers['Content-Length'] = #data
                           print('asd')
                           return data
                        end

print('hallo',cjson.encode({a=123}))
server:dispatch_get(serve_gziped_js,"/.+%.js%.gz")
server:dispatch_get(serve_gziped_css,"/.+%.css%.gz")
server:dispatch_static("/.+")
--server:dispatch_static("/.+")

return server
