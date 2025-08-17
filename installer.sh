#!/usr/bin/env bash
set -euo pipefail

REPO="https://github.com/SatoX69/Gatekept-WPS-Cracking.git"
DEST="$HOME/.ose"
WRAPPER="$PREFIX/bin/wifi"
SHELL_BIN="$(command -v bash || true)"

pkg update -y
pkg upgrade -y
pkg install -y root-repo git sudo python wpa-supplicant pixiewps iw openssl nodejs

if [ -d "$DEST/.git" ]; then
  git -C "$DEST" fetch --all --prune
  if git -C "$DEST" show-ref --verify --quiet refs/heads/main; then
    git -C "$DEST" merge --ff-only origin/main || true
  elif git -C "$DEST" show-ref --verify --quiet refs/heads/master; then
    git -C "$DEST" merge --ff-only origin/master || true
  fi
else
  rm -rf "$DEST"
  git clone --depth 1 "$REPO" "$DEST"
fi

[ -f "$DEST/package.json" ] && (cd "$DEST" && npm install --no-audit --no-fund)
[ -f "$DEST/ose.sh" ] && chmod +x "$DEST/ose.sh"

command -v fish >/dev/null && pkg uninstall -y fish

command -v chsh >/dev/null && [ -n "$SHELL_BIN" ] && chsh -s "$SHELL_BIN" || grep -Fq "exec $SHELL_BIN -l" "$HOME/.profile" || printf "\nexec %s -l\n" "$SHELL_BIN" >> "$HOME/.profile"

cat > "$WRAPPER" <<'EOF'
#!/usr/bin/env bash
OSE="$HOME/.ose/ose.sh"
[ ! -x "$OSE" ] && [ -f "$OSE" ] && chmod +x "$OSE"
exec "$OSE" "$@"
EOF
chmod +x "$WRAPPER"
grep -Fq "alias wifi=" "$HOME/.bashrc" || printf "\nalias wifi=\"$DEST/ose.sh\"\n" >> "$HOME/.bashrc"
