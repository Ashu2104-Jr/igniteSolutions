from django.http import JsonResponse
from django.core.paginator import Paginator
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Book, Author, Language, Subject, Bookshelf, Format, BookAuthors, BookLanguages, BookSubjects, BookBookshelves

@csrf_exempt
@require_http_methods(["GET"])
def books_api(request):
    book_ids = request.GET.get('book_ids', '').split(',') if request.GET.get('book_ids') else []
    languages = request.GET.get('language', '').split(',') if request.GET.get('language') else []
    mime_types = request.GET.get('mime_type', '').split(',') if request.GET.get('mime_type') else []
    topics = request.GET.get('topic', '').split(',') if request.GET.get('topic') else []
    authors = request.GET.get('author', '').split(',') if request.GET.get('author') else []
    titles = request.GET.get('title', '').split(',') if request.GET.get('title') else []
    page = int(request.GET.get('page', 1))
    page_size = int(request.GET.get('page_size', 25))
       
    queryset = Book.objects.all()
    
    if book_ids and book_ids != ['']:
        queryset = queryset.filter(gutenberg_id__in=[int(bid) for bid in book_ids if bid.isdigit()])
    
    if languages and languages != ['']:
        language_q = Q()
        for lang in languages:
            lang = lang.strip()
            if lang:
                book_ids_with_lang = BookLanguages.objects.filter(language__code__iexact=lang).values_list('book_id', flat=True)
                language_q |= Q(id__in=book_ids_with_lang)
        if language_q:
            queryset = queryset.filter(language_q)
    
    if mime_types and mime_types != ['']:
        mime_q = Q()
        for mime in mime_types:
            mime = mime.strip().strip('"')
            if mime:
                book_ids_with_mime = Format.objects.filter(mime_type__icontains=mime).values_list('book_id', flat=True)
                mime_q |= Q(id__in=book_ids_with_mime)
        if mime_q:
            queryset = queryset.filter(mime_q)

    if topics and topics != ['']:
        topic_q = Q()
        for topic in topics:
            topic = topic.strip()
            if topic:
                book_ids_with_subject = BookSubjects.objects.filter(subject__name__icontains=topic).values_list('book_id', flat=True)
                book_ids_with_bookshelf = BookBookshelves.objects.filter(bookshelf__name__icontains=topic).values_list('book_id', flat=True)
                topic_q |= Q(id__in=book_ids_with_subject) | Q(id__in=book_ids_with_bookshelf)
        if topic_q:
            queryset = queryset.filter(topic_q)
    
    if authors and authors != ['']:
        author_q = Q()
        for author in authors:
            author = author.strip()
            if author:
                book_ids_with_author = BookAuthors.objects.filter(author__name__icontains=author).values_list('book_id', flat=True)
                author_q |= Q(id__in=book_ids_with_author)
        if author_q:
            queryset = queryset.filter(author_q)
    
    if titles and titles != ['']:
        title_q = Q()
        for title in titles:
            title = title.strip()
            if title:
                title_q |= Q(title__icontains=title)
        if title_q:
            queryset = queryset.filter(title_q)
    
    queryset = queryset.order_by('-download_count').distinct()
    
    paginator = Paginator(queryset, page_size)
    page_obj = paginator.get_page(page)
    
    books_data = []
    for book in page_obj:
        authors = Author.objects.filter(bookauthors__book=book)
        author_info = [{'name': author.name, 'birth_year': author.birth_year, 'death_year': author.death_year} for author in authors]
        
        languages = Language.objects.filter(booklanguages__book=book)
        language_codes = [lang.code for lang in languages]
        
        subjects = Subject.objects.filter(booksubjects__book=book)
        subject_names = [subject.name for subject in subjects]
        
        bookshelves = Bookshelf.objects.filter(bookbookshelves__book=book)
        bookshelf_names = [shelf.name for shelf in bookshelves]
        
        formats = Format.objects.filter(book=book)
        download_links = [{'mime_type': fmt.mime_type, 'url': fmt.url} for fmt in formats]
        
        books_data.append({
            'id': book.gutenberg_id,
            'title': book.title,
            'authors': author_info,
            'languages': language_codes,
            'subjects': subject_names,
            'bookshelves': bookshelf_names,
            'download_links': download_links
        })
    
    response = JsonResponse({
        'count': paginator.count,
        'results': books_data
    })
    
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
    response['Access-Control-Allow-Headers'] = 'Content-Type'
    
    return response
