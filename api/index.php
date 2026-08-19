<?php
declare(strict_types=1);

const NAME_MAX_LENGTH = 50;
const MESSAGE_MAX_LENGTH = 100000;
const IMAGE_MAX_BYTES = 1048576;
const SUBMISSION_WINDOW_MINUTES = 60;
const SUBMISSION_LIMIT_PER_WINDOW = 5;
const REQUEST_MAX_BYTES = 3200000;

$config = load_merged_config([
    __DIR__ . '/config.php',
    __DIR__ . '/config.local.php',
]);
$storageType = strtolower(config_value($config, 'HOMMAGE_STORAGE', 'file')) === 'mysql' ? 'mysql' : 'file';
$fileStoragePath = config_value($config, 'HOMMAGE_FILE_PATH', __DIR__ . '/data/hommages.json');
$uploadDir = config_value($config, 'HOMMAGE_UPLOAD_DIR', dirname(__DIR__) . '/uploads/hommages');
$uploadUrlPrefix = rtrim(config_value($config, 'HOMMAGE_UPLOAD_URL_PREFIX', '/uploads/hommages'), '/');
$dbHost = config_value($config, 'HOMMAGE_DB_HOST', '10.243.11.128');
$dbPort = (int) config_value($config, 'HOMMAGE_DB_PORT', '3306');
$dbName = config_value($config, 'HOMMAGE_DB_NAME', 'smriti_gupta_om');
$dbUser = config_value($config, 'HOMMAGE_DB_USER', 'smriti_gupta_om');
$dbPassword = config_value($config, 'HOMMAGE_DB_PASSWORD', '');
$adminPassword = config_value($config, 'HOMMAGE_ADMIN_PASSWORD', '');
$ipHashSalt = config_value($config, 'HOMMAGE_IP_HASH_SALT', 'change-this-salt-before-production');

try {
    init_storage(
        $storageType,
        $fileStoragePath,
        $dbHost,
        $dbPort,
        $dbName,
        $dbUser,
        $dbPassword
    );

    $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    $routePath = get_route_path();

    if ($method === 'GET' && $routePath === '/hommages') {
        send_json(200, ['messages' => get_public_hommages($storageType, $fileStoragePath, $dbHost, $dbPort, $dbName, $dbUser, $dbPassword)]);
    }

    if ($method === 'GET' && $routePath === '/youtube-playlist') {
        $playlistId = clean_playlist_id((string) ($_GET['playlistId'] ?? ''));
        if ($playlistId === '') {
            send_json(400, ['error' => 'A valid playlistId is required.']);
        }

        $youtubeApiKey = config_value($config, 'YOUTUBE_API_KEY', '');
        if ($youtubeApiKey === '') {
            send_json(503, ['error' => 'YouTube playlist service is not configured yet.']);
        }

        send_json(200, get_youtube_playlist($playlistId, $youtubeApiKey, __DIR__ . '/data'));
    }

    if ($method === 'POST' && $routePath === '/hommages') {
        $contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
        if ($contentLength > REQUEST_MAX_BYTES) {
            send_json(413, ['error' => 'The attachment is too large to upload. Please use an image under 1 MB, or submit without an image.']);
        }

        $payload = read_json_body();
        $validation = validate_submission($payload);
        if (!$validation['ok']) {
            send_json(400, ['errors' => $validation['errors']]);
        }

        $ipHash = hash_ip(get_client_ip(), $ipHashSalt);
        $recentCount = count_recent_submissions(
            $storageType,
            $fileStoragePath,
            $dbHost,
            $dbPort,
            $dbName,
            $dbUser,
            $dbPassword,
            $ipHash
        );

        if ($recentCount >= SUBMISSION_LIMIT_PER_WINDOW) {
            send_json(429, ['error' => 'Too many submissions. Please try again later.']);
        }

        $imageUrl = save_hommage_image($payload['image'] ?? null, $uploadDir, $uploadUrlPrefix);
        $savedMessage = insert_hommage(
            $storageType,
            $fileStoragePath,
            $dbHost,
            $dbPort,
            $dbName,
            $dbUser,
            $dbPassword,
            $validation['data']['name'],
            $validation['data']['message'],
            $imageUrl,
            $ipHash
        );

        send_json(201, [
            'message' => 'Thank you. Your message is now visible to all visitors.',
            'homage' => $savedMessage,
        ]);
    }

    if (strpos($routePath, '/admin/') === 0) {
        if (!is_authorized($adminPassword)) {
            send_json(401, ['error' => 'Unauthorized.']);
        }

        if ($method === 'GET' && $routePath === '/admin/hommages') {
            $status = $_GET['status'] ?? 'pending';
            if (!in_array($status, ['pending', 'approved', 'rejected', 'all'], true)) {
                send_json(400, ['error' => 'Invalid status filter.']);
            }

            send_json(200, [
                'messages' => get_admin_hommages(
                    $storageType,
                    $fileStoragePath,
                    $dbHost,
                    $dbPort,
                    $dbName,
                    $dbUser,
                    $dbPassword,
                    $status
                ),
            ]);
        }

        if ($method === 'POST' && preg_match('#^/admin/hommages/(\d+)/(approve|reject|delete)$#', $routePath, $matches) === 1) {
            update_hommage_status(
                $storageType,
                $fileStoragePath,
                $dbHost,
                $dbPort,
                $dbName,
                $dbUser,
                $dbPassword,
                (int) $matches[1],
                $matches[2]
            );

            send_json(200, ['ok' => true]);
        }
    }

    send_json(404, ['error' => 'Not found.']);
} catch (InvalidArgumentException $exception) {
    send_json(400, ['error' => $exception->getMessage()]);
} catch (RuntimeException $exception) {
    send_json(500, ['error' => $exception->getMessage()]);
} catch (Throwable $exception) {
    error_log('Hommage API error: ' . $exception->getMessage());
    send_json(500, ['error' => 'Server error.']);
}

