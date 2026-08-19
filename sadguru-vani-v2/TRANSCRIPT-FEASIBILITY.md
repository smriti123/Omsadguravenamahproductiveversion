# Transcript feasibility investigation — 12 August 2026

No transcript text was downloaded, stored, or generated.

## Sample checked

Twelve public video IDs were selected from different catalogue entries and years:

| Category | Series / recording | Year | Video ID | Result |
|---|---|---:|---|---|
| Bhagwat Geeta | Chapter 1, Sidhbari | 2005–2008 | `_kgtL2bOUI8` | Caption status indeterminate without authorized channel access |
| Bhagwat Geeta | Chapter 2, Sidhbari | 2005–2008 | `EwOu9Kp4bVg` | Caption status indeterminate without authorized channel access |
| Bhagwatam | Bhagvat Katha, Jaipur | 2018 | `4VgesOYmm54` | Caption status indeterminate without authorized channel access |
| Bhagwatam | Srimad Bhagvad Katha, Sidhbari | 2016 | `3eAHoMOtwvo` | Caption status indeterminate without authorized channel access |
| Bhagwatam | Bhagvat Katha, Sidhbari | 2014 | `AOv_SI4V7EA` | Caption status indeterminate without authorized channel access |
| Bhagwatam | Bhagvad Katha, Vrindavan | 2013 | `2TAVT-cJkDw` | Caption status indeterminate without authorized channel access |
| Bhagwatam | Bhagvad Katha, Dehradun | 2013 | `Ih-QBziDQqQ` | Caption status indeterminate without authorized channel access |
| Bhagwatam | Bhagvat Katha, Rishikesh | 2005 | `BQ8fZ9g8RQM` | Caption status indeterminate without authorized channel access |
| Ramayana | Beej Ramayan | unknown | `3PdTjJdqWqI` | Caption status indeterminate without authorized channel access |
| Ramayana | Ramcharitmanas, Kanpur | 2005 | `FY8WMmqKYXE` | Caption status indeterminate without authorized channel access |
| Others | प्रश्नोत्तर सत्र | unknown | `QNnvs30ZSWI` | Caption status indeterminate without authorized channel access |
| Others | Question & Answer | 2018 | `8dM5ELs3AUU` | Caption status indeterminate without authorized channel access |

Upanishad and Prakaran Granth catalogue records in the canonical JSON are playlist-only and do not expose a first video ID. Those should be added to a second sample after playlist enumeration, without downloading transcript text.

## What the checks established

- YouTube's old public `api/timedtext?type=list` endpoint returned HTTP 200 with an empty body for all twelve videos. This endpoint is not reliable enough to interpret an empty body as “captions unavailable.”
- Public watch-page metadata requests repeatedly timed out in this environment, so language, manual/automatic status, segment timestamps, and linguistic quality could not be verified reliably.
- The supported official method is the YouTube Data API `captions.list`, which requires OAuth authorization. It returns caption-track metadata, not transcript text.
- Official `captions.download` also requires authorization and permission for the caption track. Therefore channel-owner cooperation is the cleanest legal and technical route for a reliable audit and later import.
- YouTube automatic captions support Hindi in general, but availability and quality must be checked per video. Old audio, Sanskrit, names and Vedanta terminology require human quality review.

## Recommendation before any bulk work

1. Obtain authorization from the YouTube channel owner for a read-only caption audit.
2. Repeat a 12–15 video sample covering all six categories, old/new recordings and several series.
3. Record only availability metadata first: language, track kind, status and timestamps.
4. Manually assess small excerpts for Hindi/Sanskrit search usefulness; do not publish them as quotations.
5. If approved, store timestamped transcript documents separately from the canonical talk catalogue.
6. Search results should always link to the original audio at the approximate time.

Speech-to-text, bulk transcript download, AI transcript search and an AI persona speaking for Param Pujya Swamiji remain explicitly out of scope.
