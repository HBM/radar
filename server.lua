#!/usr/bin/env orbit

require'orbit'
module("server", package.seeall, orbit.new)

local serve_gzipped = 
   function(content_type)
      return function(web)
                web.headers['Content-Type'] = content_type
                web.headers['Content-Encoding'] = 'gzip'
                local file = io.open('./'..web.path_info)
                local data = file:read('*a')
                web.headers['Content-Length'] = #data
                return data
             end
   end


server:dispatch_get(
   function(web)      
      web:redirect('/radar.html')
   end,'/')
server:dispatch_get(serve_gzipped('text/javascript'),"/.+%.js%.gz")
server:dispatch_get(serve_gzipped('text/css'),"/.+%.css%.gz")
server:dispatch_static("/.+")

return server
