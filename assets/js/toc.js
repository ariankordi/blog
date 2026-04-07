/*
    Original Author: Bramus Van Damme
    Link to original: https://www.bram.us/2020/01/10/smooth-scrolling-sticky-scrollspy-navigation/

    Most of this code comes courtesy of Bramus Van Damme, with some minor tweaks
    to get it working for my use case.  Thanks, Bramus!
*/
// @ts-check

const getItems = (/** @type {string} */ arg = '') => document.querySelectorAll('nav[id=TableOfContents] li ' + arg);

/** @type {string|null} */ let activeElement = null;
const tocHandler = () => {
    const observer = new IntersectionObserver(entries => {
        if (entries) {
            const contents = document.getElementById('contents');
            if (contents) {
                contents.innerHTML = 'Contents';
            }
        }
        for (const entry of entries) {
            if (activeElement) {
                for (const node of getItems()) {
                    node.classList.add('inactive');
                    node.classList.replace('active', 'inactive');
                }
            }
            if (entry.intersectionRatio > 0) {
                activeElement = entry.target.getAttribute('id');
            }
            if (activeElement) {
              const selector = `a[href='#${activeElement}']`;
              const items = getItems(selector);
              let parent;
              if (items && items.length > 0 && (parent = items[0].parentElement)) {
                  parent.classList.replace('inactive', 'active');
              }
            }
        };
    });

    const post = document.querySelector('.post');
    if (post) {
      const headings = post.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
      for (const section of headings) {
          observer.observe(section);
      }
    }
};

// window.addEventListener('DOMContentLoaded', tocHandler);
document.addEventListener('turbo:load', tocHandler);
