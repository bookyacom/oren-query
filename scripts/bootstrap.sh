#!/bin/bash

INSTALL=/tmp/orientdb
UNTAR=/tmp/orientechnologies
VERSION=2.0
ORIENT_HOME=/opt/
ORIENT_PWD=password
ORIENT_RELEASE_HOME=/opt/releases/orientdb*

apt-get -y -qq update

which wget || {
  echo "Installing wget......................................................"
  apt-get install -y wget
}

which ant || {
  echo "Installing ant......................................................."
  apt-get install -y ant
}

which javac || {
  echo "Installing JDK 7....................................................."
  apt-get install -y openjdk-7-jdk
}

if [ ! -d "$INSTALL" ]; then
  echo "Creating install directory at ${INSTALL}............................."
  mkdir -p $INSTALL
fi

if [ ! -d "$UNTAR" ]; then
  echo "Creating untar directory at ${UNTAR}................................."
  mkdir -p $UNTAR
fi

if [ ! -a "${INSTALL}/orientdb.tar.gz" ]; then
  echo "Downloading and unpacking orientDB..................................."
  cd $INSTALL
  wget --no-check-certificate https://github.com/orientechnologies/orientdb/tarball/${VERSION} -q -O orientdb.tar.gz
  tar -xzf orientdb.tar.gz -C $UNTAR
  mv ${UNTAR}/orient* $ORIENT_HOME/
fi

if [ ! -a "${INSTALL}/orient_lucene.jar" ]; then
  echo "Downloading the orient_lucene engine......................."
  cd $INSTALL
  wget --no-check-certificate https://github.com/orientechnologies/orientdb-lucene/releases/download/2.0-SNAPHOST/orientdb-lucene-2.0-SNAPSHOT-dist.jar -q -O orient_lucene.jar
fi

which server.sh || {
  echo "Installing orientDB.................................................."
  cd ${ORIENT_HOME}/orient* && ant clean install

  mv ${INSTALL}/orient_lucene.jar ${ORIENT_HOME}/releases/orientdb*/plugins


  cd ${ORIENT_HOME}/releases/orientdb*/bin

  for a in *; do ln -s ${ORIENT_HOME}/releases/orientdb*/bin/$a /usr/local/bin/$a; done

  echo "Starting up orientdb................................................."

  cd ../

  DB_HOME=${PWD}

  sed -i 's/YOUR_ORIENTDB_INSTALLATION_PATH/${PWD}/g' ./bin/orientdb.sh
  sed -i 's/USER_YOU_WANT_ORIENTDB_RUN_WITH/root/g' ./bin/orientdb.sh

  sh ./bin/orientdb.sh start

  echo "Creating database on orientdb........................................"
  cd /usr/local/bin

  sh ./console.sh "create database plocal:${DB_HOME}/databases/test"
}

which orientdb.sh || {
  echo "Starting up orientdb................................................."

  cd ${ORIENT_RELEASE_HOME}

  sh ./bin/orientdb.sh start
}
