#!/usr/bin/env bash
set -euo pipefail

BASE="https://raw.githubusercontent.com/ernieejo/tarot/master"
DEST="/Users/lucy/Documents/tarot/public/cards"

# Major Arcana - download by index
major_files=(
  "tarot-fool.jpg"
  "tarot-magician.jpg"
  "tarot-highpriestess.jpg"
  "tarot-empress.jpg"
  "tarot-emperor.jpg"
  "tarot-hierophant.jpg"
  "tarot-lovers.jpg"
  "tarot-chariot.jpg"
  "tarot-strength.jpg"
  "tarot-hermit.jpg"
  "tarot-wheeloffortune.jpg"
  "tarot-justice.jpg"
  "tarot-hangedman.jpg"
  "tarot-death.jpg"
  "tarot-temperance.jpg"
  "tarot-devil.jpg"
  "tarot-tower.jpg"
  "tarot-star.jpg"
  "tarot-moon.jpg"
  "tarot-sun.jpg"
  "tarot-judgement.jpg"
  "tarot-world.jpg"
)

echo "Downloading Major Arcana..."
for i in "${!major_files[@]}"; do
  filename="${major_files[$i]}"
  url="$BASE/$filename"
  out="$DEST/$i.jpg"
  echo "  $i: $filename"
  curl -fsSL "$url" -o "$out"
done

# Minor Arcana helper
download_suit() {
  local suit="$1"
  local start_id="$2"
  echo "Downloading $suit..."
  for i in $(seq 1 14); do
    local nn
    nn=$(printf "%02d" "$i")
    local id=$(( start_id + i - 1 ))
    local filename="tarot-${suit}-${nn}.jpg"
    local url="$BASE/$filename"
    local out="$DEST/$id.jpg"
    echo "  $id: $filename"
    curl -fsSL "$url" -o "$out"
  done
}

download_suit "wands"     22
download_suit "cups"      36
download_suit "swords"    50
download_suit "pentacles" 64

echo ""
echo "Done. Verifying count..."
count=$(ls "$DEST"/*.jpg 2>/dev/null | wc -l | tr -d ' ')
echo "Files downloaded: $count (expected 78)"
