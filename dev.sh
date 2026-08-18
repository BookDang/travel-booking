#!/usr/bin/env bash
#
# Dev helper: mount domain "travel-booking.com" vao hosts file va chay
# docker compose (nginx + mysql + api).
#
# Usage:
#   ./dev.sh up      Them domain vao hosts (neu chua co) roi "docker compose up --build"
#   ./dev.sh down    Dung docker compose va go domain khoi hosts file
#   ./dev.sh help    Hien huong dan nay
#
# Luu y: sua hosts file can quyen Administrator (chay Git Bash "Run as administrator").
#   Neu khong sua duoc, tu them/xoa dong sau trong C:\Windows\System32\drivers\etc\hosts:
#     127.0.0.1 travel-booking.com
#
set -euo pipefail

DOMAIN="travel-booking.com"
HOSTS_FILE="/c/Windows/System32/drivers/etc/hosts"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CMD="${1:-up}"

add_domain() {
  if grep -q "$DOMAIN" "$HOSTS_FILE" 2>/dev/null; then
    echo "$DOMAIN da co trong hosts file, bo qua."
    return
  fi
  echo "Them \"127.0.0.1 $DOMAIN\" vao hosts file..."
  if echo "127.0.0.1 $DOMAIN" >> "$HOSTS_FILE" 2>/dev/null; then
    echo "Done."
  else
    echo "Khong the ghi vao $HOSTS_FILE (can quyen Administrator)."
    echo "Chay lai terminal voi quyen Administrator, hoac tu them dong sau:"
    echo "  127.0.0.1 $DOMAIN"
    exit 1
  fi
}

remove_domain() {
  if ! grep -q "$DOMAIN" "$HOSTS_FILE" 2>/dev/null; then
    echo "$DOMAIN khong co trong hosts file, bo qua."
    return
  fi
  echo "Go \"$DOMAIN\" khoi hosts file..."
  if sed -i "/$DOMAIN/d" "$HOSTS_FILE" 2>/dev/null; then
    echo "Done."
  else
    echo "Khong the sua $HOSTS_FILE (can quyen Administrator)."
    echo "Chay lai terminal voi quyen Administrator, hoac tu xoa dong chua \"$DOMAIN\"."
    exit 1
  fi
}

case "$CMD" in
  up)
    if [ ! -f "$ROOT_DIR/.env" ]; then
      echo "Khong thay .env, copy tu .env.example -> .env"
      cp "$ROOT_DIR/.env.example" "$ROOT_DIR/.env"
    fi
    add_domain
    cd "$ROOT_DIR"
    shift || true
    docker compose up --build "$@"
    ;;
  down)
    cd "$ROOT_DIR"
    docker compose down
    remove_domain
    ;;
  help|-h|--help)
    sed -n '2,13p' "$0" | sed 's/^# \{0,1\}//'
    ;;
  *)
    echo "Lenh khong hop le: $CMD"
    echo "Dung: ./dev.sh [up|down|help]"
    exit 1
    ;;
esac
