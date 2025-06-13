// Function to convert markdown table to object
function parseMarkdownTable(markdown) {
    const lines = markdown.trim().split('\n');
    const data = {};
    
    lines.forEach(line => {
        if (line.includes('|')) {
            const [category, field, value] = line.split('|').slice(1, 4).map(s => s.trim());
            if (category && field && value && !field.includes('-')) {
                if (!data[category]) {
                    data[category] = {};
                }
                data[category][field] = value;
            }
        }
    });
    
    return data;
}

// Function to generate HTML for a publication
function generatePublicationHtml(pubData) {
    const paper = pubData.paper;
    const dataArea = pubData.data_area.join(' ');
    
    let authorsHtml = paper.authors.map(author => {
        if (typeof author === 'object' && author.is_me) {
            return `<b class='me'>${author.name}</b>`;
        }
        return author;
    }).join(', ');
    
    let venueHtml = '';
    if (paper.venue) {
        venueHtml = paper.venue.name;
        if (paper.venue.short_name) {
            venueHtml = `${venueHtml} (<b>${paper.venue.short_name}</b>`;
            if (paper.venue.ranking) {
                venueHtml = `${venueHtml}, <b>${paper.venue.ranking}</b>`;
            }
            venueHtml += ')';
        }
        if (paper.venue.year) {
            venueHtml = `${venueHtml}, ${paper.venue.year}`;
        }
    }
    
    let linksHtml = '';
    if (paper.links) {
        if (paper.links.paper) {
            linksHtml += `[<a href="${paper.links.paper}" target="_blank">paper</a>] `;
        }
        if (paper.links.arxiv) {
            linksHtml += `[<a href="${paper.links.arxiv}" target="_blank">arXiv</a>] `;
        }
        if (paper.links.code) {
            linksHtml += `[<a href="${paper.links.code}" target="_blank">code</a>] `;
        }
        if (paper.links.blog) {
            linksHtml += `[<a href="${paper.links.blog}" target="_blank">blog</a>] `;
        }
        if (paper.links.supplementary) {
            linksHtml += `[<a href="${paper.links.supplementary}" target="_blank">supp</a>] `;
        }
    }
    
    let bibtexHtml = '';
    if (paper.bibtex) {
        const escapedBibtex = paper.bibtex
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
            .replace(/\\n/g, '\n')
            .trim();
            
        bibtexHtml = `
            <div class="link2">[<a class="fakelink" onclick="$(this).siblings('.bibref').slideToggle()">bibtex</a>]
                <pre class="bibref" style="overflow: hidden; display: none; margin: 0; padding: 10px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; font-family: monospace;">${escapedBibtex}</pre>
            </div>`;
    }
    
    let abstractHtml = '';
    if (paper.abstract) {
        abstractHtml = `
            <div class="link2">[<a class="fakelink" onclick="$(this).siblings('.abstract').slideToggle()">abstract</a>]
                <div class="abstract" style="overflow: hidden; display: none;">  
                    <p>${paper.abstract}</p>
                </div>
            </div>`;
    }
    
    let githubStarsHtml = '';
    if (paper.github) {
        githubStarsHtml = `
            <img src="https://img.shields.io/github/stars/${paper.github.user}/${paper.github.repo}.svg?style=social&amp;label=Star" 
                alt="GitHub stars" style="text-align:center;vertical-align:middle">`;
    }
    
    return `
        <div class="publication" data-area="${dataArea}">
            <dl class="description">
                <div class="figure"><img src="${paper.image}" class="paper-image"></div>
                <dt class="ptitle">${paper.title}</dt>
                <dd>${authorsHtml}</dd>
                <dd>${venueHtml}</dd>
                <dd>
                    ${linksHtml}
                    ${bibtexHtml}
                    ${abstractHtml}
                    ${githubStarsHtml}
                </dd>
            </dl>
        </div>`;
}

// Hardcoded list of publication files
const publicationFiles = [
    "shen2025diversity-guided.json",
    "zhu2025sdmprune.json",
    "tang2025learning.json",
    "tang2025data-efficient.json",
    "shen2025multiple.json",
    "shen2025multi-grained.json",
    "shen2025asymmetric.json",
    "shen2023inter-instance.json",
    "sheng2023modeling.json",
    "shen2021training.json",
    "shen2021progressive.json",
    "shen2019customizing.json",
    "shen2019amalgamating.json",
    "shen2018intra-class.json",
    "song2018selective.json",
    "song2018transductive.json",
    "fang2021contrastive.json",
    "fang2021mosaicking.json",
    "fang2019data-free.json",
    "song2020depara.json",
    "song2019deep.json"
];

// Load and display publications
async function loadPublications() {
    try {
        let publicationsHtml = '';
        
        // Load each publication JSON file
        for (const file of publicationFiles) {
            const pubResponse = await fetch(`./publications/${file}`);
            const pubData = await pubResponse.json();
            
            // Generate HTML for the publication
            publicationsHtml += generatePublicationHtml(pubData);
        }
        
        return publicationsHtml;
        
    } catch (error) {
        console.error('Error loading publications:', error);
        return 'Error loading publications';
    }
}

// Initialize filter buttons
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const publications = document.querySelectorAll('.publication');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const area = button.getAttribute('data-area');
            
            publications.forEach(pub => {
                if (area === 'all') {
                    pub.style.display = 'block';
                } else {
                    const pubAreas = pub.getAttribute('data-area').split(' ');
                    pub.style.display = pubAreas.includes(area) ? 'block' : 'none';
                }
            });
        });
    });
}

// Initialize image modal
function initializeImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.getElementsByClassName('close-modal')[0];
    
    // Get all paper images
    const images = document.getElementsByClassName('paper-image');
    
    // Add click event to each image
    Array.from(images).forEach(img => {
        img.onclick = function() {
            modal.style.display = "block";
            modalImg.src = this.src;
        }
    });
    
    // Close modal when clicking close button
    closeBtn.onclick = function() {
        modal.style.display = "none";
    }
    
    // Close modal when clicking outside the image
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

// Load publications when DOM content is loaded
document.addEventListener('DOMContentLoaded', loadPublications); 