#!/usr/bin/env bash
# Vercel "Ignored Build Step" (vercel.json ignoreCommand). Çıkış 0: derleme atlanır, 1: derlenir.
# Push yalnız siteyi etkilemeyen yolları değiştiriyorsa derleme atlanır (günlük deploy sınırı için).
onceki=${VERCEL_GIT_PREVIOUS_SHA:-HEAD^}
# Önceki deploy commit'i depoda yoksa (ör. dal yeniden yazıldıysa) derle.
git cat-file -e "$onceki" 2>/dev/null || exit 1
git diff --quiet "$onceki" HEAD -- . ':!denetim' ':!docs' ':!video' ':!tools' ':!android' ':!ios' ':!assets' \
  ':!.github' ':!capacitor.config.ts' ':!AGENTS.md' ':!README.md' ':!supabase'
