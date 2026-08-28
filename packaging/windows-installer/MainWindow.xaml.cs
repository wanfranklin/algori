using System;
using System.IO;
using System.Net.Http;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Windows;
using Microsoft.Win32;

namespace Algori.Installer
{
    public partial class MainWindow : Window
    {
        private int currentStep = 1;
        private string installPath = @"C:\Program Files\Algori";
        private const string VERSION = "1.0.0";
        private const string GITHUB_URL = "https://github.com/wanfranklin/algori/releases/download/v1.0.0";

        public MainWindow()
        {
            InitializeComponent();
        }

        private void BtnNext_Click(object sender, RoutedEventArgs e)
        {
            switch (currentStep)
            {
                case 1:
                    GoToStep2();
                    break;
                case 2:
                    StartInstallation();
                    break;
                case 4:
                    Close();
                    break;
            }
        }

        private void BtnBack_Click(object sender, RoutedEventArgs e)
        {
            switch (currentStep)
            {
                case 2:
                    GoToStep1();
                    break;
            }
        }

        private void BtnBrowse_Click(object sender, RoutedEventArgs e)
        {
            var dialog = new System.Windows.Forms.FolderBrowserDialog
            {
                Description = "Selecione o local de instalação",
                SelectedPath = installPath,
                ShowNewFolderButton = true
            };

            if (dialog.ShowDialog() == System.Windows.Forms.DialogResult.OK)
            {
                installPath = dialog.SelectedPath;
                TxtInstallPath.Text = installPath;
            }
        }

        private void GoToStep1()
        {
            currentStep = 1;
            Step1_Welcome.Visibility = Visibility.Visible;
            Step2_Location.Visibility = Visibility.Collapsed;
            Step3_Installing.Visibility = Visibility.Collapsed;
            Step4_Complete.Visibility = Visibility.Collapsed;
            BtnBack.Visibility = Visibility.Collapsed;
            BtnNext.Content = "Próximo →";
        }

        private void GoToStep2()
        {
            currentStep = 2;
            Step1_Welcome.Visibility = Visibility.Collapsed;
            Step2_Location.Visibility = Visibility.Visible;
            Step3_Installing.Visibility = Visibility.Collapsed;
            Step4_Complete.Visibility = Visibility.Collapsed;
            BtnBack.Visibility = Visibility.Visible;
            BtnNext.Content = "Instalar →";
        }

        private async void StartInstallation()
        {
            currentStep = 3;
            Step2_Location.Visibility = Visibility.Collapsed;
            Step3_Installing.Visibility = Visibility.Visible;
            BtnBack.Visibility = Visibility.Collapsed;
            BtnNext.IsEnabled = false;

            try
            {
                await InstallAlgori();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Erro durante a instalação:\n{ex.Message}", 
                    "Erro", MessageBoxButton.OK, MessageBoxImage.Error);
                GoToStep2();
            }
        }

        private async Task InstallAlgori()
        {
            // Step 1: Create directory
            UpdateStatus("Criando diretório de instalação...");
            UpdateProgress(10);

            if (!Directory.Exists(installPath))
            {
                Directory.CreateDirectory(installPath);
            }

            // Step 2: Download executable
            UpdateStatus("Baixando Algori...");
            UpdateProgress(20);

            string exePath = Path.Combine(installPath, "algori.exe");
            string url = $"{GITHUB_URL}/algori-windows-x64.exe";

            using (var client = new HttpClient())
            {
                client.Timeout = TimeSpan.FromMinutes(5);
                
                var response = await client.GetAsync(url, HttpCompletionOption.ResponseHeadersRead);
                response.EnsureSuccessStatusCode();

                var totalBytes = response.Content.Headers.ContentLength ?? -1;
                var totalBytesRead = 0L;

                using (var contentStream = await response.Content.ReadAsStreamAsync())
                using (var fileStream = new FileStream(exePath, FileMode.Create, FileAccess.Write, FileShare.None, 8192))
                {
                    var buffer = new byte[8192];
                    int bytesRead;

                    while ((bytesRead = await contentStream.ReadAsync(buffer, 0, buffer.Length)) > 0)
                    {
                        await fileStream.WriteAsync(buffer, 0, bytesRead);
                        totalBytesRead += bytesRead;

                        if (totalBytes > 0)
                        {
                            int percent = (int)((totalBytesRead * 100) / totalBytes);
                            UpdateProgress(20 + (percent * 0.5)); // 20-70%
                        }
                    }
                }
            }

            // Step 3: Add to PATH
            if (ChkAddToPath.IsChecked == true)
            {
                UpdateStatus("Adicionando ao PATH do sistema...");
                UpdateProgress(75);
                AddToPath(installPath);
            }

            // Step 4: Create shortcuts
            if (ChkDesktopIcon.IsChecked == true)
            {
                UpdateStatus("Criando atalho na área de trabalho...");
                UpdateProgress(80);
                CreateDesktopShortcut(exePath);
            }

            if (ChkStartMenu.IsChecked == true)
            {
                UpdateStatus("Criando atalho no Menu Iniciar...");
                UpdateProgress(85);
                CreateStartMenuShortcut(exePath);
            }

            // Step 5: Verify installation
            UpdateStatus("Verificando instalação...");
            UpdateProgress(95);

            if (File.Exists(exePath))
            {
                UpdateProgress(100);
                await Task.Delay(500); // Small delay for visual feedback
                ShowComplete(exePath);
            }
            else
            {
                throw new Exception("Falha ao baixar o executável.");
            }
        }

