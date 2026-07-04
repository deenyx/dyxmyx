# TODO

- [x] Ads: VAST preroll reliability + UX (start-over)
  - [x] Add proper error handling and user-facing fallback when VAST fetch/parsing fails
  - [x] Improve VAST media file selection to pick the most playable mp4/progressive variant
  - [x] Fix skip countdown lifecycle + ensure content always transitions after ad (ended/skip/timeout)
  - [x] Ensure timers are cleared on every transition
  - [x] Add lightweight tracking (impression already exists; add optional complete if available)
  - [x] Run lint/build and quick manual test of preroll + skip + fallback

