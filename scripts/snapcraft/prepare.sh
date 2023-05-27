rm -rf ./.snapcraft
mkdir -p ./.snapcraft
git archive "$(git branch --show-current)" | tar -x -C ./.snapcraft
snapcraft
rm -rf ./.snapcraft
snapcraft upload *.snap --release beta