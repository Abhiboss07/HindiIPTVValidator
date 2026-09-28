
--- Guide for carousel-slide-effects ---
# Build Carousel Slide Effects

Carousel slide effects are a great way to add visual interest to a carousel. As the user scrolls through the slides, each slide can animate as it enters, centers, and exits the scrollport. For example, the slides can fade in and out, rotate, or scale in size. This creates a dynamic and engaging user experience. Unlike simple entry/exit animations, this effect uses a single, continuous animation to control the slide's appearance across the entire scrollport.

## How to implement

Here’s how to create carousel slide effects:

1.  **Create a scroller:** This element will act as the container for your carousel slides. In this example it uses `overflow-x: scroll` to allow horizontal scrolling.

    ```html
    <ul class="scroller">
      <li class="entry">1</li>
      <li class="entry">2</li>
      <li class="entry">3</li>
      …
    </ul>
    ```

    ```css
    .scroller {
      overflow-x: scroll;
    }
    ```

2.  **Define the animation:** Create a CSS animation that defines the different states of your slides as they traverse the scrollport. You can define keyframes for any part of the animation. For example, you can define a state for when the slides are in the center of the scrollport by including a `50%` keyframe. In this example, the `scale` property makes the slides grow as they approach the center and shrink as they move away.

    ```css
    @keyframes animate {
      0% {
        scale: 0.5;
      }
      50% {
        scale: 1;
      }
      100% {
        scale: 0.5;
      }
    }
    ```

3.  **Apply the animation and `view-timeline`:** Attach the animation to the carousel slides and link it to a `view-timeline` that tracks the element as it scrolls through the container.

    ```css
    .scroller > * {
      animation: animate auto linear both;
      animation-timeline: view(inline);
    }
    ```

    By default, `view()` tracks the element on the `block` axis. If you need to track it on the `inline` axis, you can use `view(inline)`.

## Example code

This code animates the carousel items of a horizontal scroller on scroll using an **anonymous view-timeline**:

```css
@keyframes animate {
  0% {
    scale: 0.5;
  }

  50% {
    scale: 1;
  }

  100% {
    scale: 0.5;
  }
}

.scroller > * {
  /* Applies the animation using an `auto` duration */
  animation: animate auto linear both;
  /* Sets the animation timeline to use an anonymous view progress timeline, tracking the element's progress through the scroller on the inline axis */
  animation-timeline: view(inline);
}
```

This code animates the carousel items of a horizontal scroller on scroll using a **named view-timeline**:

```css
@keyframes animate {
  0% {
    scale: 0.5;
  }

  50% {
    scale: 1;
  }

  100% {
    scale: 0.5;
  }
}

/* This creates a named view-timeline on each carousel item. The timeline is used to drive the animation that is applied on the same element. */
.scroller > * {
  /* Applies the animation using an `auto` duration */
  animation: animate auto linear both;
  /* Defines a named view progress timeline, tracking the element's progress through the scroller on the inline axis */
  view-timeline: --item inline;
  /* Sets the animation timeline to use the named view progress timeline defined above */
  animation-timeline: --item;
}
```

## Best Practices

When using scroll-driven animations, it's important to follow a few best practices to ensure a smooth and accessible experience:

- **DO** include feature detection: Not all browsers support scroll-driven animations. Use `@supports ((animation-timeline: view()) and (animation-range: entry))` to check for support and provide a fallback for browsers that don't support it.
  - The `(animation-range: entry)` check **MUST** be included here, to filter out browsers with only partial support.
  - **DO NOT** use the `scroll-timeline-polyfill` package for the fallback strategy as it is not feature complete and has a lot of known issues.
  - If the animation is only considered to be decorative, opt for Progressive Enhancement and **DO NOT** provide a fallback.
- **DO** respect user preferences: Some users prefer to have less motion on the web. Use the `prefers-reduced-motion` media query to disable or reduce your animations for these users.
- **DO** try to animate only performant CSS properties: For the smoothest animations, stick to animating properties that can be handled by the browser's compositor thread, such as `transform` and `opacity`. Animating other properties like `width` or `height` can lead to performance issues.
- **DO** use the correct declaration order: When using the `animation` shorthand property, declare `animation-timeline` and `animation-range` *after* it to prevent the shorthand from resetting the timeline.

Prefer a named `view-timeline` when multiple DOM elements need to animate based on the same timeline, or when you need to animate children of the element that has the `view-timeline` defined on it. If the element that you animate is also the element that defines the `view-timeline`, you can use an anonymous view-timeline using `view()`.