        private void AddToPath(string path)
        {
            try
            {
                var currentPath = Environment.GetEnvironmentVariable("Path", EnvironmentVariableTarget.Machine);
                if (!currentPath.Contains(path))
                {
                    Environment.SetEnvironmentVariable("Path", currentPath + ";" + path, EnvironmentVariableTarget.Machine);
                }
            }
            catch (Exception)
            {
                // If we can't set machine PATH, try user PATH
                var currentPath = Environment.GetEnvironmentVariable("Path", EnvironmentVariableTarget.User);
                if (!currentPath.Contains(path))
                {
                    Environment.SetEnvironmentVariable("Path", currentPath + ";" + path, EnvironmentVariableTarget.User);
                }
            }
        }

        private void CreateDesktopShortcut(string targetPath)
        {
            try
            {
                string desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
                string shortcutPath = Path.Combine(desktopPath, "Algori.lnk");

                var shell = new WScript.Shell();
                var shortcut = shell.CreateShortcut(shortcutPath);
                shortcut.TargetPath = targetPath;
                shortcut.WorkingDirectory = Path.GetDirectoryName(targetPath);
                shortcut.Description = "Algori - Linguagem de programação em português";
                shortcut.Save();
            }
            catch (Exception)
            {
                // Silently fail if we can't create shortcut
            }
        }

        private void CreateStartMenuShortcut(string targetPath)
        {
            try
            {
                string startMenuPath = Environment.GetFolderPath(Environment.SpecialFolder.Programs);
                string algoriFolder = Path.Combine(startMenuPath, "Algori");
                
                if (!Directory.Exists(algoriFolder))
                {
                    Directory.CreateDirectory(algoriFolder);
                }

                string shortcutPath = Path.Combine(algoriFolder, "Algori.lnk");

                var shell = new WScript.Shell();
                var shortcut = shell.CreateShortcut(shortcutPath);
                shortcut.TargetPath = targetPath;
                shortcut.WorkingDirectory = Path.GetDirectoryName(targetPath);
                shortcut.Description = "Algori - Linguagem de programação em português";
                shortcut.Save();
            }
            catch (Exception)
            {
                // Silently fail if we can't create shortcut
            }
        }

        private void ShowComplete(string exePath)
        {
            currentStep = 4;
            Step3_Installing.Visibility = Visibility.Collapsed;
            Step4_Complete.Visibility = Visibility.Visible;
            BtnNext.IsEnabled = true;
            BtnNext.Content = "Finalizar";

            TxtInstallInfo.Text = $"Local: {exePath}\n" +
                                  $"Versão: {VERSION}\n" +
                                  $"Atalho na área de trabalho: {(ChkDesktopIcon.IsChecked == true ? "Sim" : "Não")}\n" +
                                  $"Atalho no Menu Iniciar: {(ChkStartMenu.IsChecked == true ? "Sim" : "Não")}";
        }

        private void UpdateStatus(string status)
        {
            TxtStatus.Text = status;
        }

        private void UpdateProgress(double percent)
        {
            ProgressBar.Value = percent;
            TxtPercent.Text = $"{(int)percent}%";
        }
    }
}
