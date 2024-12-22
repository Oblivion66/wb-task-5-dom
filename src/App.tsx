import { useEffect, useState } from 'react';

function App() {
  const [componentData, setComponentData] = useState(null);

  useEffect(() => {
    async function fetchComponentData() {
      try {
        const response = await fetch('/src/component.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const data = await response.json();
        setComponentData(data);
      } catch (error) {
        console.error('Error loading component data:', error);
      }
    }
    fetchComponentData();
  }, []);

  function createElementFromJson(json) {
    const { tag, attrs = {}, children = [] } = json;
    const element = document.createElement(tag);

    for (const [key, value] of Object.entries(attrs)) {
      element.setAttribute(key, value);
    }

    children.forEach((child) => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(createElementFromJson(child));
      }
    });

    return element;
  }

  useEffect(() => {
    if (componentData) {
      const container = document.getElementById('app-container');
      if (container) {
        container.replaceChildren();
        const element = createElementFromJson(componentData);
        container.appendChild(element);
      }
    }
  }, [componentData]);

  return <div id="app-container" className="app-container"></div>;
}

export default App;
