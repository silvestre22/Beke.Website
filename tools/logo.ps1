Add-Type -AssemblyName System.Drawing
$src = [System.Drawing.Bitmap]::FromFile("D:\OneDrive\Beke\Single Flavor KV pages\KV_06_mineral_water.png")
$x0=115; $y0=100; $w=500; $h=270
$bg = $src.GetPixel(30,30); $bl = ($bg.R+$bg.G+$bg.B)/3
foreach ($pair in @(@('logo-dark.png',0),@('logo-light.png',255))) {
  $bmp = New-Object System.Drawing.Bitmap $w,$h,([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  for ($y=0;$y -lt $h;$y++){ for($x=0;$x -lt $w;$x++){
    $c=$src.GetPixel($x0+$x,$y0+$y); $l=($c.R+$c.G+$c.B)/3
    $a=[int][Math]::Max(0,[Math]::Min(255,($bl-$l)/$bl*255*1.08))
    $v=$pair[1]
    $bmp.SetPixel($x,$y,[System.Drawing.Color]::FromArgb($a,$v,$v,$v))
  }}
  $bmp.Save("D:\OneDrive\Beke\website\assets\$($pair[0])",[System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()
}
$src.Dispose(); "ok"
