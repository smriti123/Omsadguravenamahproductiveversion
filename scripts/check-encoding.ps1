$ErrorActionPreference = "Stop"

$root = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
$textExtensions = @(
  ".css",
  ".html",
  ".htaccess",
  ".js",
  ".json",
  ".php",
  ".ps1",
  ".svg",
  ".txt",
  ".webmanifest",
  ".xml"
)

$excludedDirectories = @(
  ".git",
  ".agents",
  ".browser-test",
  ".browser-test-2",
  ".gallery-browser",
  ".gallery-browser-2",
  ".gallery-browser-3",
  ".gallery-cdp",
  "uploads"
)

$excludedFiles = @(
  ".browser-dom.txt",
  ".browser-error.txt",
  ".gallery-dom.txt",
  ".gallery-error.txt",
  ".local-server-err.txt",
  ".local-server-out.txt",
  ".local-test-err.txt",
  ".local-test-out.txt",
  ".server-err.txt",
  ".server-out.txt"
)

function New-StringFromCodepoints {
  param([int[]] $Codepoints)

  $chars = New-Object System.Collections.Generic.List[char]
  foreach ($codepoint in $Codepoints) {
    $chars.Add([char] $codepoint)
  }

  return -join $chars
}

$mojibakePatterns = @(
  # Devanagari UTF-8 bytes decoded as Windows-1252/Latin-1.
  (New-StringFromCodepoints @(0x00E0, 0x00A4)),
  (New-StringFromCodepoints @(0x00E0, 0x00A5)),

  # Common mojibake starts for UTF-8 punctuation and accented text.
  (New-StringFromCodepoints @(0x00C3)),
  (New-StringFromCodepoints @(0x00E2, 0x20AC)),

  # Replacement character means the original byte sequence was already lost.
  (New-StringFromCodepoints @(0xFFFD))
)

function Test-IsExcludedPath {
  param([string] $Path)

  $relative = $Path.Substring($root.Length).TrimStart([System.IO.Path]::DirectorySeparatorChar)
  foreach ($directory in $excludedDirectories) {
    if (
      $relative.Equals($directory, [System.StringComparison]::OrdinalIgnoreCase) -or
      $relative.StartsWith($directory + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)
    ) {
      return $true
    }
  }

  return $false
}

$utf8Strict = New-Object System.Text.UTF8Encoding($false, $true)
$failures = New-Object System.Collections.Generic.List[object]

Get-ChildItem -LiteralPath $root -Recurse -File | ForEach-Object {
  if (Test-IsExcludedPath $_.FullName) {
    return
  }

  $extension = $_.Extension.ToLowerInvariant()
  if ($textExtensions -notcontains $extension -and $_.Name -ne ".htaccess") {
    return
  }

  $relativePath = $_.FullName.Substring($root.Length).TrimStart([System.IO.Path]::DirectorySeparatorChar)
  if ($excludedFiles -contains $_.Name) {
    return
  }

  $bytes = [System.IO.File]::ReadAllBytes($_.FullName)

  try {
    $text = $utf8Strict.GetString($bytes)
  } catch {
    $failures.Add([PSCustomObject]@{
      Path = $relativePath
      Issue = "File is not valid UTF-8"
      Match = ""
    })
    return
  }

  foreach ($pattern in $mojibakePatterns) {
    if ($text.Contains($pattern)) {
      $failures.Add([PSCustomObject]@{
        Path = $relativePath
        Issue = "Possible mojibake/corrupted Unicode text"
        Match = ("U+" + ([int][char]$pattern[0]).ToString("X4"))
      })
      break
    }
  }
}

if ($failures.Count -gt 0) {
  Write-Host "Encoding check failed. Fix these files before deploy:" -ForegroundColor Red
  $failures | Format-Table -AutoSize
  exit 1
}

Write-Host "Encoding check passed: all scanned text files are valid UTF-8 and no mojibake markers were found." -ForegroundColor Green
