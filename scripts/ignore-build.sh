#!/bin/sh
# Vercel "ignore build" check. Exit 0 skips the build, exit 1 builds.
# Builds unless we can confirm that no site files changed since the last deployment.
[ -n "$VERCEL_GIT_PREVIOUS_SHA" ] || exit 1
git cat-file -e "$VERCEL_GIT_PREVIOUS_SHA" 2>/dev/null || exit 1
git diff --quiet "$VERCEL_GIT_PREVIOUS_SHA" HEAD -- app components lib public db next.config.ts postcss.config.mjs tailwind.config.js tsconfig.json package.json && exit 0
exit 1
