from django import template

register = template.Library()

@register.inclusion_tag('tags/render_charts.html')
def render_charts():
    pass