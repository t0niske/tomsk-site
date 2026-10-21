<?php
// Приём заявок «Я владелец / нашли ошибку / добавить место».
// Заявки складываются в папку reports/ (закрыта от просмотра извне), фото — в reports/photos/.
// Читать заявки: откройте admin.php?key=ВАШ_КЛЮЧ (ключ задаётся в config.php).
header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/config.php';

function fail($m, $code = 400) { http_response_code($code); echo json_encode(['ok' => false, 'error' => $m], JSON_UNESCAPED_UNICODE); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('method');
if (!empty($_POST['website2'])) { echo json_encode(['ok' => true]); exit; }          // ловушка для ботов
if (empty($_POST['consent'])) fail('Нужно согласие на публикацию');

// не больше 10 заявок в час с одного адреса
$dir = __DIR__ . '/reports'; @mkdir($dir . '/photos', 0750, true);
$ip = $_SERVER['REMOTE_ADDR'] ?? '-';
$rl = $dir . '/.rate_' . md5($ip);
$hits = array_filter(explode("\n", @file_get_contents($rl) ?: ''), fn($t) => $t && $t > time() - 3600);
if (count($hits) >= 10) fail('Слишком много заявок, попробуйте позже', 429);
$hits[] = time(); file_put_contents($rl, implode("\n", $hits));

$f = fn($k, $n = 500) => mb_substr(trim((string)($_POST[$k] ?? '')), 0, $n);
$id = date('Ymd-His') . '-' . bin2hex(random_bytes(3));
$rec = ['id' => $id, 'time' => date('c'), 'who' => $f('who', 20), 'place' => $f('place', 120), 'hours' => $f('hours', 200), 'prices' => $f('prices', 200),
        'phone' => $f('phone', 40), 'web' => $f('web', 200), 'text' => $f('text', 3000), 'contact' => $f('contact', 120), 'photos' => []];
if ($rec['place'] === '') fail('Укажите название места');

// фото: только jpeg/png/webp, до 5 штук по 8 МБ, пересохраняем под своим именем
if (!empty($_FILES['photos']['name'][0])) {
  $ok = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
  for ($i = 0; $i < min(5, count($_FILES['photos']['name'])); $i++) {
    if ($_FILES['photos']['error'][$i] !== UPLOAD_ERR_OK || $_FILES['photos']['size'][$i] > 8e6) continue;
    $tmp = $_FILES['photos']['tmp_name'][$i]; $type = mime_content_type($tmp);
    if (!isset($ok[$type]) || !@getimagesize($tmp)) continue;
    $name = $id . '-' . ($i + 1) . '.' . $ok[$type];
    if (move_uploaded_file($tmp, $dir . '/photos/' . $name)) $rec['photos'][] = $name;
  }
}
file_put_contents($dir . '/reports.jsonl', json_encode($rec, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);

// уведомление на почту (если указана в config.php)
if (NOTIFY_EMAIL) {
  $body = "Новая заявка: {$rec['place']}\nКто: {$rec['who']}\nЧасы: {$rec['hours']}\nЦены: {$rec['prices']}\nТелефон: {$rec['phone']}\nСайт: {$rec['web']}\n\n{$rec['text']}\n\nКонтакт: {$rec['contact']}\nФото: " . count($rec['photos']);
  @mail(NOTIFY_EMAIL, '=?UTF-8?B?' . base64_encode('Куда сходить: ' . $rec['place']) . '?=', $body, "Content-Type: text/plain; charset=utf-8");
}
echo json_encode(['ok' => true, 'id' => $id]);
