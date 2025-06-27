import json
import os
from bs4 import BeautifulSoup
import html

def generate_publication_html(pub_data):
    """
    Generates HTML for a single publication from its data.
    """
    paper = pub_data.get('paper', {})
    data_area = ' '.join(pub_data.get('data_area', []))

    # Authors
    authors_list = []
    for author in paper.get('authors', []):
        if isinstance(author, dict) and author.get('is_me'):
            authors_list.append(f"<b class='me'>{author['name']}</b>")
        else:
            authors_list.append(str(author))
    authors_html = ', '.join(authors_list)

    # Venue
    venue_html = ''
    venue = paper.get('venue')
    if venue:
        venue_html = venue.get('name', '')
        short_name = venue.get('short_name')
        if short_name:
            venue_html += f" (<b>{short_name}</b>"
            ranking = venue.get('ranking')
            if ranking:
                venue_html += f", <b>{ranking}</b>"
            venue_html += ')'
        year = venue.get('year')
        if year:
            venue_html += f", {year}"

    # Links
    links_html = ''
    links = paper.get('links')
    if links:
        if links.get('paper'):
            links_html += f'[<a href="{links["paper"]}" target="_blank">paper</a>] '
        if links.get('arxiv'):
            links_html += f'[<a href="{links["arxiv"]}" target="_blank">arXiv</a>] '
        if links.get('code'):
            links_html += f'[<a href="{links["code"]}" target="_blank">code</a>] '
        if links.get('model'):
            links_html += f'[<a href="{links["model"]}" target="_blank">model</a>] '
        if links.get('blog'):
            links_html += f'[<a href="{links["blog"]}" target="_blank">blog</a>] '
        if links.get('supplementary'):
            links_html += f'[<a href="{links["supplementary"]}" target="_blank">supp</a>] '

    # Bibtex
    bibtex_html = ''
    bibtex = paper.get('bibtex')
    if bibtex:
        escaped_bibtex = html.escape(bibtex.replace('\\n', '\n').strip())
        bibtex_html = f'''
            <div class="link2">[<a class="fakelink" onclick="$(this).siblings('.bibref').slideToggle()">bibtex</a>]
                <pre class="bibref" style="overflow: hidden; display: none; margin: 0; padding: 10px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; font-family: monospace;">{escaped_bibtex}</pre>
            </div>'''

    # Abstract
    abstract_html = ''
    abstract = paper.get('abstract')
    if abstract:
        abstract_html = f'''
            <div class="link2">[<a class="fakelink" onclick="$(this).siblings('.abstract').slideToggle()">abstract</a>]
                <div class="abstract" style="overflow: hidden; display: none;">  
                    <p>{abstract}</p>
                </div>
            </div>'''

    # Github Stars
    github_stars_html = ''
    github = paper.get('github')
    if github:
        github_stars_html = f'''
            <img src="https://img.shields.io/github/stars/{github['user']}/{github['repo']}.svg?style=social&amp;label=Star" 
                alt="GitHub stars" style="text-align:center;vertical-align:middle">'''

    return f'''
        <div class="publication" data-area="{data_area}">
            <dl class="description">
                <div class="figure"><img src="{paper.get("image", "")}" class="paper-image"></div>
                <dt class="ptitle">{paper.get("title", "")}</dt>
                <dd>{authors_html}</dd>
                <dd>{venue_html}</dd>
                <dd>
                    {links_html}
                    {bibtex_html}
                    {abstract_html}
                    {github_stars_html}
                </dd>
            </dl>
        </div>'''

def convert_to_static_html(fname_template, fname_out):
    """
    Main function to generate the static HTML file.
    """
    publication_files = [
        "shen2025diversity-guided.json", "zhu2025sdmprune.json", "tang2025learning.json",
        "tang2025data-efficient.json", "shen2025multiple.json", "shen2025multi-grained.json",
        "shen2025asymmetric.json", "shen2023inter-instance.json", "sheng2023modeling.json",
        "shen2021training.json", "shen2021progressive.json", "shen2019customizing.json",
        "shen2019amalgamating.json", "shen2018intra-class.json", "song2018selective.json",
        "song2018transductive.json", "fang2021contrastive.json", "fang2021mosaicking.json",
        "fang2019data-free.json", "song2020depara.json", "song2019deep.json"
    ]

    publications_html_parts = []
    for filename in publication_files:
        filepath = os.path.join('publications', filename)
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
                publications_html_parts.append(generate_publication_html(data))
        except (IOError, json.JSONDecodeError) as e:
            print(f"Error processing {filepath}: {e}")

    all_publications_html = "\n".join(publications_html_parts)

    with open(fname_template, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html.parser')

    pub_content_div = soup.find('div', id='publications-content')
    if pub_content_div:
        pub_content_div.clear()
        pub_content_div.append(BeautifulSoup(all_publications_html, 'html.parser'))

    # Replace the dynamic loading script
    script_tag = soup.find('script', string=lambda t: t and 'loadPublications' in t)
    if script_tag:
        new_script_tag = soup.new_tag("script")
        new_script_tag.string = """
                    // Wait for DOM content to load
                    document.addEventListener('DOMContentLoaded', function() {
                        // Initialize filters and modal after content is loaded
                        initializeFilters();
                        initializeImageModal();
                    });
                """
        script_tag.replace_with(new_script_tag)

    with open(fname_out, 'w', encoding='utf-8') as f:
        # f.write(soup.prettify())
        f.write(str(soup))
    
    print(f"Successfully generated {fname_out}")

if __name__ == '__main__':
    fname_template = 'index_dynamic.html'
    fname_out = 'index.html'
    convert_to_static_html(fname_template, fname_out) 
    fname_template = 'index_cn_dynamic.html'
    fname_out = 'index_cn.html'
    convert_to_static_html(fname_template, fname_out) 