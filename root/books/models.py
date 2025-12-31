from django.db import models

class Author(models.Model):
    id = models.IntegerField(primary_key=True)
    birth_year = models.IntegerField(null=True, blank=True)
    death_year = models.IntegerField(null=True, blank=True)
    name = models.CharField(max_length=128)

    class Meta:
        managed = False
        db_table = 'books_author'

    def __str__(self):
        return self.name

class Book(models.Model):
    id = models.IntegerField(primary_key=True)
    download_count = models.IntegerField(null=True, blank=True)
    gutenberg_id = models.IntegerField(unique=True)
    media_type = models.CharField(max_length=16)
    title = models.CharField(max_length=1024, null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'books_book'

    def __str__(self):
        return self.title or f"Book {self.gutenberg_id}"

class Bookshelf(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=64, unique=True)

    class Meta:
        managed = False
        db_table = 'books_bookshelf'

    def __str__(self):
        return self.name

class Format(models.Model):
    id = models.IntegerField(primary_key=True)
    mime_type = models.CharField(max_length=32)
    url = models.CharField(max_length=256)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)

    class Meta:
        managed = False
        db_table = 'books_format'

    def __str__(self):
        return f"{self.mime_type} - {self.url}"

class Language(models.Model):
    id = models.IntegerField(primary_key=True)
    code = models.CharField(max_length=4, unique=True)

    class Meta:
        managed = False
        db_table = 'books_language'

    def __str__(self):
        return self.code

class Subject(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=256)

    class Meta:
        managed = False
        db_table = 'books_subject'

    def __str__(self):
        return self.name

class BookAuthors(models.Model):
    id = models.IntegerField(primary_key=True)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)

    class Meta:
        managed = False
        db_table = 'books_book_authors'

class BookBookshelves(models.Model):
    id = models.IntegerField(primary_key=True)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    bookshelf = models.ForeignKey(Bookshelf, on_delete=models.CASCADE)

    class Meta:
        managed = False
        db_table = 'books_book_bookshelves'

class BookLanguages(models.Model):
    id = models.IntegerField(primary_key=True)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    language = models.ForeignKey(Language, on_delete=models.CASCADE)

    class Meta:
        managed = False
        db_table = 'books_book_languages'

class BookSubjects(models.Model):
    id = models.IntegerField(primary_key=True)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)

    class Meta:
        managed = False
        db_table = 'books_book_subjects'

