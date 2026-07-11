param(
  [switch] $SkipEncodingCheck
)

$ErrorActionPreference = "Stop"

$root = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
$utf8Strict = New-Object System.Text.UTF8Encoding($false, $true)
$failures = New-Object System.Collections.Generic.List[string]

function Read-TextFile {
  param([string] $RelativePath)

  $path = Join-Path $root $RelativePath
  if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
    throw "Missing file: $RelativePath"
  }

  return $utf8Strict.GetString([System.IO.File]::ReadAllBytes($path))
}

function Add-Failure {
  param([string] $Message)
  $failures.Add($Message)
}

function Assert-Contains {
  param(
    [string] $Text,
    [string] $Needle,
    [string] $Message
  )

  if (-not $Text.Contains($Needle)) {
    Add-Failure $Message
  }
}

function New-StringFromCodepoints {
  param([int[]] $Codepoints)

  $chars = New-Object System.Collections.Generic.List[char]
  foreach ($codepoint in $Codepoints) {
    $chars.Add([char] $codepoint)
  }

  return -join $chars
}

function Count-Matches {
  param(
    [string] $Text,
    [string] $Pattern
  )

  return ([regex]::Matches($Text, $Pattern)).Count
}

$mojibakePatterns = @(
  (New-StringFromCodepoints @(0x00E0, 0x00A4)),
  (New-StringFromCodepoints @(0x00E0, 0x00A5)),
  (New-StringFromCodepoints @(0x00C3)),
  (New-StringFromCodepoints @(0x00E2, 0x20AC)),
  (New-StringFromCodepoints @(0xFFFD))
)

$sadguruMantra = New-StringFromCodepoints @(0x0950,0x0020,0x0936,0x094D,0x0930,0x0940,0x0020,0x0938,0x0926,0x094D,0x0917,0x0941,0x0930,0x0935,0x0947,0x0020,0x0928,0x092E,0x0903)
$satsangAnsh = New-StringFromCodepoints @(0x0938,0x0924,0x094D,0x0938,0x0902,0x0917,0x002D,0x0905,0x0902,0x0936)
$satsangShlokaFirstLine = New-StringFromCodepoints @(0x0924,0x0935,0x0020,0x0915,0x0925,0x093E,0x092E,0x0943,0x0924,0x0902,0x0020,0x0924,0x092A,0x094D,0x0924,0x091C,0x0940,0x0935,0x0928,0x0902,0x0020,0x0915,0x0935,0x093F,0x092D,0x093F,0x0930,0x0940,0x0921,0x093F,0x0924,0x0902,0x0020,0x0915,0x0932,0x094D,0x092E,0x0937,0x093E,0x092A,0x0939,0x092E,0x094D,0x0020,0x0964)
$satsangTitlePrefixCss = 'content: "' + (New-StringFromCodepoints @(0x0938,0x0924,0x094D,0x0938,0x0902,0x0917,0x0020,0x002D)) + '"'

if (-not $SkipEncodingCheck) {
  & (Join-Path $PSScriptRoot "check-encoding.ps1")
}

$index = Read-TextFile "index.html"
$homeIndex = Read-TextFile "home\index.html"
$sw = Read-TextFile "sw.js"
$htaccess = Read-TextFile ".htaccess"

$bundleMatch = [regex]::Match($index, '/assets/index-[^"]+\.js\?v=\d+')
$cssMatch = [regex]::Match($index, '/section-banner-overrides\.css\?v=\d+')
$excerptsMatch = [regex]::Match($index, '/excerpts-playlist\.js\?v=\d+')

if (-not $bundleMatch.Success) {
  Add-Failure "index.html does not reference an active built JS bundle."
}
if (-not $cssMatch.Success) {
  Add-Failure "index.html does not reference section-banner-overrides.css with a cache version."
}
if (-not $excerptsMatch.Success) {
  Add-Failure "index.html does not reference excerpts-playlist.js with a cache version."
}

