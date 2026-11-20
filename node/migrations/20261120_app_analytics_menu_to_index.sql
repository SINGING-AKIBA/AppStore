-- Move the analytics dashboard onto the existing /index/Index menu.
-- Safe to run after the original analytics migration has already created /analytics.

SET @index_menu_id = (
  SELECT id FROM smile_menu
  WHERE path = '/index' AND type = 10 AND COALESCE(is_delete, 0) = 0
  ORDER BY id LIMIT 1
);

SET @index_page_id = (
  SELECT id FROM smile_menu
  WHERE path = '/index/Index' AND type = 20 AND COALESCE(is_delete, 0) = 0
  ORDER BY id LIMIT 1
);

UPDATE smile_menu
SET
  pid = @index_menu_id,
  title = '数据统计',
  icon = 'bar-chart',
  status = 10,
  \`show\` = 10,
  update_time = UNIX_TIMESTAMP()
WHERE id = @index_page_id AND @index_menu_id IS NOT NULL;

INSERT INTO smile_menu
  (type, pid, title, path, icon, weigh, status, target, \`show\`, create_time, update_time, is_delete, delete_time)
SELECT
  20, @index_menu_id, '数据统计', '/index/Index', 'bar-chart', 2, 10, 10, 10, UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 0, NULL
WHERE @index_menu_id IS NOT NULL AND @index_page_id IS NULL;

-- Hide and soft-delete the temporary standalone analytics menu.
UPDATE smile_menu
SET
  status = 20,
  \`show\` = 20,
  is_delete = 1,
  delete_time = UNIX_TIMESTAMP(),
  update_time = UNIX_TIMESTAMP()
WHERE path IN ('/analytics/Index', '/analytics')
  AND COALESCE(is_delete, 0) = 0;
