; Algori - Inno Setup Script
; Uso: iscc algori.iss (requer Inno Setup instalado)

#define MyAppName "Algori"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "Wanfranklin Alves"
#define MyAppURL "https://github.com/wanfranklin/algori"
#define MyAppExeName "algori.exe"

[Setup]
AppId={{A1B2C3D4-E5F6-7890-ABCD-EF1234567890}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}/issues
AppUpdatesURL={#MyAppURL}/releases
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
LicenseFile=..\..\LICENSE
OutputDir=..\..\dist
OutputBaseFilename=algori-{#MyAppVersion}-setup
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
PrivilegesRequired=lowest
PrivilegesRequiredOverridesAllowed=dialog

[Languages]
Name: "brazilianportuguese"; MessagesFile: "compiler:Languages\BrazilianPortuguese.isl"
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "addtopath"; Description: "Adicionar ao PATH do sistema"; GroupDescription: "Opções:"

[Files]
Source: "..\..\dist\algori-windows-x64.exe"; DestDir: "{app}"; DestName: "algori.exe"; Flags: ignoreversion

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\algori.exe"
Name: "{group}\{cm:UninstallProgram,{#MyAppName}}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\algori.exe"; Tasks: desktopicon

[Run]
Filename: "{app}\algori.exe"; Parameters: "--version"; Description: "Verificar instalação"; Flags: runhidden waituntilterminated

[Code]
// Adicionar ao PATH
procedure AddToPath;
var
  Path: string;
  ResultCode: Integer;
begin
  if IsAdminInstallMode then
  begin
    Exec('cmd.exe', '/c setx PATH "' + ExpandConstant('{app}') + ';%PATH%" /M', '', 0, ewNoWait, ResultCode);
  end
  else
  begin
    Exec('cmd.exe', '/c setx PATH "' + ExpandConstant('{app}') + ';%PATH%"', '', 0, ewNoWait, ResultCode);
  end;
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssPostInstall then
  begin
    if IsTaskSelected('addtopath') then
    begin
      AddToPath;
    end;
  end;
end;
