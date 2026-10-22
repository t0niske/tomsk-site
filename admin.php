<?php
// Админка «Куда сходить в Томске»: заведения, фото, заявки.
// Вход по паролю из config.php. Данные сайта — data/venues.json (перед каждым сохранением делается копия в data/backup/).
require __DIR__ . '/config.php';
session_name('kss_admin');
session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'httponly' => true, 'samesite' => 'Strict', 'secure' => !empty($_SERVER['HTTPS'])]);
session_start();

const DATA = __DIR__ . '/data/venues.json';
const BACK = __DIR__ . '/data/backup';
const UPL = __DIR__ . '/uploads';
const REP = __DIR__ . '/reports';

function out($d, $code = 200) { http_response_code($code); header('Content-Type: application/json; charset=utf-8'); echo json_encode($d, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); exit; }
function fail($m, $code = 400) { out(['ok' => false, 'error' => $m], $code); }
function authed() { return !empty($_SESSION['ok']) && ($_SESSION['t'] ?? 0) > time() - 12 * 3600; }
function body() { $j = json_decode(file_get_contents('php://input'), true); return is_array($j) ? $j : []; }
function load() { $j = json_decode(@file_get_contents(DATA), true); return is_array($j) && isset($j['items']) ? $j : ['v' => 1, 'items' => []]; }
function save_all($db) {
  @mkdir(BACK, 0750, true);
  if (is_file(DATA)) copy(DATA, BACK . '/venues-' . date('Ymd-His') . '.json');
  $old = glob(BACK . '/venues-*.json'); sort($old); while (count($old) > 40) @unlink(array_shift($old));   // храним 40 последних копий
  $db['updated'] = date('c');
  $tmp = DATA . '.tmp';
  file_put_contents($tmp, json_encode($db, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
  rename($tmp, DATA);
}
function with_lock($fn) { $l = fopen(__DIR__ . '/data/.lock', 'c'); flock($l, LOCK_EX); try { return $fn(); } finally { flock($l, LOCK_UN); fclose($l); } }

// сжатие фото: длинная сторона до 1600 px, JPEG, без EXIF (геометки с телефона не утекут)
function store_image($tmp, $base) {
  $info = @getimagesize($tmp); if (!$info) return null;
  @mkdir(UPL, 0755, true);
  $name = $base . '-' . bin2hex(random_bytes(4)) . '.jpg';
  if (function_exists('imagecreatefromstring')) {
    $im = @imagecreatefromstring(file_get_contents($tmp)); if (!$im) return null;
    // поворот по EXIF, чтобы снимки с телефона не лежали на боку
    if (function_exists('exif_read_data') && ($info[2] ?? 0) === IMAGETYPE_JPEG) {
      $o = @exif_read_data($tmp)['Orientation'] ?? 1;
      if ($o == 3) $im = imagerotate($im, 180, 0); elseif ($o == 6) $im = imagerotate($im, -90, 0); elseif ($o == 8) $im = imagerotate($im, 90, 0);
    }
    $w = imagesx($im); $h = imagesy($im); $k = min(1, 1600 / max($w, $h));
    $dst = imagecreatetruecolor(max(1, (int)round($w * $k)), max(1, (int)round($h * $k)));
    imagefill($dst, 0, 0, imagecolorallocate($dst, 255, 255, 255));
    imagecopyresampled($dst, $im, 0, 0, 0, 0, imagesx($dst), imagesy($dst), $w, $h);
    imagejpeg($dst, UPL . '/' . $name, 82); imagedestroy($im); imagedestroy($dst);
  } else {
    if (!in_array($info[2], [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP])) return null;
    $name = preg_replace('/\.jpg$/', image_type_to_extension($info[2]), $name);
    copy($tmp, UPL . '/' . $name);
  }
  return 'uploads/' . $name;
}
function clean_item($it) {
  $s = fn($k, $n = 500) => mb_substr(trim((string)($it[$k] ?? '')), 0, $n);
  $cats = ['food', 'bar', 'culture', 'church', 'nature', 'fun', 'shop', 'sight', 'stay'];
  $o = ['id' => preg_replace('/[^a-zA-Z0-9_-]/', '', (string)($it['id'] ?? '')), 'name' => $s('name', 160), 'cat' => in_array($it['cat'] ?? '', $cats) ? $it['cat'] : 'food',
        'lat' => round((float)($it['lat'] ?? 0), 6), 'lon' => round((float)($it['lon'] ?? 0), 6)];
  foreach (['kind' => 80, 'addr' => 200, 'hours' => 300, 'prices' => 300, 'phone' => 60, 'web' => 300, 'why' => 300, 'desc' => 4000, 'cuisine' => 120, 'checked' => 10, 'src' => 300, 'scene' => 20, 'origin' => 10, 'about' => 6000, 'look' => 1500, 'tips' => 1500] as $k => $n) { $v = $s($k, $n); if ($v !== '') $o[$k] = $v; }
  foreach (['price', 'mins', 'mx', 'my'] as $k) if (isset($it[$k]) && $it[$k] !== '' && $it[$k] !== null && is_numeric($it[$k])) $o[$k] = (int)$it[$k];
  foreach (['pick', 'feat', 'hidden'] as $k) if (!empty($it[$k])) $o[$k] = true;
  $moods = array_values(array_intersect((array)($it['moods'] ?? []), ['date', 'friends', 'kids', 'solo', 'rain', 'wood', 'night', 'free'])); if ($moods) $o['moods'] = $moods;
  if (!empty($it['tags']) && is_array($it['tags'])) $o['tags'] = array_slice(array_map(fn($t) => mb_substr((string)$t, 0, 40), $it['tags']), 0, 4);
  $ph = [];
  foreach ((array)($it['photos'] ?? []) as $p) {
    $src = (string)($p['src'] ?? '');
    if (!preg_match('~^(uploads/[\w.-]+|https://upload\.wikimedia\.org/\S+)$~', $src)) continue;
    $q = ['src' => $src]; foreach (['credit' => 120, 'license' => 40, 'link' => 300] as $k => $n) if (!empty($p[$k])) $q[$k] = mb_substr((string)$p[$k], 0, $n);
    $ph[] = $q;
  }
  if ($ph) $o['photos'] = array_slice($ph, 0, 12);
  return $o;
}

// ---------- API ----------
$a = $_GET['a'] ?? '';
if ($a !== '') {
  if ($a === 'login') {
    if (ADMIN_PASSWORD === 'поменяйте-этот-пароль' || mb_strlen(ADMIN_PASSWORD) < 10) fail('Сначала задайте пароль в config.php (не короче 10 символов)', 403);
    @mkdir(__DIR__ . '/data', 0755, true);
    $f = __DIR__ . '/data/.login_' . md5($_SERVER['REMOTE_ADDR'] ?? '-');
    $tries = array_filter(explode("\n", @file_get_contents($f) ?: ''), fn($t) => $t && $t > time() - 900);
    if (count($tries) >= 8) fail('Слишком много попыток. Подождите 15 минут.', 429);
    if (!hash_equals(ADMIN_PASSWORD, (string)(body()['password'] ?? ''))) { $tries[] = time(); file_put_contents($f, implode("\n", $tries)); usleep(400000); fail('Неверный пароль', 403); }
    @unlink($f); session_regenerate_id(true); $_SESSION['ok'] = 1; $_SESSION['t'] = time(); out(['ok' => true]);
  }
  if (!authed()) fail('Нужно войти', 401);
  if (($_SERVER['HTTP_X_REQ'] ?? '') !== '1') fail('bad request', 400);   // защита от подделки запросов с чужих сайтов
  $_SESSION['t'] = time();
  switch ($a) {
    case 'logout': session_destroy(); out(['ok' => true]);
    case 'data':
      $st = json_decode(@file_get_contents(REP . '/state.json'), true) ?: [];
      $reps = array_reverse(array_values(array_filter(array_map(fn($l) => json_decode($l, true), @file(REP . '/reports.jsonl', FILE_IGNORE_NEW_LINES) ?: []))));
      foreach ($reps as &$r) $r['done'] = !empty($st[$r['id']]);
      $bk = glob(BACK . '/venues-*.json') ?: []; rsort($bk);
      out(['ok' => true, 'db' => load(), 'reports' => $reps, 'backups' => array_map('basename', array_slice($bk, 0, 40)), 'gd' => function_exists('imagecreatefromstring')]);
    case 'save':
      $it = clean_item(body()['item'] ?? []);
      if ($it['name'] === '') fail('Укажите название');
      if (!$it['lat'] || !$it['lon']) fail('Поставьте место на карте');
      $r = with_lock(function () use ($it) {
        $db = load(); if ($it['id'] === '') { $it['id'] = 'n' . date('ymdHis') . bin2hex(random_bytes(2)); $it['origin'] = 'admin'; }
        $i = array_search($it['id'], array_column($db['items'], 'id'));
        if ($i === false) $db['items'][] = $it; else { if (!empty($db['items'][$i]['origin']) && empty($it['origin'])) $it['origin'] = $db['items'][$i]['origin']; $db['items'][$i] = $it; }
        save_all($db); return $it;
      });
      out(['ok' => true, 'item' => $r]);
    case 'delete':
      $id = (string)(body()['id'] ?? '');
      $r = with_lock(function () use ($id) {
        $db = load(); $i = array_search($id, array_column($db['items'], 'id')); if ($i === false) return 'нет такого места';
        $it = $db['items'][$i];
        // места из OpenStreetMap не удаляем совсем, а скрываем — иначе они вернутся при следующем обновлении карты
        if (($it['origin'] ?? '') === 'osm' || ($it['origin'] ?? '') === 'editor') { $db['items'][$i]['hidden'] = true; $res = 'hidden'; }
        else { array_splice($db['items'], $i, 1); $res = 'deleted'; }
        save_all($db); return $res;
      });
      if ($r === 'нет такого места') fail($r);
      out(['ok' => true, 'result' => $r]);
    case 'upload':
      if (empty($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) fail('Файл не загрузился');
      if ($_FILES['photo']['size'] > 15e6) fail('Файл больше 15 МБ');
      $src = store_image($_FILES['photo']['tmp_name'], preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['id'] ?? 'new') ?: 'new');
      if (!$src) fail('Это не похоже на фотографию (нужен JPEG, PNG или WebP)');
      out(['ok' => true, 'src' => $src]);
    case 'report_photo_import':
      $n = basename((string)(body()['name'] ?? '')); $fp = REP . '/photos/' . $n;
      if (!is_file($fp)) fail('Фото не найдено');
      $src = store_image($fp, 'r'); if (!$src) fail('Не получилось обработать фото');
      out(['ok' => true, 'src' => $src]);
    case 'report_done':
      $b = body(); $st = json_decode(@file_get_contents(REP . '/state.json'), true) ?: [];
      if (!empty($b['done'])) $st[(string)$b['id']] = 1; else unset($st[(string)$b['id']]);
      @mkdir(REP, 0750, true); file_put_contents(REP . '/state.json', json_encode($st)); out(['ok' => true]);
    case 'restore':
      $f = basename((string)(body()['file'] ?? '')); $fp = BACK . '/' . $f;
      if (!preg_match('/^venues-\d{8}-\d{6}\.json$/', $f) || !is_file($fp)) fail('Копия не найдена');
      $db = json_decode(file_get_contents($fp), true); if (!$db || !isset($db['items'])) fail('Копия повреждена');
      with_lock(fn() => save_all($db)); out(['ok' => true]);
  }
  fail('unknown');
}
// фото из заявок (закрытая папка) — только для вошедшего
if (isset($_GET['rphoto'])) {
  if (!authed()) { http_response_code(403); exit; }
  $fp = REP . '/photos/' . basename($_GET['rphoto']); if (!is_file($fp)) { http_response_code(404); exit; }
  header('Content-Type: ' . mime_content_type($fp)); header('Cache-Control: private, max-age=3600'); readfile($fp); exit;
}
header('X-Frame-Options: DENY'); header('Referrer-Policy: same-origin');
?><!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Админка · Куда сходить в Томске</title><meta name="robots" content="noindex,nofollow">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css">
<link rel="stylesheet" href="admin-app.css?v=1">
</head><body>
<div id="app"><div class="boot">Загрузка…</div></div>
<script>window.ADMIN_AUTHED=<?= authed() ? 'true' : 'false' ?>;</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
<script src="admin-app.js?v=1"></script>
</body></html>