$bundleRef = $bundleMatch.Value
$cssRef = $cssMatch.Value
$excerptsRef = $excerptsMatch.Value

if ($bundleRef) {
  $bundlePath = $bundleRef.Split("?")[0].TrimStart("/")
  if (-not (Test-Path -LiteralPath (Join-Path $root $bundlePath) -PathType Leaf)) {
    Add-Failure "Active bundle referenced by index.html is missing: $bundlePath"
  } else {
    $bundle = Read-TextFile $bundlePath
    $devanagariCount = Count-Matches $bundle '[\u0900-\u097F]'
    if ($devanagariCount -lt 1000) {
      Add-Failure "Active bundle has too little Devanagari text; it may be corrupted or the wrong bundle."
    }
    Assert-Contains $bundle $sadguruMantra "Active bundle does not contain the main Hindi mantra."
    Assert-Contains $bundle $satsangShlokaFirstLine "Active bundle does not contain the first line of the Satsang shloka banner."
    Assert-Contains $bundle "M8 36C17 33 22 25 18 17" "Active bundle does not contain the refined Satsang floral SVG flourish."
    foreach ($pattern in $mojibakePatterns) {
      if ($bundle.Contains($pattern)) {
        Add-Failure "Active bundle contains mojibake marker U+$(([int][char]$pattern[0]).ToString('X4'))."
        break
      }
    }
  }
}

# Cross-file cache-version consistency (the important one): EVERY versioned asset
# "/<file>.js|css?v=N" referenced in index.html must appear with the SAME ?v=
# number in home/index.html AND in the sw.js app shell. This catches the classic
# mistake of bumping a version in one file but forgetting another, which would
# serve visitors a stale cached file.
$versionedRefs = [regex]::Matches($index, '/[A-Za-z0-9._/-]+\.(?:js|css)\?v=\d+') |
  ForEach-Object { $_.Value } |
  Sort-Object -Unique

if (@($versionedRefs).Count -lt 3) {
  Add-Failure "index.html has fewer versioned (?v=) asset references than expected; cache-busting may be broken."
}

foreach ($reference in $versionedRefs) {
  $bare = $reference.Split("?")[0]
  if (-not $homeIndex.Contains($reference)) {
    Add-Failure "Version mismatch: index.html has '$reference' but home\index.html does not. Bump $bare in home\index.html to match."
  }
  if (-not $sw.Contains($reference)) {
    Add-Failure "Version mismatch: index.html has '$reference' but sw.js app-shell does not. Update the app-shell entry AND bump CACHE_VERSION in sw.js."
  }
}

Assert-Contains $htaccess "AddDefaultCharset UTF-8" ".htaccess does not force UTF-8."
Assert-Contains $htaccess "application/javascript; charset=UTF-8" ".htaccess does not serve JS as UTF-8."