function env_value(string $key, string $default = ''): string
{
    $value = getenv($key);
    return $value === false || $value === '' ? $default : (string) $value;
}

function load_merged_config(array $paths): array
{
    $merged = [];

    foreach ($paths as $path) {
        if (!is_file($path)) {
            continue;
        }

        $config = require $path;
        if (!is_array($config)) {
            throw new RuntimeException('Local Hommage config must return an array.');
        }

        $merged = array_merge($merged, $config);
    }

    return $merged;
}

function config_value(array $config, string $key, string $default = ''): string
{
    if (array_key_exists($key, $config) && $config[$key] !== null && $config[$key] !== '') {
        return (string) $config[$key];
    }

    return env_value($key, $default);
}

function send_json(int $status, array $body): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function get_route_path(): string
{
    $uriPath = rawurldecode((string) parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH));
    $scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/api/index.php'));
    $scriptDir = $scriptDir === '.' ? '' : rtrim($scriptDir, '/');

    if ($scriptDir !== '' && strpos($uriPath, $scriptDir) === 0) {
        $uriPath = substr($uriPath, strlen($scriptDir));
    }

    if ($uriPath === '' || $uriPath === false) {
        return '/';
    }

    return '/' . ltrim($uriPath, '/');
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        throw new InvalidArgumentException('Invalid JSON payload.');
    }

    return $decoded;
}

function clean_text($value): string
{
    $text = (string) ($value ?? '');
    $text = preg_replace("/\r\n?/", "\n", $text) ?? $text;
    $text = preg_replace('/[\x00-\x09\x0B-\x1F\x7F]/u', ' ', $text) ?? $text;
    $text = preg_replace('/[^\S\n]+/u', ' ', $text) ?? $text;
    $text = preg_replace("/\n{3,}/u", "\n\n", $text) ?? $text;
    return trim($text);
}

function validate_submission(array $payload): array
{
    $name = clean_text($payload['name'] ?? '');
    $message = clean_text($payload['message'] ?? '');
    $consent = ($payload['consent'] ?? false) === true
        || ($payload['consent'] ?? '') === 'true'
        || ($payload['consent'] ?? '') === 'on';
    $honeypot = clean_text($payload['website'] ?? '');
    $errors = [];

    if ($honeypot !== '') {
        $errors[] = 'Submission could not be accepted.';
    }

    if ($name === '') {
        $errors[] = 'Name is required.';
    } elseif (mb_strlen($name) > NAME_MAX_LENGTH) {
        $errors[] = 'Name must be ' . NAME_MAX_LENGTH . ' characters or fewer.';
    }

    if ($message === '') {
        $errors[] = 'Hommage message is required.';
    } elseif (mb_strlen($message) > MESSAGE_MAX_LENGTH) {
        $errors[] = 'Hommage message must be ' . MESSAGE_MAX_LENGTH . ' characters or fewer.';
    }

    if (!$consent) {
        $errors[] = 'Consent is required.';
    }

    return [
        'ok' => count($errors) === 0,
        'errors' => $errors,
        'data' => [
            'name' => $name,
            'message' => $message,
            'consent' => $consent,
        ],
    ];
}

