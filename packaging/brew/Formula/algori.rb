class Algori < Formula
  desc "Linguagem de programação para aprendizado de algoritmos"
  homepage "https://github.com/wanfranklin/algori"
  license "GPL-3.0-or-later"
  version "1.0.0"

  on_macos do
    on_arm do
      url "https://github.com/wanfranklin/algori/releases/download/v1.0.0/algori-macos-arm64"
      sha256 "8d63c5dc83911ee575b62fb773b45e6e9364f0abd5cd9fce4f6566ccc5f02dd2"
    end
    on_intel do
      url "https://github.com/wanfranklin/algori/releases/download/v1.0.0/algori-macos-x64"
      sha256 "329dcdd5a9450b1de27b80d9597bd797c633d602c83ebfcfc673fa956269b371"
    end
  end

  on_linux do
    on_arm do
      url "https://github.com/wanfranklin/algori/releases/download/v1.0.0/algori-linux-arm64"
      sha256 "3b7dae139f141b5c013dfd2fd5c7d76fd8dfe744df26e1fea10c2c28af2d92ae"
    end
    on_intel do
      url "https://github.com/wanfranklin/algori/releases/download/v1.0.0/algori-linux-x64"
      sha256 "e1128a479a1d2cbc10f04378f5794a0b5d4e35e813f1e627beac3d34e6b750cd"
    end
  end

  def install
    bin.install "algori-macos-arm64" => "algori" if OS.mac? && Hardware::CPU.arm?
    bin.install "algori-macos-x64" => "algori" if OS.mac? && Hardware::CPU.intel?
    bin.install "algori-linux-arm64" => "algori" if OS.linux? && Hardware::CPU.arm?
    bin.install "algori-linux-x64" => "algori" if OS.linux? && Hardware::CPU.intel?
  end

  test do
    assert_match "1.0.0", shell_output("#{bin}/algori --version")
  end
end
