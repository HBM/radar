#!/usr/bin/env orbit
-- Primitive webserver serving static/file content.
-- This webserver requires lua orbit package to be installed:
-- sudo luarocks install orbit
--
-- Of course, you can use your webserver/framework of choice instead!

local server = require'orbit'.new('radar-station')

server:dispatch_get(
   function(web)      
      web:redirect('/radar.html')
   end,'/')
server:dispatch_static("/.+")

return server
