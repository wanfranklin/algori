Name:           algori
Version:        1.0.0
Release:        1%{?dist}
Summary:        Linguagem de programação em português
License:        GPLv3+
URL:            https://github.com/wanfranklin/algori
Source0:        %{name}-%{version}.tar.gz
BuildArch:      x86_64

%description
Algori é uma linguagem de pseudocódigo educacional com palavras
reservadas em português para aprendizado de algoritmos e lógica
de programação.

Suporta variáveis tipadas, condicionais, loops, funções, e 12
funções built-in para operações matemáticas e texto.

%prep
%autosetup

%build
# Nada a construir (binário pré-compilado)

%install
mkdir -p %{buildroot}/usr/bin
install -m 755 %{name} %{buildroot}/usr/bin/%{name}

%files
/usr/bin/%{name}

%changelog
* Mon Aug 25 2026 Wanfranklin <wanfranklin@users.noreply.github.com> - 1.0.0-1
- Initial release
