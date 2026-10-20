# ==========================================================================
# UPCT Racing Team - Servidor local de desarrollo (solo Windows, sin instalar nada)
#
# Alternativa a "python -m http.server" para equipos sin Python.
# Sirve esta carpeta en http://localhost:8000  (cambia el puerto con -Port 9000).
# Detenerlo: Ctrl+C. No es parte de la web: no hay que subirlo al hosting.
# ==========================================================================
param(
  [int]$Port = 8000,
  [switch]$NoOpen
)

$ErrorActionPreference = 'Stop'
$root = [System.IO.Path]::GetFullPath($PSScriptRoot)

$mime = @{
  '.html' = 'text/html; charset=utf-8';       '.htm'  = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8';        '.js'   = 'text/javascript; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'; '.txt'  = 'text/plain; charset=utf-8'
  '.md'   = 'text/plain; charset=utf-8';      '.svg'  = 'image/svg+xml'
  '.png'  = 'image/png';  '.jpg' = 'image/jpeg'; '.jpeg' = 'image/jpeg'
  '.webp' = 'image/webp'; '.avif' = 'image/avif'; '.gif' = 'image/gif'; '.ico' = 'image/x-icon'
  '.woff' = 'font/woff';  '.woff2' = 'font/woff2'
  '.glb'  = 'model/gltf-binary'; '.gltf' = 'model/gltf+json'; '.bin' = 'application/octet-stream'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
try { $listener.Start() }
catch {
  Write-Host "No se pudo abrir el puerto $Port (quizas ya esta en uso). Prueba con: -Port 8080" -ForegroundColor Yellow
  exit 1
}

Write-Host ""
Write-Host "  UPCT Racing Team - servidor local" -ForegroundColor Cyan
Write-Host "  Abre:  http://localhost:$Port/"
Write-Host "  Carpeta: $root"
Write-Host "  Pulsa Ctrl+C para detenerlo."
Write-Host ""
if (-not $NoOpen) { Start-Process "http://localhost:$Port/" }

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $res = $ctx.Response
    try {
      $rel = [System.Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart('/')
      if ($rel -eq '') { $rel = 'index.html' }
      $full = [System.IO.Path]::GetFullPath((Join-Path $root ($rel -replace '/', '\')))

      if (-not $full.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
        $res.StatusCode = 403
      }
      elseif ((Test-Path -LiteralPath $full -PathType Container) -and (Test-Path -LiteralPath (Join-Path $full 'index.html'))) {
        $full = Join-Path $full 'index.html'
      }

      if ($res.StatusCode -eq 200 -and (Test-Path -LiteralPath $full -PathType Leaf)) {
        $ext = [System.IO.Path]::GetExtension($full).ToLowerInvariant()
        $type = $mime[$ext]
        if (-not $type) { $type = 'application/octet-stream' }
        $bytes = [System.IO.File]::ReadAllBytes($full)
        $res.ContentType = $type
        $res.Headers.Add('Cache-Control', 'no-cache')
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
        Write-Host ("  200  /" + $rel)
      }
      elseif ($res.StatusCode -eq 200) {
        $res.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("404 - No encontrado: /$rel")
        $res.ContentType = 'text/plain; charset=utf-8'
        $res.OutputStream.Write($msg, 0, $msg.Length)
        Write-Host ("  404  /" + $rel) -ForegroundColor DarkYellow
      }
    }
    catch { Write-Host ("  ERR  " + $_.Exception.Message) -ForegroundColor Red }
    finally { $res.Close() }
  }
}
finally { $listener.Stop() }
