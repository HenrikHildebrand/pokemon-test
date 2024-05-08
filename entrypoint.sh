#!/bin/sh
set -e

yarn prisma generate

exec "$@"