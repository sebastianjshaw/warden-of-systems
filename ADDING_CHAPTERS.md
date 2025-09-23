# Adding New Chapters to Warden of Systems

This guide explains how to easily add new chapters to the website.

## Quick Steps

1. **Create the chapter HTML file** (e.g., `chapter2.html`)
2. **Add chapter info to `chapters.html`**
3. **Add the chapter image** to the `images/` directory
4. **Update navigation** in existing chapters

## Detailed Instructions

### 1. Create Chapter HTML File

Copy `chapter1.html` and rename it to `chapterX.html` (where X is the chapter number).

Update these elements:
- `<title>` tag
- `<h1 class="wardrobe-chapter-reader-title">` 
- Chapter content in `.wardrobe-chapter-text`
- Chapter header image path
- Navigation buttons (previous/next chapter)

### 2. Update Chapters Overview Page

In `chapters.html`, add a new chapter card in the `.wardrobe-chapters-grid`:

```html
<article class="wardrobe-chapter-card">
    <div class="wardrobe-chapter-thumbnail">
        <img src="images/chapterX-header.jpg" alt="Chapter X Title" class="wardrobe-chapter-thumb-img">
        <div class="wardrobe-chapter-number">X</div>
    </div>
    <div class="wardrobe-chapter-info">
        <h3 class="wardrobe-chapter-title">Chapter Title</h3>
        <p class="wardrobe-chapter-summary">Brief summary of the chapter...</p>
        <div class="wardrobe-chapter-meta">
            <span class="wardrobe-chapter-date">Published: Month Year</span>
            <span class="wardrobe-chapter-status wardrobe-status-published">Published</span>
        </div>
        <a href="chapterX.html" class="wardrobe-btn wardrobe-btn-primary">Read Chapter</a>
    </div>
</article>
```

### 3. Update Homepage

In `index.html`, update the latest chapter section:
- Change the chapter image
- Update the chapter title and summary
- Update the "Read Chapter" link

### 4. Update Navigation

In the new chapter file, update the navigation section:
- Previous chapter link (if not Chapter 1)
- Next chapter link (if not the latest chapter)
- Chapter info text

### 5. Add Chapter Image

- Add the header image to `images/chapterX-header.jpg`
- Recommended size: 1200x400px
- Optimize for web (under 500KB)

## Chapter Content Structure

Each chapter should follow this structure:

```html
<div class="wardrobe-chapter-text">
    <p>First paragraph...</p>
    <p>Second paragraph...</p>
    <!-- Add images if needed -->
    <img src="images/chapterX-image1.jpg" alt="Description" class="wardrobe-chapter-inline-img">
    <p>Continue story...</p>
</div>
```

## Adding Inline Images

For images within the chapter text, add this CSS class:

```css
.wardrobe-chapter-inline-img {
    max-width: 100%;
    height: auto;
    border-radius: 5px;
    margin: 2rem 0;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}
```

## Status Classes

- `wardrobe-status-published` - For published chapters
- `wardrobe-status-upcoming` - For upcoming chapters
- `wardrobe-chapter-upcoming` - For upcoming chapter cards (adds opacity)

## Example: Adding Chapter 2

1. Copy `chapter1.html` → `chapter2.html`
2. Update title: "Chapter 2 — The Awakening"
3. Add content to `.wardrobe-chapter-text`
4. Update image: `images/chapter2-header.jpg`
5. Update navigation: Previous → Chapter 1, Next → Coming Soon
6. Add chapter card to `chapters.html`
7. Update homepage latest chapter section

That's it! The website will automatically handle the rest.
