# What is it?

**IGDB Name Resolver** is a Vercel serverless function that resolves non Steam game names to the correct IGDB game name. It uses the IGDB API to search for the game name and returns the correct name if found.

This is useful for [iamSlightlyWind/SteamGrid](https://github.com/iamSlightlyWind/steamgrid) (not upstreamed) to get the correct game name for user-defined non Steam games, since upstream [SteamGridDB](https://github.com/boppreh/steamgrid) is not being maintained anymore, doesn't correctly resolve non Steam game names and thus fails to find the correct artworks for them.

# Do I need to set up anything?

No, the function is hosted on Vercel and is publicly accessible. You can use it without any setup. You can also host it yourself if you want to. [iamSlightlyWind/SteamGrid](https://github.com/iamSlightlyWind/steamgrid) will be updated to use this function by default.

# How do I deploy it?

Clone the repository and deploy it to Vercel. You need the following environment variables:

- `CLIENT_ID`: Your IGDB client ID
- `CLIENT_SECRET`: Your IGDB client secret

The following environment variables can be copied from your [Redis install](https://vercel.com/marketplace/redis):

- `KV_REST_API_READ_ONLY_TOKEN`
- `KV_REST_API_TOKEN`
- `KV_REST_API_URL`
- `KV_URL`
- `REDIS_URL`
- `VERCEL_OIDC_TOKEN`
