export class LiquidGenerator {
    theme = 'dawn';
    async generate(prompt, context) {
        const lowerPrompt = prompt.toLowerCase();
        const files = [];
        // Determine what to generate based on prompt
        if (lowerPrompt.includes('section')) {
            files.push(...await this.generateSection(prompt, context));
        }
        else if (lowerPrompt.includes('snippet') || lowerPrompt.includes('partial')) {
            files.push(...await this.generateSnippet(prompt, context));
        }
        else if (lowerPrompt.includes('layout') || lowerPrompt.includes('theme')) {
            files.push(...await this.generateLayout(prompt, context));
        }
        else if (lowerPrompt.includes('component') || lowerPrompt.includes('card')) {
            files.push(...await this.generateComponent(prompt, context));
        }
        else {
            // Default to section
            files.push(...await this.generateSection(prompt, context));
        }
        return files;
    }
    async generateSection(prompt, context) {
        const sectionName = this.extractSectionName(prompt);
        const schema = this.generateSchema(prompt);
        return [{
                path: `sections/${sectionName}.liquid`,
                content: this.generateSectionTemplate(sectionName, schema, prompt),
                language: 'liquid',
                description: `Section: ${sectionName}`,
            }];
    }
    async generateSnippet(prompt, context) {
        const snippetName = this.extractSnippetName(prompt);
        return [{
                path: `snippets/${snippetName}.liquid`,
                content: this.generateSnippetTemplate(snippetName, prompt),
                language: 'liquid',
                description: `Snippet: ${snippetName}`,
            }];
    }
    async generateLayout(prompt, context) {
        return [{
                path: 'layout/theme.liquid',
                content: this.generateLayoutTemplate(),
                language: 'liquid',
                description: 'Theme layout template',
            }];
    }
    async generateComponent(prompt, context) {
        const componentName = this.extractComponentName(prompt);
        return [{
                path: `snippets/${componentName}.liquid`,
                content: this.generateComponentTemplate(componentName, prompt),
                language: 'liquid',
                description: `Component: ${componentName}`,
            }];
    }
    extractSectionName(prompt) {
        const match = prompt.match(/section[:\s]+["']?([a-z0-9-_]+)["']?/i);
        if (match && match[1])
            return match[1];
        const words = prompt
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, '')
            .split(' ')
            .filter(w => !['the', 'a', 'an', 'with', 'and', 'for', 'section'].includes(w));
        return words.slice(0, 3).join('-') || 'custom-section';
    }
    extractSnippetName(prompt) {
        const match = prompt.match(/snippet[:\s]+["']?([a-z0-9-_]+)["']?/i);
        if (match && match[1])
            return match[1];
        const words = prompt
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, '')
            .split(' ')
            .filter(w => !['the', 'a', 'an', 'with', 'and', 'for', 'snippet', 'partial'].includes(w));
        return words.slice(0, 2).join('-') || 'custom-snippet';
    }
    extractComponentName(prompt) {
        const match = prompt.match(/component[:\s]+["']?([a-z0-9-_]+)["']?/i);
        if (match && match[1])
            return match[1];
        const words = prompt
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, '')
            .split(' ')
            .filter(w => !['the', 'a', 'an', 'with', 'and', 'for', 'component', 'card'].includes(w));
        return words.slice(0, 2).join('-') || 'component';
    }
    generateSchema(prompt) {
        const schema = {
            name: this.extractSectionName(prompt),
            tag: 'section',
            class: 'section',
            settings: [
                {
                    type: 'text',
                    id: 'title',
                    label: 'Title',
                    default: 'Featured Collection',
                },
                {
                    type: 'checkbox',
                    id: 'show_description',
                    label: 'Show description',
                    default: true,
                },
            ],
            blocks: [
                {
                    type: 'product',
                    name: 'Product',
                    settings: [
                        {
                            type: 'product',
                            id: 'product',
                            label: 'Product',
                        },
                    ],
                },
            ],
            presets: [
                {
                    name: 'Default',
                    category: 'Featured',
                },
            ],
        };
        // Detect if should have image
        if (prompt.toLowerCase().includes('image') || prompt.toLowerCase().includes('hero')) {
            schema.settings.push({
                type: 'image_picker',
                id: 'image',
                label: 'Image',
            });
        }
        // Detect if should have color scheme
        if (prompt.toLowerCase().includes('color') || prompt.toLowerCase().includes('theme')) {
            schema.settings.push({
                type: 'select',
                id: 'color_scheme',
                label: 'Color scheme',
                options: [
                    { value: 'background-1', label: 'Background 1' },
                    { value: 'background-2', label: 'Background 2' },
                    { value: 'inverse', label: 'Inverse' },
                    { value: 'accent-1', label: 'Accent 1' },
                    { value: 'accent-2', label: 'Accent 2' },
                ],
                default: 'background-1',
            });
        }
        return schema;
    }
    generateSectionTemplate(name, schema, prompt) {
        const settings = schema.settings.map(s => `    {
      type: "${s.type}",
      id: "${s.id}",
      label: "${s.label}"${s.default !== undefined ? `,
      default: ${typeof s.default === 'string' ? `"${s.default}"` : s.default}` : ''}
    }`).join(',\n');
        return `{% comment %}
  Section: ${name}
  Description: ${prompt.slice(0, 100)}...
{% endcomment %}

{{\`scheme-${name}.json\` | stylesheet_tag }}

<section class="section {{ name }} section-{{ section.id }}" {{ shopify_attributes }}>
  <div class="container">
    {%- if section.settings.title != blank -%}
      <h2 class="{{ section.settings.heading_size }}">
        {{ section.settings.title | escape }}
      </h2>
    {%- endif -%}

    {%- if section.settings.show_description == true and section.blocks.size > 0 -%}
      <div class="section-description">
        {{ section.blocks.first.settings.product.description }}
      </div>
    {%- endif -%}

    <div class="grid">
      {%- for block in section.blocks -%}
        {%- case block.type -%}
          {%- when 'product' -%}
            {%- render 'product-card', product: block.settings.product, block: block -%}
          {%- when 'text' -%}
            <div class="text-block" {{ block.shopify_attributes }}>
              {{ block.settings.text }}
            </div>
        {%- endcase -%}
      {%- endfor -%}
    </div>
  </div>
</section>

{% schema %}
{
  ${JSON.stringify(schema, null, 4).replace(/"/g, '"').replace(/\\n/g, '\n').split('\n').map((l, i) => i === 0 ? l : '  ' + l).join('\n')}
}
{% endschema %}

{% stylesheet %}
.{{ name }} {
  padding: {{ section.settings.padding_top }}px 0 {{ section.settings.padding_bottom }}px;
}

.{{ name }} .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.{{ name }} .grid {
  display: grid;
  grid-template-columns: repeat({{ section.settings.columns_desktop }}, 1fr);
  gap: {{ section.settings.column_gap }}px;
}

@media screen and (max-width: 749px) {
  .{{ name }} .grid {
    grid-template-columns: repeat({{ section.settings.columns_mobile }}, 1fr);
  }
}
{% endstylesheet %}

{% javascript %}
  // Section-specific JavaScript
{% endjavascript %}
`;
    }
    generateSnippetTemplate(name, prompt) {
        return `{% comment %}
  Snippet: ${name}
  Description: ${prompt.slice(0, 100)}...
{% endcomment %}

{% comment %} Usage: {% render '${name}' %} {% endcomment %}

<div class="{{ name }}">
  ${prompt.toLowerCase().includes('product') ? `{% if product %}
    <div class="{{ name }}__product">
      <h3>{{ product.title }}</h3>
      <p>{{ product.price | money }}</p>
    </div>
  {% endif %}` : `  <p>${name} content</p>`}
</div>
`;
    }
    generateLayoutTemplate() {
        return `<!doctype html>
<html class="no-js" lang="{{ request.locale.iso_code }}">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="theme-color" content="">
    <link rel="canonical" href="{{ canonical_url }}">
    
    {%- if settings.favicon != blank -%}
      <link rel="icon" type="image/png" href="{{ settings.favicon | image_url: width: 32, height: 32 }}">
    {%- endif -%}

    {%- unless settings.type_header_font.system? and settings.type_body_font.system? -%}
      <link rel="preconnect" href="https://fonts.shopifycdn.com" crossorigin>
    {%- endunless -%}

    <title>
      {{ page_title }}
      {%- if current_tags %} &ndash; tagged "{{ current_tags | join: ', ' }}"{% endif -%}
      {%- if current_page != 1 %} &ndash; Page {{ current_page }}{% endif -%}
      {%- unless page_title contains shop.name %} &ndash; {{ shop.name }}{% endunless -%}
    </title>

    {% if page_description %}
      <meta name="description" content="{{ page_description | escape }}">
    {% endif %}

    {% render 'meta-tags' %}

    {{ content_for_header }}

    {%- liquid
      assign body_font_bold = settings.type_body_font | font_modify: 'weight', 'bold'
      assign body_font_italic = settings.type_body_font | font_modify: 'style', 'italic'
      assign body_font_bold_italic = body_font_bold | font_modify: 'style', 'italic'
    %}

    {% style %}
      {{ settings.type_body_font | font_face: font_display: 'swap' }}
      {{ body_font_bold | font_face: font_display: 'swap' }}
      {{ body_font_italic | font_face: font_display: 'swap' }}
      {{ body_font_bold_italic | font_face: font_display: 'swap' }}
      {{ settings.type_header_font | font_face: font_display: 'swap' }}

      :root {
        --font-body-family: {{ settings.type_body_font.family }}, {{ settings.type_body_font.fallback_families }};
        --font-body-style: {{ settings.type_body_font.style }};
        --font-body-weight: {{ settings.type_body_font.weight }};
        --font-body-weight-bold: {{ settings.type_body_font.weight | plus: 300 | at_most: 1000 }};

        --color-base-text: {{ settings.colors_text.red }}, {{ settings.colors_text.green }}, {{ settings.colors_text.blue }};
        --color-shadow: {{ settings.colors_text.red }}, {{ settings.colors_text.green }}, {{ settings.colors_text.blue }};
        --color-base-background-1: {{ settings.colors_background_1.red }}, {{ settings.colors_background_1.green }}, {{ settings.colors_background_1.blue }};
        --color-base-background-2: {{ settings.colors_background_2.red }}, {{ settings.colors_background_2.green }}, {{ settings.colors_background_2.blue }};
        --color-base-solid-button-labels: {{ settings.colors_solid_button_labels.red }}, {{ settings.colors_solid_button_labels.green }}, {{ settings.colors_solid_button_labels.blue }};
        --color-base-outline-button-labels: {{ settings.colors_outline_button_labels.red }}, {{ settings.colors_outline_button_labels.green }}, {{ settings.colors_outline_button_labels.blue }};
        --color-base-accent-1: {{ settings.colors_accent_1.red }}, {{ settings.colors_accent_1.green }}, {{ settings.colors_accent_1.blue }};
        --color-base-accent-2: {{ settings.colors_accent_2.red }}, {{ settings.colors_accent_2.green }}, {{ settings.colors_accent_2.blue }};
      }
    {% endstyle %}

    {{ 'base.css' | asset_url | stylesheet_tag }}
  </head>

  <body class="gradient">
    <a class="skip-to-content-link button visually-hidden" href="#MainContent">
      {{ 'accessibility.skip_to_text' | t }}
    </a>

    {% sections 'header-group' %}

    <main id="MainContent" role="main" tabindex="-1">
      {{ content_for_layout }}
    </main>

    {% sections 'footer-group' %}

    <ul hidden>
      <li id="a11y-refresh-page-message">{{ 'accessibility.refresh_page' | t }}</li>
      <li id="a11y-new-window-message">{{ 'accessibility.link_messages.new_window' | t }}</li>
    </ul>

    <script>
      window.shopUrl = '{{ request.origin }}';
      window.routes = {
        cart_add_url: '{{ routes.cart_add_url }}',
        cart_change_url: '{{ routes.cart_change_url }}',
        cart_update_url: '{{ routes.cart_update_url }}',
        cart_url: '{{ routes.cart_url }}',
        predictive_search_url: '{{ routes.predictive_search_url }}'
      };
    </script>

    {%- if settings.cart_type == 'drawer' -%}
      {% render 'cart-drawer' %}
    {%- endif -%}

    {{ 'global.js' | asset_url | script_tag }}
  </body>
</html>
`;
    }
    generateComponentTemplate(name, prompt) {
        return `{% comment %}
  Component: ${name}
  Description: ${prompt.slice(0, 100)}...
{% endcomment %}

{% comment %} Usage: {% render '${name}', product: product %} {% endcomment %}

{% if product %}
  <div class="${name}" {{ block.shopify_attributes }}>
    <div class="${name}__media">
      {% if product.featured_media %}
        <img
          src="{{ product.featured_media | image_url: width: 533 }}"
          alt="{{ product.featured_media.alt | escape }}"
          loading="lazy"
          width="{{ product.featured_media.width }}"
          height="{{ product.featured_media.height }}"
        >
      {% endif %}
    </div>
    
    <div class="${name}__info">
      <h3 class="${name}__title">
        <a href="{{ product.url }}">
          {{ product.title | escape }}
        </a>
      </h3>
      
      <div class="${name}__price">
        {% render 'price', product: product, price_class: '' %}
      </div>
      
      {% if product.description %}
        <p class="${name}__description">
          {{ product.description | truncate: 100 }}
        </p>
      {% endif %}
    </div>
  </div>
{% endif %}

<style>
  .${name} {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .${name}__media img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }

  .${name}__info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .${name}__title a {
    text-decoration: none;
    color: inherit;
  }
</style>
`;
    }
}
//# sourceMappingURL=liquid-generator.js.map