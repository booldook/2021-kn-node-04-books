-- CRUD: Create, Read, Update, Delete
-- SQL: Structured Query Language

-- Create
-- INSERT INTO books (bookName, writer, content) VALUES ('별주분전', '꺼북이', '용왕이 나의 간을...');
-- INSERT INTO books SET bookName='구운몽전', writer='구운몽', content='나비가 나를...';

-- Update
-- UPDATE books SET bookName='별주부전', writer='거북이' WHERE id=2;

-- Delete
-- DELETE FROM books WHERE id=3;

-- Read
-- SELECT * FROM books ORDER BY bookName ASC; -- ASC 
SELECT * FROM books ORDER BY id DESC LIMIT 0, 5; --시작레코드, 갯수













