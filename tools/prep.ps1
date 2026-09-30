Add-Type -AssemblyName System.Drawing
$root = "D:\OneDrive\Beke"
$out = "$root\website\assets"
New-Item -ItemType Directory -Force "$out\flavors","$out\kv","$out\features","$out\pack" | Out-Null

$jpg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$ep = New-Object System.Drawing.Imaging.EncoderParameters 1
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]84)

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

# Flavor KVs: device crop + full page (downsized) + background color
$colors = @{}
Get-ChildItem "$root\Single Flavor KV pages\*.png" | ForEach-Object {
  $id = $_.BaseName.Substring(3,2)
  $img = [System.Drawing.Bitmap]::FromFile($_.FullName)
  $c = $img.GetPixel(30, 30); $c2 = $img.GetPixel(1000, 2000)
  $colors[$id] = @('#{0:x2}{1:x2}{2:x2}' -f $c.R,$c.G,$c.B, '#{0:x2}{1:x2}{2:x2}' -f $c2.R,$c2.G,$c2.B)
  $img.Dispose()
  Save-Crop $_.FullName 1270 1020 690 1570 420 "$out\flavors\$id.jpg" 'jpg'
  Save-Crop $_.FullName 0 0 2160 2700 1080 "$out\kv\$id.jpg" 'jpg'
}
$colors.GetEnumerator() | Sort-Object Name | ForEach-Object { "$($_.Name) $($_.Value -join ' ')" }

# Features from the one-pager (3240x4818)
$op = "$root\One Pager Flavor Card\全口味-带功能.png"
Save-Crop $op 900 280 520 1220 520 "$out\features\hero-device.png" 'png'
Save-Crop $op 135 800 640 420 640 "$out\features\coil.jpg" 'jpg'
Save-Crop $op 135 1300 640 490 640 "$out\features\ripple.jpg" 'jpg'
Save-Crop $op 1475 520 370 470 370 "$out\features\tank.jpg" 'jpg'
Save-Crop $op 1475 1410 370 320 370 "$out\features\battery.jpg" 'jpg'
Save-Crop "$root\One Pager Flavor Card\全口味-带凉度指引.png" 0 0 3240 4818 1400 "$out\flavor-profile.jpg" 'jpg'

# Packaging (small box) for a few flavors
foreach ($n in 'greem grape ice','raw cola ice','watermelon ice','mineral water') {
  $src = "$root\小盒包装效果图\$n.png"
  $i = [System.Drawing.Image]::FromFile($src); $w=$i.Width; $h=$i.Height; $i.Dispose()
  Save-Crop $src 0 0 $w $h 500 "$out\pack\$($n -replace ' ','-').png" 'png'
}

Copy-Item "$root\宣传视频\553.MP4" "$out\promo.mp4" -Force
Get-ChildItem -Recurse $out | Measure-Object Length -Sum | Select-Object Count, Sum