When using the `view()` function to create a scroll-driven animation:

- **OPTIONAL** be explicit about the axis to track: When not targeting the default `block` axis (such as in a horizontal scroller), be explicit about which axis to track with `view(block)` or `view(inline)`.

When using the `view-timeline` property to create a scroll-driven animation:

- **DO** use a CSS `<dashed-ident>` for the name (e.g. `view-timeline: --my-custom-name`)
- **OPTIONAL** be explicit about the axis to track: When not targeting the default `block` axis (such as in a horizontal scroller), be explicit about which axis to track with `view-timeline-axis`.
- **DO** make sure the scope of the lookup works: When the element that is declaring the `view-timeline` is not a flat tree ancestor of the animated element, hoist up the visibility of the `view-timeline`’s name by using `timeline-scope` on a shared ancestor.

## Browser support and fallback strategies

Scroll-driven animations has limited availability.
Supported by: Chrome 115 (Jul 2023), Edge 115 (Jul 2023), and Safari 26 (Sep 2025).
Unsupported in: Firefox.. Therefore, a fallback strategy is typically required.

For browsers that do not support scroll-driven animations, you can use a fallback to recreate the visual effects. The fallbacks are typically built with either a scroll listener (for ScrollTimeline effects) or the IntersectionObserver API (for ViewTimeline effects).

In browsers with built-in support for scroll-driven animations, ALWAYS use the native CSS implementation as those are more performant.

Note that not every effect can be recreated using the fallbacks approach.

For this use-case specifically, the following script applies the fallback for browsers that do not support scroll-driven animations. It uses the Web Animations API (`Element.animate()`) to create a paused animation for each item in the carousel. It then listens to the `scroll` event on the scroller and updates the `currentTime` of each animation based on the item's scroll progress within the scroller.

```js
// Fallback for browsers that don't support scroll-driven animations
if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
  const scroller = document.querySelector('.scroller');
  const entries = document.querySelectorAll('.entry');

  // Create a map to store animations
  const animations = new Map();

  entries.forEach(entry => {
    const animation = entry.animate(
      {
        scale: ['0.5', '1', '0.5']
      },
      {
        duration: 1, // We'll control the time ourselves
        fill: 'both'
      }
    );
    animation.pause();
    animations.set(entry, animation);
  });

  // Update animations on scroll
  const tick = () => {
    const scrollerRect = scroller.getBoundingClientRect();

    entries.forEach(entry => {
      const animation = animations.get(entry);
      if (!animation) return;

      const entryRect = entry.getBoundingClientRect();
      const progress = (entryRect.left + entryRect.width / 2 - scrollerRect.left) / scrollerRect.width;

      animation.currentTime = progress;
    });
  };
    
  scroller.addEventListener('scroll', tick);
  tick();
}
```


--- Guide for carousel-snap-highlights ---
# Carousel Snap Highlights

Scroll-state container queries allow you to style elements based on their current scroll state, such as whether an element is "stuck" (via sticky positioning) or "snapped" (via scroll snapping). This enables carousel or gallery experiences where the active item can be visually distinguished without relying on JavaScript intersection observers or scroll event listeners.

### Core implementation

To highlight snapped items, you must establish a scroll-snap container, define the snap targets as scroll-state containers, and then query that state to style descendants.

#### 1. Establish the scroll snap container
The parent container must have `scroll-snap-type` enabled.

```html
<div class="carousel">
  <div class="carousel-item">
    <div class="card">Product 1 content</div>
  </div>
  <div class="carousel-item">
    <div class="card">Product 2 content</div>
  </div>
</div>
```

```css
.carousel {
  display: flex;
  overflow-x: auto;
  /* MANDATORY: Enable scroll snapping on the container */
  scroll-snap-type: x mandatory;
}
```

#### 2. Define snap targets as scroll-state containers
Each item in the carousel that should be tracked for snapping must be declared as a `scroll-state` container.

```css
.carousel-item {
  /* Define where the item snaps within the container */
  scroll-snap-align: center;
  
  /* MANDATORY: Establish this element as a scroll-state query container */
  container-type: scroll-state;
}
```

#### 3. Query the `snapped` state

Because container queries style **descendants**, you must apply the highlight styles to an element *inside* the snap target.  Because the scroll container is set to overflow on the x axis, use the `scroll-state(snapped: x)` query.

