#!/bin/sh

sed -i 's#__VITE_BACKEND_URL__#'"'$VITE_BACKEND_URL'"'#g' /usr/share/caddy/html/index.html
sed -i 's#__VITE_DESTINATION__#'"'$VITE_DESTINATION'"'#g' /usr/share/caddy/html/index.html
sed -i 's#__VITE_IS_PACKAGED__#'"'$VITE_IS_PACKAGED'"'#g' /usr/share/caddy/html/index.html
sed -i 's#__VITE_DEVELOPER_MODE__#'"'$VITE_DEVELOPER_MODE'"'#g' /usr/share/caddy/html/index.html

exec "$@"
