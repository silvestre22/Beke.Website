# Builds the social share image (1200x630) and square icons from assets/logo-dark.png
Add-Type -AssemblyName System.Drawing
$root = Split-Path $PSScriptRoot -Parent
$logo = [System.Drawing.Image]::FromFile("$root\assets\logo-dark.png")
$jpg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$ep = New-Object System.Drawing.Imaging.EncoderParameters 1
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]90)

function New-Canvas($w, $h, $logoW, $dest, $fmt) {
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'; $g.SmoothingMode = 'HighQuality'; $g.PixelOffsetMode = 'HighQuality'
  $g.Clear([System.Drawing.Color]::White)
  $lh = [int]($logo.Height * $logoW / $logo.Width)
  $g.DrawImage($logo, [int](($w - $logoW) / 2), [int](($h - $lh) / 2), $logoW, $lh)
  if ($fmt -eq 'png') { $bmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png) } else { $bmp.Save($dest, $jpg, $ep) }
  $g.Dispose(); $bmp.Dispose()
}

New-Canvas 1200 630 620 "$root\assets\og-image.jpg" 'jpg'
New-Canvas 180 180 150 "$root\assets\apple-touch-icon.png" 'png'
New-Canvas 512 512 420 "$root\assets\icon-512.png" 'png'
New-Canvas 32 32 30 "$root\assets\favicon-32.png" 'png'
$logo.Dispose()
Get-ChildItem "$root\assets\og-image.jpg","$root\assets\*icon*.png","$root\assets\favicon-32.png" | Select-Object Name, Length