**MANDATORY**: Wrap the styles in ` @media (prefers-reduced-motion: no-preference)` to only show the effect to users who have not requested reduced motion. Depending on your use case, you may retain portions of the effect, but in this case, the cards flash from white to blue in a way that may cause problems for some users, so we disable it completely.

```css
/* Specify transition outside of queries so that it is applied regardless of state.  */
.card {
  transition:
    scale 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
    background-color 0.4s,
    color 0.4s,
    box-shadow 0.4s;
}
/* 
Only show the effect for users not requesting reduced motion. Disable completely, including the color change, as it causes a flash that may be problematic.
*/
@media (prefers-reduced-motion: no-preference) {
  /* Style the content when its parent .carousel-item is snapped on the x axis */
  @container scroll-state(snapped: x) {
    .card {
      background: #007bff;
      color: white;
      scale: 1.15;
      box-shadow: 0 10px 25px rgba(0, 123, 255, 0.3);
    }
  }
}

/* MANDATORY Copy-Paste Safety: Disable highlight scaling/flashing for motion sensitive users */
@media (prefers-reduced-motion: reduce) {
  .card {
    transition: none !important;
    scale: 1 !important;
  }
}
```

The `snapped` descriptor can query specific axes: `x`, `y`, `inline`, `block`, or `both`.


### Accessibility

**AVOID**: using `scroll-state` with interactive elements.

Visual highlights for snapped items can improve the UX, but the snapped item is not exposed to the accessibility tree. The visual theme applied to a snapped item should not convey that the element is active or focused, and a keyboard focus ring should be highly visible and distinct from the `snapped` highlight. If the snapped item is interactive, you must use other standard accessibility practices to make it accessible.  

Snapping occurs due to scrolling, which does not move keyboard focus. However, keyboard focus may cause the scroll container to move, causing a change in the snapped item, which may or may not be the focused item. This will likely be a source of confusion for users and is discouraged.

> [!NOTE]
> Detailed accessibility requirements for carousels (such as ARIA roles, slide attributes, and complex keyboard patterns) have been intentionally omitted from this guide. Carousel accessibility is highly nuanced and context-dependent; refer to established accessibility standards and perform thorough user testing for production environments.


## Fallback strategies

Container scroll-state queries has limited availability.
Supported by: Chrome 133 (Feb 2025) and Edge 133 (Feb 2025).
Unsupported in: Firefox and Safari.

For browsers that do not support scroll-state queries, you should provide a functional base experience where all items are legible, even without the "active" highlight.

#### Feature detection
You can use `@supports` to provide enhancements only to supported browsers:

```css
@supports (container-type: scroll-state) {
  /* Enhancement styles here */
}
```

#### JavaScript fallback

If the highlight is critical for the user experience, use `IntersectionObserver` to determine the snapped item. Adjust the observed area to a thin slice in the center of the carousel by providing a `rootMargin` with a negative inline value. For example, to consider an element to be intersecting if it is in the center 2% of the carousel, set the `rootMargin` to `"0px -49%"`.  

```javascript
// Optional: detect support and apply a JS-based fallback
if (!CSS.supports('container-type', 'scroll-state')) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Toggle a class based on intersection
      entry.target.classList.toggle('is-snapped', entry.isIntersecting);
    });
  }, {
    root: document.querySelector(".carousel"),
    // Carousel item intersects if any part of the carousel item is in the middle 2% of the carousel.
    rootMargin: "0px -49%"
  });

  document.querySelectorAll('.carousel-item').forEach(item => {
    observer.observe(item);
  });
}
```


--- Guide for dark-mode ---
# Dark mode

The `color-scheme` property indicates which color schemes (such as light or dark) your page supports. This informs the browser that it can automatically theme native UI elements—like scrollbars, form controls, and the default canvas background—to match your site's design and help minimize white flashes during initial loading.

## Implementation

### 1. Declare supported schemes in HTML

MANDATORY: To help prevent a "flash of un-themed content" (FOUC), place a `<meta>` tag in your `<head>` to ensure the browser knows which themes you support before it even starts rendering. While this `<meta>` tag helps to avoid FOUC by setting the initial canvas color early, it may not completely eliminate flashes in all browsers or loading conditions.

```html
<!-- MANDATORY: Declare support for both light and dark themes -->
<meta name="color-scheme" content="light dark">
```

### 2. Apply page-wide color scheme to CSS :root or html

