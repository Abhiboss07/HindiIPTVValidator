# Hindi IPTV Validator

A comprehensive IPTV validator that filters and validates Hindi language channels, including international channels with Hindi dubbed content.

## Features

- 🇮🇳 **Hindi Channel Detection**: Automatically identifies Hindi language channels
- 🌍 **International Content**: Disney, Discovery, HBO, Warner in Hindi
- 🔧 **Stream Validation**: Tests each channel and removes dead/blocked streams
- 📊 **Smart Filtering**: Filter by country (India) and category
- 📋 **Multiple Formats**: Output in M3U or JSON format
- 🎯 **Category Organization**: Organizes channels by type

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Validate all Hindi channels
python hindi_validator_demo.py hindi_channels_extended.m3u hindi_working.m3u

# Filter specific categories
python hindi_validator_demo.py hindi_channels_extended.m3u disney_hindi.m3u --category "International Hindi"
python hindi_validator_demo.py hindi_channels_extended.m3u hindi_news.m3u --category News
python hindi_validator_demo.py hindi_channels_extended.m3u hindi_kids.m3u --category Kids
```

## Channel Coverage

- **85 Total Hindi Channels** across 9 categories
- **16 International Hindi Channels** (Disney, Discovery, HBO, etc.)
- **10 News Channels** (NDTV, Aaj Tak, Republic, etc.)
- **9 Kids Channels** (Disney, Cartoon Network, Nickelodeon)
- **6 Sports Channels** (Star Sports, Sony Sports, etc.)
- **9 Movie Channels** (Star Gold, Sony Max, etc.)
- **7 Music Channels** (MTV India, Zee Music, etc.)
- **10 Lifestyle Channels** (Food, Travel, Business)
- **6 Religious Channels** (Aastha, Sanskar, etc.)

## Files

- `hindi_validator.py` - Full validator with stream testing
- `hindi_validator_demo.py` - Demo version (no ffprobe required)
- `channels.yml` - Channel metadata configuration
- `requirements.txt` - Python dependencies

Perfect for creating clean, working Hindi IPTV playlists! 🇮🇳
