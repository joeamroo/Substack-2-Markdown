import requests
from bs4 import BeautifulSoup
import html2text
import sys
import os

def substack_to_markdown(url):
    response = requests.get(url)
    if response.status_code != 200:
        raise Exception(f"Failed to load page: {response.status_code}")
    
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Extract title
    title_tag = soup.find('h1')
    title = title_tag.get_text() if title_tag else "No Title"
    
    # Extract metadata (author and date)
    author_tag = soup.find('meta', attrs={'name': 'author'})
    author = author_tag['content'] if author_tag else "Unknown Author"
    
    date_tag = soup.find('time')
    date = date_tag.get('datetime') if date_tag else "Unknown Date"
    
    # Extract article content
    article_tag = soup.find('article')
    if not article_tag:
        raise Exception("No article content found")
    
    html_content = str(article_tag)

    markdown_converter = html2text.HTML2Text()
    markdown_converter.ignore_links = False
    markdown_converter.body_width = 0  # No line wrapping
    markdown_converter.code_tags = ['pre', 'code']  # Preserve code blocks
    markdown_converter.blockquote_tags = ['blockquote']  # Preserve blockquotes
    markdown_converter.list_markers = ['*', '-']  # Preserve unordered lists

    markdown_content = markdown_converter.handle(html_content)
    
    # Combine title, metadata, and content
    metadata = f"**Author**: {author}\n**Date**: {date}\n\n"
    markdown_output = f"# {title}\n\n{metadata}{markdown_content}"
    
    return markdown_output

def convert_all_articles(author_url, output_dir):
    response = requests.get(author_url)
    if response.status_code != 200:
        raise Exception(f"Failed to load author page: {response.status_code}")
    
    soup = BeautifulSoup(response.content, 'html.parser')
    articles = soup.find_all('a', href=True)
    article_links = [a['href'] for a in articles if '/p/' in a['href']]  # Substack articles contain '/p/' in URL
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    for link in article_links:
        article_url = link if link.startswith('http') else f"https://{author_url.split('/')[2]}{link}"
        markdown = substack_to_markdown(article_url)
        article_id = link.split('/')[-1]
        with open(os.path.join(output_dir, f'{article_id}.md'), 'w', encoding='utf-8') as f:
            f.write(markdown)

if __name__ == "__main__":
    if '--all' in sys.argv:
        author_url = sys.argv[2]
        output_dir = sys.argv[3]
        convert_all_articles(author_url, output_dir)
    else:
        url = sys.argv[1]
        output_file = sys.argv[2]
        markdown = substack_to_markdown(url)
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(markdown)
