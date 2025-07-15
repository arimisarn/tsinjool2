import requests

YOUTUBE_API_KEY = "AIzaSyCiniFMWroptb800PgSF6TsObUTUdU-mj4"


def get_youtube_url(query: str, api_key: str):
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": 1,
        "key": api_key,
    }
    response = requests.get(url, params=params)
    data = response.json()
    if data.get("items"):
        video_id = data["items"][0]["id"]["videoId"]
        return f"https://www.youtube.com/watch?v={video_id}"
    return None


def enrich_videos_with_youtube_urls(coaching_data, youtube_api_key):
    for step in coaching_data.get("steps", []):
        for ex in step.get("exercises", []):
            # On suppose recommended_videos est une liste de titres/mots-clés
            enriched_urls = []
            for keyword in ex.get("recommended_videos", []):
                url = get_youtube_url(keyword, youtube_api_key)
                if url:
                    enriched_urls.append(url)
            ex["recommended_videos"] = enriched_urls
    return coaching_data