MANDATORY: Apply the `color-scheme` property to the `html` element or the `:root` pseudo-class. Browsers specifically look to the root element to determine the theme for the entire viewport—including the root scrollbars and the initial "canvas" background. If applied only to the `body`, these global UI surfaces may remain in light mode because the `body` does not control the window's rendering context.

```css
/* MANDATORY: Apply color-scheme to :root or html for viewport-wide theming */
:root {
  /* MANDATORY: Automatically adapt native UI to user system preferences */
  color-scheme: light dark;
}
```

### 3. Define light and dark color tokens

You can use the `light-dark()` function to define color tokens that automatically adapt to different `color-scheme` values.

It is recommended that you also keep the raw color values in separate custom properties, which makes it easier to combine them in different ways (and makes fallback behavior easier, if needed).

For more control over the colors of built-in UI such as `accent-color` or `scrollbar-color`, authors **can optionally** add their own dynamic colors with use of custom properties and/or the `light-dark()` function. This function automatically picks the correct color based on the computed `color-scheme` of the element and eliminates the need for redundant media queries, but is not required for a basic implementation.

```css
:root {
  --color-brand-light: oklch(45% 0.23 270);
  --color-brand-dark: oklch(85% 0.15 210);
  --color-brand-text-light: white;
  --color-brand-text-dark: oklch(40% 0.23 270);

  --color-brand: light-dark(var(--color-brand-light), var(--color-brand-dark));
  --color-brand-text: light-dark(var(--color-brand-text-light), var(--color-brand-text-dark));

  /* MANDATORY: Automatically adapt native UI to user system preferences */
  color-scheme: light dark;
}

button.primary {
  /* These automatically adapt to color scheme */
  background-color: var(--color-brand);
  color: var(--color-brand-text);
}
```

OPTIONAL: A number of system colors are available, which also automatically adapt to the used color scheme (and other color modes, e.g. forced colors), such as `canvas`, `canvastext`, `accentcolor` (check support) , `buttonborder` etc. These are typically too limited to be useful, beyond very specific cases where you need to exactly match certain default browser UI or as fallbacks/defaults.

#### OPTIONAL: Tailor color pairs to context

Even when overriding the system default, it can be useful to use the `prefers-color-scheme` media query to define **different** color pairs that take into account the colors of the browser and OS chrome around the page (or of the surrounding page, when the page is used as an iframe).

For example, use a slightly dimmer light theme when the system setting is `dark`, or a more contrasting dark theme when the system setting is `light`, so the page is not visually overpowered by the surrounding UI.


## Fine-grained browser UI customization

Setting `color-scheme` already adapts browser UI to the used color scheme, but this will use OS defaults and/or system colors that may not perfectly align with the website design.
Modern browsers expose several fine-grained customization hooks for these.
Do not reimplement native controls simply to customize their appearance without exhausting the customization hooks modern browsers provide.

### Setting the accent color

Some browser UI (e.g. checked checkboxes or sliders) uses an accent color.
This resolves to the OS setting by default, but you can use the `accent-color` property to set it to a color that better aligns with the page, such as the page's brand color.

```css
html {
  accent-color: light-dark(var(--color-accent-light), var(--color-accent-dark));
}
```

### Issues to be aware of when using accent-color

- When placing visual elements over the accent color (e.g. a checkbox checkmark), Chrome and Safari will automatically select a contrasting color, whereas Safari will modify the accent color, and may not maintain adequate contrast.

### Scrollbar colors

You can use `scrollbar-color` together with `light-dark()` to set custom scrollbar colors that adapt to the color scheme used.

```css
:root {
  --color-scrollbar-track: light-dark(#eee, #222);
  --color-scrollbar-thumb: light-dark(#999, #666);
  scrollbar-color: var(--color-scrollbar-thumb) var(--color-scrollbar-track);
}
```

### Issues to be aware of when using scrollbar-color