$css = Read-TextFile "section-banner-overrides.css"
Assert-Contains $css "min-height: auto" "Mobile hero blank-space fix is missing from CSS."
Assert-Contains $css "border: 0" "No-border portrait override is missing from CSS."
Assert-Contains $css "width: min(82vw, 21.5rem)" "Mobile portrait enlargement rule is missing from CSS."
Assert-Contains $css "width: min(58vw, 12rem)" "Mobile charan circle enlargement rule is missing from CSS."
Assert-Contains $css "max-height: 680px" "Very-short mobile Namami visibility rule is missing from CSS."
Assert-Contains $css "background: rgba(255, 250, 239, 0.88)" "Compact Satsang shloka ivory card background is missing from CSS."
Assert-Contains $css "max-width: 700px" "Compact Satsang shloka card width cap is missing from CSS."
Assert-Contains $css "padding: 26px clamp(22px, 4vw, 34px)" "Compact Satsang shloka desktop padding is missing from CSS."
Assert-Contains $css "line-height: 1.75" "Compact Satsang shloka line-height is missing from CSS."
Assert-Contains $css "Satsang intro: approved manuscript banner." "Approved Satsang manuscript banner override is missing from CSS."
Assert-Contains $css $satsangTitlePrefixCss "Approved Satsang title prefix is missing from CSS."
Assert-Contains $css "padding: 28px 80px" "Approved Satsang shloka card desktop padding is missing from CSS."
Assert-Contains $css "width: min(92%, 720px)" "Approved Satsang shloka card width is missing from CSS."
Assert-Contains $css "svg:first-of-type" "Approved Satsang side flourish positioning is missing from CSS."
Assert-Contains $css "Satsang intro mobile correction: no title mandala, two-line shloka." "Satsang mobile two-line correction is missing from CSS."
Assert-Contains $css "white-space: pre !important;" "Satsang shloka two-line whitespace rule is missing from CSS."
Assert-Contains $css "width: calc(100vw - 16px)" "Satsang mobile shloka card width rule is missing from CSS."
Assert-Contains $css "font-size: clamp(0.76rem, 3.14vw, 1rem)" "Satsang mobile two-line font sizing rule is missing from CSS."
Assert-Contains $css "Satsang intro refinement final pass." "Satsang final refinement override is missing from CSS."
Assert-Contains $css "font-size: clamp(2.5rem, 4.5vw, 4.15rem)" "Refined Satsang title size is missing from CSS."
Assert-Contains $css "font-style: oblique 8deg" "Refined Satsang Vani oblique style is missing from CSS."
Assert-Contains $css "width: min(90%, 880px)" "Refined Satsang shloka card width is missing from CSS."
Assert-Contains $css "padding: 22px 84px" "Refined Satsang shloka card padding is missing from CSS."
Assert-Contains $css "opacity: 0.025" "Refined subtle Satsang mandala opacity is missing from CSS."
Assert-Contains $css "margin-top: 1.65rem" "Refined Satsang category spacing is missing from CSS."
Assert-Contains $css "Satsang intro refinement: category-row gap lock." "Refined Satsang category visual gap lock is missing from CSS."
Assert-Contains $css "padding-top: 2.55rem" "Refined Satsang category shell top gap is missing from CSS."
Assert-Contains $css "padding-top: 2.25rem" "Refined Satsang mobile category shell top gap is missing from CSS."

$excerpts = Read-TextFile "excerpts-playlist.js"
Assert-Contains $excerpts "function injectExploreCard" "Excerpts explore-card insertion is missing."
Assert-Contains $excerpts "data-excerpts-card-link" "Excerpts homepage card marker is missing."
Assert-Contains $excerpts "targetUrl.pathname !== window.location.pathname" "Excerpts route guard is missing."
Assert-Contains $excerpts $satsangAnsh "Excerpts script does not contain the Satsang-Ansh Hindi label."

$fallback = Read-TextFile "data\excerpts-playlist-fallback.json"
try {
  $fallbackJson = $fallback | ConvertFrom-Json
  if (-not $fallbackJson.videos -or $fallbackJson.videos.Count -lt 1) {
    Add-Failure "Excerpts fallback JSON has no videos."
  }
} catch {
  Add-Failure "Excerpts fallback JSON is invalid."
}
foreach ($pattern in $mojibakePatterns) {
  if ($fallback.Contains($pattern)) {
    Add-Failure "Excerpts fallback JSON contains mojibake marker U+$(([int][char]$pattern[0]).ToString('X4'))."
    break
  }
}

if ($failures.Count -gt 0) {
  Write-Host "Site preflight failed. Fix these before deploy:" -ForegroundColor Red
  foreach ($failure in $failures) {
    Write-Host " - $failure" -ForegroundColor Red
  }
  exit 1
}

Write-Host "Site preflight passed: encoding, cross-file cache versions (all ?v= assets), main Hindi bundle, mobile hero CSS, and Satsang-Ansh checks are clean." -ForegroundColor Green
