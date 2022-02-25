# Wagtail Charts
Chart.js charts in Wagtail, edited and customised from the Wagtail admin

Assuming you have a Wagtail project up and running:

`pip install wagtailcharts`

Add `wagtailcharts` to your settings.py in the INSTALLED_APPS section, before the core wagtail packages:

```
INSTALLED_APPS = [
    # ...
    'commonblocks',
    'wagtail.contrib.wagtailsitemaps',
    # ...
]