function get_client_ip(): string
{
    $forwarded = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    if ($forwarded !== '') {
        $parts = explode(',', $forwarded);
        return trim((string) ($parts[0] ?? 'unknown'));
    }

    return trim((string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
}

function hash_ip(string $ip, string $salt): string
{
    return hash('sha256', $salt . ':' . $ip);
}

function is_authorized(string $adminPassword): bool
{
    if ($adminPassword === '') {
        return false;
    }

    $header = get_authorization_header();
    if (strpos($header, 'Bearer ') !== 0) {
        return false;
    }

    $token = substr($header, 7);
    return hash_equals($adminPassword, $token);
}

function get_authorization_header(): string
{
    // The Authorization header lands in different places depending on how PHP
    // runs (mod_php, CGI, FPM) and the server's config. Check them all.
    foreach (['HTTP_AUTHORIZATION', 'REDIRECT_HTTP_AUTHORIZATION'] as $key) {
        if (!empty($_SERVER[$key])) {
            return trim((string) $_SERVER[$key]);
        }
    }

    if (function_exists('apache_request_headers')) {
        foreach (apache_request_headers() as $name => $value) {
            if (strcasecmp($name, 'Authorization') === 0) {
                return trim((string) $value);
            }
        }
    }

    if (function_exists('getallheaders')) {
        foreach (getallheaders() as $name => $value) {
            if (strcasecmp($name, 'Authorization') === 0) {
                return trim((string) $value);
            }
        }
    }

    return '';
}

function init_storage(
    string $storageType,
    string $fileStoragePath,
    string $dbHost,
    int $dbPort,
    string $dbName,
    string $dbUser,
    string $dbPassword
): void {
    if ($storageType === 'mysql') {
        init_mysql_storage($dbHost, $dbPort, $dbName, $dbUser, $dbPassword);
        return;
    }

    ensure_directory(dirname($fileStoragePath));
    if (!is_file($fileStoragePath)) {
        file_put_contents($fileStoragePath, "[]\n", LOCK_EX);
    }
}

function init_mysql_storage(string $dbHost, int $dbPort, string $dbName, string $dbUser, string $dbPassword): void
{
    $pdo = get_pdo($dbHost, $dbPort, $dbName, $dbUser, $dbPassword);
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS hommages (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT,
            name VARCHAR(120) NOT NULL,
            message TEXT NOT NULL,
            image_url VARCHAR(255),
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            approved TINYINT(1) NOT NULL DEFAULT 0,
            rejected TINYINT(1) NOT NULL DEFAULT 0,
            ip_hash CHAR(64),
            PRIMARY KEY (id),
            INDEX idx_hommages_public (approved, rejected, created_at),
            INDEX idx_hommages_ip_created (ip_hash, created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    try {
        $pdo->exec('ALTER TABLE hommages ADD COLUMN image_url VARCHAR(255) AFTER message');
    } catch (Throwable $exception) {
    }
}

function get_pdo(string $dbHost, int $dbPort, string $dbName, string $dbUser, string $dbPassword): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = 'mysql:host=' . $dbHost . ';port=' . $dbPort . ';dbname=' . $dbName . ';charset=utf8mb4';
    $pdo = new PDO($dsn, $dbUser, $dbPassword, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $pdo;
}

function ensure_directory(string $directory): void
{
    if (is_dir($directory)) {
        return;
    }

    if (!mkdir($directory, 0775, true) && !is_dir($directory)) {
        throw new RuntimeException('Unable to create required storage directory.');
    }
}

function read_file_messages(string $fileStoragePath): array
{
    if (!is_file($fileStoragePath)) {
        return [];
    }

    $raw = file_get_contents($fileStoragePath);
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function write_file_messages(string $fileStoragePath, array $messages): void
{
    ensure_directory(dirname($fileStoragePath));
    $written = file_put_contents(
        $fileStoragePath,
        json_encode($messages, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n",
        LOCK_EX
    );

    if ($written === false) {
        throw new RuntimeException('Unable to persist hommage messages.');
    }
}

function to_public_message(array $message): array
{
    return [
        'id' => (int) $message['id'],
        'name' => (string) $message['name'],
        'message' => (string) $message['message'],
        'image_url' => $message['image_url'] ?? null,
        'created_at' => (string) $message['created_at'],
    ];
}

function get_public_hommages(
    string $storageType,
    string $fileStoragePath,
    string $dbHost,
    int $dbPort,
    string $dbName,
    string $dbUser,
    string $dbPassword
): array {
    if ($storageType === 'mysql') {
        $pdo = get_pdo($dbHost, $dbPort, $dbName, $dbUser, $dbPassword);
        // Approved posts stay on the wall for good. There used to be an
        // "AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)" here, which quietly
        // hid posts once they turned 30 days old (they were never deleted, just
        // hidden). Removed — posts are now taken down only by an explicit admin
        // delete.
        $statement = $pdo->query(
            'SELECT id, name, message, image_url, created_at
             FROM hommages
             WHERE approved = 1
               AND rejected = 0
             ORDER BY created_at DESC, id DESC'
        );

        return $statement->fetchAll();
    }

    $messages = array_values(array_filter(
        read_file_messages($fileStoragePath),
        static function (array $message): bool {
            // No age limit — see the note in the mysql branch above.
            return ((int) ($message['approved'] ?? 0) === 1)
                && ((int) ($message['rejected'] ?? 0) !== 1);
        }
    ));

    usort($messages, static function (array $left, array $right): int {
        $leftTime = strtotime((string) ($left['created_at'] ?? '')) ?: 0;
        $rightTime = strtotime((string) ($right['created_at'] ?? '')) ?: 0;

        if ($leftTime === $rightTime) {
            return ((int) ($right['id'] ?? 0)) <=> ((int) ($left['id'] ?? 0));
        }

        return $rightTime <=> $leftTime;
    });

    return array_map('to_public_message', $messages);
}

function count_recent_submissions(
    string $storageType,
    string $fileStoragePath,
    string $dbHost,
    int $dbPort,
    string $dbName,
    string $dbUser,
    string $dbPassword,
    string $ipHash
): int {
    if ($storageType === 'mysql') {
        $pdo = get_pdo($dbHost, $dbPort, $dbName, $dbUser, $dbPassword);
        $statement = $pdo->prepare(
            'SELECT COUNT(*) AS count
             FROM hommages
             WHERE ip_hash = :ip_hash
               AND created_at >= DATE_SUB(NOW(), INTERVAL :minutes MINUTE)'
        );
        $statement->bindValue(':ip_hash', $ipHash, PDO::PARAM_STR);
        $statement->bindValue(':minutes', SUBMISSION_WINDOW_MINUTES, PDO::PARAM_INT);
        $statement->execute();
        $row = $statement->fetch();
        return (int) ($row['count'] ?? 0);
    }

    $cutoff = time() - (SUBMISSION_WINDOW_MINUTES * 60);
    $messages = read_file_messages($fileStoragePath);
    $count = 0;

    foreach ($messages as $message) {
        $createdAt = strtotime((string) ($message['created_at'] ?? '')) ?: 0;
        if (($message['ip_hash'] ?? '') === $ipHash && $createdAt >= $cutoff) {
            $count++;
        }
    }

    return $count;
}

function save_hommage_image($image, string $uploadDir, string $uploadUrlPrefix): ?string
{
    if (!is_array($image) || !isset($image['dataUrl'])) {
        return null;
    }

    $type = (string) ($image['type'] ?? '');
    $allowedTypes = [
        'image/jpeg' => '.jpg',
        'image/png' => '.png',
        'image/webp' => '.webp',
        'image/gif' => '.gif',
    ];

    if (!isset($allowedTypes[$type])) {
        throw new InvalidArgumentException('Please upload a JPG, PNG, WebP, or GIF image.');
    }

    if (preg_match('#^data:([^;]+);base64,(.+)$#s', (string) $image['dataUrl'], $matches) !== 1 || $matches[1] !== $type) {
        throw new InvalidArgumentException('Image upload could not be read.');
    }

    $binary = base64_decode($matches[2], true);
    if ($binary === false || $binary === '') {
        throw new InvalidArgumentException('Image upload could not be read.');
    }

    if (strlen($binary) > IMAGE_MAX_BYTES) {
        throw new InvalidArgumentException('Please keep the image under 1 MB.');
    }

    ensure_directory($uploadDir);
    $fileName = sprintf('%d-%s%s', (int) round(microtime(true) * 1000), bin2hex(random_bytes(4)), $allowedTypes[$type]);
    $targetPath = rtrim($uploadDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $fileName;

    if (file_put_contents($targetPath, $binary, LOCK_EX) === false) {
        throw new RuntimeException('Image upload failed. Please try a smaller image, or submit without an image.');
    }

    return $uploadUrlPrefix . '/' . $fileName;
}

function insert_hommage(
    string $storageType,
    string $fileStoragePath,
    string $dbHost,
    int $dbPort,
    string $dbName,
    string $dbUser,
    string $dbPassword,
    string $name,
    string $message,
    ?string $imageUrl,
    string $ipHash
): array {
    if ($storageType === 'mysql') {
        $pdo = get_pdo($dbHost, $dbPort, $dbName, $dbUser, $dbPassword);
        $statement = $pdo->prepare(
            'INSERT INTO hommages (name, message, image_url, approved, rejected, ip_hash)
             VALUES (:name, :message, :image_url, 1, 0, :ip_hash)'
        );
        $statement->execute([
            ':name' => $name,
            ':message' => $message,
            ':image_url' => $imageUrl,
            ':ip_hash' => $ipHash,
        ]);

        $fetch = $pdo->prepare(
            'SELECT id, name, message, image_url, created_at
             FROM hommages
             WHERE id = :id'
        );
        $fetch->execute([':id' => (int) $pdo->lastInsertId()]);
        $row = $fetch->fetch();

        if (!is_array($row)) {
            throw new RuntimeException('Unable to load saved hommage.');
        }

        return $row;
    }

    $messages = read_file_messages($fileStoragePath);
    $nextId = 1;
    foreach ($messages as $existingMessage) {
        $nextId = max($nextId, ((int) ($existingMessage['id'] ?? 0)) + 1);
    }

    $savedMessage = [
        'id' => $nextId,
        'name' => $name,
        'message' => $message,
        'image_url' => $imageUrl,
        'created_at' => gmdate('c'),
        'approved' => 1,
        'rejected' => 0,
        'ip_hash' => $ipHash,
    ];

    $messages[] = $savedMessage;
    write_file_messages($fileStoragePath, $messages);

    return to_public_message($savedMessage);
}

function get_admin_hommages(
    string $storageType,
    string $fileStoragePath,
    string $dbHost,
    int $dbPort,
    string $dbName,
    string $dbUser,
    string $dbPassword,
    string $status
): array {
    if ($storageType === 'mysql') {
        $pdo = get_pdo($dbHost, $dbPort, $dbName, $dbUser, $dbPassword);
        $whereClause = 'approved = 0 AND rejected = 0';

        if ($status === 'approved') {
            $whereClause = 'approved = 1 AND rejected = 0';
        } elseif ($status === 'rejected') {
            $whereClause = 'rejected = 1';
        } elseif ($status === 'all') {
            $whereClause = '1 = 1';
        }

        $statement = $pdo->query(
            'SELECT id, name, message, image_url, created_at, approved, rejected, ip_hash
             FROM hommages
             WHERE ' . $whereClause . '
             ORDER BY created_at DESC, id DESC
             LIMIT 200'
        );

        return $statement->fetchAll();
    }

    $messages = array_values(array_filter(
        read_file_messages($fileStoragePath),
        static function (array $message) use ($status): bool {
            $approved = (int) ($message['approved'] ?? 0);
            $rejected = (int) ($message['rejected'] ?? 0);

            if ($status === 'pending') {
                return $approved === 0 && $rejected === 0;
            }

            if ($status === 'approved') {
                return $approved === 1 && $rejected === 0;
            }

            if ($status === 'rejected') {
                return $rejected === 1;
            }

            return true;
        }
    ));

    usort($messages, static function (array $left, array $right): int {
        $leftTime = strtotime((string) ($left['created_at'] ?? '')) ?: 0;
        $rightTime = strtotime((string) ($right['created_at'] ?? '')) ?: 0;

        if ($leftTime === $rightTime) {
            return ((int) ($right['id'] ?? 0)) <=> ((int) ($left['id'] ?? 0));
        }

        return $rightTime <=> $leftTime;
    });

    return array_slice($messages, 0, 200);
}

function update_hommage_status(
    string $storageType,
    string $fileStoragePath,
    string $dbHost,
    int $dbPort,
    string $dbName,
    string $dbUser,
    string $dbPassword,
    int $id,
    string $action
): void {
    if (!in_array($action, ['approve', 'reject', 'delete'], true)) {
        throw new InvalidArgumentException('Invalid action.');
    }

    if ($storageType === 'mysql') {
        $pdo = get_pdo($dbHost, $dbPort, $dbName, $dbUser, $dbPassword);

        if ($action === 'approve') {
            $statement = $pdo->prepare('UPDATE hommages SET approved = 1, rejected = 0 WHERE id = :id');
            $statement->execute([':id' => $id]);
            return;
        }

        if ($action === 'reject') {
            $statement = $pdo->prepare('UPDATE hommages SET approved = 0, rejected = 1 WHERE id = :id');
            $statement->execute([':id' => $id]);
            return;
        }

        $statement = $pdo->prepare('DELETE FROM hommages WHERE id = :id');
        $statement->execute([':id' => $id]);
        return;
    }

    $messages = read_file_messages($fileStoragePath);
    foreach ($messages as $index => $message) {
        if ((int) ($message['id'] ?? 0) !== $id) {
            continue;
        }

        if ($action === 'delete') {
            array_splice($messages, $index, 1);
        } else {
            $messages[$index]['approved'] = $action === 'approve' ? 1 : 0;
            $messages[$index]['rejected'] = $action === 'reject' ? 1 : 0;
        }

        write_file_messages($fileStoragePath, array_values($messages));
        return;
    }
}

function clean_playlist_id(string $value): string
{
    $value = trim($value);
    if ($value === '') {
        return '';
    }

    if (preg_match('/^[A-Za-z0-9_-]{10,80}$/', $value) === 1) {
        return $value;
    }

    return '';
}

function get_youtube_playlist(string $playlistId, string $apiKey, string $cacheDir): array
{
    ensure_directory($cacheDir);
    $cachePath = rtrim($cacheDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'youtube-playlist-' . $playlistId . '.json';
    $cached = read_youtube_cache($cachePath);
    if ($cached !== null) {
        return $cached;
    }

    // Playlist pagination: load every page with maxResults=50 and preserve YouTube's playlist order.
    $playlistItems = [];
    $pageToken = '';
    do {
        $params = [
            'part' => 'snippet,contentDetails',
            'maxResults' => '50',
            'playlistId' => $playlistId,
            'key' => $apiKey,
        ];
        if ($pageToken !== '') {
            $params['pageToken'] = $pageToken;
        }

        $page = youtube_get_json('https://www.googleapis.com/youtube/v3/playlistItems?' . http_build_query($params));
        foreach (($page['items'] ?? []) as $item) {
            if (is_array($item)) {
                $playlistItems[] = $item;
            }
        }
        $pageToken = (string) ($page['nextPageToken'] ?? '');
    } while ($pageToken !== '');

    $videoIds = [];
    foreach ($playlistItems as $item) {
        $videoId = (string) ($item['contentDetails']['videoId'] ?? '');
        if ($videoId !== '') {
            $videoIds[] = $videoId;
        }
    }

    $videoDetails = [];
    foreach (array_chunk(array_values(array_unique($videoIds)), 50) as $idBatch) {
        $details = youtube_get_json('https://www.googleapis.com/youtube/v3/videos?' . http_build_query([
            'part' => 'contentDetails,snippet,status',
            'id' => implode(',', $idBatch),
            'key' => $apiKey,
        ]));

        foreach (($details['items'] ?? []) as $video) {
            $videoId = (string) ($video['id'] ?? '');
            if ($videoId !== '') {
                $videoDetails[$videoId] = $video;
            }
        }
    }

    $videos = [];
    $unavailableCount = 0;
    foreach ($videoIds as $videoId) {
        $video = $videoDetails[$videoId] ?? null;
        if (!is_array($video) || !is_youtube_video_available($video)) {
            $unavailableCount++;
            continue;
        }

        $duration = (string) ($video['contentDetails']['duration'] ?? '');
        $seconds = youtube_duration_to_seconds($duration);
        $videos[] = [
            'id' => $videoId,
            'title' => clean_text($video['snippet']['title'] ?? 'Untitled excerpt'),
            'thumbnail' => best_youtube_thumbnail($video['snippet']['thumbnails'] ?? []),
            'duration' => [
                'iso' => $duration,
                'seconds' => $seconds,
                'display' => format_youtube_duration($seconds),
                'label' => format_youtube_duration_label($seconds),
            ],
        ];
    }

    $payload = [
        'playlistId' => $playlistId,
        'videos' => $videos,
        'unavailableCount' => $unavailableCount,
        'fetchedAt' => gmdate('c'),
    ];

    write_youtube_cache($cachePath, $payload);
    return $payload;
}

function read_youtube_cache(string $cachePath): ?array
{
    if (!is_file($cachePath) || (time() - filemtime($cachePath)) > 21600) {
        return null;
    }

    $raw = file_get_contents($cachePath);
    $decoded = $raw === false ? null : json_decode($raw, true);
    return is_array($decoded) ? $decoded : null;
}

function write_youtube_cache(string $cachePath, array $payload): void
{
    file_put_contents(
        $cachePath,
        json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n",
        LOCK_EX
    );
}

function youtube_get_json(string $url): array
{
    $response = false;
    if (function_exists('curl_init')) {
        $curl = curl_init($url);
        curl_setopt_array($curl, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 8,
            CURLOPT_TIMEOUT => 20,
            CURLOPT_HTTPHEADER => ['Accept: application/json'],
        ]);
        $response = curl_exec($curl);
        $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
        $error = curl_error($curl);
        curl_close($curl);
        if ($response === false || $status >= 400) {
            throw new RuntimeException($error !== '' ? $error : 'YouTube API request failed.');
        }
    } else {
        $response = file_get_contents($url);
        if ($response === false) {
            throw new RuntimeException('YouTube API request failed.');
        }
    }

    $decoded = json_decode((string) $response, true);
    if (!is_array($decoded)) {
        throw new RuntimeException('YouTube API returned an invalid response.');
    }

    return $decoded;
}

function is_youtube_video_available(array $video): bool
{
    $status = $video['status'] ?? [];
    $snippet = $video['snippet'] ?? [];
    $title = strtolower((string) ($snippet['title'] ?? ''));

    if (($status['privacyStatus'] ?? '') !== 'public') {
        return false;
    }
    if (($status['uploadStatus'] ?? '') !== 'processed') {
        return false;
    }
    if (($status['embeddable'] ?? true) === false) {
        return false;
    }

    return $title !== '' && $title !== 'deleted video' && $title !== 'private video';
}

function best_youtube_thumbnail(array $thumbnails): string
{
    foreach (['maxres', 'standard', 'high', 'medium', 'default'] as $key) {
        $url = $thumbnails[$key]['url'] ?? '';
        if (is_string($url) && $url !== '') {
            return $url;
        }
    }

    return '';
}

function youtube_duration_to_seconds(string $duration): int
{
    // Duration conversion: YouTube returns ISO 8601 values such as PT8M25S or PT1H5M10S.
    if (preg_match('/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/', $duration, $matches) !== 1) {
        return 0;
    }

    $hours = (int) ($matches[1] ?? 0);
    $minutes = (int) ($matches[2] ?? 0);
    $seconds = (int) ($matches[3] ?? 0);
    return ($hours * 3600) + ($minutes * 60) + $seconds;
}

function format_youtube_duration(int $seconds): string
{
    $seconds = max(0, $seconds);
    $hours = intdiv($seconds, 3600);
    $minutes = intdiv($seconds % 3600, 60);
    $remaining = $seconds % 60;

    if ($hours > 0) {
        return sprintf('%d:%02d:%02d', $hours, $minutes, $remaining);
    }

    return sprintf('%d:%02d', $minutes, $remaining);
}

function format_youtube_duration_label(int $seconds): string
{
    if ($seconds <= 0) {
        return 'Short excerpt';
    }

    $minutes = max(1, (int) round($seconds / 60));
    return $minutes . ' min';
}
