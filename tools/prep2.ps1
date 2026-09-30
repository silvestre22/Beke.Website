Add-Type -AssemblyName System.Drawing
$root = "D:\OneDrive\Beke"
$out = "$root\website\assets"
$jpg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$ep = New-Object System.Drawing.Imaging.EncoderParameters 1
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]86)

function Save-Crop($src, $x, $y, $w, $h, $tw, $dest, $fmt) {
  $img = [System.Drawing.Image]::FromFile($src)
  $th = [int]($h * $tw / $w)
  $bmp = New-Object System.Drawing.Bitmap $tw, $th
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'; $g.SmoothingMode = 'HighQuality'; $g.PixelOffsetMode = 'HighQuality'
  $g.DrawImage($img, (New-Object System.Drawing.Rectangle 0,0,$tw,$th), (New-Object System.Drawing.Rectangle $x,$y,$w,$h), 'Pixel')
  if ($fmt -eq 'png') { $bmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png) } else { $bmp.Save($dest, $jpg, $ep) }
  $g.Dispose(); $bmp.Dispose(); $img.Dispose()
}

Get-ChildItem "$root\Single Flavor KV pages\*.png" | ForEach-Object {
  $id = $_.BaseName.Substring(3,2)
  Save-Crop $_.FullName 1296 1040 624 1520 400 "$out\flavors\$id.jpg" 'jpg'
}
# Hero devices at higher resolution
Save-Crop "$root\Single Flavor KV pages\KV_06_mineral_water.png" 1296 1040 624 1520 624 "$out\features\hero-device.jpg" 'jpg'
Save-Crop "$root\Single Flavor KV pages\KV_05_cola.png" 1296 1040 624 1520 624 "$out\features\hero-cola.jpg" 'jpg'
Remove-Item "$out\features\hero-device.png","$out\features\tank.jpg","$out\features\battery.jpg" -ErrorAction SilentlyContinue

$op = "$root\One Pager Flavor Card\全口味-带功能.png"
Save-Crop $op 56 385 262 124 524 "$out\features\coil.jpg" 'jpg'
Save-Crop $op 56 580 262 164 524 "$out\features\ripple.jpg" 'jpg'
Save-Crop $op 610 225 156 186 312 "$out\features\tank.jpg" 'jpg'
"done"
