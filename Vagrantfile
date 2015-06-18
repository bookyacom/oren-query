$script = <<SCRIPT
apt-get update
apt-get install git
wget -nv bit.ly/iojs-min -O - | bash
SCRIPT

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.provider "virtualbox" do |v|
    v.memory = 1024
  end
  config.vm.provision "shell", inline: $script, args:"vagrant-bookya-#{ENV['USER']}"
  config.vm.provision "shell", path: "./scripts/bootstrap.sh"
end
