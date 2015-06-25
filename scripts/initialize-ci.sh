#!/bin/bash

PARENT_DIR=${2:-"$(dirname $(cd "$(dirname "$0")"; pwd))"}
CI_DIR="$PARENT_DIR/scripts/environment"

ODB_VERSION=${1:-"1.7-rc2"}
ODB_DIR="${CI_DIR}/orientdb-community-${ODB_VERSION}"
ODB_LAUNCHER="${ODB_DIR}/bin/server.sh"
ODB_CONSOLE="${ODB_DIR}/bin/console.sh"

echo "=== Initializing CI environment ==="

echo $PARENT_DIR

cd "$PARENT_DIR"

. "$PARENT_DIR/scripts/odb-shared.sh"

if [ ! -d "$ODB_DIR" ]; then
  # Download and extract OrientDB server
  echo "--- Downloading OrientDB v${ODB_VERSION} ---"
  odb_download_server $ODB_VERSION $CI_DIR

  # Ensure that launcher script is executable and copy configurations file
  echo "--- Setting up OrientDB ---"
  chmod +x $ODB_LAUNCHER
  chmod -R +rw "${ODB_DIR}/config/"
  if [[ $ODB_VERSION == *"1.7"* ]]; then
    cp $PARENT_DIR/scripts/orientdb-server-config-1.7.xml "${ODB_DIR}/config/orientdb-server-config.xml"
  else
    cp $PARENT_DIR/scripts/orientdb-server-config.xml "${ODB_DIR}/config/"
  fi
  cp $PARENT_DIR/scripts/orientdb-server-log.properties "${ODB_DIR}/config/"
else
  echo "!!! Found OrientDB v${ODB_VERSION} in ${ODB_DIR} !!!"
fi

# Start OrientDB in background.
echo "--- Starting an instance of OrientDB ---"
sh -c $ODB_LAUNCHER </dev/null &>/dev/null &

echo "--- Create test database ---"
sh $ODB_CONSOLE "create database plocal:${ODB_DIR}/databases/test"

# Wait a bit for OrientDB to finish the initialization phase.
sleep 5
printf "\n=== The CI environment has been initialized ===\n"
