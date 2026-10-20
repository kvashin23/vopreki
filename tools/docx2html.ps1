# Конвертер юридических документов .docx → HTML-фрагмент для src/legal/*.html
#   powershell -NoProfile -ExecutionPolicy Bypass -File tools/docx2html.ps1 -Docx src/legal/privacy.docx -Out src/legal/privacy.js -Skip 1
# -Skip N — сколько первых непустых абзацев пропустить (заголовок документа выводит шаблон страницы).
# Сохраняет абзацы, жирный/курсив, списки (нумерованные и маркированные, с вложенностью) и таблицы.
param([Parameter(Mandatory)][string]$Docx, [Parameter(Mandatory)][string]$Out, [int]$Skip = 0)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'

function ReadPart($zip, $name) {
  $e = $zip.GetEntry($name); if (-not $e) { return $null }
  $r = New-Object IO.StreamReader($e.Open(), [Text.Encoding]::UTF8); $x = $r.ReadToEnd(); $r.Close()
  $doc = New-Object Xml.XmlDocument; $doc.LoadXml($x); $doc
}
$zip = [IO.Compression.ZipFile]::OpenRead((Resolve-Path -LiteralPath $Docx))
$d = ReadPart $zip 'word/document.xml'; $num = ReadPart $zip 'word/numbering.xml'; $zip.Dispose()
$ns = New-Object Xml.XmlNamespaceManager($d.NameTable); $ns.AddNamespace('w', $W)
function A($node, $xp) { $n = $node.SelectSingleNode($xp, $ns); if ($n) { $n.GetAttribute('val', $W) } else { $null } }

# numId → (ilvl → формат: bullet / decimal / …)
$fmt = @{}
if ($num) {
  $nsn = New-Object Xml.XmlNamespaceManager($num.NameTable); $nsn.AddNamespace('w', $W)
  $abs = @{}
  foreach ($a in $num.SelectNodes('//w:abstractNum', $nsn)) {
    $lv = @{}; foreach ($l in $a.SelectNodes('w:lvl', $nsn)) { $lv[$l.GetAttribute('ilvl', $W)] = $l.SelectSingleNode('w:numFmt', $nsn).GetAttribute('val', $W) }
    $abs[$a.GetAttribute('abstractNumId', $W)] = $lv
  }
  foreach ($n in $num.SelectNodes('//w:num', $nsn)) { $fmt[$n.GetAttribute('numId', $W)] = $abs[$n.SelectSingleNode('w:abstractNumId', $nsn).GetAttribute('val', $W)] }
}

function Esc([string]$s) { $s.Replace('&', '&amp;').Replace('<', '&lt;').Replace('>', '&gt;') }
function Linkify([string]$h) {
  $h = [regex]::Replace($h, '(https?://[^\s<,;]+[^\s<,;.)])', '<a href="$1" target="_blank" rel="noopener">$1</a>')
  [regex]::Replace($h, '(?<![\w.@/])([\w.\-]+@[\w\-]+\.[\w.\-]+\w)', '<a href="mailto:$1">$1</a>')
}
function Inline($p) {
  $html = ''; $plain = ''; $allBold = $true; $any = $false
  foreach ($r in $p.SelectNodes('.//w:r', $ns)) {
    $b = [bool]$r.SelectSingleNode('w:rPr/w:b[not(@w:val="0") and not(@w:val="false")]', $ns)
    $i = [bool]$r.SelectSingleNode('w:rPr/w:i[not(@w:val="0") and not(@w:val="false")]', $ns)
    $s = ''
    foreach ($c in $r.ChildNodes) {
      switch ($c.LocalName) { 't' { $s += Esc $c.InnerText } 'tab' { $s += ' ' } 'br' { $s += '<br>' } }
    }
    if ($s -eq '') { continue }
    $plain += $s
    if ($s.Trim() -ne '' -and $s -ne '<br>') { $any = $true; if (-not $b) { $allBold = $false } }
    if ($i) { $s = "<em>$s</em>" }
    if ($b) { $s = "<strong>$s</strong>" }
    $html += $s
  }
  $html = $html.Replace('</strong><strong>', '').Replace('</em><em>', '')
  $html = ($html -replace '\s{2,}', ' ' -replace '(<br>\s*)+$', '').Trim()
  [pscustomobject]@{ Html = (Linkify $html); Text = ($plain -replace '<br>', ' ').Trim(); Bold = ($any -and $allBold) }
}
function Strip-Strong([string]$h) { $h -replace '</?strong>', '' }

$sb = New-Object Text.StringBuilder
$stack = New-Object System.Collections.Generic.List[string]   # открытые списки: 'ul' / 'ol'
function CloseLists([int]$to) { while ($stack.Count -gt $to) { [void]$sb.Append("</li></$($stack[$stack.Count-1])>`n"); $stack.RemoveAt($stack.Count - 1) } }

