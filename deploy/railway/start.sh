#!/bin/sh
echo "NEXUS-ENGINE Platform Preview"
echo "ERL-4 Deployment Mode"
./run-engine-services.sh
sleep 10
./run-api-with-engines.sh
