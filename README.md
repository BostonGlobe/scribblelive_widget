# Scribblelive widget
A homepage widget that pulls in latest tweets and cycles through them via Scribblelive

## Instructions

1. Create ticket for cron job on [Jira](http://jira.boston.com)

```
Project: Operations
**Issue type**: Cronjob
**Summary**: hit php output to jsonp
**Add watchers**: mike.devlin

**Description**:
URL: http://private.boston.com/newsprojects/scribblelive/fetch.php?callback=onLoadData&token=[your-token]&event=[your-event]
Save output as [your-filename-date].jsonp
Result should be public
Run every minute
End on [date]
```

Replace the brackets above with your info.

2. Create a new jpt in Methode by copying the contents of `methode.jpt`
3. Fill out custom data in jpt

## Developers
Graphic files live at `/Boston/Content/Metro/WebGraphics/reusable/scribblelive`

## TODO
* truncate (option / default to twitter)