# MultiFlix

## Recommendation Engine

MultiFlix includes a profile-level content-based recommendation system:

- **Per-profile:** Each profile gets independent recommendations based on its own watch history, consistent with the platform's data isolation design.
- **Genre-based filtering:** The engine fetches genre metadata for each watched title from TMDb, builds a weighted genre profile, and queries TMDb's discovery API filtered by the top 3 genres.
- **Cold start handling:** Profiles with no watch history receive trending content as a fallback, ensuring the "Recommended for you" row is never empty.
- **Two-layer caching:** Genre metadata is cached in memory for 1 hour to minimize TMDb API calls, and final recommendation results are cached per profile for 30 minutes.
- **Watched title filtering:** Already-watched titles are excluded from recommendations.
