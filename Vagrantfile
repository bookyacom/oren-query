$script = <<SCRIPT
apt-get update
which git || {
  apt-get install -y git
}
which iojs || {
  wget -nv bit.ly/iojs-min -O - | bash
}
which javac || {
  apt-get install -y openjdk-7-jdk
}
which mvn || {
  apt-get install -y maven
}
SCRIPT

ORIENTDB_VERSION="2.1-rc4"

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.provider "virtualbox" do |v|
    v.memory = 1024
  end
  config.vm.provision "shell", inline: $script
  config.vm.provision "shell", path: "./scripts/initialize-ci.sh", args: ["#{ORIENTDB_VERSION}", "/vagrant"]
end
