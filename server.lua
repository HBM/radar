#!/usr/bin/env wsapi.cgi

require'orbit'
module("server", package.seeall, orbit.new)
server:dispatch_static("/.+")
return server
