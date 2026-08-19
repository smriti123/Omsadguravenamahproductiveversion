# Sadguru Vani: transcript-ready data architecture

Transcripts are not imported in V1. They are optional search/indexing aids and must not be presented as authoritative quotations.

## Talk extension

The existing canonical catalogue remains `../data/satsang-talks.json`. Runtime playlist episodes use a stable YouTube video ID. A future metadata index may add optional fields without changing the catalogue hierarchy:

```json
{
  "videoId": "youtube-video-id",
  "transcript": {
    "available": true,
    "languages": ["hi"],
    "source": "youtube-captions",
    "status": "unreviewed-auto",
    "version": 1
  }
}
```

## Optional transcript document

Store transcript documents separately from the main talks catalogue, keyed by YouTube video ID:

```json
{
  "videoId": "youtube-video-id",
  "language": "hi",
  "source": "youtube-captions",
  "status": "unreviewed-auto",
  "segments": [
    { "start": 2262.4, "end": 2268.1, "text": "..." }
  ]
}
```

This allows future search results to point to an approximate playback time while keeping the transcript separate from published quotations. The interface should label automatic/unreviewed text clearly and lead users to the original audio.

## Manan V1

Manan remains in localStorage key `sadguru-vani-library-v1`. `mananNotes[talkId]` contains an array of `{ id, text, seconds, createdAt }`. `seconds` is optional. Existing single notes in `notes[talkId]` are migrated once to one timestamp-free Manan entry and preserved in the old field for rollback safety.

Cross-device sync, accounts, bulk transcript import, speech-to-text, and AI answers in Param Pujya Swamiji's name are outside V1.
