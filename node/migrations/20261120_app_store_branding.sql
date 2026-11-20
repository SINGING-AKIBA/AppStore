-- Add a manageable App Store branding page under System Settings.
-- Safe to run more than once on existing installations.

SET @settings_parent_id = (
  SELECT id FROM smile_menu
  WHERE path = '/setting' AND type = 10 AND COALESCE(is_delete, 0) = 0
  ORDER BY id LIMIT 1
);

SET @brand_settings_menu_id = (
  SELECT id FROM smile_menu
  WHERE path = '/setting/Brand' AND type = 20 AND COALESCE(is_delete, 0) = 0
  ORDER BY id LIMIT 1
);

UPDATE smile_menu
SET
  pid = @settings_parent_id,
  title = '品牌设置',
  icon = '',
  weigh = 30,
  status = 10,
  target = 10,
  `show` = 10,
  update_time = UNIX_TIMESTAMP()
WHERE id = @brand_settings_menu_id AND @settings_parent_id IS NOT NULL;

INSERT INTO smile_menu
  (type, pid, title, path, icon, weigh, status, target, `show`, create_time, update_time, is_delete, delete_time)
SELECT
  20, @settings_parent_id, '品牌设置', '/setting/Brand', '', 30, 10, 10, 10, UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 0, NULL
WHERE @settings_parent_id IS NOT NULL AND @brand_settings_menu_id IS NULL;

INSERT INTO smile_rules (ptype, v0, v1, v2, v3, v4, v5, v6)
SELECT 'p', '开发', 'setting', 'brand', NULL, NULL, NULL, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM smile_rules
  WHERE ptype = 'p' AND v0 = '开发' AND v1 = 'setting' AND v2 = 'brand'
);
