#!/bin/sh
set -eo
sed -ri \
  -e 's#(window.VITE_BACKEND_URL = ).*;#\1'"'$VITE_BACKEND_URL';"'#g' \
  -e 's#(window.VITE_IS_PACKAGED = ).*;#\1'"'$VITE_IS_PACKAGED';"'#g' \
  -e 's#(window.VITE_DEVELOPER_MODE = ).*;#\1'"'$VITE_DEVELOPER_MODE';"'#g' \
  -e 's#(window.VITE_PROXY_ENABLED = ).*;#\1'"'$VITE_PROXY_ENABLED';"'#g' \
  /usr/share/caddy/html/index.html

exec "$@"
