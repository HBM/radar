project(jet-webinterface)
cmake_minimum_required(VERSION 2.8)
set(CMAKE_MODULE_PATH ${PROJECT_SOURCE_DIR}/../cmake)

include(QuantumxSettings)

########################### defebitions unix ##############
if(UNIX)
  file(GLOB html_files "*.html")
  install( FILES ${html_files} DESTINATION var/www/webmx )
#  file(GLOB ico_files "*.ico")
#  install( FILES ${ico_files} DESTINATION var/www/webmx )
  file(GLOB js_files "js/*.js")
  install( FILES ${js_files} DESTINATION var/www/webmx/js )
  file(GLOB style_files "style/*.css" "style/*.less")
  install( FILES ${style_files} DESTINATION var/www/webmx/style )
  file(GLOB style_files "style/*.css" "style/*.less")
  install( FILES ${style_files} DESTINATION var/www/webmx/style )

  ## bootstrap
  file(GLOB bs_css_files "bootstrap/css/bootstrap.min.css" "bootstrap/css/bootstrap-responsive.min.css")
  install( FILES ${bs_css_files} DESTINATION var/www/webmx/bootstrap/css )
  file(GLOB bs_img_files "bootstrap/img/glyphicons-halflings.png")
  install( FILES ${bs_img_files} DESTINATION var/www/webmx/bootstrap/img )
  file(GLOB bs_js_files "bootstrap/js/bootstrap.js")
  install( FILES ${bs_js_files} DESTINATION var/www/webmx/bootstrap/js )
endif(UNIX)







