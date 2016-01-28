# Scribblelive widget
A homepage widget that pulls in latest tweets and cycles through them via Scribblelive

## Instructions

1. Setup the event and get the stream id (Syndication -> API) and token (Gear in top menu -> API -> enter description and click generate)

2. Create ticket for cron job on [Jira](http://jira.boston.com)

```
Project: Operations
**Issue type**: Cronjob
**Summary**: hit php output to jsonp
**Add watchers**: mike.devlin

**Description**:
URL: http://private.boston.com/newsprojects/scribblelive/fetch.php?callback=onLoadData&token=[your-token]&event=[your-stream-id]
Save output as [your-filename-date].jsonp
Result should be public
Run every minute
End on [date]
```

Replace the brackets above with your info.

3. Create a new jpt in Methode by copying the contents in the file [**methode.jpt**](/methode.jpt)
4. Fill out customData in jpt

## Developers
Graphic files live at `/Boston/Content/Metro/WebGraphics/reusable/scribblelive`