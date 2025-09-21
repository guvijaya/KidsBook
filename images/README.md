# Images Folder

This folder contains shared images that can be used across all language essays.

## Usage in Markdown Files

To use images in your markdown essays, reference them like this:

```markdown
![Description](../images/image-name.jpg)
```

## Supported Image Formats

- `.jpg` / `.jpeg`
- `.png` 
- `.gif`
- `.webp`
- `.svg`

## Image Guidelines

1. **File Naming**: Use descriptive, lowercase names with hyphens
   - ✅ `birthday-cake.jpg`
   - ✅ `kids-playing.png`
   - ❌ `IMG_001.jpg`

2. **Size Recommendations**:
   - Max width: 800px for optimal display
   - File size: Keep under 500KB for fast loading

3. **Common Images**: This folder is shared across all languages
   - Tamil essays: `essays/ta/*.md` → `../images/`
   - Telugu essays: `essays/te/*.md` → `../images/`
   - English essays: `essays/en/*.md` → `../images/`
   - Kannada essays: `essays/kn/*.md` → `../images/`
   - Hindi essays: `essays/hi/*.md` → `../images/`

## Example Usage

```markdown
# My Birthday Story

![Birthday Party](../images/birthday-party.jpg)

We had a wonderful birthday celebration with friends and family.

## The Cake

![Chocolate Cake](../images/chocolate-cake.jpg)

The cake was delicious and had my favorite flavor.
```