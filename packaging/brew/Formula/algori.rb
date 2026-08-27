class Algori < Formula
  desc "Linguagem de programação para aprendizado de algoritmos"
  homepage "https://github.com/wanfranklin/algori"
  license "GPL-3.0-or-later"
  version "1.0.0"

  on_macos do
    on_arm do
      url "https://github.com/wanfranklin/algori/releases/download/v1.0.0/algori-macos-arm64"
      sha256 "PLACEHOLDER_MACOS_ARM64"
    end
    on_intel do
      url "https://github.com/wanfranklin/algori/releases/download/v1.0.0/algori-macos-x64"
      sha256 "PLACEHOLDER_MACOS_X64"
    end
  end

  on_linux do
    on_arm do
      url "https://github.com/wanfranklin/algori/releases/download/v1.0.0/algori-linux-arm64"
      sha256 "PLACEHOLDER_LINUX_ARM64"
    end
    on_intel do
      url "https://github.com/wanfranklin/algori/releases/download/v1.0.0/algori-linux-x64"
      sha256 "PLACEHOLDER_LINUX_X64"
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
