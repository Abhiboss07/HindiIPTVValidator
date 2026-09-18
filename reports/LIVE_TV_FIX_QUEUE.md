# T2L Live TV Remediation & Fix Queue

This document tracks channels with broken sources, improper mappings, and required migrations.

## P0 — IDENTITY / WRONG CHANNEL SOURCE (3 Channels)

### Discovery Channel HD (Hindi) (`discovery-channel-hindi-hd`)
- **Current URL**: ``
- **Diagnostic Issue**: No source URL specified
- **Required Action**: Unmap foreign feed and replace with verified broadcast origin stream.

### Animal Planet HD (Hindi) (`animal-planet-hindi-hd`)
- **Current URL**: ``
- **Diagnostic Issue**: No source URL specified
- **Required Action**: Unmap foreign feed and replace with verified broadcast origin stream.

### Disney Channel HD (Hindi) (`disney-channel-hindi-hd`)
- **Current URL**: ``
- **Diagnostic Issue**: No source URL specified
- **Required Action**: Unmap foreign feed and replace with verified broadcast origin stream.

## P1 — BROKEN KIDS & CARTOON CHANNELS (1 Channels)

### ZB Cartoon (`live_ch_633`)
- **URL**: `https://server.zillarbarta.com/zbcatun/video.m3u8`
- **Failure**: `HTTP_404_NOT_FOUND`
- **Action**: Replace with authenticated/live feed.

## P2 — BROKEN INFOTAINMENT & DOCUMENTARY CHANNELS (2 Channels)

### Discovery Channel HD (Hindi) (`discovery-channel-hindi-hd`)
- **URL**: ``
- **Failure**: `EMPTY_SOURCE_URL`
- **Action**: Deploy verified broadcaster feed.

### Animal Planet HD (Hindi) (`animal-planet-hindi-hd`)
- **URL**: ``
- **Failure**: `EMPTY_SOURCE_URL`
- **Action**: Deploy verified broadcaster feed.