$skipped = 0
$cnt = @{}   # сквозная нумерация: numId/ilvl → номер пункта
foreach ($el in $d.SelectSingleNode('//w:body', $ns).ChildNodes) {
  if ($el.LocalName -eq 'p') {
    $x = Inline $el
    if ($x.Text -eq '') { continue }
    if ($skipped -lt $Skip) { $skipped++; continue }
    $numId = A $el 'w:pPr/w:numPr/w:numId'
    if ($numId -and $numId -ne '0') {
      $lvl = [int](A $el 'w:pPr/w:numPr/w:ilvl')
      $f = 'bullet'; if ($fmt[$numId] -and $fmt[$numId]["$lvl"]) { $f = $fmt[$numId]["$lvl"] }
      $tag = if ($f -eq 'bullet' -or $f -eq 'none') { 'ul' } else { 'ol' }
      $depth = $lvl + 1
      $key = "$numId/$lvl"; $cnt[$key] = 1 + [int]$cnt[$key]
      $start = if ($tag -eq 'ol' -and $cnt[$key] -gt 1) { " start=`"$($cnt[$key])`"" } else { '' }
      if ($stack.Count -gt $depth) { CloseLists $depth }
      if ($stack.Count -eq $depth -and $stack[$depth - 1] -ne $tag) { CloseLists ($depth - 1) }
      if ($stack.Count -eq $depth) { [void]$sb.Append("</li>`n<li>$($x.Html)") }
      else { while ($stack.Count -lt $depth) { $st = if ($stack.Count -eq $depth - 1) { $start } else { '' }; [void]$sb.Append("<$tag$st>`n<li>"); $stack.Add($tag) }; [void]$sb.Append($x.Html) }
      continue
    }
    CloseLists 0
    if ($x.Bold -and $x.Text.Length -lt 140) { [void]$sb.Append("<h2>$(Strip-Strong $x.Html)</h2>`n") }
    else { [void]$sb.Append("<p>$($x.Html)</p>`n") }
  } elseif ($el.LocalName -eq 'tbl') {
    CloseLists 0
    [void]$sb.Append("<div class=`"tbl`"><table>`n")
    $first = $true
    foreach ($tr in $el.SelectNodes('w:tr', $ns)) {
      $cells = @($tr.SelectNodes('w:tc', $ns) | ForEach-Object {
        $ps = @($_.SelectNodes('w:p', $ns) | ForEach-Object { Inline $_ } | Where-Object { $_.Text -ne '' })
        [pscustomobject]@{ Html = (($ps | ForEach-Object { $_.Html }) -join '<br>'); Bold = ($ps.Count -gt 0 -and -not ($ps | Where-Object { -not $_.Bold })); Span = (A $_ 'w:tcPr/w:gridSpan') }
      })
      $head = $first -and $cells.Count -gt 1 -and -not ($cells | Where-Object { -not $_.Bold })
      $tagc = if ($head) { 'th' } else { 'td' }
      [void]$sb.Append('<tr>' + (($cells | ForEach-Object { $sp = if ($_.Span) { " colspan=`"$($_.Span)`"" } else { '' }; $h = if ($head) { Strip-Strong $_.Html } else { $_.Html }; "<$tagc$sp>$h</$tagc>" }) -join '') + "</tr>`n")
      $first = $false
    }
    [void]$sb.Append("</table></div>`n")
  }
}
CloseLists 0
$dir = Split-Path -Parent $Out; if ($dir) { New-Item -ItemType Directory -Force $dir | Out-Null }
$html = $sb.ToString()
# чистка: двойные переносы, переносы в начале/конце ячеек и пустые выделения
$html = $html -replace '(<br>\s*)+</strong>', '</strong><br>' -replace '(<br>\s*)+</em>', '</em><br>'
$html = $html -replace '<strong>(\s|<br>)*</strong>', '' -replace '<em>(\s|<br>)*</em>', '' -replace '(<br>\s*){2,}', '<br>'
$html = $html -replace '(<t[dh][^>]*>)(\s|<br>)+', '$1' -replace '(\s|<br>)+(</t[dh]>)', '$2' -replace '(<br>\s*)+(</(p|li|h2)>)', '$2'
# .js — ES-модуль для src/render.js, иначе — HTML-фрагмент
if ($Out -like '*.js') { $html = "// Сгенерировано tools/docx2html.ps1 из $(Split-Path -Leaf $Docx) — не править вручную`nexport default " + (ConvertTo-Json -InputObject $html) + ";`n" }
[IO.File]::WriteAllText((Join-Path (Get-Location) $Out), $html, (New-Object Text.UTF8Encoding($false)))
Write-Host "OK $Out"
