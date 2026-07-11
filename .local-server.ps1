param(
  [int] $Port = 5500
)

$ErrorActionPreference = "Stop"

$root = [System.IO.Path]::GetFullPath((Split-Path -Parent $MyInvocation.MyCommand.Path))
$indexPath = Join-Path $root "index.html"

$mimeTypes = @{
  ".css" = "text/css; charset=utf-8"
  ".html" = "text/html; charset=utf-8"
  ".js" = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".webmanifest" = "application/manifest+json; charset=utf-8"
  ".svg" = "image/svg+xml"
  ".png" = "image/png"
  ".jpg" = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".webp" = "image/webp"
  ".ico" = "image/x-icon"
}

function Get-ContentType {
  param([string] $Path)

  $extension = [System.IO.Path]::GetExtension($Path).ToLowerInvariant()
  if ($mimeTypes.ContainsKey($extension)) {
    return $mimeTypes[$extension]
  }

  return "application/octet-stream"
}

function Resolve-RequestPath {
  param([string] $UrlPath)

  $relativePath = [Uri]::UnescapeDataString($UrlPath.TrimStart("/"))
  if ([string]::IsNullOrWhiteSpace($relativePath)) {
    $relativePath = "index.html"
  }

  $relativePath = $relativePath.Replace("/", [System.IO.Path]::DirectorySeparatorChar)
  $candidate = [System.IO.Path]::GetFullPath((Join-Path $root $relativePath))

  if (-not $candidate.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
    return $null
  }

  if (Test-Path -LiteralPath $candidate -PathType Container) {
    $candidate = Join-Path $candidate "index.html"
  }

  if (Test-Path -LiteralPath $candidate -PathType Leaf) {
    return $candidate
  }

  $extension = [System.IO.Path]::GetExtension($candidate)
  if ([string]::IsNullOrEmpty($extension) -and (Test-Path -LiteralPath $indexPath -PathType Leaf)) {
    return $indexPath
  }

  return $null
}

function Send-Response {
  param(
    [System.Net.Sockets.NetworkStream] $Stream,
    [int] $StatusCode,
    [string] $StatusText,
    [string] $ContentType,
    [byte[]] $Body
  )

  $header =
    "HTTP/1.1 $StatusCode $StatusText`r`n" +
    "Content-Type: $ContentType`r`n" +
    "Content-Length: $($Body.Length)`r`n" +
    "Cache-Control: no-store`r`n" +
    "Connection: close`r`n`r`n"

  $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
  $Stream.Write($headerBytes, 0, $headerBytes.Length)
  $Stream.Write($Body, 0, $Body.Length)
}

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
$listener.Start()

Write-Host "Serving $root at http://127.0.0.1:$Port/"
Write-Host "Keep this PowerShell window open while previewing the site."
Write-Host "Press Ctrl+C to stop."

try {
  while ($true) {
    $client = $listener.AcceptTcpClient()

    try {
      $client.ReceiveTimeout = 3000
      $client.SendTimeout = 10000
      $stream = $client.GetStream()
      $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)

      $requestLine = $reader.ReadLine()
      if ([string]::IsNullOrWhiteSpace($requestLine)) {
        continue
      }

      while ($true) {
        $line = $reader.ReadLine()
        if ($null -eq $line -or $line.Length -eq 0) {
          break
        }
      }

      $parts = $requestLine.Split(" ")
      $urlPath = "/"
      if ($parts.Length -ge 2) {
        $urlPath = $parts[1].Split("?")[0]
      }

      $filePath = Resolve-RequestPath $urlPath
      if ($null -eq $filePath) {
        $body = [System.Text.Encoding]::UTF8.GetBytes("Not found")
        Send-Response $stream 404 "Not Found" "text/plain; charset=utf-8" $body
      } else {
        $body = [System.IO.File]::ReadAllBytes($filePath)
        Send-Response $stream 200 "OK" (Get-ContentType $filePath) $body
      }
    } catch {
      try {
        if ($null -ne $stream) {
          $body = [System.Text.Encoding]::UTF8.GetBytes("Server error")
          Send-Response $stream 500 "Internal Server Error" "text/plain; charset=utf-8" $body
        }
      } catch {}

      Write-Host "Server error: $($_.Exception.Message)"
    } finally {
      if ($null -ne $reader) {
        $reader.Dispose()
      }
      if ($null -ne $stream) {
        $stream.Dispose()
      }
      $client.Close()
    }
  }
} finally {
  $listener.Stop()
}
