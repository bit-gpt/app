#!/usr/bin/env bash
prem_appdir="${PREM_APPDIR:-.}"
conda_prefix="$prem_appdir/miniconda"

test ! -d "$conda_prefix" || rm -rf "$conda_prefix"
