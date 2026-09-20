import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const saves=sqliteTable('saves',{
 userId:text('user_id').primaryKey(),
 snapshot:text('snapshot').notNull(),
 previous:text('previous'),
 revision:integer('revision').notNull(),
 updatedAt:integer('updated_at').notNull()
});
