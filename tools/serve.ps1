# Локальный сервер сайта (без Node и Python):
#   powershell -NoProfile -ExecutionPolicy Bypass -File tools/serve.ps1
# Открывает http://localhost:5173. Красивые адреса /padel/ → padel/index.html.
# Страница http://localhost:5173/tools/build.html пересобирает HTML: она отправляет
# готовые файлы сюда (POST /__write), а сервер записывает их в папку проекта.
param([int]$Port = 5173)
$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath((Split-Path -Parent $PSScriptRoot)).TrimEnd('\') + '\'
$types = @{
  '.html' = 'text/html; charset=utf-8'; '.css' = 'text/css; charset=utf-8'; '.js' = 'text/javascript; charset=utf-8'
  '.mjs' = 'text/javascript; charset=utf-8'; '.json' = 'application/json; charset=utf-8'; '.svg' = 'image/svg+xml'
  '.png' = 'image/png'; '.jpg' = 'image/jpeg'; '.jpeg' = 'image/jpeg'; '.webp' = 'image/webp'; '.ico' = 'image/x-icon'
  '.ttf' = 'font/ttf'; '.woff2' = 'font/woff2'; '.xml' = 'application/xml; charset=utf-8'; '.txt' = 'text/plain; charset=utf-8'
}
$utf8 = New-Object System.Text.UTF8Encoding($false)
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Сайт: http://localhost:$Port/   Сборка: http://localhost:$Port/tools/build.html"

function Send($ctx, [int]$code, [byte[]]$bytes, [string]$type) {
  $ctx.Response.StatusCode = $code
  $ctx.Response.ContentType = $type
  $ctx.Response.Headers.Add('Cache-Control', 'no-store')
  $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  $ctx.Response.Close()
}

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  try {
    $req = $ctx.Request
    $rel = [Uri]::UnescapeDataString($req.Url.AbsolutePath).TrimStart('/')

    # Запись собранных страниц: только .html/.xml/.txt и только вне служебных папок
    if ($req.HttpMethod -eq 'POST' -and $rel -eq '__write') {
      $target = $req.QueryString['path']
      $ok = $target -and $target -match '^[a-z0-9\-/]+\.(html|xml|txt)$' -and $target -notmatch '(^|/)\.\.(/|$)' -and $target -notmatch '^(tools|src|assets)/'
      if (-not $ok) { Send $ctx 400 $utf8.GetBytes("bad path: $target") 'text/plain'; continue }
      $reader = New-Object IO.StreamReader($req.InputStream, $utf8)
      $body = $reader.ReadToEnd(); $reader.Close()
      $file = [IO.Path]::GetFullPath((Join-Path $root $target))
      if (-not $file.StartsWith($root)) { Send $ctx 400 $utf8.GetBytes('outside root') 'text/plain'; continue }
      New-Item -ItemType Directory -Force -Path (Split-Path -Parent $file) | Out-Null
      [IO.File]::WriteAllText($file, $body, $utf8)
      Send $ctx 200 $utf8.GetBytes("ok $target") 'text/plain'
      continue
    }

    $file = [IO.Path]::GetFullPath((Join-Path $root $rel))
    if (-not $file.StartsWith($root.TrimEnd('\'))) { Send $ctx 403 $utf8.GetBytes('forbidden') 'text/plain'; continue }
    if (Test-Path $file -PathType Container) {
      if (-not $req.Url.AbsolutePath.EndsWith('/')) { $ctx.Response.Redirect($req.Url.AbsolutePath + '/'); $ctx.Response.Close(); continue }
      $file = Join-Path $file 'index.html'
    }
    if (Test-Path $file -PathType Leaf) {
      $ext = [IO.Path]::GetExtension($file).ToLower()
      $type = $types[$ext]; if (-not $type) { $type = 'application/octet-stream' }
      Send $ctx 200 ([IO.File]::ReadAllBytes($file)) $type
    } else {
      $nf = Join-Path $root '404.html'
      if (Test-Path $nf) { Send $ctx 404 ([IO.File]::ReadAllBytes($nf)) 'text/html; charset=utf-8' }
      else { Send $ctx 404 $utf8.GetBytes('not found') 'text/plain' }
    }
  } catch {
    try { Send $ctx 500 $utf8.GetBytes($_.ToString()) 'text/plain' } catch {}
  }
}
