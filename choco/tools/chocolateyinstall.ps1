$ErrorActionPreference = 'Stop';
$toolsDir   = "$(Split-Path -parent $MyInvocation.MyCommand.Definition)"
$url        = 'https://github.com/ghanizadev/bluedis/releases/download/v0.2.0/Bluedis.Setup.0.2.0-ia32.exe'
$url64      = 'https://github.com/ghanizadev/bluedis/releases/download/v0.2.0/Bluedis.Setup.0.2.0.exe'

$packageArgs = @{
  packageName   = $env:ChocolateyPackageName
  unzipLocation = $toolsDir
  fileType      = 'exe'
  url           = $url
  url64bit      = $url64

  softwareName  = 'Bluedis*'

  checksum      = '22e915d7335d9c0b8985e91229ebd31f8872234fbfb34d7805f407b3f54edd3a'
  checksumType  = 'sha256'
  checksum64    = '36fe4b9ac54bc8ba45cc0a655e8a03be2a5926e0696a0847ba762c65bc46f902'
  checksumType64= 'sha256'
  silentArgs    = "/S"
  validExitCodes= @(0, 3010, 1641)
}

Install-ChocolateyPackage @packageArgs