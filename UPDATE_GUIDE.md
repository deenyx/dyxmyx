# Quick Content Update Guide

This site is mostly driven by data files, so you can update content without editing React components.

## 1. Update a model profile
Open [data/profiles.json](data/profiles.json) and edit the profile object for the model you want to change.

You can update:
- name
- bio
- location
- contactEmail
- avatar
- photos
- videos

## 2. Add or replace a video
Inside the model's `videos` array, update an existing item or add a new one.

Each video item should look like this:

```json
{
  "url": "https://player.mediadelivery.net/play/677818/your-video-id",
  "title": "Video Title",
  "poster": "/deenyx/titlecards/1.jpg"
}
```

Tips:
- Use a public Bunny play URL for best compatibility.
- Keep the poster path relative to the public folder.

## 3. Add an image or poster
Place your file in [public/uploads](public/uploads) or another public folder.

Then reference it like this in the JSON:

```json
"avatar": "/uploads/deenyx/your-image.jpg"
```

## 4. Preview changes
Run the app locally:

```bash
npm run dev
```

Then open http://localhost:3000.

## 5. If a video does not play
Check that:
- the URL is public
- the URL is a Bunny play URL or another supported format
- the poster image exists

## 6. Shareable video links
The video page now supports shareable links. When a visitor selects a video, the page URL can be shared by text or copied directly.

## 7. Views counter
The videos UI now keeps a per-video views counter.

- The counter increases when a video becomes active (including direct video links).
- Counts are stored in the browser using localStorage.
- Storage key: `dyxmyx.videoViews`.
- To reset counts for testing, clear that key in browser dev tools.