- Do NOT animate or transition `scrollbar-color`. A [WebKit bug](https://bugs.webkit.org/show_bug.cgi?id=311752) causes the scrollbar to flicker every time `scrollbar-color` changes.
- On macOS, `scrollbar-color` (standard) and `::-webkit-scrollbar` (legacy) properties are ignored by default because macOS uses native "overlay" scrollbars. You MUST pair custom colors with `scrollbar-width` (e.g., `thin` or `auto`) to force macOS to render them.
- Even with `scrollbar-width` applied, macOS overlay scrollbars render the track (gutter) as transparent by default. If the design requires a visible track background color on MacOS, you MUST apply `scrollbar-gutter: stable;` to the scrollable container, but note that it only appears after the user hovers over the scrollbar.
- Even with `scrollbar-gutter: stable` the track may be transparent on MacOS. The thumb should not depend on the track color to be visible.

### Further customization

Most browser UI exposes pseudo-elements to fully customize its appearance, such as:
- `::placeholder`
- `::spelling-error`
- `::grammar-error`
- `::selection`
- `::search-text`
- `::target-text`
- `::file-selector-button`

You can use `light-dark()` colors on any of these to apply colors that adapt to the used color scheme.

## OPTIONAL: Implementing a color-scheme toggle

**DO NOT** set `color-scheme: light` or `color-scheme: dark` on the root element by default.
The default color-scheme MUST be the user's system preference, which happens automatically when setting `color-scheme` to `light dark`.

For website-specific customization, a manual toggle could be provided to allow users to choose between light, dark, or system-default modes.

If a user-facing toggle to override it is desired, it should:
- Update the `<meta name="color-scheme">` element to reflect the chosen theme (`light dark` for system default, `light` for light, and `dark` for dark).
- If branching is desired for non-color values, set a class on `<html>` to match the theme preference and use descendant selectors. While `:root:has(> head > meta[name="color-scheme"][content="dark"])` would technically work, it is slower and confers no benefit, since we are already using JS to update the `<meta>` element.
- Persist user choice in `localStorage`.
- **IMPORTANT**: The CSS should be written to default to the system preference, with overrides for user-specified color-schemes. That way, if JS fails to execute, the site still defaults to the system color-scheme.
- The system-level OS theme can change at any time. If you are using JS to read `matchMedia("(prefers-color-scheme: dark)").matches`, you MUST also use `addEventListener("change", fn)` to react to changes. CSS automatically adapts to changes.
- **IMPORTANT**: To avoid a Flash of Unstyled Content (FOUC) for users who have pinned a different color scheme than their system default, use an inline script (NOT `type=module`, NOT `defer`) to set it when the page loads:

```html
<meta name="color-scheme" content="light dark">
<script>
{
  const colorScheme = localStorage.getItem("color-scheme");
  if (colorScheme) {
    document.querySelector('meta[name="color-scheme"]').content = colorScheme;
  }
}
</script>
```

### UX considerations

Use a two-state control:
1. System setting.
2. The opposite (e.g. light when the system setting is dark, and dark when the system setting is light). Selecting this setting must pin that exact color scheme, not a dynamically computed "opposite of system setting" value. Example scenario:
    1. The OS is set to light mode.
    2. The user selects the opposite setting for this website (dark).
    3. The user changes their system setting to dark.
    4. The website should remain dark.

**DON'T** expose all three states (system, light, dark). While the rationale is plausible — "Follow system (currently dark)" is a distinct user intent from "Always dark" — it provides suboptimal UX:
- Users cannot meaningfully express intent for problems they don't currently have. A manual toggle is a temporary comfort adjustment ("it's too bright right now"), not a long-term preference ("make sure this never changes").
- Two of the three options always produce the same visual result, violating the principle of feedback.

## Component-specific overrides

You can override the global theme for specific elements by setting `color-scheme` on them.
This is useful for "dark mode" sections within a light-themed site, such as code blocks or media players.

```css
pre, code {
  /* Forces element and its children to use dark themed UI */
  color-scheme: dark;
}
```

For more information about component-specific overrides and their gotchas, see `component-specific-light-dark-theme` (via `npx -y modern-web-guidance@latest retrieve "component-specific-light-dark-theme"`).

## Known issues to be aware of

### Issues to be aware of when using color-scheme

- Chrome and Firefox respect `color-scheme` for iframes: they render embedded pages in the correct color scheme and adjust the embedded page's `prefers-color-scheme` media query to reflect the embedding context's `color-scheme`. Safari does not, and resolves `prefers-color-scheme` to the system setting even inside iframes.
  - **If you control both parent and iframe:** pass the parent's color scheme to the iframe explicitly — via a URL parameter (`?theme=dark`) at iframe construction time, or via `postMessage()` (which also lets you react to runtime changes). In the iframe, set a class on `<html>` (and/or `color-scheme` on `:root`) from that signal instead of relying on `prefers-color-scheme`.
  - **If you only control the embedded page:** there is no reliable way to detect the embedding context's `color-scheme` from inside the iframe in Safari. Expose an explicit theme parameter on your embed API (e.g. a query string or `postMessage` protocol) and document it for embedders.

## Fallback strategies

### Fallbacks & browser support for color-scheme

Baseline status for color-scheme: Widely available. It's been Baseline since 2022-02-03.
Supported by: Chrome 98 (Feb 2022), Edge 98 (Feb 2022), Firefox 96 (Jan 2022), and Safari 13 (Sep 2019).

The `color-scheme` property is **progressive enhancement**.
Browsers that do not support it will ignore this property and use their default light-mode UI.

To adapt to the user's preferences in older browsers, use `prefers-color-scheme` media queries to provide different colors when dark mode is preferred.

- DO use the media query to switch custom properties on `:root` or `html`
- Avoid using the media query on individual components unless the component requires a very specific type of dark mode customization beyond colors.

```css
:root {
  /* Define brand colors for each mode */
  --color-brand-light: #0056b3;
  --color-brand-dark: #00e5ff;
  --color-brand: var(--color-brand-light);

  /* MANDATORY: Fallback for browsers without light-dark support */
  @media (prefers-color-scheme: dark) {
    --color-brand: var(--color-brand-dark);
  }

  /* Ignored in older browsers */
  color-scheme: light dark;
}

button.primary {
	background-color: var(--color-brand);
}
```

### Fallbacks & browser support for light-dark()

Baseline status for light-dark(): Newly available. It's been Baseline since 2024-05-13.
Supported by: Chrome 123 (Mar 2024), Edge 123 (Mar 2024), Firefox 120 (Nov 2023), and Safari 17.5 (May 2024).

For browsers that support `color-scheme` but not yet `light-dark()`, light and dark versions of colors should first be defined as custom properties, and the `prefers-color-scheme` media query should be used to set colors for the respective mode like in the example below:

```css
:root {
  /* Define browser UI accent color for each mode */
  --brand-accent-light: #0056b3;
  --brand-accent-dark: #00e5ff;
  --accent-color: var(--brand-accent-light);

  /* MANDATORY: Fallback for browsers without light-dark support */
  @media (prefers-color-scheme: dark) {
    --accent-color: var(--brand-accent-dark);
  }

  /* OPTIONAL: use light-dark() for more control of built-in UI colors */
  @supports (color: light-dark(white, black)) {
    --accent-color: light-dark(var(--brand-accent-light), var(--brand-accent-dark));
  }

  /* MANDATORY: Automatically adapt native UI to user system preferences */
  color-scheme: light dark;

  /* Example inherited color property */
  accent-color: var(--accent-color);
}

pre, code {
  color-scheme: dark;

  /* **Mandatory**: any inherited color properties must be set again, even if to the same design tokens */
  accent-color: var(--accent-color);
}
```

### Fallbacks & browser support for scrollbar-color

Baseline status for scrollbar-color: Newly available. It's been Baseline since 2025-12-12.
Supported by: Chrome 121 (Jan 2024), Edge 121 (Jan 2024), Firefox 64 (Dec 2018), and Safari 26.2 (Dec 2025).

This feature is progressive enhancement and does not always require fallbacks.

If the styling is important and the user's Baseline target is "Baseline Widely Available" or earlier, you SHOULD include the non-standard `::-webkit-scrollbar` pseudo-elements as fallbacks.

Wrap legacy fallbacks in an `@supports not (scrollbar-color: auto)` block to prevent conflicts between standard properties and legacy WebKit selectors in browsers that support both natively.

If you are using custom properties to define colors, these will cascade to the legacy WebKit selectors automatically. You do NOT need to duplicate them.

```css
/* Legacy fallback for WebKit/Blink browsers */
@supports not (scrollbar-color: auto) {
  .scroller::-webkit-scrollbar {
    /* Must define base size in WebKit for custom colors to be visual */
    width: 12px;
    height: 12px;
  }

  .scroller::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
  }

  .scroller::-webkit-scrollbar-track {
    background: var(--scrollbar-track);
  }
}
```

### Fallbacks & browser support for accent-color

accent-color has limited availability.
Supported by: Chrome 93 (Aug 2021), Edge 93 (Sep 2021), Firefox 92 (Sep 2021), and Safari 26.2 (Dec 2025).

The `accent-color` property is progressive enhancement.
Browsers that do not support this property will ignore it and use their default UI colors.

