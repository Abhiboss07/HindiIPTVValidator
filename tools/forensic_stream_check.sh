#!/usr/bin/env bash
# ==============================================================================
# Forensic Stream Check Suite for T2L Application
# ==============================================================================
# This script independently verifies all stream URLs in the T2L application:
# 1. movies_catalog.json streamUrls and trailerUrls (and season episodes)
# 2. Radio stations in assets/app.js and data/channels.json
# 3. 20 Live TV sample channels from data/channels.json
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "========================================================================"
echo " Starting T2L Forensic Stream Validation Suite"
echo " Target Catalog: $REPO_ROOT/data/movies_catalog.json"
echo " Target Channels: $REPO_ROOT/data/channels.json"
echo " Target App JS:   $REPO_ROOT/assets/app.js"
echo "========================================================================"

# Run the python verification engine
python3 "$REPO_ROOT/tools/forensic_stream_verifier.py"

EXIT_CODE=$?

echo ""
echo "========================================================================"
echo " Validation complete. Report generated at:"
echo " - $REPO_ROOT/reports/forensic_stream_check_report.json"
echo " - $REPO_ROOT/reports/forensic_stream_check_report.md"
echo "========================================================================"

exit $EXIT_CODE
